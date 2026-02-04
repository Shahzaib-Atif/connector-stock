import { ChevronDown } from "lucide-react";
import { Department } from "@/utils/types";

interface Props {
  encomenda: string;
  setEncomenda: (value: string) => void;
  dept: Department;
  setDept: (value: Department) => void;
}

function WithdrawalDetails({ encomenda, setEncomenda, dept, setDept }: Props) {
  return (
    <div className="space-y-4">
      {/* Encomenda */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">
          Encomenda
        </label>
        <input
          type="text"
          value={encomenda}
          onChange={(e) => setEncomenda(e.target.value)}
          placeholder="Order number (optional)"
          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all placeholder:text-slate-600"
        />
      </div>

      {/* Department */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          Destination Department
        </label>
        <div className="relative">
          <select
            id="departments"
            value={dept}
            onChange={(e) => setDept(e.target.value as Department)}
            className="w-full p-3 pr-10 bg-slate-900 border border-slate-700 rounded-xl text-white font-medium outline-none appearance-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
          >
            {Object.keys(Department).map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-slate-400">
            <ChevronDown className="w-5 h-5" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default WithdrawalDetails;
