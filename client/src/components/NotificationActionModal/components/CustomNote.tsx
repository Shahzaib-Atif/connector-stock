import { DeliveryStatus } from "@/utils/types";

interface Props {
  deliveryStatus: DeliveryStatus;
  customNote: string;
  setCustomNote: (val: string) => void;
}

function CustomNote({ deliveryStatus, customNote, setCustomNote }: Props) {
  return (
    deliveryStatus === DeliveryStatus.Other && (
      <div className="space-y-2">
        <label
          htmlFor="note"
          className="block text-sm font-medium text-slate-400"
        >
          {deliveryStatus === DeliveryStatus.Other
            ? "Description (Required)"
            : "Additional Note (Optional)"}
        </label>
        <textarea
          id="note"
          value={customNote}
          onChange={(e) => setCustomNote(e.target.value)}
          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all resize-none h-24"
          placeholder={
            deliveryStatus === DeliveryStatus.Other
              ? "Please explain..."
              : "Add any details here..."
          }
          required={deliveryStatus === DeliveryStatus.Other}
        />
      </div>
    )
  );
}

export default CustomNote;
