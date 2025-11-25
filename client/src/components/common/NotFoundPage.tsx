import React from "react";
import { LucideIcon } from "lucide-react";
import { DetailHeader } from "./DetailHeader";

interface NotFoundPageProps {
  label: string;
  icon: LucideIcon;
  title: string;
  message: string;
  onBack: () => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({
  label,
  icon: Icon,
  title,
  message,
  onBack,
}) => {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-200">
      <DetailHeader label={label} title="Not Found" onBack={onBack} />
      <div className="flex flex-col items-center justify-center h-[60vh] text-center p-8">
        <div className="bg-slate-800 p-6 rounded-full mb-4">
          <Icon className="w-12 h-12 text-slate-600" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
        <p className="text-slate-400 max-w-md">{message}</p>
      </div>
    </div>
  );
};
