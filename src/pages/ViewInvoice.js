import React, { useEffect, useState, useRef } from "react";

import { useParams } from "react-router-dom";
import { query, collection, where, doc, onSnapshot } from "@firebase/firestore";
import { useReactToPrint } from "react-to-print";
import { useNavigate } from "react-router-dom";
import db from "../firebase";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import HomeIcon from "@mui/icons-material/Home";
import {
  findGrandTotal,
  convertTimestamp,
  checkVat,
  amount,
} from "../utils/functions";

import Loading from "../components/Loading";
import { getAuth } from "firebase/auth";

export const ComponentToPrint = React.forwardRef((props, ref) => {
  let params = useParams();
  const [invoiceDetails, setInvoiceDetails] = useState(null);
  const [businessDetails, setBusinessDetails] = useState(null);

  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const auth = getAuth();

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
  }, [params.id, navigate, auth.currentUser.uid]);

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
                businessDetails[0].data.businessCity && (
                  <p className="text-sm mb-1">
                    {businessDetails[0].data.businessCity}
                  </p>
                )}
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
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; T.I.C:{" "}
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
                <h3 className="font-medium mb-2 text-gray-700">Customer :</h3>
                <p className="text-sm mb-1">
                  {invoiceDetails.data.customerName}
                </p>
                <p className="text-sm mb-1">
                  {invoiceDetails.data.customerAddress}
                </p>
                <p className="text-sm mb-1">
                  {invoiceDetails.data.customerCity}
                </p>
                <p className="text-sm mb-1">
                  {invoiceDetails.data.customerEmail}
                </p>
              </div>
            )}

            {businessDetails && (
              <div className="  py-2 text-right">
                <h3 className="text-6xl text-gray-700 mb-4">Invoice</h3>
                <p className="text-sm font-medium">
                  ID:{" "}
                  {invoiceDetails ? (
                    <span className="ml-2 text-sm">
                      {String(invoiceDetails.data.id).padStart(10, "0")}
                    </span>
                  ) : null}
                </p>

                <p className="text-sm font-medium">
                  Date:{" "}
                  {invoiceDetails && (
                    <span className="ml-2 text-sm">
                      {convertTimestamp(invoiceDetails.data.timestamp)}
                    </span>
                  )}
                </p>
              </div>
            )}
          </div>

          <div className="min-h-[560px] overflow-x-auto">
            <table className="table-auto mt-2 max-w-full text-xs md:text-sm ">
              <thead>
                <tr className="bg-gray-200">
                  <th className="px-2 py-1">Product</th>
                  <th className="px-2 py-1">Cost</th>
                  <th className="px-2 py-1">Qty</th>
                  <th className="px-2 py-1">Price</th>
                </tr>
              </thead>
              <tbody>
                {invoiceDetails &&
                  invoiceDetails.data.itemList.map((item) => (
                    <tr key={item.itemName}>
                      <td className="border px-2 py-1">{item.itemName}</td>
                      <td className="border px-2 py-1 flex justify-between">
                        <span> {item.itemCost} </span>

                        <span className="discount-percentage">
                          {item.itemDiscount ? `-${item.itemDiscount}%` : ""}
                        </span>
                      </td>

                      <td className="border px-2 py-1">
                        {Number(item.itemQuantity).toLocaleString("en-US")}
                      </td>
                      <td className="border px-2 py-1">
                        {(
                          item.itemCost * item.itemQuantity -
                          (item.itemCost *
                            item.itemQuantity *
                            (parseFloat(item.itemDiscount) || 0)) /
                            100
                        ).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                {invoiceDetails && (
                  <>
                    <tr className="bg-gray-200">
                      <td colSpan="3" className="text-right font-bold py-1">
                        Tax base amount
                      </td>
                      <td className="font-bold uppercase py-1">
                        {amount(
                          invoiceDetails.data,
                          invoiceDetails.data.currency
                        )}
                      </td>
                    </tr>
                    <tr className="bg-gray-200">
                      <td colSpan="3" className="text-right font-bold py-1">
                        VAT rate 19%
                      </td>
                      <td className="font-bold uppercase py-1">
                        {checkVat(
                          invoiceDetails.data,
                          invoiceDetails.data.currency
                        )}
                      </td>
                    </tr>
                    <tr className="bg-gray-200">
                      <td colSpan="3" className="text-right font-bold py-1">
                        Total amount
                      </td>
                      <td className="font-bold uppercase py-1">
                        {findGrandTotal(
                          invoiceDetails.data,
                          invoiceDetails.data.currency
                        )}
                      </td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>

          {businessDetails && (
            <div className="mt-2 sm:mt-8 flex flex-col">
              <h3 className="mb-1 sm:mb-0.5 text-gray-700 w-full">
                Payment Details
              </h3>
              <div>
                <p className="text-sm mb-1 capitalize">
                  <span>Bank: </span>
                  {businessDetails[0].data.bankName}
                </p>
                {/* <p className="text-sm mb-1 sm:mb-0.5">
                  <span>Account No.: </span>
                  {businessDetails[0].data.bankNo}
                </p> */}
              </div>
              <div>
                <p className="text-sm mb-1 sm:mb-0.5">
                  <span>IBAN: </span>
                  {businessDetails[0].data.iban}
                </p>
                <p className="text-sm mb-1 sm:mb-0.5 capitalize">
                  <span>SWIFT: </span> {businessDetails[0].data.swift}
                </p>
              </div>
            </div>
          )}

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
  const ComponentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => ComponentRef.current,
  });
  const navigate = useNavigate();
  return (
    <>
      <div className="w-full flex items-center md:justify-start justify-center relative">
        <Tooltip title="Print Invoice">
          <IconButton
            onClick={handlePrint}
            style={{
              position: "absolute",
              top: "0",
              right: "20px",
              zIndex: "1000",
              color: "#F7CCAC",
            }}
          >
            <LocalPrintshopIcon style={{ fontSize: "40px" }} />
          </IconButton>
        </Tooltip>

        <Tooltip title="Go Home">
          <IconButton
            onClick={() => navigate("/dashboard")}
            style={{
              position: "absolute",
              bottom: "50px",
              right: "20px",
              zIndex: "1000px",
            }}
          >
            <HomeIcon style={{ fontSize: "40px" }} />
          </IconButton>
        </Tooltip>

        <ComponentToPrint ref={ComponentRef} />
      </div>
    </>
  );
};
