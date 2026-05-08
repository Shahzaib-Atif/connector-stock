import React from "react";
import { X } from "lucide-react";
import { filterStyles } from "@/utils/filterUtils";

interface StickyHeaderCellProps {
  children: React.ReactNode;
  className?: string;
}

interface StickyFilterCellProps {
  children?: React.ReactNode;
  className?: string;
}

interface ClearableTextFilterProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  autoComplete?: string;
  className?: string;
}

interface SelectFilterProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  allLabel?: string;
  className?: string;
}

const HEADER_CELL_BASE =
  "table-header-cell sticky top-0 z-30 bg-slate-800/95 backdrop-blur";
const FILTER_CELL_BASE =
  "sticky top-[40px] z-20 bg-slate-900/95 px-2 py-2 align-top backdrop-blur";

export function StickyHeaderCell({
  children,
  className = "",
}: StickyHeaderCellProps) {
  return <th className={`${HEADER_CELL_BASE} ${className}`.trim()}>{children}</th>;
}

export function StickyFilterCell({
  children,
  className = "",
}: StickyFilterCellProps) {
  return <th className={`${FILTER_CELL_BASE} ${className}`.trim()}>{children}</th>;
}

export function StickySpacerCell({ className = "" }: { className?: string }) {
  return <StickyFilterCell className={className} />;
}

export function ClearableTextFilter({
  id,
  value,
  onChange,
  placeholder = "All",
  autoComplete,
  className = "",
}: ClearableTextFilterProps) {
  const hasValue = value.trim().length > 0;

  return (
    <div className="relative">
      <input
        id={id}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={`${filterStyles.input} pr-8 ${className}`.trim()}
      />
      {hasValue && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded text-slate-400 hover:text-white"
          title="Clear filter"
          aria-label="Clear filter"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

export function SelectFilter({
  id,
  value,
  onChange,
  options,
  allLabel = "All",
  className = "",
}: SelectFilterProps) {
  return (
    <select
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`${filterStyles.select} ${className}`.trim()}
    >
      <option value="all">{allLabel}</option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}
