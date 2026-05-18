import { filterStyles } from "@/utils/filterUtils";
import { X } from "lucide-react";

export default function FilterCell({
  id,
  value,
  onChange,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const hasValue = value.trim().length > 0;

  return (
    <th className={filterCellClass}>
      <div className="relative">
        <input
          id={id}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="All"
          className={`${filterStyles.input} pr-8`}
        />
        {hasValue && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded text-slate-400 hover:text-white"
            aria-label="Clear filter"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </th>
  );
}

const filterCellClass =
  "sticky top-[40px] z-20 bg-slate-900/95 px-2 py-2 align-top backdrop-blur";
