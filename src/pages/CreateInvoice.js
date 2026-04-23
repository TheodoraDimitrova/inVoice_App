import React, { useCallback, useMemo, useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useInvoiceCreationReady } from "../contexts/InvoiceCreationReadyContext";
import { useDispatch } from "react-redux";
import { setInvoice } from "../redux/invoice";
import ProductButton from "../components/ProductButton";

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
  Grid,
  InputAdornment,
  MenuItem,
  Paper,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { FormFieldHelperText } from "../components/FormFieldHelperText";
import { gridFieldSx, setupProfileFieldProps } from "../utils/muiFieldSx";
import { COUNTRIES } from "../data/countries";
import { getPrimaryCompanyIdentityRule } from "../data/companyIdentityRules";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";

const CURRENCY_SYMBOLS = {
  EUR: "\u20ac",
  BGN: "\u043b\u0432",
  PLN: "z\u0142",
  CZK: "K\u010d",
  DKK: "kr",
  HUF: "Ft",
  RON: "lei",
  SEK: "kr",
};

const currencySymbol = (code) => CURRENCY_SYMBOLS[(code || "").toUpperCase()] || (code || "").toUpperCase() || "\u20ac";
const toDateInput = (d) => new Date(d).toISOString().slice(0, 10);
const plusDays = (d, days) => {
  const next = new Date(d);
  next.setDate(next.getDate() + days);
  return next;
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

const fieldProps = setupProfileFieldProps;
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

const CreateInvoice = () => {
  const [customerName, setCustomerName] = useState("");
  const [customerType, setCustomerType] = useState("business");
  const [customerAddress, setCustomerAddress] = useState("");
  const [customerPostCode, setCustomerPostCode] = useState("");
  const [customerCity, setCustomerCity] = useState("");
  const [customerCountry, setCustomerCountry] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerVat, setCustomerVat] = useState("");
  const [currency, setCurrency] = useState("");
  const [invoiceNumberPreview, setInvoiceNumberPreview] = useState("");
  const [issueDate, setIssueDate] = useState(toDateInput(new Date()));
  const [dueDate, setDueDate] = useState(toDateInput(plusDays(new Date(), 14)));
  const [products, setProducts] = useState([]);
  const { invoiceId } = useParams();
  const [isEditing, setIsEditing] = useState(false);

  const rowIdRef = useRef(0);
  const [defaultBusinessVatRate, setDefaultBusinessVatRate] = useState(20);

  const createEmptyRow = useCallback(
    (vatRate = defaultBusinessVatRate) => ({
      _rowId: ++rowIdRef.current,
      itemName: "",
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
  const { ready: invoiceCreationReady, loading: invoiceGateLoading } = useInvoiceCreationReady();

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
          setCustomerName(invoiceSnapshot.data().customerName);
          setCustomerType(inv.customerType || "business");
          setCustomerAddress(invoiceSnapshot.data().customerAddress);
          setCustomerPostCode(inv.customerPostCode || "");
          setCustomerCity(inv.customerCity || "");
          setCustomerCountry(inv.customerCountry || inv.customerCity || "");
          setCustomerEmail(inv.customerEmail);
          setCustomerVat(inv.vat ?? "");
          setCurrency(inv.currency);
          const existingRows = Array.isArray(inv.itemList)
            ? inv.itemList.map((item) => ({
                _rowId: ++rowIdRef.current,
                itemName: item.itemName ?? "",
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
          setIssueDate(inv.issueDate || toDateInput(new Date()));
          setDueDate(inv.dueDate || toDateInput(plusDays(new Date(), 14)));
          setInvoiceNumberPreview(String(inv.id ?? ""));
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
            setCurrency((data.currency ?? "").toString());
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
  }, [invoiceId, createEmptyRow, defaultBusinessVatRate]);

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

  const handleAddToRow = (e, id, name, price) => {
    e.preventDefault();
    setItemList((prev) => {
      const rows = [...prev];
      const lastIdx = rows.length - 1;
      if (lastIdx >= 0 && !isMeaningfulRow(rows[lastIdx])) {
        rows[lastIdx] = {
          ...rows[lastIdx],
          itemName: name,
          itemCost: price,
          itemQuantity: 1,
          itemVatRate: Number(defaultBusinessVatRate) || 0,
        };
      } else {
        rows.push({
          _rowId: ++rowIdRef.current,
          itemName: name,
          itemCost: price,
          itemQuantity: 1,
          itemVatRate: Number(defaultBusinessVatRate) || 0,
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

  const saveInvoice = async (e) => {
    e.preventDefault();
    if (!invoiceItems.length) return;

    // Create a new invoice
    if (!isEditing) {
      dispatch(
        setInvoice({
          customerName,
          customerType,
          customerAddress,
          customerPostCode,
          customerVat,
          customerCity,
          customerCountry,
          customerEmail,
          itemList: invoiceItems,
          currency,
        })
      );
      const bisnesRef = query(
        collection(db, "businesses"),
        where("user_id", "==", auth.currentUser.uid)
      );
      const querySnapshot = await getDocs(bisnesRef);
      let docId = "";
      let countInvoices = 0;
      querySnapshot.forEach((doc) => {
        docId = doc.id;
        countInvoices = doc.data().invoices;
      });

      await addDoc(collection(db, "invoices"), {
        user_id: auth.currentUser.uid,
        customerName,
        customerType,
        customerAddress,
        customerPostCode,
        customerCity,
        customerCountry,
        customerEmail,
        vat: customerVat,
        currency,
        itemList: invoiceItems,
        issueDate,
        dueDate,
        timestamp: serverTimestamp(),
        id: (countInvoices += 1),
      })
        .then(() => {
          showToast("success", "Фактурата е създадена!📜");
        })
        .then(async () => {
          const bisnessRef = doc(db, "businesses", docId);
          await updateDoc(bisnessRef, {
            invoices: increment(1),
          });
        })
        .then(() => navigate("/dashboard"))
        .catch((err) => {
          console.log(err);
          showToast("error", "Опитайте отново! Фактурата не е създадена!😭");
        });
    }
    // Update an existing invoice
    else {
      await updateDoc(doc(db, "invoices", invoiceId), {
        customerName,
        customerType,
        customerAddress,
        customerPostCode,
        customerCity,
        customerCountry,
        customerEmail,
        vat: customerVat,
        currency,
        issueDate,
        dueDate,
        itemList: invoiceItems,
      })
        .then(() => {
          showToast("success", "Фактурата е обновена успешно!");
          navigate("/dashboard");
        })
        .catch((err) => {
          console.log(err);
          showToast("error", "Грешка при обновяване на фактурата. Опитайте отново.");
        });
    }
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
              <Paper variant="outlined" sx={sectionShellSx}>
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1.5 }}>
                  <Box sx={sectionIconBoxSx}>
                    <DescriptionOutlinedIcon fontSize="small" />
                  </Box>
                  <Box>
                    <Typography sx={{ fontWeight: 700, color: "var(--color-brand-primary)" }}>
                      Данни за документа
                    </Typography>
                    <Typography variant="caption" sx={{ color: "text.secondary" }}>
                      Номер и дати на фактурата.
                    </Typography>
                  </Box>
                </Stack>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Stack spacing={0.75}>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: "text.secondary" }}>
                        Тип клиент
                      </Typography>
                      <ToggleButtonGroup
                        value={customerType}
                        exclusive
                        onChange={(_, next) => {
                          if (!next) return;
                          setCustomerType(next);
                          if (next === "individual") {
                            setCustomerVat("");
                            setItemList((prev) =>
                              prev.map((row) => ({
                                ...row,
                                itemVatRate: Number(defaultBusinessVatRate) || 0,
                              }))
                            );
                          }
                        }}
                        size="small"
                        sx={{
                          width: "fit-content",
                          "& .MuiToggleButton-root": {
                            px: 2,
                            textTransform: "none",
                            fontWeight: 600,
                          },
                        }}
                      >
                        <ToggleButton value="business">Фирма (B2B)</ToggleButton>
                        <ToggleButton value="individual">Физическо лице (B2C)</ToggleButton>
                      </ToggleButtonGroup>
                      <Typography variant="caption" color="text.secondary">
                        Изберете категорията на клиента за тази фактура.
                      </Typography>
                    </Stack>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      {...fieldProps}
                      label="Номер на фактура"
                      value={invoiceNumberPreview || "-"}
                      placeholder="Генерира се автоматично"
                      disabled
                      helperText={<FormFieldHelperText hint="Автоматично генериран пореден номер." />}
                      FormHelperTextProps={{ component: "div" }}
                      sx={gridFieldSx}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      {...fieldProps}
                      label="Дата на издаване"
                      type="date"
                      value={issueDate}
                      onChange={(e) => setIssueDate(e.target.value)}
                      required
                      helperText={
                        <FormFieldHelperText hint="Задължително поле. Дата на издаване." />
                      }
                      FormHelperTextProps={{ component: "div" }}
                      sx={gridFieldSx}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      {...fieldProps}
                      label="Падеж"
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      helperText={<FormFieldHelperText hint="Срок за плащане." />}
                      FormHelperTextProps={{ component: "div" }}
                      sx={gridFieldSx}
                    />
                  </Grid>
                </Grid>
              </Paper>

              <Paper variant="outlined" sx={sectionShellSx}>
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1.5 }}>
                  <Box sx={sectionIconBoxSx}>
                    <PersonOutlineOutlinedIcon fontSize="small" />
                  </Box>
                  <Box>
                    <Typography sx={{ fontWeight: 700, color: "var(--color-brand-primary)" }}>
                      Клиент
                    </Typography>
                    <Typography variant="caption" sx={{ color: "text.secondary" }}>
                      Данни за идентификация и контакт за фактуриране.
                    </Typography>
                  </Box>
                </Stack>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <TextField
                      {...fieldProps}
                      label="Име на клиент"
                      name="customerName"
                      placeholder="напр. Acme Solutions Ltd"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      required
                      helperText={<FormFieldHelperText hint="Задължително поле." />}
                      FormHelperTextProps={{ component: "div" }}
                      sx={gridFieldSx}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      {...fieldProps}
                      select
                      label="Държава на клиента"
                      name="customerCountry"
                      value={customerCountry}
                      onChange={(e) => setCustomerCountry(e.target.value)}
                      required
                      helperText={<FormFieldHelperText hint="Задължително поле." />}
                      FormHelperTextProps={{ component: "div" }}
                      sx={gridFieldSx}
                    >
                      <MenuItem value="" disabled>
                        Изберете държава
                      </MenuItem>
                      {COUNTRIES.map((c) => (
                        <MenuItem key={c} value={c}>
                          {c}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  {customerType === "business" ? (
                    <Grid item xs={12} md={4}>
                      <TextField
                        {...fieldProps}
                        label={customerIdLabel}
                        name="customerVat"
                        placeholder={`напр. ${customerIdRule?.hint || "ЕИК / ДДС номер"}`}
                        value={customerVat}
                        onChange={(e) => setCustomerVat(e.target.value ?? "")}
                        helperText={<FormFieldHelperText hint="Фирмен идентификатор за избраната държава." />}
                        FormHelperTextProps={{ component: "div" }}
                        sx={gridFieldSx}
                      />
                    </Grid>
                  ) : (
                    <Grid item xs={12} md={4}>
                      <TextField
                        {...fieldProps}
                        label="Личен идентификатор (по избор)"
                        name="customerPersonalId"
                        value=""
                        disabled
                        helperText={<FormFieldHelperText hint="Не е задължително за физически лица." />}
                        FormHelperTextProps={{ component: "div" }}
                        sx={gridFieldSx}
                      />
                    </Grid>
                  )}
                  <Grid item xs={12} md={6}>
                    <TextField
                      {...fieldProps}
                      label="Адрес на клиента"
                      name="customerAddress"
                      placeholder="напр. бул. Витоша 24"
                      value={customerAddress}
                      onChange={(e) => setCustomerAddress(e.target.value)}
                      helperText={<FormFieldHelperText hint="Улица и номер." />}
                      FormHelperTextProps={{ component: "div" }}
                      sx={gridFieldSx}
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <TextField
                      {...fieldProps}
                      label="Пощенски код"
                      name="customerPostCode"
                      placeholder="напр. 1000"
                      value={customerPostCode}
                      onChange={(e) => setCustomerPostCode(e.target.value)}
                      helperText={<FormFieldHelperText hint="Пощенски код." />}
                      FormHelperTextProps={{ component: "div" }}
                      sx={gridFieldSx}
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <TextField
                      {...fieldProps}
                      label="Град"
                      name="customerCity"
                      placeholder="напр. София"
                      value={customerCity}
                      onChange={(e) => setCustomerCity(e.target.value)}
                      helperText={<FormFieldHelperText hint="Град." />}
                      FormHelperTextProps={{ component: "div" }}
                      sx={gridFieldSx}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      {...fieldProps}
                      label="Имейл на клиента"
                      type="email"
                      name="customerEmail"
                      placeholder="напр. billing@client.com"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      helperText={<FormFieldHelperText hint="Имейл за фактуриране." />}
                      FormHelperTextProps={{ component: "div" }}
                      sx={gridFieldSx}
                    />
                  </Grid>
                </Grid>
              </Paper>

              <Paper variant="outlined" sx={sectionShellSx}>
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1.5 }}>
                  <Box sx={sectionIconBoxSx}>
                    <Inventory2OutlinedIcon fontSize="small" />
                  </Box>
                  <Box>
                    <Typography sx={{ fontWeight: 700, color: "var(--color-brand-primary)" }}>
                      Продукти
                    </Typography>
                    <Typography variant="caption" sx={{ color: "text.secondary" }}>
                      Добавяйте по един ред с артикул.
                    </Typography>
                  </Box>
                </Stack>

                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: {
                      xs: "1fr",
                      sm: "repeat(2, minmax(0, 1fr))",
                      lg: "repeat(4, minmax(0, 1fr))",
                    },
                    gap: 1,
                    mb: 2,
                  }}
                >
                  {products.map((product) => (
                    <ProductButton
                      key={product.id}
                      id={product.id}
                      name={product.name}
                      price={product.price}
                      currencySymbol={currencySign}
                      click={handleAddToRow}
                    />
                  ))}
                </Box>

                <Box sx={{ border: "1px solid rgba(15, 23, 42, 0.08)", borderRadius: 2, overflow: "hidden" }}>
                  <Box
                    sx={{
                      display: { xs: "none", md: "grid" },
                      gridTemplateColumns: "5fr 2fr 2fr 2fr 1.6fr 56px",
                      px: 1.25,
                      py: 1,
                      bgcolor: "rgba(15, 23, 42, 0.04)",
                      borderBottom: "1px solid rgba(15, 23, 42, 0.08)",
                    }}
                  >
                    {[
                      { label: "Артикул", align: "left" },
                      { label: "Ед. цена", align: "right" },
                      { label: "ДДС %", align: "right" },
                      { label: "Количество", align: "right" },
                      { label: "Общо", align: "right" },
                    ].map((h) => (
                      <Typography
                        key={h.label}
                        variant="caption"
                        sx={{
                          color: "#64748b",
                          fontWeight: 700,
                          fontSize: "0.73rem",
                          letterSpacing: "0.06em",
                          textTransform: "uppercase",
                          textAlign: h.align,
                          ...(h.align === "right" ? { pr: 1.5 } : {}),
                        }}
                      >
                        {h.label}
                      </Typography>
                    ))}
                    <Typography
                      variant="caption"
                      sx={{
                        color: "#64748b",
                        fontWeight: 700,
                        fontSize: "0.73rem",
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                        textAlign: "center",
                      }}
                    >
                      Изтрий
                    </Typography>
                  </Box>

                  {itemList.map((row, idx) => {
                    const rowTotal =
                      (Number(row.itemCost) || 0) *
                      (Number(row.itemQuantity) || 0) *
                      (1 + (Number(row.itemVatRate) || 0) / 100);
                    const isEmpty = !isMeaningfulRow(row);
                    return (
                      <Box
                        key={row._rowId}
                        sx={{
                          display: "grid",
                          gridTemplateColumns: {
                            xs: "1fr",
                            md: "5fr 2fr 2fr 2fr 1.6fr 56px",
                          },
                          gap: 1,
                          alignItems: "center",
                          px: 1.25,
                          py: 0.75,
                          borderTop: idx === 0 ? "none" : "1px solid rgba(15, 23, 42, 0.06)",
                        }}
                      >
                        <TextField
                          {...fieldProps}
                          placeholder="Име на артикул"
                          value={row.itemName}
                          onChange={(e) => updateRow(row._rowId, "itemName", e.target.value)}
                          sx={{ ...INLINE_CELL_SX, mb: 0 }}
                        />
                        <TextField
                          {...fieldProps}
                          type="number"
                          placeholder="0.00"
                          value={row.itemCost}
                          onChange={(e) => updateRow(row._rowId, "itemCost", e.target.value)}
                          inputProps={{ step: "0.01", min: 0 }}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">{currencySign}</InputAdornment>
                            ),
                          }}
                          sx={{
                            ...INLINE_CELL_SX,
                            mb: 0,
                            "& .MuiOutlinedInput-input": {
                              py: "10px",
                              textAlign: "right",
                              fontVariantNumeric: "tabular-nums",
                            },
                          }}
                        />
                        <TextField
                          {...fieldProps}
                          select
                          value={row.itemVatRate}
                          onChange={(e) =>
                            updateRow(row._rowId, "itemVatRate", Number(e.target.value))
                          }
                          disabled={customerType === "individual"}
                          sx={{ ...INLINE_CELL_SX, mb: 0 }}
                        >
                          {vatRateOptions.map((rate) => (
                            <MenuItem key={rate} value={rate}>
                              {rate}%
                            </MenuItem>
                          ))}
                        </TextField>
                        <TextField
                          {...fieldProps}
                          type="number"
                          placeholder="Кол."
                          value={row.itemQuantity}
                          onChange={(e) => updateRow(row._rowId, "itemQuantity", e.target.value)}
                          inputProps={{ min: 1 }}
                          sx={{
                            ...INLINE_CELL_SX,
                            mb: 0,
                            "& .MuiOutlinedInput-input": {
                              py: "10px",
                              textAlign: "right",
                              fontVariantNumeric: "tabular-nums",
                            },
                          }}
                        />
                        <Typography
                          variant="body1"
                          sx={{
                            pr: 1,
                            textAlign: "right",
                            fontWeight: 700,
                            whiteSpace: "nowrap",
                            color: isEmpty ? "text.disabled" : "text.primary",
                            fontVariantNumeric: "tabular-nums",
                          }}
                        >
                          {currencySign} {rowTotal.toFixed(2)}
                        </Typography>
                        <Box sx={{ display: "flex", justifyContent: "center" }}>
                          {!isEmpty ? (
                            <Button
                              type="button"
                              size="small"
                              color="error"
                              onClick={(e) => deleteRow(e, row._rowId)}
                              sx={{ minWidth: 32, px: 0.5 }}
                            >
                              X
                            </Button>
                          ) : (
                            <Box sx={{ width: 32 }} />
                          )}
                        </Box>
                      </Box>
                    );
                  })}
                </Box>

              </Paper>

              {invoiceItems.length > 0 && (
                <Paper
                  variant="outlined"
                  sx={{
                    p: 2,
                    mt: 0.5,
                    borderRadius: 2,
                    borderColor: "rgba(15, 23, 42, 0.08)",
                    bgcolor: "rgba(15, 23, 42, 0.02)",
                  }}
                >
                  <Stack spacing={0.75} sx={{ maxWidth: 360, ml: "auto" }}>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="body2" color="text.secondary">
                        Междинна сума
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {currencySign} {subtotal.toFixed(2)}
                      </Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="body2" color="text.secondary">
                        {vatLabel}
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {currencySign} {vatTotal.toFixed(2)}
                      </Typography>
                    </Stack>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      sx={{ pt: 0.5, borderTop: "1px solid rgba(15, 23, 42, 0.08)" }}
                    >
                      <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                        Крайна сума
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 900 }}>
                        {currencySign} {grandTotal.toFixed(2)}
                      </Typography>
                    </Stack>
                  </Stack>
                </Paper>
              )}

              <Button
                type="button"
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                sx={{ mt: 1, height: 48, fontWeight: 700 }}
                onClick={saveInvoice}
              >
                ЗАПАЗИ ФАКТУРА
              </Button>
            </Box>
          </Paper>
        </Container>
      )}
    </>
  );
};

export default CreateInvoice;
