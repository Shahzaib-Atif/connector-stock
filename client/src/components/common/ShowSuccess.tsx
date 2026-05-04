import { AlertTriangle, CheckCircle2 } from "lucide-react";

interface Props {
  title: string;
  message: string;
  variant?: "success" | "warning";
  actionLabel?: string;
  onAction?: () => void;
}

function ShowSuccess({
  title,
  message,
  variant = "success",
  actionLabel,
  onAction,
}: Props) {
  const isWarning = variant === "warning";

  return (
    <div className="flex flex-col items-center justify-center py-6 space-y-3">
      {isWarning ? (
        <AlertTriangle className="w-16 h-16 text-amber-400 animate-pulse" />
      ) : (
        <CheckCircle2 className="w-16 h-16 text-green-500 animate-bounce" />
      )}
      <p className="text-xl font-bold text-white">{title}</p>
      <p className={isWarning ? "text-amber-200 text-center" : "text-slate-400 text-center"}>
        {message}
      </p>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className={
            isWarning
              ? "mt-2 rounded-xl bg-amber-600 px-4 py-2 font-medium text-white transition-colors hover:bg-amber-500"
              : "mt-2 rounded-xl bg-slate-800 px-4 py-2 font-medium text-slate-200 transition-colors hover:bg-slate-700"
          }
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export default ShowSuccess;
