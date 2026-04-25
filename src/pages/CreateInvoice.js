import React, { useCallback, useMemo, useRef, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useInvoiceCreationReady } from "../contexts/InvoiceCreationReadyContext";
import { useDispatch } from "react-redux";
import { setInvoice } from "../redux/invoice";

import {
  addDoc,
  collection,
  doc,
  getDocs,
  increment,
  query,
  getDoc,
  serverTimestamp,
  updateDoc,
  where,
} from "@firebase/firestore";

import db, { auth } from "../firebase";
import { showToast } from "../utils/functions";
import Loading from "../components/Loading";
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { COUNTRIES } from "../data/countries";
import { getPrimaryCompanyIdentityRule } from "../data/companyIdentityRules";
import { createInvoiceSchema } from "../schemas/createInvoiceSchema";
import { DocumentSection } from "../components/createInvoice/DocumentSection";
import { CustomerSection } from "../components/createInvoice/CustomerSection";
import { ProductsSection } from "../components/createInvoice/ProductsSection";
import { TotalsSection } from "../components/createInvoice/TotalsSection";
import { ComponentToPrint as InvoicePreviewContent } from "./ViewInvoice";

const CURRENCY_SYMBOLS = {
  EUR: "\u20ac",
  BGN: "\u043b\u0432",
  USD: "$",
  GBP: "\u00a3",
};
const INVOICE_CURRENCY_OPTIONS = ["EUR", "BGN", "USD", "GBP"];

const currencySymbol = (code) => CURRENCY_SYMBOLS[(code || "").toUpperCase()] || (code || "").toUpperCase() || "\u20ac";
const toDateInput = (d) => new Date(d).toISOString().slice(0, 10);
const DEFAULT_FORM_VALUES = {
  customerType: "business",
  issueDate: toDateInput(new Date()),
  dueDate: toDateInput(new Date()),
  currency: "EUR",
  customerName: "",
  customerCountry: "Bulgaria",
  companyIdentifier: "",
  customerVatRegistered: false,
  customerVatNumber: "",
  customerAddress: "",
  customerPostCode: "",
  customerCity: "",
  customerEmail: "",
};


const sectionIconBoxSx = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 40,
  height: 40,
  borderRadius: 2,
  bgcolor: "var(--color-brand-accent)",
  color: "var(--color-brand-primary)",
  flexShrink: 0,
};

const sectionShellSx = {
  p: { xs: 1.5, sm: 2 },
  borderRadius: 2,
  bgcolor: "rgba(15, 23, 42, 0.04)",
  border: "1px solid",
  borderColor: "rgba(15, 23, 42, 0.08)",
};

const VAT_RATE_OPTIONS = [20, 9, 0];
const UNIFIED_FIELD_RADIUS = 1; // same radius as SetupProfile fields
const INLINE_CELL_SX = {
  "& .MuiOutlinedInput-root": {
    borderRadius: UNIFIED_FIELD_RADIUS,
    minHeight: 44,
    height: 44,
    alignItems: "center",
    "& .MuiOutlinedInput-notchedOutline": {
      borderRadius: UNIFIED_FIELD_RADIUS,
    },
    "& fieldset": { borderColor: "transparent" },
    "&:hover fieldset": { borderColor: "rgba(15, 23, 42, 0.16)" },
    "&.Mui-focused fieldset": {
      borderColor: "var(--color-brand-primary)",
      borderWidth: 1,
    },
  },
  "& .MuiOutlinedInput-input": {
    py: "10px",
    fontSize: "0.9rem",
    lineHeight: 1.5,
    boxSizing: "border-box",
  },
  "& .MuiSelect-select": {
    paddingTop: "10px !important",
    paddingBottom: "10px !important",
    paddingRight: "32px !important",
    minHeight: "auto",
    display: "flex",
    alignItems: "center",
  },
  "& .MuiSelect-icon": {
    right: 8,
  },
  "& .MuiInputAdornment-root": {
    mt: 0,
  },
};
const isMeaningfulRow = (row) =>
  String(row?.itemName || "").trim() !== "" ||
  Number(row?.itemCost || 0) > 0 ||
  Number(row?.itemQuantity || 0) > 0;
const getValidInvoiceNumber = (value) => {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : null;
};

const CreateInvoice = () => {
  const [invoiceNumberPreview, setInvoiceNumberPreview] = useState("");
  const [products, setProducts] = useState([]);
  const { invoiceId } = useParams();
  const [isEditing, setIsEditing] = useState(false);

  const rowIdRef = useRef(0);
  const [defaultBusinessVatRate, setDefaultBusinessVatRate] = useState(20);

  const createEmptyRow = useCallback(
    (vatRate = defaultBusinessVatRate) => ({
      _rowId: ++rowIdRef.current,
      itemName: "",
      itemUnit: "",
      itemCost: "",
      itemQuantity: "",
      itemVatRate: Number(vatRate) || 0,
      itemDiscount: 0,
    }),
    [defaultBusinessVatRate]
  );
  const [itemList, setItemList] = useState([createEmptyRow(20)]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [saveInProgress, setSaveInProgress] = useState(false);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [productsRequiredError, setProductsRequiredError] = useState(false);
  const { ready: invoiceCreationReady, loading: invoiceGateLoading } = useInvoiceCreationReady();
  const form = useForm({
    resolver: zodResolver(createInvoiceSchema),
    defaultValues: DEFAULT_FORM_VALUES,
    mode: "onSubmit",
  });
  const {
    setValue,
    trigger,
    getValues,
    watch,
    reset,
    formState: { errors: formErrors },
  } = form;

  const customerName = watch("customerName");
  const customerType = watch("customerType");
  const customerAddress = watch("customerAddress");
  const customerPostCode = watch("customerPostCode");
  const customerCity = watch("customerCity");
  const customerCountry = watch("customerCountry");
  const customerEmail = watch("customerEmail");
  const companyIdentifier = watch("companyIdentifier");
  const customerVatRegistered = watch("customerVatRegistered");
  const customerVatNumber = watch("customerVatNumber");
  const currency = watch("currency");
  const issueDate = watch("issueDate");
  const dueDate = watch("dueDate");

  const customerIdRule = getPrimaryCompanyIdentityRule(customerCountry || "");
  const customerIdLabel =
    customerIdRule?.label?.split("(")[0]?.trim() || "ЕИК / ДДС";
  const currencySign = currencySymbol(currency);
  const vatRateOptions = useMemo(() => {
    const merged = [...VAT_RATE_OPTIONS, Number(defaultBusinessVatRate) || 0];
    return [...new Set(merged)].sort((a, b) => a - b);
  }, [defaultBusinessVatRate]);
  const toInvoiceItem = (row) => ({
    itemName: String(row.itemName || "").trim(),
    itemUnit: String(row.itemUnit || "").trim(),
    itemCost: Number(row.itemCost) || 0,
    itemQuantity: Number(row.itemQuantity) || 0,
    itemVatRate: Number(row.itemVatRate) || 0,
    itemDiscount: Number(row.itemDiscount) || 0,
  });
  const invoiceItems = useMemo(
    () =>
      itemList
        .filter((row) => {
          const normalized = toInvoiceItem(row);
          return (
            normalized.itemName &&
            normalized.itemCost > 0 &&
            normalized.itemQuantity >= 1
          );
        })
        .map(toInvoiceItem),
    [itemList]
  );

  useEffect(() => {
    if (invoiceGateLoading) return;
    if (!invoiceId && !invoiceCreationReady) {
      showToast(
        "error",
        'Добавете данъчни настройки (ДДС), фирмен идентификатор и банкови данни в "Профил", или включете "Не ми трябват банкови данни във фактурите".',
      );
      navigate("/profile", { replace: true });
    }
  }, [invoiceGateLoading, invoiceId, invoiceCreationReady, navigate]);

  useEffect(() => {
    const fetchInvoiceData = async () => {
      try {
        const invoiceRef = doc(db, "invoices", invoiceId);
        const invoiceSnapshot = await getDoc(invoiceRef);
        if (invoiceSnapshot.exists()) {
          const inv = invoiceSnapshot.data();
          reset({
            ...DEFAULT_FORM_VALUES,
            customerName: inv.customerName || "",
            customerType: inv.customerType || "business",
            customerAddress: inv.customerAddress || "",
            customerPostCode: inv.customerPostCode || "",
            customerCity: inv.customerCity || "",
            customerCountry: inv.customerCountry || "Bulgaria",
            customerEmail: inv.customerEmail || "",
            companyIdentifier: inv.companyIdentifier ?? inv.vat ?? "",
            customerVatRegistered: Boolean(inv.customerVatRegistered),
            customerVatNumber: inv.customerVatNumber ?? "",
            currency: (inv.currency || "EUR").toUpperCase(),
            issueDate: inv.issueDate || toDateInput(new Date()),
            dueDate: inv.dueDate || inv.issueDate || toDateInput(new Date()),
          });
          const existingRows = Array.isArray(inv.itemList)
            ? inv.itemList.map((item) => ({
                _rowId: ++rowIdRef.current,
                itemName: item.itemName ?? "",
                itemUnit: item.itemUnit ?? "",
                itemCost: item.itemCost ?? "",
                itemQuantity: item.itemQuantity ?? "",
                itemVatRate:
                  item.itemVatRate == null
                    ? Number(defaultBusinessVatRate) || 0
                    : Number(item.itemVatRate) || 0,
                itemDiscount: item.itemDiscount ?? 0,
              }))
            : [];
          setItemList([...existingRows, createEmptyRow(defaultBusinessVatRate)]);
          const validNumber = getValidInvoiceNumber(inv.id);
          setInvoiceNumberPreview(validNumber ? String(validNumber) : "Чернова");
        }
      } catch (error) {
        showToast("error", "Грешка при зареждане на фактурата. Опитайте отново.");
      }
    };

    const fetchBusinessMeta = async () => {
      try {
        const bisnesRef = query(
          collection(db, "businesses"),
          where("user_id", "==", auth.currentUser.uid)
        );
        const querySnapshot = await getDocs(bisnesRef);
        querySnapshot.forEach((d) => {
          const data = d.data();
          if (!invoiceId) {
            setValue("currency", ((data.currency ?? "").toString() || "EUR").toUpperCase());
            setInvoiceNumberPreview(String((Number(data.invoices) || 0) + 1));
            const businessVatRate = Number(data.vatRate);
            const normalizedVatRate =
              Number.isFinite(businessVatRate) &&
              VAT_RATE_OPTIONS.includes(businessVatRate)
                ? businessVatRate
                : 20;
            setDefaultBusinessVatRate(normalizedVatRate);
            setItemList((prev) => {
              if (!prev.length) return [createEmptyRow(normalizedVatRate)];
              const next = [...prev];
              const last = next[next.length - 1];
              if (last && !isMeaningfulRow(last)) {
                next[next.length - 1] = {
                  ...last,
                  itemVatRate: normalizedVatRate,
                };
              }
              return next;
            });
          }
        });
      } catch {
        // Keep form usable even if metadata fetch fails.
      }
    };

    if (invoiceId) {
      setIsEditing(true);
      fetchInvoiceData();
    }
    fetchBusinessMeta();
    fetchProducts();
    setLoading(false);
  }, [invoiceId, createEmptyRow, defaultBusinessVatRate, reset, setValue]);

  const fetchProducts = async () => {
    try {
      const userId = auth.currentUser.uid;
      const querySnapshot = await getDocs(
        collection(db, "users", userId, "products")
      );
      const fetchedProducts = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(fetchedProducts);
    } catch (error) {
      showToast("error", "Моля, свържете се с техническа поддръжка.");
    }
  };

  const handleAddToRow = (e, product) => {
    e.preventDefault();
    const name = product?.name ?? "";
    const price = Number(product?.price) || 0;
    const unit = product?.unit ?? "";
    const rowVatRate =
      Number.isFinite(Number(product?.vat)) && Number(product?.vat) >= 0
        ? Number(product.vat)
        : Number(defaultBusinessVatRate) || 0;
    setItemList((prev) => {
      const rows = [...prev];
      const lastIdx = rows.length - 1;
      if (lastIdx >= 0 && !isMeaningfulRow(rows[lastIdx])) {
        rows[lastIdx] = {
          ...rows[lastIdx],
          itemName: name,
          itemUnit: unit,
          itemCost: price,
          itemQuantity: 1,
          itemVatRate: rowVatRate,
        };
      } else {
        rows.push({
          _rowId: ++rowIdRef.current,
          itemName: name,
          itemUnit: unit,
          itemCost: price,
          itemQuantity: 1,
          itemVatRate: rowVatRate,
          itemDiscount: 0,
        });
      }
      const tail = rows[rows.length - 1];
      if (tail && isMeaningfulRow(tail)) {
        rows.push(createEmptyRow(defaultBusinessVatRate));
      }
      return rows;
    });
  };

  const persistInvoice = async (action) => {
    const hasInvoiceItems = invoiceItems.length > 0;
    setProductsRequiredError(!hasInvoiceItems);
    const isValid = await trigger();
    if (!isValid) {
      setSaveDialogOpen(false);
      return;
    }
    if (!hasInvoiceItems) {
      setSaveDialogOpen(false);
      showToast("error", "Добавете поне един артикул.");
      return;
    }
    setSaveInProgress(true);
    const formData = getValues();
    const isIssued = action === "issued";
    const issueDateToPersist = isIssued ? toDateInput(new Date()) : formData.issueDate;
    const dueDateToPersist = (formData.dueDate || "").trim() || issueDateToPersist;

    const basePayload = {
      user_id: auth.currentUser.uid,
      customerName: formData.customerName,
      customerType: formData.customerType,
      customerAddress: formData.customerAddress,
      customerPostCode: formData.customerPostCode,
      customerCity: formData.customerCity,
      customerCountry: formData.customerCountry,
      customerEmail: formData.customerEmail,
      companyIdentifier: formData.companyIdentifier || "",
      customerVatRegistered: formData.customerVatRegistered,
      customerVatNumber: formData.customerVatNumber || "",
      currency: formData.currency,
      itemList: invoiceItems,
      issueDate: issueDateToPersist,
      dueDate: dueDateToPersist,
      status: isIssued ? "issued" : "draft",
      finalizedAt: isIssued ? serverTimestamp() : null,
      timestamp: serverTimestamp(),
    };

    try {
      // Create a new invoice
      if (!isEditing) {
        let generatedInvoiceNumber = null;
        let businessDocId = "";
        if (isIssued) {
          const businessRef = query(
            collection(db, "businesses"),
            where("user_id", "==", auth.currentUser.uid)
          );
          const businessSnapshot = await getDocs(businessRef);
          businessSnapshot.forEach((businessDoc) => {
            businessDocId = businessDoc.id;
            generatedInvoiceNumber = (Number(businessDoc.data().invoices) || 0) + 1;
          });
        }

        dispatch(
          setInvoice({
            customerName: formData.customerName,
            customerType: formData.customerType,
            customerAddress: formData.customerAddress,
            customerPostCode: formData.customerPostCode,
            companyIdentifier: formData.companyIdentifier || "",
            customerCity: formData.customerCity,
            customerCountry: formData.customerCountry,
            customerEmail: formData.customerEmail,
            itemList: invoiceItems,
            currency: formData.currency,
            status: isIssued ? "issued" : "draft",
            id: generatedInvoiceNumber,
            customerVatRegistered: formData.customerVatRegistered,
            customerVatNumber: formData.customerVatNumber || "",
          })
        );

        await addDoc(collection(db, "invoices"), {
          ...basePayload,
          id: generatedInvoiceNumber,
        });

        if (isIssued && businessDocId) {
          await updateDoc(doc(db, "businesses", businessDocId), {
            invoices: increment(1),
          });
        }

        showToast(
          "success",
          isIssued ? "Фактурата е издадена успешно!📜" : "Черновата е запазена успешно."
        );
      } else {
        // Update an existing invoice
        const invoiceRef = doc(db, "invoices", invoiceId);
        const currentInvoice = await getDoc(invoiceRef);
        const currentInvoiceData = currentInvoice.exists() ? currentInvoice.data() : {};
        const existingInvoiceNumber = getValidInvoiceNumber(currentInvoiceData?.id);
        const hasInvoiceNumber = existingInvoiceNumber != null;
        let generatedInvoiceNumber = existingInvoiceNumber;
        let businessDocId = "";

        if (isIssued && !hasInvoiceNumber) {
          const businessRef = query(
            collection(db, "businesses"),
            where("user_id", "==", auth.currentUser.uid)
          );
          const businessSnapshot = await getDocs(businessRef);
          businessSnapshot.forEach((businessDoc) => {
            businessDocId = businessDoc.id;
            generatedInvoiceNumber = (Number(businessDoc.data().invoices) || 0) + 1;
          });
        }

        await updateDoc(invoiceRef, {
          ...basePayload,
          id: generatedInvoiceNumber,
        });

        if (isIssued && !hasInvoiceNumber && businessDocId) {
          await updateDoc(doc(db, "businesses", businessDocId), {
            invoices: increment(1),
          });
        }

        showToast(
          "success",
          isIssued ? "Фактурата е издадена успешно!📜" : "Черновата е запазена успешно."
        );
      }

      setSaveDialogOpen(false);
      navigate("/dashboard");
    } catch (err) {
      console.log(err);
      showToast("error", "Грешка при запазване. Опитайте отново.");
    } finally {
      setSaveInProgress(false);
    }
  };

  const openSaveDialog = async (e) => {
    e.preventDefault();
    setSaveDialogOpen(true);
  };
  const buildPreviewData = () => {
    const formData = getValues();
    const previewInvoiceNumber = getValidInvoiceNumber(invoiceNumberPreview);
    const nowMs = Date.now();
    return {
      id: previewInvoiceNumber,
      status: previewInvoiceNumber ? "issued" : "draft",
      customerName: formData.customerName,
      customerType: formData.customerType,
      customerAddress: formData.customerAddress,
      customerPostCode: formData.customerPostCode,
      customerCity: formData.customerCity,
      customerCountry: formData.customerCountry,
      customerEmail: formData.customerEmail,
      companyIdentifier: formData.companyIdentifier || "",
      customerVatRegistered: Boolean(formData.customerVatRegistered),
      customerVatNumber: formData.customerVatNumber || "",
      currency: (formData.currency || "EUR").toUpperCase(),
      issueDate: formData.issueDate,
      dueDate: (formData.dueDate || "").trim() || formData.issueDate,
      itemList: invoiceItems,
      timestamp: {
        seconds: Math.floor(nowMs / 1000),
        nanoseconds: (nowMs % 1000) * 1000000,
      },
    };
  };
  const handlePreviewInvoice = () => {
    setPreviewModalOpen(true);
  };

  const deleteRow = (e, rowId) => {
    e.preventDefault();
    setItemList((prev) => {
      const next = prev.filter((item) => item._rowId !== rowId);
      if (!next.length) return [createEmptyRow(defaultBusinessVatRate)];
      const last = next[next.length - 1];
      if (last && isMeaningfulRow(last)) {
        next.push(createEmptyRow(defaultBusinessVatRate));
      }
      return next;
    });
  };
  const updateRow = (rowId, key, value) => {
    setItemList((prev) => {
      const next = prev.map((row) =>
        row._rowId === rowId ? { ...row, [key]: value } : row
      );
      const last = next[next.length - 1];
      if (last && isMeaningfulRow(last)) {
        next.push(createEmptyRow(defaultBusinessVatRate));
      }
      return next;
    });
    if (productsRequiredError) {
      setProductsRequiredError(false);
    }
  };
  const handleCustomerTypeChange = (_, next) => {
    if (!next) return;
    setValue("customerType", next, { shouldDirty: true, shouldValidate: true });
    if (next === "individual") {
      setValue("companyIdentifier", "", { shouldDirty: true, shouldValidate: true });
      setValue("customerVatRegistered", false, { shouldDirty: true, shouldValidate: true });
      setValue("customerVatNumber", "", { shouldDirty: true, shouldValidate: true });
    }
  };

  const blockNewInvoice = !invoiceId && !invoiceCreationReady;
  const subtotal = invoiceItems.reduce(
    (sum, item) => sum + (Number(item.itemCost) || 0) * (Number(item.itemQuantity) || 0),
    0
  );
  const vatTotal = invoiceItems.reduce((sum, item) => {
    const net = (Number(item.itemCost) || 0) * (Number(item.itemQuantity) || 0);
    const rate = Number(item.itemVatRate) || 0;
    return sum + (net * rate) / 100;
  }, 0);
  const grandTotal = subtotal + vatTotal;
  const uniqueRates = [...new Set(invoiceItems.map((item) => Number(item.itemVatRate) || 0))];
  const vatLabel =
    uniqueRates.length === 1
      ? `ДДС (${uniqueRates[0].toFixed(0)}%)`
      : "ДДС (смесени ставки)";

  return (
    <>
      {loading || invoiceGateLoading || blockNewInvoice ? (
        <Loading />
      ) : (
        <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 2.5 } }}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2, sm: 3 },
              borderRadius: 3,
              border: "1px solid rgba(15, 23, 42, 0.08)",
              bgcolor: "#fff",
            }}
          >
            <Typography
              variant="h5"
              sx={{ fontWeight: 800, color: "var(--color-brand-primary)" }}
            >
              Създай фактура
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.75, mb: 3 }}>
              Попълнете данни за документа, клиента и продуктите.
            </Typography>

            <Box component="form" sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
              <DocumentSection
                sectionShellSx={sectionShellSx}
                sectionIconBoxSx={sectionIconBoxSx}
                customerType={customerType}
                onCustomerTypeChange={handleCustomerTypeChange}
                invoiceNumberPreview={invoiceNumberPreview}
                issueDate={issueDate}
                onIssueDateChange={(e) =>
                  setValue("issueDate", e.target.value, {
                    shouldDirty: true,
                    shouldValidate: true,
                  })
                }
                dueDate={dueDate}
                onDueDateChange={(e) =>
                  setValue("dueDate", e.target.value, {
                    shouldDirty: true,
                    shouldValidate: true,
                  })
                }
                currency={currency}
                onCurrencyChange={(e) =>
                  setValue("currency", (e.target.value || "EUR").toUpperCase(), {
                    shouldDirty: true,
                    shouldValidate: true,
                  })
                }
                currencyOptions={INVOICE_CURRENCY_OPTIONS}
                errors={formErrors}
              />

              <CustomerSection
                sectionShellSx={sectionShellSx}
                sectionIconBoxSx={sectionIconBoxSx}
                countries={COUNTRIES}
                customerType={customerType}
                customerIdLabel={customerIdLabel}
                customerIdRule={customerIdRule}
                customerName={customerName}
                onCustomerNameChange={(e) =>
                  setValue("customerName", e.target.value, {
                    shouldDirty: true,
                    shouldValidate: true,
                  })
                }
                customerCountry={customerCountry}
                onCustomerCountryChange={(e) =>
                  setValue("customerCountry", e.target.value, {
                    shouldDirty: true,
                    shouldValidate: true,
                  })
                }
                companyIdentifier={companyIdentifier}
                onCompanyIdentifierChange={(e) =>
                  setValue("companyIdentifier", e.target.value ?? "", {
                    shouldDirty: true,
                    shouldValidate: true,
                  })
                }
                customerVatRegistered={customerVatRegistered}
                onCustomerVatRegisteredChange={(e) =>
                  {
                    const nextChecked = e.target.checked;
                    setValue("customerVatRegistered", nextChecked, {
                      shouldDirty: true,
                      shouldValidate: true,
                    });
                    if (!nextChecked) {
                      setValue("customerVatNumber", "", {
                        shouldDirty: true,
                        shouldValidate: true,
                      });
                    }
                  }
                }
                customerVatNumber={customerVatNumber}
                onCustomerVatNumberChange={(e) =>
                  setValue("customerVatNumber", e.target.value, {
                    shouldDirty: true,
                    shouldValidate: true,
                  })
                }
                customerAddress={customerAddress}
                onCustomerAddressChange={(e) =>
                  setValue("customerAddress", e.target.value, {
                    shouldDirty: true,
                    shouldValidate: true,
                  })
                }
                customerPostCode={customerPostCode}
                onCustomerPostCodeChange={(e) =>
                  setValue("customerPostCode", e.target.value, {
                    shouldDirty: true,
                    shouldValidate: true,
                  })
                }
                customerCity={customerCity}
                onCustomerCityChange={(e) =>
                  setValue("customerCity", e.target.value, {
                    shouldDirty: true,
                    shouldValidate: true,
                  })
                }
                customerEmail={customerEmail}
                onCustomerEmailChange={(e) =>
                  setValue("customerEmail", e.target.value, {
                    shouldDirty: true,
                    shouldValidate: true,
                  })
                }
                errors={formErrors}
              />

              <ProductsSection
                sectionShellSx={sectionShellSx}
                sectionIconBoxSx={sectionIconBoxSx}
                inlineCellSx={INLINE_CELL_SX}
                products={products}
                currencySign={currencySign}
                handleAddToRow={handleAddToRow}
                itemList={itemList}
                isMeaningfulRow={isMeaningfulRow}
                updateRow={updateRow}
                vatRateOptions={vatRateOptions}
                deleteRow={deleteRow}
                showRequiredError={productsRequiredError}
              />

              {invoiceItems.length > 0 && (
                <TotalsSection
                  currencySign={currencySign}
                  subtotal={subtotal}
                  vatLabel={vatLabel}
                  vatTotal={vatTotal}
                  grandTotal={grandTotal}
                />
              )}

              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.25} sx={{ mt: 1 }}>
                <Button
                  type="button"
                  variant="outlined"
                  color="primary"
                  size="large"
                  onClick={handlePreviewInvoice}
                  startIcon={<VisibilityOutlinedIcon />}
                  sx={{ height: 48, fontWeight: 700, minWidth: { sm: 180 } }}
                >
                  Преглед
                </Button>
                <Button
                  type="button"
                  variant="contained"
                  color="primary"
                  fullWidth
                  size="large"
                  sx={{ height: 48, fontWeight: 700 }}
                  onClick={openSaveDialog}
                >
                  ЗАПАЗИ ФАКТУРА
                </Button>
              </Stack>
            </Box>
          </Paper>
        </Container>
      )}
      <Dialog open={saveDialogOpen} onClose={() => !saveInProgress && setSaveDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Как искате да запазите фактурата?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Изберете дали да издадете официална фактура с пореден номер, или да запазите като чернова за по-късно.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, pt: 0.5, gap: 1 }}>
          <Button onClick={() => setSaveDialogOpen(false)} disabled={saveInProgress}>
            Отказ
          </Button>
          <Button
            variant="outlined"
            onClick={() => persistInvoice("draft")}
            disabled={saveInProgress}
          >
            Запази като чернова
          </Button>
          <Button
            variant="contained"
            onClick={() => persistInvoice("issued")}
            disabled={saveInProgress}
          >
            Издай фактурата
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={previewModalOpen}
        onClose={() => setPreviewModalOpen(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>Преглед на фактура</DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          <Box
            sx={{
              maxHeight: "72vh",
              overflow: "auto",
              bgcolor: "#f8fafc",
              borderRadius: 1.5,
              p: { xs: 0.5, sm: 1 },
            }}
          >
            <InvoicePreviewContent previewData={buildPreviewData()} />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, pt: 0.5, gap: 1 }}>
          <Button onClick={() => setPreviewModalOpen(false)}>Затвори</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CreateInvoice;
