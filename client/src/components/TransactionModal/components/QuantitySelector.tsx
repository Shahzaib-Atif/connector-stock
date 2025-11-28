import React from "react";

interface QuantitySelectorProps {
  amount: number;
  onChange: (amount: number) => void;
}

export const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  amount,
  onChange,
}) => {
  return (
    <div className="flex items-center justify-center gap-6">
      <button
        onClick={() => onChange(Math.max(1, amount - 1))}
        className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold text-xl hover:bg-slate-600 transition-colors"
      >
        -
      </button>
      <input
        type="number"
        value={amount === 0 ? "" : amount}
        onChange={(e) => {
          const val = e.target.value;
          if (val === "") {
            onChange(0);
          } else {
            const num = parseInt(val);
            if (!isNaN(num) && num >= 0) {
              onChange(num);
            }
          }
        }}
        onBlur={() => {
          if (amount === 0) {
            onChange(1);
          }
        }}
        className="text-4xl font-bold text-white w-24 text-center bg-transparent border-none outline-none focus:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      />
      <button
        onClick={() => onChange(amount + 1)}
        className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold text-xl hover:bg-slate-600 transition-colors"
      >
        +
      </button>
    </div>
  );
};
