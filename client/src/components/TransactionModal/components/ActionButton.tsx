interface Props {
  handleSubmit: () => void;
  type: "IN" | "OUT";
  isAuthenticated: boolean;
  amount: number;
  subType: string;
  isConnector: boolean;
}

function ActionButton({
  handleSubmit,
  type,
  isAuthenticated,
  amount,
  subType,
  isConnector,
}: Props) {
  return (
    <button
      onClick={handleSubmit}
      className={`w-full py-4 rounded-xl font-bold text-base sm:text-lg shadow-lg transition-transform active:scale-[0.98] ${
        type === "IN" ? "btn-primary" : "btn-secondary"
      } ${
        !isAuthenticated || amount === 0 || (isConnector && !subType)
          ? "opacity-50 cursor-not-allowed"
          : ""
      }`}
      disabled={!isAuthenticated || amount === 0 || (isConnector && !subType)}
    >
      CONFIRM {type === "IN" ? "ENTRY" : "WITHDRAWAL"}
    </button>
  );
}

export default ActionButton;
