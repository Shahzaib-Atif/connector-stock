import { Database, X } from "lucide-react";

interface Props {
  onClose: () => void;
  currentStep: number;
}

function SampleWizardModalHeader({ onClose, currentStep }: Props) {
  return (
    <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
      <div className="flex items-center gap-2">
        <Database className="w-5 h-5 text-blue-400" />
        <h3 className="text-lg font-semibold text-white">{`Sample Creation Wizard - Step ${currentStep} of 3`}</h3>
      </div>
      <button
        onClick={onClose}
        className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
}

export default SampleWizardModalHeader;
