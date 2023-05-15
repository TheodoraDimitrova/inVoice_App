import React from "react";

export default function ProductButton({ id, name, price, click }) {
  return (
    <div
      onClick={(e) => click(e, id, name, price)}
      id={`product-${id}`}
      className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
    >
      {`${name} - ${price.toFixed(2)} \u20AC`}
    </div>
  );
}
