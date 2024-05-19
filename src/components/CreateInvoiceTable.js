import React, { memo } from "react";

const CreateInvoiceTable = memo(({ itemList, onDeleteRow }) => {
  return (
    <div className="my-4">
      <table className="w-full table-auto">
        <thead>
          <tr>
            <th className="text-left">Item Name</th>
            <th>Item Cost</th>
            <th className="text-right">Item Quantity</th>
            <th className="text-right">Total Cost</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {itemList.map((item, index) => (
            <tr key={index}>
              <td>{item.itemName}</td>
              <td className="flex justify-between">
                <span> {item.itemCost} </span>

                <span className="discount-percentage">
                  {item.itemDiscount ? `-${item.itemDiscount}%` : ""}
                </span>
              </td>
              <td className="text-right">{item.itemQuantity}</td>
              <td className="text-right">
                {(
                  item.itemCost * item.itemQuantity -
                  (item.itemCost *
                    item.itemQuantity *
                    (parseFloat(item.itemDiscount) || 0)) /
                    100
                ).toFixed(2)}
              </td>
              <td className="text-right">
                <button
                  className="text-red-600"
                  onClick={(e) => onDeleteRow(e, index)}
                >
                  X
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});

export default CreateInvoiceTable;
