import React from "react";
import { LucideIcon } from "lucide-react";
import { DetailHeader } from "./DetailHeader";
import { useAppSelector } from "@/store/hooks";

interface NotFoundPageProps {
  label: string;
  icon: LucideIcon;
  onBack: () => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({
  label,
  icon: Icon,
  onBack,
}) => {
  const masterData = useAppSelector((state) => state.masterData);
  const itemType = label?.toLowerCase();
  const title = `${label} Not Found`;
  let message = "";

  if (!masterData.data || masterData.error)
    message =
      "Error while fetching data from server! Please contact your website administrator if this error persists.";
  else
    message = `The ${itemType} you are looking for does not exist in the system`;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200">
      <DetailHeader
        label={label}
        title="Not Found"
        onBack={onBack}
        handleQRClick={() => {}}
        showQR={false}
      />
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
