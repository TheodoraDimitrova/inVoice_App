import React from "react";

export default function ProductButton({ product, click, currencySymbol = "\u20ac" }) {
  const { id, name, price, unit, vat } = product;
  return (
    <div
      onClick={(e) => click(e, product)}
      id={`product-${id}`}
      className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
    >
      <div className="text-left">
        <div>{name}</div>
        <div className="text-xs font-normal opacity-90">
          {currencySymbol} {Number(price || 0).toFixed(2)}
          {unit ? ` · ${unit}` : ""} · {Number(vat ?? 20)}% ДДС
        </div>
      </div>
    </div>
  );
}
