import { Accessory } from "@/types";
import { Wrench } from "lucide-react";

interface Props {
  acc: Accessory;
}

function AccessoryInfo({ acc }: Props) {
  return (
    <>
      <div className="w-12 h-12 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center">
        <Wrench className="w-6 h-6" />
      </div>
      <div>
        <div className="text-white font-mono">type: {acc.type}</div>
        <div className="font-mono text-slate-400">For {acc.connectorId}</div>
      </div>
    </>
  );
}

export default AccessoryInfo;
