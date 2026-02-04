interface Props {
  handleSubmit: () => void;
  type: "IN" | "OUT";
  isAuthenticated: boolean;
  amount: number;
  targetId: string;
  subType: string;
}

function ActionButton({
  handleSubmit,
  type,
  isAuthenticated,
  amount,
  targetId,
  subType,
}: Props) {
  return (
    <button
      onClick={handleSubmit}
      className={`w-full py-4 rounded-xl font-bold text-base sm:text-lg shadow-lg transition-transform active:scale-[0.98] ${
        type === "IN" ? "btn-primary" : "btn-secondary"
      } ${
        !isAuthenticated ||
        amount === 0 ||
        (!targetId.includes("_") && !subType)
          ? "opacity-50 cursor-not-allowed"
          : ""
      }`}
      disabled={
        !isAuthenticated ||
        amount === 0 ||
        (!targetId.includes("_") && !subType)
      }
    >
      CONFIRM {type === "IN" ? "ENTRY" : "WITHDRAWAL"}
    </button>
  );
}

export default ActionButton;
