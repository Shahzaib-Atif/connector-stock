import { CheckCircle2 } from "lucide-react";

interface Props {
  title: string;
  message: string;
}

function ShowSucess({ title, message }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-6 space-y-3">
      <CheckCircle2 className="w-16 h-16 text-green-500 animate-bounce" />
      <p className="text-xl font-bold text-white">{title}</p>
      <p className="text-slate-400">{message}</p>
    </div>
  );
}

export default ShowSucess;
