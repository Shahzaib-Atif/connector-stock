import React from "react";
import { ChevronDown } from "lucide-react";
import { Department } from "@/utils/types/shared";

interface DepartmentSelectorProps {
  value: Department;
  onChange: (dept: Department) => void;
}

export const DepartmentSelector: React.FC<DepartmentSelectorProps> = ({
  value,
  onChange,
}) => {
  return (
    <div className="space-y-2">
      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
        Destination Department
      </label>
      <div className="relative">
        <select
          id="departments"
          value={value}
          onChange={(e) => onChange(e.target.value as Department)}
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
  );
};
