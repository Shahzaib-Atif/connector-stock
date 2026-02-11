import { NotificationCompletion_T } from "@/utils/types";

interface Props {
  completionType: NotificationCompletion_T;
  customNote: string;
  setCustomNote: (val: string) => void;
}

function CustomNote({ completionType, customNote, setCustomNote }: Props) {
  return (
    completionType === "other" && (
      <div className="space-y-2">
        <label
          htmlFor="note"
          className="block text-sm font-medium text-slate-400"
        >
          {completionType === "other"
            ? "Description (Required)"
            : "Additional Note (Optional)"}
        </label>
        <textarea
          id="note"
          value={customNote}
          onChange={(e) => setCustomNote(e.target.value)}
          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all resize-none h-24"
          placeholder={
            completionType === "other"
              ? "Please explain..."
              : "Add any details here..."
          }
          required={completionType === "other"}
        />
      </div>
    )
  );
}

export default CustomNote;
