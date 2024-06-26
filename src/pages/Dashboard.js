import React, { useEffect, useState } from "react";
import Nav from "../components/Nav";
import Table from "../components/Table";
import { useNavigate } from "react-router-dom";
import {
  query,
  collection,
  where,
  onSnapshot,
  orderBy,
} from "@firebase/firestore";
import db from "../firebase";
import Loading from "../components/Loading";
import { getAuth } from "firebase/auth";

const Dashboard = () => {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();

  useEffect(() => {
    try {
      const q = query(
        collection(db, "invoices"),
        where("user_id", "==", auth.currentUser.uid),
        orderBy("timestamp", "desc")
      );
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const firebaseInvoices = [];
        querySnapshot.forEach((doc) => {
          firebaseInvoices.push({ data: doc.data(), id: doc.id });
        });
        setInvoices(firebaseInvoices);
        setLoading(false);
        return () => unsubscribe();
      });
    } catch (error) {
      console.log(error);
    }
  }, [auth.currentUser.uid]);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div className="w-full">
          <Nav />

          <div className="sm:p-6 flex items-center flex-col p-3 justify-center">
            <h3 className="p-12 text-slate-800">
              Welcome,{" "}
              <span className="text-blue-800">{auth.currentUser.email}</span>
            </h3>
            <div className="flex flex-col md:flex-row md:space-x-8">
              <button
                className=" h-36 py-6 px-12 border-t-8 border-blue-800 shadow-md rounded hover:bg-slate-200 hover:border-red-500 bg-slate-50 cursor-pointer mb-[100px] mt-[50px] text-blue-700"
                onClick={() => navigate("/new/invoice")}
              >
                <p>Create an invoice</p>
              </button>
              <button
                className=" h-36 py-6 px-12 border-t-8 border-blue-800 shadow-md rounded hover:bg-slate-200 hover:border-red-500 bg-slate-50 cursor-pointer mb-[100px] mt-[50px] text-blue-700"
                onClick={() => navigate("/products")}
              >
                <p>Manage Products</p>
              </button>
            </div>

            {invoices.length !== 0 && <Table invoices={invoices} />}
          </div>
        </div>
      )}
    </>
  );
};

export default Dashboard;
