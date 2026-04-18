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
import { Button, IconButton, TextField, Tooltip, Typography } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import { outlinedFieldSx } from "../utils/muiFieldSx";

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
              <TextField
                label="Customer's Name"
                name="customerName"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                required
                fullWidth
                variant="outlined"
                sx={outlinedFieldSx}
              />
              <TextField
                label="Customer's VAT"
                name="customerVat"
                value={customerVat}
                onChange={(e) => setCustomerVat(e.target.value ?? "")}
                fullWidth
                variant="outlined"
                sx={outlinedFieldSx}
              />

              <div className="flex items-end space-x-3">
                <div className="flex flex-col w-1/2">
                  <TextField
                    label="Customer's Address"
                    name="customerAddress"
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                    fullWidth
                    variant="outlined"
                    sx={outlinedFieldSx}
                  />
                </div>

                <div className="flex flex-col w-1/2">
                  <TextField
                    label="Customer's Country"
                    name="customerCity"
                    value={customerCity}
                    onChange={(e) => setCustomerCity(e.target.value)}
                    required
                    fullWidth
                    variant="outlined"
                    sx={outlinedFieldSx}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex flex-col w-2/3">
                  <TextField
                    label="Customer's Email"
                    type="email"
                    name="customerEmail"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    required
                    fullWidth
                    variant="outlined"
                    sx={outlinedFieldSx}
                  />
                </div>

                <div className="flex flex-col w-1/3">
                  <TextField
                    label="Currency"
                    name="currency"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    required
                    fullWidth
                    variant="outlined"
                    inputProps={{ maxLength: 3, minLength: 3 }}
                    sx={outlinedFieldSx}
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
                    <TextField
                      label="Name"
                      name="itemName"
                      placeholder="Name"
                      value={itemName}
                      onChange={(e) => setItemName(e.target.value)}
                      fullWidth
                      variant="outlined"
                      sx={outlinedFieldSx}
                    />
                  </div>

                  <div className="md:flex md:justify-between">
                    <div className="flex flex-col justify-center md:w-1/5">
                      <TextField
                        label="Cost"
                        type="number"
                        name="itemCost"
                        placeholder="Cost"
                        value={itemCost}
                        onChange={(e) => setItemCost(e.target.value)}
                        fullWidth
                        variant="outlined"
                        inputProps={{ step: "0.01", min: 0 }}
                        sx={outlinedFieldSx}
                      />
                    </div>

                    <div className="flex flex-col justify-center md:w-1/5">
                      <TextField
                        label="Quantity"
                        type="number"
                        name="itemQuantity"
                        placeholder="Quantity"
                        value={itemQuantity}
                        onChange={(e) => setItemQuantity(e.target.value)}
                        fullWidth
                        variant="outlined"
                        inputProps={{ min: 1 }}
                        sx={outlinedFieldSx}
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
                      <Typography variant="body2" sx={{ mb: 0.5 }}>
                        Price
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          py: 1.5,
                          px: 2,
                          mb: 3,
                          bgcolor: "grey.100",
                          borderRadius: 1,
                        }}
                      >
                        {Number(
                          itemCost * itemQuantity -
                            (itemCost * itemQuantity * (itemDiscount || 0)) /
                              100
                        ).toFixed(2)}
                      </Typography>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between gap-2">
                  <Button
                    type="button"
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                    sx={{ minWidth: 150, my: 1 }}
                  >
                    Add Item
                  </Button>
                  <Button
                    type="button"
                    variant="contained"
                    color="error"
                    onClick={clearForm}
                    sx={{ minWidth: 150, my: 1 }}
                  >
                    Clear Form
                  </Button>
                </div>
              </div>

              {itemList[0] && (
                <CreateInvoiceTable
                  itemList={itemList}
                  onDeleteRow={deleteRow}
                />
              )}

              <Button
                type="button"
                variant="contained"
                color="success"
                fullWidth
                size="large"
                sx={{ mt: 3 }}
                onClick={saveInvoice}
              >
                SAVE INVOICE
              </Button>
            </form>
          </div>
          <Tooltip title="Go Home">
            <IconButton
              onClick={() => navigate("/dashboard")}
              sx={{
                position: "fixed",
                bottom: "50px",
                right: "30px",
                zIndex: 1000,
              }}
            >
              <HomeIcon sx={{ fontSize: "30px" }} />
            </IconButton>
          </Tooltip>
        </div>
      )}
    </>
  );
};

export default CreateInvoice;
