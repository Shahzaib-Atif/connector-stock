import { Check, ExternalLink, X } from "lucide-react";
import { ReclickStep } from "./types";

interface Props {
  newConnector: string;
  steps: ReclickStep[];
  currentStep: number;
  onLaunchStep: () => void;
  onClose: () => void;
}

// Guides one DIVDESK launch per explicit user click.
export default function DivDeskReclickModal({
  newConnector,
  steps,
  currentStep,
  onLaunchStep,
  onClose,
}: Props) {
  const total = steps.length;
  const current = steps[currentStep];
  const isLast = currentStep === total - 1;

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-lg flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div>
            <h3 className="text-lg font-semibold text-white">Open DIVDESK</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Step {currentStep + 1} of {total} — click once per line
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-4 space-y-4">
          <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all duration-300"
              style={{ width: `${((currentStep + 1) / total) * 100}%` }}
            />
          </div>

          <p className="text-sm text-slate-300">
            Please process one line at a time.
          </p>

          <div className="rounded-lg border border-blue-500/40 bg-blue-500/10 p-4 space-y-2">
            <p className="text-xs text-white uppercase tracking-wide">
              Current line
            </p>
            <p className="text-sm text-slate-300">
              <span className="text-slate-500">Line No.</span>
              {current.line}
              <br />
              <span className="text-slate-500">Order No.</span> {current.enc}
            </p>

            {current.previousConnector && (
              <p className="text-sm">
                <span className="text-slate-500">Conector:</span>{" "}
                <span className="text-amber-300 line-through">
                  {current.previousConnector}
                </span>
                {" → "}
                <span className="text-emerald-300 font-mono">
                  {newConnector}
                </span>
              </p>
            )}
          </div>

          <ul className="max-h-64 overflow-y-auto space-y-1 text-sm">
            {steps.map((step, index) => {
              const done = index < currentStep;
              const active = index === currentStep;
              return (
                <li
                  key={`${step.enc}-${step.line}`}
                  className={`flex items-center gap-2 px-2 py-1 rounded ${
                    active ? "bg-blue-500/15 text-blue-200" : "text-slate-500"
                  }`}
                >
                  {done ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  ) : (
                    <span className="w-3.5 h-3.5 rounded-full border border-slate-600 shrink-0" />
                  )}
                  <span>
                    Line No: {step.line}
                    {done ? " — done" : active ? " — next" : ""}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="px-6 py-4 border-t border-slate-800 flex flex-col gap-2">
          <button
            type="button"
            onClick={onLaunchStep}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            {isLast
              ? `Open DIVDESK — Line No: ${current.line} (last)`
              : `Open DIVDESK — Line No: ${current.line}`}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full px-4 py-2 rounded-lg text-sm text-slate-400 hover:text-slate-200 transition-colors"
          >
            Cancel remaining steps
          </button>
        </div>
      </div>
    </div>
  );
}
