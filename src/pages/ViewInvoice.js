import React, { useEffect, useState, useRef } from "react";

import { useLocation, useParams } from "react-router-dom";
import { query, collection, where, doc, onSnapshot } from "@firebase/firestore";
import { useReactToPrint } from "react-to-print";
import db from "../firebase";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import {
  lineGross,
  lineNetBeforeVat,
  lineVatAmount,
  lineTotalWithVat,
} from "../utils/invoiceLineNet";

import Loading from "../components/Loading";
import { getAuth } from "firebase/auth";

const formatInvoiceBadge = (invoiceData) => {
  const n = Number(invoiceData?.id);
  const hasNumber = Number.isFinite(n) && n > 0;
  if (!hasNumber || invoiceData?.status === "draft") return "Чернова";
  return String(n).padStart(10, "0");
};
const formatStoredDate = (value, fallbackTimestamp) => {
  const raw = String(value || "").trim();
  if (raw) {
    const [y, m, d] = raw.split("-");
    if (y && m && d) return `${d}.${m}.${y}`;
    return raw;
  }
  if (fallbackTimestamp?.seconds) {
    const date = new Date(fallbackTimestamp.seconds * 1000);
    return date.toLocaleDateString("bg-BG");
  }
  return "";
};
const identifierLabelFromDigits = (value, fallback = "Идентификатор") => {
  const raw = String(value ?? "").trim();
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 9) return "ЕИК";
  if (digits.length === 10) return "Булстат";
  return fallback;
};
const EUR_TO_BGN_RATE = 1.95583;
const formatDiscountPercent = (value) => {
  const n = Number(value) || 0;
  if (!n) return "";
  return Number.isInteger(n) ? `${n}%` : `${n.toFixed(1)}%`;
};

export const ComponentToPrint = React.forwardRef((props, ref) => {
  const { previewData } = props;
  let params = useParams();
  const [invoiceDetails, setInvoiceDetails] = useState(null);
  const [businessDetails, setBusinessDetails] = useState(null);

  const [loading, setLoading] = useState(true);
  const auth = getAuth();
  const invoiceData = invoiceDetails?.data || {};
  const invoiceCurrency = String(invoiceData?.currency || "BGN").toUpperCase();
  const showBgnEquivalent = invoiceCurrency === "EUR";
  const formatBgnEquivalent = (amount) =>
    `${(Number(amount || 0) * EUR_TO_BGN_RATE).toFixed(2)} BGN`;
  const businessData = businessDetails?.[0]?.data || {};
  const invoiceItems = invoiceDetails?.data?.itemList ?? [];
  const fallbackVatRate = Number(businessDetails?.[0]?.data?.vatRate || 0);
  const bankName = String(businessData.bankName || "").trim();
  const iban = String(businessData.iban || "").trim();
  const swift = String(businessData.swift || "").trim();
  const isBusinessVatRegistered = businessData.isVatRegistered !== false;
  const hideBankDetails = businessData.noBankDetailsOnInvoices === true;
  const showPaymentDetails = !hideBankDetails && Boolean(bankName || iban || swift);
  const invoiceNoteText = String(invoiceData?.invoiceNote || "").trim();
  const hasInvoiceNote =
    Boolean(invoiceData?.includeInvoiceNote) && Boolean(invoiceNoteText);
  const hasAnyDiscount = invoiceItems.some((item) => {
    const pct =
      item?.itemDiscountPercent != null
        ? Number(item.itemDiscountPercent) || 0
        : Number(item?.itemDiscount) || 0;
    const amt = Number(item?.itemDiscountAmount) || 0;
    return pct > 0 || amt > 0;
  });
  const grossSubtotal = invoiceItems.reduce((sum, item) => sum + lineGross(item), 0);
  const netSubtotal = invoiceItems.reduce(
    (sum, item) => sum + lineNetBeforeVat(item),
    0
  );
  const discountTotal = Math.max(0, grossSubtotal - netSubtotal);
  const vatAmount = invoiceItems.reduce(
    (sum, item) => sum + lineVatAmount(item, fallbackVatRate),
    0
  );
  const grandTotal = netSubtotal + vatAmount;

  useEffect(() => {
    try {
      const q = query(
        collection(db, "businesses"),
        where("user_id", "==", auth.currentUser.uid)
      );
      onSnapshot(q, (querySnapshot) => {
        const firebaseBusinesses = [];
        querySnapshot.forEach((doc) => {
          firebaseBusinesses.push({ data: doc.data(), id: doc.id });
        });
        setBusinessDetails(firebaseBusinesses);
      });
      if (previewData) {
        setInvoiceDetails({ data: previewData, id: "preview" });
        setLoading(false);
        return;
      }
      if (params.id) {
        const unsub = onSnapshot(doc(db, "invoices", params.id), (doc) => {
          setInvoiceDetails({ data: doc.data(), id: doc.id });
        });
        setLoading(false);
        return () => unsub();
      }
    } catch (error) {
      console.error(error);
    }
  }, [params.id, auth.currentUser.uid, previewData]);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div
          // className=" flex flex-col  p-10 sm:p-10 sm:mt-0 relative min-h-screen  md:w-2/3 shadow-xl mx-auto    print:py-0 print:pt-5 print:shadow-none"
          className="flex flex-col p-10 sm:p-10 sm:mt-0 relative min-h-screen md:w-2/3 shadow-xl mx-auto  print:w-auto print:max-w-full"
          ref={ref}
        >
          <div className="w-full  border-b border-gray-300 ">
            <div className="mb-2 flex items-center sm:flex-row ">
              {businessDetails &&
                businessDetails[0] &&
                businessDetails[0].data.logo && (
                  <img
                    src={businessDetails[0].data.logo}
                    alt="Logo"
                    className="mb-2 print:w-40 w-60 h-25 mr-6 sm:mr-12 mt-2 sm:mt-4"
                  />
                )}
              {businessDetails &&
                businessDetails[0] &&
                businessDetails[0].data.businessName && (
                  <p className="text-4xl  print:text-xl">
                    {businessDetails[0].data.businessName}
                  </p>
                )}
            </div>

            <div className="mb-2">
              {businessDetails &&
                businessDetails[0] &&
                businessDetails[0].data.regNum && (
                  <p className="text-sm mb-1">
                    Reg. number:&nbsp;&nbsp;&nbsp;
                    {businessDetails[0].data.regNum}
                  </p>
                )}
              {businessDetails &&
                businessDetails[0] &&
                businessDetails[0].data.businessAddress && (
                  <p className="text-sm mb-1">
                    {businessDetails[0].data.businessAddress}
                  </p>
                )}

              {businessDetails &&
                businessDetails[0] &&
                (() => {
                  const d = businessDetails[0].data;
                  const pc =
                    d.postCode == null ? "" : String(d.postCode).trim();
                  const city = d.city == null ? "" : String(d.city).trim();
                  const country =
                    d.country == null ? "" : String(d.country).trim();
                  const line = [pc, city].filter(Boolean).join(" ");
                  if (line || country) {
                    return (
                      <>
                        {line ? (
                          <p className="text-sm mb-1">{line}</p>
                        ) : null}
                        {country ? (
                          <p className="text-sm mb-1">{country}</p>
                        ) : null}
                      </>
                    );
                  }
                  if (d.businessCity) {
                    return (
                      <p className="text-sm mb-1">{d.businessCity}</p>
                    );
                  }
                  return null;
                })()}
              {businessDetails &&
                businessDetails[0] &&
                businessDetails[0].data.phone && (
                  <p className="text-sm mb-1">
                    Tel: {businessDetails[0].data.phone}
                  </p>
                )}
              {businessDetails &&
                businessDetails[0] &&
                businessDetails[0].data.email && (
                  <p className="text-sm mb-1 flex justify-between">
                    Email: {businessDetails[0].data.email}
                    {businessDetails[0].data.vat && (
                      <span className="ml-auto">
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; VAT:{" "}
                        {businessDetails[0].data.vat}
                      </span>
                    )}
                    {businessDetails[0].data.tic && (
                      <span className="ml-auto">
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        {identifierLabelFromDigits(
                          businessDetails[0].data.tic,
                          "Идентификатор",
                        )}
                        :{" "}
                        {businessDetails[0].data.tic}
                      </span>
                    )}
                  </p>
                )}
            </div>
          </div>

          <div className="w-full  flex  justify-between">
            {invoiceDetails && (
              <div className=" py-2">
                <h3 className="font-medium mb-2 text-gray-700">Клиент:</h3>
                <p className="text-sm mb-1">
                  {invoiceData.customerName}
                </p>
                {invoiceData.customerType === "business" &&
                String(invoiceData.companyIdentifier || "").trim() ? (
                  <p className="text-sm mb-1">
                    {identifierLabelFromDigits(invoiceData.companyIdentifier)}:{" "}
                    {invoiceData.companyIdentifier}
                  </p>
                ) : null}
                <p className="text-sm mb-1">
                  {invoiceData.customerAddress}
                </p>
                <p className="text-sm mb-1">
                  {[invoiceData.customerPostCode, invoiceData.customerCity]
                    .filter(Boolean)
                    .join(" ")}
                </p>
                <p className="text-sm mb-1">
                  {invoiceData.customerCountry || ""}
                </p>
                <p className="text-sm mb-1">
                  {invoiceData.customerEmail}
                </p>
                {invoiceData.customerVatRegistered &&
                invoiceData.customerVatNumber ? (
                  <p className="text-sm mb-1">
                    ДДС номер: {invoiceData.customerVatNumber}
                  </p>
                ) : null}
              </div>
            )}

            {businessDetails && (
              <div className="  py-2 text-right">
                {previewData ? (
                  (() => {
                    const previewNumber = Number(invoiceData?.id);
                    const hasPreviewNumber =
                      Number.isFinite(previewNumber) && previewNumber > 0;
                    return !hasPreviewNumber;
                  })() ? (
                  <p className="inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800 mb-3">
                    ПРЕГЛЕД (НЕЗАПИСАНО)
                  </p>
                  ) : null
                ) : null}
                <h3 className="text-6xl text-gray-700 mb-4">Фактура</h3>
                <p className="text-sm font-medium">
                  №:{" "}
                  {invoiceDetails ? (
                    <span className="ml-2 text-sm">
                      {formatInvoiceBadge(invoiceDetails.data)}
                    </span>
                  ) : null}
                </p>

                <p className="text-sm font-medium">
                  Дата на издаване:{" "}
                  <span className="ml-2 text-sm">
                    {formatStoredDate(
                      invoiceData.issueDate,
                      invoiceData.timestamp,
                    )}
                  </span>
                </p>
                <p className="text-sm font-medium">
                  Падеж:{" "}
                  <span className="ml-2 text-sm">
                    {formatStoredDate(
                      invoiceData.dueDate,
                      invoiceData.timestamp,
                    )}
                  </span>
                </p>
              </div>
            )}
          </div>

          <div className="min-h-[560px] overflow-x-auto">
            <table className="table-auto mt-2 max-w-full text-xs md:text-sm ">
              <thead>
                <tr className="bg-gray-200">
                  <th className="px-2 py-1">Артикул</th>
                  <th className="px-2 py-1">Мярка</th>
                  <th className="px-2 py-1 text-right">Ед. цена</th>
                  <th className="px-2 py-1 text-right">Кол.</th>
                  {hasAnyDiscount ? (
                    <>
                      <th className="px-2 py-1 text-right">Отстъпка</th>
                    </>
                  ) : null}
                  <th className="px-2 py-1 text-right">ДДС %</th>
                  <th className="px-2 py-1 text-right">Общо</th>
                </tr>
              </thead>
              <tbody>
                {invoiceDetails &&
                  invoiceDetails.data.itemList.map((item, itemIdx) => {
                    const lineRate =
                      item.itemVatRate == null ? fallbackVatRate : item.itemVatRate;
                    const discPct =
                      item.itemDiscountPercent != null
                        ? Number(item.itemDiscountPercent)
                        : Number(item.itemDiscount) || 0;
                    const discAmt = Math.max(
                      0,
                      lineGross(item) - lineNetBeforeVat(item),
                    );
                    const discountPctText = formatDiscountPercent(discPct);
                    const discountAmountText = discAmt ? discAmt.toFixed(2) : "";
                    const discountDisplay = [discountPctText, discountAmountText ? `(${discountAmountText})` : ""]
                      .filter(Boolean)
                      .join(" ");
                    const lineTot = lineTotalWithVat(item, fallbackVatRate);
                    const kind =
                      item.itemKind === "service"
                        ? "Услуга"
                        : item.itemKind === "product"
                          ? "Продукт"
                          : "";
                    const meta = [
                      kind,
                      String(item.itemCategory || "").trim(),
                      item.itemApplication || "",
                    ]
                      .filter(Boolean)
                      .join(" · ");
                    return (
                      <tr key={`${item.itemName}-${itemIdx}`}>
                        <td className="border px-2 py-1 align-top">
                          <div className="font-medium">{item.itemName}</div>
                          {meta ? (
                            <div className="text-gray-500 text-xs mt-0.5">{meta}</div>
                          ) : null}
                        </td>
                        <td className="border px-2 py-1 align-top">
                          {item.itemUnit || "—"}
                        </td>
                        <td className="border px-2 py-1 text-right">
                          {Number(item.itemCost || 0).toFixed(2)}
                        </td>
                        <td className="border px-2 py-1 text-right">
                          {Number(item.itemQuantity || 0).toLocaleString("bg-BG")}
                        </td>
                        {hasAnyDiscount ? (
                          <>
                            <td className="border px-2 py-1 text-right">
                              {discountDisplay || "—"}
                            </td>
                          </>
                        ) : null}
                        <td className="border px-2 py-1 text-right">
                          {isBusinessVatRegistered
                            ? `${Number(lineRate).toFixed(0)}%`
                            : "—"}
                        </td>
                        <td className="border px-2 py-1 text-right">
                          {lineTot.toFixed(2)}
                        </td>
                      </tr>
                    );
                  })}
                {invoiceDetails && (
                  <>
                    <tr className="bg-gray-200">
                      <td
                        colSpan={hasAnyDiscount ? 6 : 5}
                        className="text-right font-bold py-1"
                      >
                        Междинна сума
                      </td>
                      <td className="font-bold uppercase py-1 text-right">
                        <div>{grossSubtotal.toFixed(2)} {invoiceCurrency}</div>
                        {showBgnEquivalent ? (
                          <div className="text-[11px] font-medium normal-case text-gray-600">
                            {formatBgnEquivalent(grossSubtotal)}
                          </div>
                        ) : null}
                      </td>
                    </tr>
                    {hasAnyDiscount ? (
                      <tr className="bg-gray-200">
                        <td colSpan="6" className="text-right font-bold py-1">
                          Отстъпки
                        </td>
                        <td className="font-bold uppercase py-1 text-right">
                          <div>-{discountTotal.toFixed(2)} {invoiceCurrency}</div>
                          {showBgnEquivalent ? (
                            <div className="text-[11px] font-medium normal-case text-gray-600">
                              -{formatBgnEquivalent(discountTotal)}
                            </div>
                          ) : null}
                        </td>
                      </tr>
                    ) : null}
                    <tr className="bg-gray-200">
                      <td
                        colSpan={hasAnyDiscount ? 6 : 5}
                        className="text-right font-bold py-1"
                      >
                        {isBusinessVatRegistered
                          ? "Сума ДДС"
                          : "ДДС: не се начислява"}
                      </td>
                      <td className="font-bold uppercase py-1 text-right">
                        {isBusinessVatRegistered
                          ? (
                            <>
                              <div>{vatAmount.toFixed(2)} {invoiceCurrency}</div>
                              {showBgnEquivalent ? (
                                <div className="text-[11px] font-medium normal-case text-gray-600">
                                  {formatBgnEquivalent(vatAmount)}
                                </div>
                              ) : null}
                            </>
                          )
                          : ""}
                      </td>
                    </tr>
                    <tr className="bg-gray-200">
                      <td
                        colSpan={hasAnyDiscount ? 6 : 5}
                        className="text-right font-bold py-1"
                      >
                        Крайна сума
                      </td>
                      <td className="font-bold uppercase py-1 text-right">
                        <div>{grandTotal.toFixed(2)} {invoiceCurrency}</div>
                        {showBgnEquivalent ? (
                          <div className="text-[11px] font-medium normal-case text-gray-700">
                            {formatBgnEquivalent(grandTotal)}
                          </div>
                        ) : null}
                      </td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>

          {businessDetails && showPaymentDetails && (
            <div className="mt-2 sm:mt-8 flex flex-col">
              <h3 className="mb-1 sm:mb-0.5 text-gray-700 w-full">
                Данни за плащане
              </h3>
              <div>
                <p className="text-sm mb-1 capitalize">
                  <span>Банка: </span>
                  {bankName}
                </p>
              </div>
              <div>
                <p className="text-sm mb-1 sm:mb-0.5">
                  <span>IBAN: </span>
                  {iban}
                </p>
                <p className="text-sm mb-1 sm:mb-0.5 capitalize">
                  <span>SWIFT: </span> {swift}
                </p>
              </div>
            </div>
          )}

          {hasInvoiceNote ? (
            <div className="mt-4 border-t border-gray-200 pt-3">
              <p className="text-sm font-semibold text-gray-700 mb-1">Забележка</p>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">
                {invoiceNoteText}
              </p>
            </div>
          ) : null}
          {/* <footer className="absolute bottom-0 left-0 w-full bg-gray-200">
            <p className="text-sm text-center py-2">
              Thank you for your business!
            </p>
          </footer> */}
        </div>
      )}
    </>
  );
});

export const ViewInvoice = () => {
  const location = useLocation();
  const previewData = location.state?.previewData || null;
  const ComponentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => ComponentRef.current,
  });
  return (
    <>
      <div className="w-full flex items-center md:justify-start justify-center relative">
        <Tooltip title="Печат на фактура">
          <IconButton
            onClick={handlePrint}
            sx={{
              position: "absolute",
              top: "0",
              right: "20px",
              zIndex: 1000,
              color: "#F7CCAC",
            }}
          >
            <LocalPrintshopIcon sx={{ fontSize: "40px" }} />
          </IconButton>
        </Tooltip>

        <ComponentToPrint ref={ComponentRef} previewData={previewData} />
      </div>
    </>
  );
};
