import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getDownloadURL, ref, uploadString } from "@firebase/storage";
import { storage } from "../firebase";
import {
  addDoc,
  collection,
  doc,
  updateDoc,
  onSnapshot,
  query,
  where,
} from "@firebase/firestore";

import db from "../firebase";
import Nav from "../components/Nav";
import Loading from "../components/Loading";
import { showToast } from "../utils/functions";
import { getAuth } from "firebase/auth";

const SetupProfile = () => {
  const auth = getAuth();
  const [businessName, setBusinessName] = useState("");
  const [businessAddress, setBusinessAddress] = useState("");
  const [businessCity, setBusinessCity] = useState("");
  const [tic, setTic] = useState("");
  const [vat, setVat] = useState("");
  const [bankName, setBankName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [bankNo, setBankNo] = useState("");
  const [iban, setIban] = useState("");
  const [swift, setSwift] = useState("");
  const [logo, setLogo] = useState(
    "https://www.pesmcopt.com/admin-media/images/default-logo.png"
  );
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const q = query(
        collection(db, "businesses"),
        where("user_id", "==", auth.currentUser.uid)
      );
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const business = [];
        querySnapshot.forEach((doc) => {
          business.push(doc.data().name);
        });
        setLoading(false);

        if (business.length > 0) {
          navigate("/dashboard");
        }
      });
      return () => unsubscribe();
    } catch (error) {
      console.log(error);
    }
  }, [auth.currentUser.uid]);

  const handleFileReader = (e) => {
    const reader = new FileReader();
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }
    reader.onload = (readerEvent) => {
      setLogo(readerEvent.target.result);
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const docRef = await addDoc(collection(db, "businesses"), {
      user_id: auth.currentUser.uid,
      businessName,
      businessAddress,
      businessCity,
      phone,
      tic,
      vat,
      email,
      iban,
      swift,
      bankNo,
      bankName,
      invoices: 0,
    });

    const imageRef = ref(storage, `businesses/${docRef.id}/image`);
    const metadata = {
      customMetadata: {
        owner: auth.currentUser.uid,
      },
    };

    if (
      logo !== "https://www.pesmcopt.com/admin-media/images/default-logo.png"
    ) {
      await uploadString(imageRef, logo, "data_url", metadata).then(
        async (snapshop) => {
          const downloadURL = await getDownloadURL(imageRef);
          await updateDoc(doc(db, "businesses", docRef.id), {
            logo: downloadURL,
          });
          showToast("success", "Your profile has been created!");
        }
      );
      navigate("/dashboard");
    }
  };

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div>
          <Nav />
          <div className="w-full md:p-8 md:w-2/3 md:shadow mx-auto mt-8 rounded p-3 my-8">
            <h3 className="text-center font-bold  mb-6 text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl">
              Setup Business Profile
            </h3>

            <form
              className="w-full mx-auto flex flex-col"
              onSubmit={handleSubmit}
            >
              <div className="flex flex-col sm:flex-row sm:space-x-4">
                <div className="flex flex-col sm:w-1/3">
                  <label htmlFor="businessName" className="text-sm">
                    Company name
                  </label>
                  <input
                    type="text"
                    required
                    className="py-2 px-4 bg-gray-100 w-full mb-6 capitalize rounded"
                    name="businessName"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                  />
                </div>
                <div className="flex flex-col sm:w-1/3">
                  <label htmlFor="email" className="text-sm">
                    Company Email
                  </label>
                  <input
                    type="email"
                    required
                    className="py-2 px-4 bg-gray-100 w-full mb-6 rounded"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="flex flex-col sm:w-1/3">
                  <label htmlFor="phone" className="text-sm">
                    Company Phone
                  </label>
                  <input
                    type="phone"
                    required
                    className="py-2 px-4 bg-gray-100 w-full mb-6 rounded"
                    name="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:space-x-4">
                <div className="flex flex-col sm:w-1/2">
                  <label htmlFor="businessAddress" className="text-sm">
                    Address (street,district)
                  </label>
                  <input
                    type="text"
                    required
                    className="py-2 px-4 bg-gray-100 w-full mb-6 rounded"
                    name="businessAddress"
                    value={businessAddress}
                    onChange={(e) => setBusinessAddress(e.target.value)}
                  />
                </div>

                <div className="flex flex-col sm:w-1/2">
                  <label htmlFor="businessCity" className="text-sm">
                    Post code, City, Country
                  </label>
                  <input
                    type="text"
                    required
                    className="py-2 px-4 bg-gray-100 w-full mb-6 rounded"
                    name="businessCity"
                    value={businessCity}
                    onChange={(e) => setBusinessCity(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:space-x-4">
                <div className="flex flex-col sm:w-1/2">
                  <label htmlFor="vat" className="text-sm">
                    VAT number
                  </label>
                  <input
                    type="text"
                    className="py-2 px-4 bg-gray-100 w-full mb-6 rounded"
                    name="vat"
                    value={vat}
                    onChange={(e) => setVat(e.target.value)}
                  />
                </div>

                <div className="flex flex-col sm:w-1/2">
                  <label htmlFor="tic" className="text-sm">
                    T.I.C number
                  </label>
                  <input
                    type="text"
                    className="py-2 px-4 bg-gray-100 w-full mb-6 rounded"
                    name="tic"
                    value={tic}
                    onChange={(e) => setTic(e.target.value)}
                  />
                </div>
              </div>

              <label htmlFor="bankName" className="text-sm">
                Bank Name
              </label>
              <input
                type="text"
                className="py-2 px-4 bg-gray-100 w-full mb-6 capitalize rounded"
                name="bankName"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
              />

              <div className="flex flex-col sm:flex-row sm:space-x-4 ">
                <div className="flex flex-col sm:w-1/3">
                  <label htmlFor="bankNo" className="text-sm">
                    Account No:
                  </label>
                  <input
                    type="text"
                    className="py-2 px-4 bg-gray-100 w-full mb-6  rounded"
                    name="bankNo"
                    value={bankNo}
                    onChange={(e) => setBankNo(e.target.value)}
                  />
                </div>
                <div className="flex flex-col sm:w-1/3">
                  <label htmlFor="iban" className="text-sm">
                    Iban
                  </label>
                  <input
                    type="text"
                    className="py-2 px-4 bg-gray-100 w-full mb-6 capitalize rounded"
                    name="iban"
                    value={iban}
                    onChange={(e) => setIban(e.target.value)}
                  />
                </div>
                <div className="flex flex-col sm:w-1/3">
                  <label htmlFor="swift" className="text-sm">
                    Swift
                  </label>
                  <input
                    type="text"
                    className="py-2 px-4 bg-gray-100 w-full mb-6 capitalize rounded"
                    name="swift"
                    value={swift}
                    onChange={(e) => setSwift(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-4 w-full">
                <div className="flex flex-col w-1/2">
                  <img
                    src={logo}
                    alt="Logo"
                    className=" w-full max-h-[300px]"
                  />
                </div>

                <div className="flex flex-col w-full">
                  <label htmlFor="logo" className="text-sm mb-1">
                    {logo ===
                      "https://www.pesmcopt.com/admin-media/images/default-logo.png" &&
                      "Upload logo"}
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    required
                    className="w-full mb-6  rounded"
                    name="logo"
                    onChange={handleFileReader}
                  />
                </div>
              </div>

              <button className="bg-blue-800 text-gray-100 w-full p-5 rounded my-6">
                COMPLETE PROFILE
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default SetupProfile;
