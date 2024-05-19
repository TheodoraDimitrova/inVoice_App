import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import CreateInvoiceTable from "../components/CreateInvoiceTable";
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
import Nav from "../components/Nav";
import { showToast } from "../utils/functions";
import Loading from "../components/Loading";
import { IconButton, Tooltip } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";

const CreateInvoice = () => {
  const [customerName, setCustomerName] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [customerCity, setCustomerCity] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerVat, setCustomerVat] = useState("");
  const [currency, setCurrency] = useState("");
  const [products, setProducts] = useState([]);
  const { invoiceId } = useParams();
  const [isEditing, setIsEditing] = useState(false);

  const [itemName, setItemName] = useState("");
  const [itemCost, setItemCost] = useState(0);
  const [itemQuantity, setItemQuantity] = useState(1);
  const [itemDiscount, setItemDiscount] = useState(0);

  const [itemList, setItemList] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoiceData = async () => {
      try {
        const invoiceRef = doc(db, "invoices", invoiceId);
        const invoiceSnapshot = await getDoc(invoiceRef);
        if (invoiceSnapshot.exists()) {
          setCustomerName(invoiceSnapshot.data().customerName);
          setCustomerAddress(invoiceSnapshot.data().customerAddress);
          setCustomerCity(invoiceSnapshot.data().customerCity);
          setCustomerEmail(invoiceSnapshot.data().customerEmail);
          setCustomerVat(invoiceSnapshot.data().vat);
          setCurrency(invoiceSnapshot.data().currency);
          setItemList(invoiceSnapshot.data().itemList);
        }
      } catch (error) {
        showToast("error", "Failed to fetch invoice data. Please try again.");
      }
    };

    if (invoiceId) {
      setIsEditing(true);
      fetchInvoiceData();
    }
    fetchProducts();
    setLoading(false);
  }, [invoiceId]);

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
      showToast("error", "Please contact technical support");
    }
  };

  const handleAddToRow = (e, id, name, price) => {
    e.preventDefault();
    setItemName(name);
    setItemCost(price);
    setItemQuantity(1);
    setItemDiscount(0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (itemName.trim() && itemCost > 0 && itemQuantity >= 1) {
      setItemList([
        {
          itemName,
          itemCost,
          itemQuantity,
          itemDiscount,
        },
        ...itemList,
      ]);
    }

    clearForm();
  };
  const clearForm = () => {
    // e.preventDefault();
    setItemName("");
    setItemCost(0);
    setItemQuantity(1);
    setItemDiscount(0);
  };

  const saveInvoice = async (e) => {
    e.preventDefault();
    if (!itemList.length) return;

    // Create a new invoice
    if (!isEditing) {
      dispatch(
        setInvoice({
          customerName,
          customerAddress,
          customerVat,
          customerCity,
          customerEmail,
          itemList,
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
        customerAddress,
        customerCity,
        customerEmail,
        currency,
        itemList,
        timestamp: serverTimestamp(),
        id: (countInvoices += 1),
      })
        .then(() => {
          showToast("success", "Invoice created!📜");
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
          showToast("error", "Try again! Invoice not created!😭");
        });
    }
    // Update an existing invoice
    else {
      await updateDoc(doc(db, "invoices", invoiceId), {
        customerName,
        customerAddress,
        customerCity,
        customerEmail,
        currency,
        itemList,
      })
        .then(() => {
          showToast("success", "Invoice updated successfully!");
          navigate("/dashboard");
        })
        .catch((err) => {
          console.log(err);
          showToast("error", "Failed to update the invoice. Please try again.");
        });
    }
  };

  const deleteRow = (e, index) => {
    e.preventDefault();
    setItemList(itemList.filter((item, i) => i !== index));
  };

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div>
          <Nav />
          <div className="w-full p-3 md:w-2/3 shadow-xl mx-auto mt-8 rounded  my-8 md:p-8">
            <h3 className="text-center font-bold text-xl mb-4">
              Create an invoice
            </h3>

            <form className="w-full mx-auto flex flex-col">
              <label htmlFor="customerName" className="text-sm">
                Customer's Name
              </label>
              <input
                type="text"
                required
                name="customerName"
                className="py-2 px-4 bg-gray-100 w-full mb-6"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />
              <label htmlFor="customerVat" className="text-sm">
                Customer's VAT
              </label>
              <input
                type="text"
                name="customerVat"
                className="py-2 px-4 bg-gray-100 w-full mb-6"
                value={customerVat}
                onChange={(e) => setCustomerVat(e.target.value ?? "")}
              />

              <div className="flex items-end space-x-3">
                <div className="flex flex-col w-1/2">
                  <label htmlFor="customerAddress" className="text-sm">
                    Customer's Address
                  </label>
                  <input
                    type="text"
                    name="customerAddress"
                    className="py-2 px-4 bg-gray-100 w-full mb-6"
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                  />
                </div>

                <div className="flex flex-col w-1/2">
                  <label htmlFor="customerCity" className="text-sm">
                    Customer's Country
                  </label>
                  <input
                    type="text"
                    required
                    name="customerCity"
                    className="py-2 px-4 bg-gray-100 w-full mb-6"
                    value={customerCity}
                    onChange={(e) => setCustomerCity(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex flex-col w-2/3">
                  <label htmlFor="customerEmail" className="text-sm">
                    Customer's Email
                  </label>
                  <input
                    type="email"
                    required
                    name="customerEmail"
                    className="py-2 px-4 bg-gray-100 w-full mb-6"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                  />
                </div>

                <div className="flex flex-col w-1/3">
                  <label htmlFor="currency" className="text-sm">
                    Currency
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={3}
                    minLength={3}
                    name="currency"
                    className="py-2 px-4 bg-gray-100 w-full mb-6"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {products.map((product) => (
                  <ProductButton
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    price={product.price}
                    click={handleAddToRow}
                  />
                ))}
              </div>

              <div className="w-full flex justify-between flex-col">
                <h3 className="my-4 font-bold ">Products List</h3>

                <div className="flex flex-col">
                  <div className="flex flex-col justify-center md:w-full">
                    <label htmlFor="itemName" className="text-sm">
                      Name
                    </label>
                    <input
                      type="text"
                      name="itemName"
                      placeholder="Name"
                      className="py-2 px-4 mb-6 bg-gray-100"
                      value={itemName}
                      onChange={(e) => setItemName(e.target.value)}
                    />
                  </div>

                  <div className="md:flex md:justify-between">
                    <div className="flex flex-col justify-center md:w-1/5">
                      <label htmlFor="itemCost" className="text-sm">
                        Cost
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        name="itemCost"
                        placeholder="Cost"
                        className="py-2 px-4 mb-6 bg-gray-100"
                        value={itemCost}
                        onChange={(e) => setItemCost(e.target.value)}
                      />
                    </div>

                    <div className="flex flex-col justify-center md:w-1/5">
                      <label htmlFor="itemQuantity" className="text-sm">
                        Quantity
                      </label>
                      <input
                        type="number"
                        name="itemQuantity"
                        placeholder="Quantity"
                        className="py-2 px-4 mb-6 bg-gray-100"
                        value={itemQuantity}
                        onChange={(e) => setItemQuantity(e.target.value)}
                      />
                    </div>
                    {/* <div className="flex flex-col justify-center md:w-1/5">
                      <label htmlFor="itemDiscount" className="text-sm">
                        Discount
                      </label>
                      <input
                        type="number"
                        name="itemDiscount"
                        placeholder="Discount"
                        className="py-2 px-4 mb-6 bg-gray-100"
                        value={itemDiscount}
                        onChange={(e) => setItemDiscount(e.target.value)}
                      />
                    </div> */}

                    <div className="flex flex-col justify-center md:w-1/5">
                      <p className="text-sm">Price</p>
                      <p className="py-2 px-4 mb-6 bg-gray-100">
                        {Number(
                          itemCost * itemQuantity -
                            (itemCost * itemQuantity * (itemDiscount || 0)) /
                              100
                        ).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <button
                    className="bg-blue-500 hover:bg-blue-600 text-gray-100 w-[150px] py-3 px-4 rounded my-2"
                    onClick={handleSubmit}
                  >
                    Add Item
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-600 text-gray-100 w-[150px] p-3 rounded my-2"
                    onClick={clearForm}
                  >
                    Clear Form
                  </button>
                </div>
              </div>

              {itemList[0] && (
                <CreateInvoiceTable
                  itemList={itemList}
                  onDeleteRow={deleteRow}
                />
              )}

              <button
                className="bg-green-500 bg-opacity-75 hover:bg-opacity-100 text-white font-bold py-2 px-4 rounded w-full mt-6"
                onClick={saveInvoice}
              >
                SAVE INVOICE
              </button>
            </form>
          </div>
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
        </div>
      )}
    </>
  );
};

export default CreateInvoice;
