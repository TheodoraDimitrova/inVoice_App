import { toast } from "react-toastify";
import { lineNetBeforeVat, lineVatAmount } from "./invoiceLineNet";

const toastOptions = {
  position: "top-right",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  style: {
    background: "var(--color-brand-primary)",
    color: "#ffffff",
    border: "1px solid rgba(255, 255, 255, 0.22)",
  },
  progressStyle: {
    background: "var(--color-brand-accent)",
  },
};

export const showToast = (type, message) => {
  if (type === "success") {
    toast.success(message, {
      ...toastOptions,
      icon: () => (
        <span
          style={{
            width: 18,
            height: 18,
            borderRadius: "50%",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#ffffff",
            color: "var(--color-brand-primary)",
            fontSize: 12,
            fontWeight: 900,
            lineHeight: 1,
          }}
        >
          ✓
        </span>
      ),
    });
  } else {
    toast.error(message, toastOptions);
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
  if (typeof currency !== "string") {
    throw new Error("Currency must be a string");
  }
  let total = 0;
  for (let i = 0; i < itemList.length; i++) {
    const item = itemList[i];
    total += lineNetBeforeVat(item) + lineVatAmount(item, vatRate);
  }
  return `${currency} ${total.toFixed(2)}`;
};
export const amount = ({ itemList }, currency) => {
  let total = 0;
  for (let i = 0; i < itemList.length; i++) {
    total += lineNetBeforeVat(itemList[i]);
  }

  return `${currency} ${total.toFixed(2).toLocaleString("en-US")}`;
};
export const checkVat = ({ itemList }, currency, vatRate) => {
  let total = 0;
  for (let i = 0; i < itemList.length; i++) {
    total += lineVatAmount(itemList[i], vatRate);
  }

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
