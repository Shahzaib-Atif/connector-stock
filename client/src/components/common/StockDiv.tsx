import React from "react";

interface Props {
  currentStock: number;
}

function StockDiv({ currentStock }: Props) {
  return (
    <div id="stock-div" className="flex justify-between items-start">
      <div>
        <h2 className="text-lg sm:text-2xl font-bold text-white">
          {currentStock}
        </h2>
        <p className="text-slate-400 font-medium text-base sm:text-base">
          Units Available
        </p>
      </div>
    </div>
  );
}

export default StockDiv;
