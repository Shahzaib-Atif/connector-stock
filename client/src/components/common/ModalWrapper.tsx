import { useClickOutside } from "@/hooks/useClickOutside";
import { useEscKeyDown } from "@/hooks/useEscKeyDown";
import { X, LucideProps } from "lucide-react";
import React, { useRef } from "react";

interface Props {
  onClose: () => void;
  Icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
  children: React.JSX.Element;
  title: string;
  extraClasses?: string;
}

export const ModalWrapper: React.FC<Props> = ({
  onClose,
  Icon,
  children,
  title,
  extraClasses = "",
}) => {
  const ref = useRef(null);
  useClickOutside(ref, onClose);
  useEscKeyDown(ref, onClose);

  return (
    <div
      id="modal-wrapper"
      className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4 "
    >
      <div
        ref={ref}
        className={
          "bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl animate-in fade-in zoom-in duration-200 w-full max-h-[95vh] overflow-y-auto " +
          extraClasses
        }
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Icon className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main Content */}
        {children}
      </div>
    </div>
  );
};
