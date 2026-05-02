import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useInvoiceCreationReady } from "../../contexts/InvoiceCreationReadyContext";
import { useDispatch } from "react-redux";

import {
  createDefaultInvoiceFormValues,
  getValidInvoiceNumber,
  hasRowInput,
  toDateInput,
  useCreateInvoiceData,
  useCreateInvoiceHydration,
  useCreateInvoiceFormSetup,
  useInvoiceCreationGate,
  useInvoiceSavedCustomers,
  useItemListFormSync,
  useInvoiceRowFactory,
  useInvoiceNoteDefaults,
  useLoadInvoiceProducts,
  useNormalizeVatRows,
  useInvoicePreviewData,
  useCreateInvoiceSectionProps,
  useCreateInvoiceUiHandlers,
  useCreateInvoiceViewModel,
  useInvoiceItems,
  useInvoicePersistence,
  useInvoiceTotals,
  VAT_EXEMPT_DEFAULT_NOTE,
} from "./index";
import CreateInvoiceFormView from "./components/CreateInvoiceFormView";
import { InvoicePreviewContent } from "../invoice-view";

const CreateInvoiceFormContainer = () => {
  const defaultFormValues = useMemo(() => createDefaultInvoiceFormValues(), []);
  const [invoiceNumberPreview, setInvoiceNumberPreview] = useState("");
  const [products, setProducts] = useState([]);
  const { invoiceId } = useParams();
  const [isEditing, setIsEditing] = useState(false);

  const [defaultBusinessVatRate, setDefaultBusinessVatRate] = useState(20);
  const [isBusinessVatRegistered, setIsBusinessVatRegistered] = useState(true);
  const { createEmptyRow, getNextRowId } = useInvoiceRowFactory({
    defaultBusinessVatRate,
    isBusinessVatRegistered,
  });
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [saveInProgress, setSaveInProgress] = useState(false);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [productsRequiredError, setProductsRequiredError] = useState(false);
  const { loadInvoice, loadBusinessDocs, loadProducts } =
    useCreateInvoiceData();
  const { ready: invoiceCreationReady, loading: invoiceGateLoading } =
    useInvoiceCreationReady();
  const {
    itemList,
    setItemList,
    addRow,
    updateRow,
    patchRow,
    deleteRow: removeRow,
  } = useInvoiceItems({
    createEmptyRow,
    defaultBusinessVatRate,
    onItemsChanged: () => setProductsRequiredError(false),
  });
  const dispatch = useDispatch();
  const { form, formValues } = useCreateInvoiceFormSetup({
    defaultValues: defaultFormValues,
  });
  const {
    setValue,
    setField,
    setFieldFromEvent,
    trigger,
    getValues,
    reset,
    formState: { errors: formErrors },
  } = form;

  const {
    customerName,
    customerType,
    customerAddress,
    customerPostCode,
    customerCity,
    customerCountry,
    customerEmail,
    companyIdentifier,
    customerVatRegistered,
    customerVatNumber,
    currency,
    issueDate,
    dueDate,
    includeInvoiceNote,
    invoiceNote,
  } = formValues;

  const { savedCustomers } = useInvoiceSavedCustomers();
  const savedCustomersForType = useMemo(
    () =>
      savedCustomers.filter(
        (c) => Boolean(c?.customerType) && c.customerType === customerType,
      ),
    [customerType, savedCustomers],
  );
  const [selectedSavedCustomer, setSelectedSavedCustomer] = useState(null);
  const {
    customerIdRule,
    customerIdLabel,
    currencySign,
    vatRateOptions,
    invoiceItems,
  } = useCreateInvoiceViewModel({
    customerCountry,
    currency,
    defaultBusinessVatRate,
    isBusinessVatRegistered,
    itemList,
  });
  useItemListFormSync({ itemList, setValue });
  useNormalizeVatRows({ isBusinessVatRegistered, setItemList });
  useInvoiceNoteDefaults({
    includeInvoiceNote,
    isBusinessVatRegistered,
    getValues,
    setValue,
    vatExemptDefaultNote: VAT_EXEMPT_DEFAULT_NOTE,
  });
  useInvoiceCreationGate({
    invoiceGateLoading,
    invoiceId,
    invoiceCreationReady,
    navigate,
  });

  const fetchProducts = useLoadInvoiceProducts({ loadProducts, setProducts });

  useCreateInvoiceHydration({
    invoiceId,
    loadInvoice,
    loadBusinessDocs,
    fetchProducts,
    reset,
    setValue,
    setItemList,
    createEmptyRow,
    defaultBusinessVatRate,
    getNextRowId,
    setIsEditing,
    setIsBusinessVatRegistered,
    setDefaultBusinessVatRate,
    setInvoiceNumberPreview,
    setLoading,
    defaultFormValues,
    getValidInvoiceNumber,
    hasRowInput,
    toDateInput,
    vatRateOptions,
  });

  const persistInvoice = useInvoicePersistence({
    getValues,
    trigger,
    setValue,
    itemList,
    invoiceItems,
    isEditing,
    invoiceId,
    setProductsRequiredError,
    setSaveDialogOpen,
    setSaveInProgress,
    navigate,
    dispatch,
  });

  const {
    openSaveDialog,
    handlePreviewInvoice,
    deleteRow,
    handleCustomerTypeChange,
    handleCustomerVatRegisteredChange,
    handleInvoiceNoteToggle,
  } = useCreateInvoiceUiHandlers({
    setField,
    getValues,
    setPreviewModalOpen,
    setSaveDialogOpen,
    removeRow,
    isBusinessVatRegistered,
    vatExemptDefaultNote: VAT_EXEMPT_DEFAULT_NOTE,
  });

  useEffect(() => {
    setSelectedSavedCustomer(null);
  }, [customerType]);

  const applySavedCustomerToForm = useCallback(
    (customer) => {
      setField("customerName", String(customer.customerName || "").trim());
      setField(
        "customerCountry",
        String(customer.customerCountry || "Bulgaria").trim() || "Bulgaria",
      );
      setField(
        "customerAddress",
        String(customer.customerAddress || "").trim(),
      );
      setField(
        "customerPostCode",
        String(customer.customerPostCode || "").trim(),
      );
      setField("customerCity", String(customer.customerCity || "").trim());
      setField("customerEmail", String(customer.customerEmail || "").trim());

      if (customer.customerType === "business") {
        setField(
          "companyIdentifier",
          String(customer.companyIdentifier || "").trim(),
        );
        setField(
          "customerVatRegistered",
          Boolean(customer.customerVatRegistered),
        );
        setField(
          "customerVatNumber",
          String(customer.customerVatNumber || "")
            .trim()
            .toUpperCase(),
        );
      } else {
        setField("companyIdentifier", "");
        setField("customerVatRegistered", false);
        setField("customerVatNumber", "");
      }
    },
    [setField],
  );

  const handleCustomerNameAutocompleteChange = useCallback(
    (_, newValue) => {
      if (newValue && typeof newValue === "object" && newValue.id) {
        setSelectedSavedCustomer(newValue);
        applySavedCustomerToForm(newValue);
        return;
      }
      setSelectedSavedCustomer(null);
      if (newValue == null) {
        setField("customerName", "");
        return;
      }
      if (typeof newValue === "string") {
        setField("customerName", newValue.trim());
      }
    },
    [applySavedCustomerToForm, setField],
  );

  const handleCustomerNameAutocompleteInputChange = useCallback(
    (_, inputValue, reason) => {
      if (reason === "reset") return;
      const next = typeof inputValue === "string" ? inputValue : "";
      setField("customerName", next);
      if (reason === "input" || reason === "clear") {
        setSelectedSavedCustomer(null);
      }
    },
    [setField],
  );

  const previewData = useInvoicePreviewData({
    getValues,
    invoiceItems,
    invoiceNumberPreview,
    getValidInvoiceNumber,
    includeInvoiceNote,
    invoiceNote,
  });

  const blockNewInvoice = !invoiceId && !invoiceCreationReady;
  const { subtotal, discountTotal, vatTotal, grandTotal, vatLabel } =
    useInvoiceTotals({
      invoiceItems,
      defaultBusinessVatRate,
      isBusinessVatRegistered,
    });
  const {
    documentSectionProps,
    customerSectionProps,
    productsSectionProps,
    invoiceNoteSectionProps,
    totalsProps,
  } = useCreateInvoiceSectionProps({
    customerType,
    handleCustomerTypeChange,
    invoiceNumberPreview,
    issueDate,
    dueDate,
    currency,
    setFieldFromEvent,
    formErrors,
    customerIdLabel,
    customerIdRule,
    customerName,
    customerCountry,
    companyIdentifier,
    customerVatRegistered,
    handleCustomerVatRegisteredChange,
    customerVatNumber,
    customerAddress,
    customerPostCode,
    customerCity,
    customerEmail,
    savedCustomerOptions: savedCustomersForType,
    selectedSavedCustomer,
    onCustomerNameAutocompleteChange: handleCustomerNameAutocompleteChange,
    onCustomerNameAutocompleteInputChange:
      handleCustomerNameAutocompleteInputChange,
    products,
    currencySign,
    itemList,
    updateRow,
    patchRow,
    addRow,
    vatRateOptions,
    isBusinessVatRegistered,
    deleteRow,
    productsRequiredError,
    defaultBusinessVatRate,
    includeInvoiceNote,
    invoiceNote,
    handleInvoiceNoteToggle,
    subtotal,
    discountTotal,
    vatLabel,
    vatTotal,
    grandTotal,
  });

  return (
    <CreateInvoiceFormView
      loading={loading}
      invoiceGateLoading={invoiceGateLoading}
      blockNewInvoice={blockNewInvoice}
      documentSectionProps={documentSectionProps}
      customerSectionProps={customerSectionProps}
      productsSectionProps={productsSectionProps}
      invoiceNoteSectionProps={invoiceNoteSectionProps}
      showTotals={invoiceItems.length > 0}
      totalsProps={totalsProps}
      onPreview={handlePreviewInvoice}
      onOpenSaveDialog={openSaveDialog}
      saveDialogOpen={saveDialogOpen}
      onCloseSaveDialog={() => setSaveDialogOpen(false)}
      onSaveDraft={() => persistInvoice("draft")}
      onIssue={() => persistInvoice("issued")}
      saveInProgress={saveInProgress}
      previewModalOpen={previewModalOpen}
      onClosePreview={() => setPreviewModalOpen(false)}
      previewContent={<InvoicePreviewContent previewData={previewData} />}
    />
  );
};

export default CreateInvoiceFormContainer;
