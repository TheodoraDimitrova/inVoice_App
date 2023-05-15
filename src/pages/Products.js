import React, { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";

import db, { auth } from "../firebase";
import { showToast } from "../utils/functions";
import { IconButton, Tooltip } from "@mui/material";
import { useNavigate } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";

function Products() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [products, setProducts] = useState([]);
  const [editing, setEditing] = useState(false); // State variable for tracking editing state
  const [editProductId, setEditProductId] = useState(""); // State variable for storing the ID of the product being edited
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const editProduct = (productId, currentName, currentPrice) => {
    // Set the current values in the form fields
    setName(currentName);
    setPrice(currentPrice.toString());

    // Set the editing state and the ID of the product being edited
    setEditing(true);
    setEditProductId(productId);
  };

  const updateProduct = async (productId, newName, newPrice) => {
    // Update the product in the database
    try {
      const userId = auth.currentUser.uid;
      await updateDoc(doc(db, "users", userId, "products", productId), {
        name: newName,
        price: newPrice,
      });
      fetchProducts();
    } catch (error) {
      showToast("error", "Please contact technical support");
    }

    // Reset form fields and editing state after update
    setName("");
    setPrice("");
    setEditing(false);
    setEditProductId("");
  };

  const addProduct = async (e) => {
    e.preventDefault();

    if (name && price) {
      try {
        const userId = auth.currentUser.uid;
        const newProduct = {
          name,
          price: parseFloat(price),
        };

        if (editing) {
          // If editing mode, update the existing product
          await updateProduct(editProductId, newProduct.name, newProduct.price);
        } else {
          // If new product, add it to the database
          await addDoc(collection(db, "users", userId, "products"), newProduct);
        }

        fetchProducts();
        setName("");
        setPrice("");
        setEditing(false);
        setEditProductId("");

        // Display success toast message
        showToast(
          "success",
          editing
            ? "Product updated successfully!"
            : "Product added successfully!"
        );
      } catch (error) {
        showToast("error", "Please contact technical support");
      }
    } else {
      showToast("error", "Please fill in all the required fields.");
    }
  };

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

  const deleteProduct = async (productId) => {
    try {
      const userId = auth.currentUser.uid;
      await deleteDoc(doc(db, "users", userId, "products", productId));
      showToast("success", "Product deleted successfully!");
      fetchProducts();
    } catch (error) {
      showToast("error", "Please contact technical support");
    }
  };

  return (
    <div className="container mx-auto h-screen mt-8">
      <h1 className="text-4xl text-center font-bold mb-8">Products</h1>

      <form onSubmit={addProduct} className="mb-4">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mr-2 px-2 py-1 border border-gray-300 rounded"
        />
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="mr-2 px-2 py-1 border border-gray-300 rounded"
        />
        <button
          type="submit"
          className={`px-3 py-1 rounded ${
            editing ? "bg-green-500 text-white" : "bg-blue-500 text-white"
          }`}
        >
          {editing ? "Update Product" : "Add Product"}
        </button>
      </form>

      {products.length > 0 ? (
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 bg-gray-100 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product
              </th>
              <th className="px-6 py-3 bg-gray-100 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 bg-gray-100 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td className="px-6 py-2 whitespace-nowrap">{product.name}</td>
                <td className="px-6 py-2 whitespace-nowrap">
                  {product.price.toFixed(2)} &euro;
                </td>
                <td className="px-6 py-2 whitespace-nowrap">
                  <button
                    onClick={() => deleteProduct(product.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded mr-2"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() =>
                      editProduct(product.id, product.name, product.price)
                    }
                    className="px-3 py-1 bg-green-500 text-white rounded"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No products available</p>
      )}

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
  );
}

export default Products;
