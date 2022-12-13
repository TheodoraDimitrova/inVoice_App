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
          className="w-full md:w-2/3 shadow-xl mx-auto mt-8 rounded"
          ref={ref}
        >
          <div className="w-full  flex items-center">
            <div className="w-1/2 h-[100%]  p-8 ">
              <img
                src={businessDetails ? businessDetails[0].data.logo : ""}
                alt="Logo"
                className="w-[150px]"
              />
            </div>
            <div className="w-1/2  px-6 py-4 text-black">
              <h3 className="text-3xl mb-8">Invoice</h3>
              <p className="text-sm font-medium mb-1">Invoice ID:</p>

              {invoiceDetails && (
                <p className="mb-5 text-sm">
                  {String(invoiceDetails.data.id).padStart(10, "0")}
                </p>
              )}

              <p className=" text-sm mb-1 font-medium">Date:</p>

              {invoiceDetails && (
                <p className="text-sm">
                  {convertTimestamp(invoiceDetails.data.timestamp)}
                </p>
              )}
            </div>
          </div>
          <div className="w-full flex  items-stretch">
            {invoiceDetails && (
              <div className="w-1/2 p-8">
                <h3 className="font-medium mb-2 bg-black text-white">
                  Customer
                </h3>
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
              <div className="w-1/2  p-8">
                <h3 className="font-medium mb-2 bg-black text-white">
                  Seller :
                </h3>
                <p className="text-sm mb-1">
                  {businessDetails[0].data.businessName}
                </p>
                <p className="text-sm mb-1">
                  {businessDetails[0].data.businessAddress},
                </p>
                <p className="text-sm mb-1">
                  {businessDetails[0].data.businessCity}
                </p>
              </div>
            )}
          </div>

          <div className=" p-8">
            <table>
              <thead>
                <tr>
                  <th>Item</th>
                  <th className="text-right text-sm">Cost</th>
                  <th className="text-right text-sm">Qty</th>
                  <th className="text-right text-sm">Price</th>
                </tr>
              </thead>
              <tbody>
                {invoiceDetails &&
                  invoiceDetails.data.itemList.map((item) => (
                    <tr key={item.itemName}>
                      <td className="text-xs capitalize">{item.itemName}</td>
                      <td className="text-xs text-right">
                        {Number(item.itemCost).toLocaleString("en-US")}
                      </td>
                      <td className="text-xs text-right">
                        {Number(item.itemQuantity).toLocaleString("en-US")}
                      </td>
                      <td className="text-xs text-right">
                        {(
                          Number(item.itemQuantity) * Number(item.itemCost)
                        ).toLocaleString("en-US")}
                      </td>
                    </tr>
                  ))}

                {invoiceDetails && (
                  <>
                    <tr>
                      <td colSpan="3" className="text-right font-bold text-sm">
                        Тax base amount
                      </td>
                      <td className="font-bold text-right uppercase text-sm">
                        {amount(
                          invoiceDetails.data,
                          invoiceDetails.data.currency
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan="3" className="text-right font-bold text-sm">
                        VAT rate 19%
                      </td>
                      <td className="font-bold text-right uppercase text-sm">
                        {checkVat(
                          invoiceDetails.data,
                          invoiceDetails.data.currency
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan="3" className="text-right font-bold text-sm">
                        TOTAL AMOUNT
                      </td>
                      <td className="font-bold text-right uppercase text-sm">
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
            <div className="w-full p-8">
              <h3 className="font-semibold mb-2">Payment Details</h3>
              <p className="text-sm mb-1 capitalize">
                <span className="font-semibold">Account Name: </span>
                {businessDetails[0].data.accountName}
              </p>
              <p className="text-sm mb-1">
                <span className="font-semibold">Account Number: </span>
                {businessDetails[0].data.accountNumber}
              </p>
              <p className="text-sm mb-1 capitalize">
                <span className="font-semibold">Bank Name: </span>{" "}
                {businessDetails[0].data.bankName}
              </p>
            </div>
          )}

          <footer className="px-8 py-4 bg-gray-200 w-full">
            <p className="text-sm text-center">Thanks for the patronage!</p>
          </footer>
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
              position: "fixed",
              top: "10px",
              right: "30px",
              zIndex: "1000px",
              color: "#F7CCAC",
            }}
          >
            <LocalPrintshopIcon style={{ fontSize: "50px" }} />
          </IconButton>
        </Tooltip>

        <Tooltip title="Go Home">
          <IconButton
            onClick={() => navigate("/dashboard")}
            style={{
              position: "fixed",
              bottom: "50px",
              right: "30px",
              zIndex: "1000px",
            }}
          >
            <HomeIcon style={{ fontSize: "30px" }} />
          </IconButton>
        </Tooltip>

        <ComponentToPrint ref={ComponentRef} />
      </div>
    </>
  );
};
