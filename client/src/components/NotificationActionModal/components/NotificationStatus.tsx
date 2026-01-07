import CustomNote from "./CustomNote";

interface Props {
  completionType: "fulfilled" | "outOfStock" | "other";
  setCompletionType: (val: "fulfilled" | "outOfStock" | "other") => void;
  maxQuantity: number;
  customNote: string;
  setCustomNote: (val: string) => void;
}

export default function NotificationStatus({
  completionType,
  maxQuantity,
  customNote,
  setCustomNote,
  setCompletionType,
}: Props) {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-slate-400">
        Completion Status
      </label>
      <div className="grid grid-cols-3 gap-3">
        <button
          type="button"
          onClick={() => setCompletionType("fulfilled")}
          className={`px-3 py-2.5 rounded-xl text-sm font-medium transition-all border ${
            completionType === "fulfilled"
              ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/20"
              : buttonClass2
          }`}
        >
          Fulfilled
        </button>
        <button
          type="button"
          onClick={() => setCompletionType("outOfStock")}
          className={`px-3 py-2.5 rounded-xl text-sm font-medium transition-all border ${
            completionType === "outOfStock"
              ? "bg-amber-600 border-amber-500 text-white shadow-lg shadow-amber-600/20"
              : buttonClass2
          }`}
        >
          Out of Stock
        </button>
        <button
          type="button"
          onClick={() => setCompletionType("other")}
          className={`px-3 py-2.5 rounded-xl text-sm font-medium transition-all border ${
            completionType === "other"
              ? "bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-600/20"
              : buttonClass2
          }`}
        >
          Other
        </button>
      </div>

      <CustomNote
        completionType={completionType}
        customNote={customNote}
        setCustomNote={setCustomNote}
      />
    </div>
  );
}

const buttonClass2 =
  "bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800";
