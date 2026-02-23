import { DeliveryStatus } from "@/utils/types";

interface Props {
  quantityInput: string;
  setQuantityInput: (val: string) => void;
  maxQuantity?: number;
  deliveryStatus: DeliveryStatus;
}

function QuantityInput({
  deliveryStatus,
  maxQuantity,
  quantityInput,
  setQuantityInput,
}: Props) {
  const isDisabled =
    deliveryStatus === DeliveryStatus.OutOfStock || maxQuantity === 0;

  return (
    <div
      className={`transition-all duration-200 ${
        isDisabled ? "opacity-50 pointer-events-none" : "opacity-100"
      }`}
    >
      <label
        htmlFor="quantity"
        className="block text-sm font-medium text-slate-400 mb-1.5"
      >
        Quantity Being Taken Out
      </label>
      <input
        id="quantity"
        type="number"
        min="0"
        max={maxQuantity}
        value={quantityInput}
        onChange={(e) => {
          const val = e.target.value;
          if (val === "") {
            setQuantityInput("");
          } else {
            let num = parseInt(val);
            if (!isNaN(num)) {
              if (maxQuantity !== undefined && num > maxQuantity) {
                num = maxQuantity;
              }
              setQuantityInput(Math.max(0, num).toString());
            }
          }
        }}
        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all disabled:opacity-50"
        placeholder={isDisabled ? "0" : "Enter quantity"}
        required={!isDisabled}
        disabled={isDisabled}
      />
    </div>
  );
}

export default QuantityInput;
