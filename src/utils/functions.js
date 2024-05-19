import { toast } from "react-toastify";

export const showToast = (type, message) => {
  if (type === "success") {
    toast.success(message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  } else {
    toast.error(message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  }
};
// export const findGrandTotal = ({ itemList }, currency, vatRate) => {
//   console.log(vatRate);
//   let total = 0;
//   for (let i = 0; i < itemList.length; i++) {
//     const amount =
//       itemList[i].itemCost * itemList[i].itemQuantity -
//       (itemList[i].itemCost *
//         itemList[i].itemQuantity *
//         (itemList[i].itemDiscount || 0)) /
//         100;
//     total += amount;
//   }
//   total = total * ((100 + vatRate) / 100);
//   return `${currency} ${total.toFixed(2).toLocaleString("en-US")}`;
// };
export const findGrandTotal = ({ itemList }, currency, vatRate) => {
  vatRate = parseFloat(vatRate);
  if (isNaN(vatRate)) {
    throw new Error("Invalid VAT rate");
  }

  if (typeof currency !== "string") {
    throw new Error("Currency must be a string");
  }

  let total = 0;
  for (let i = 0; i < itemList.length; i++) {
    const amount =
      itemList[i].itemCost * itemList[i].itemQuantity -
      (itemList[i].itemCost *
        itemList[i].itemQuantity *
        (itemList[i].itemDiscount || 0)) /
        100;
    total += amount;
  }
  const grandTotal = total * ((100 + vatRate) / 100);
  return `${currency} ${grandTotal.toFixed(2)}`;
};
export const amount = ({ itemList }, currency) => {
  let total = 0;
  for (let i = 0; i < itemList.length; i++) {
    const amount =
      itemList[i].itemCost * itemList[i].itemQuantity -
      (itemList[i].itemCost *
        itemList[i].itemQuantity *
        (itemList[i].itemDiscount || 0)) /
        100;

    total += amount;
  }

  return `${currency} ${total.toFixed(2).toLocaleString("en-US")}`;
};
export const checkVat = ({ itemList }, currency, vatRate) => {
  let total = 0;
  for (let i = 0; i < itemList.length; i++) {
    const amount =
      itemList[i].itemCost * itemList[i].itemQuantity -
      (itemList[i].itemCost *
        itemList[i].itemQuantity *
        (itemList[i].itemDiscount || 0)) /
        100;
    total += amount;
  }
  total = (total / 100) * vatRate;

  return `${currency} ${total.toFixed(2).toLocaleString("en-US")}`;
};

export const convertTimestamp = (timestamp) => {
  const fireBaseTime = new Date(
    timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000
  );
  const day =
    fireBaseTime.getDate() < 10
      ? `0${fireBaseTime.getDate()}`
      : fireBaseTime.getDate();
  // const month =
  //   fireBaseTime.getMonth() < 10
  //     ? `0${fireBaseTime.getMonth() + 1}`
  //     : fireBaseTime.getMonth() + 1;

  const month =
    fireBaseTime.getMonth().length === 1
      ? `0${fireBaseTime.getMonth() + 1}`
      : fireBaseTime.getMonth() + 1;

  const year = fireBaseTime.getFullYear();

  return `${day}-${month}-${year}`;
};
