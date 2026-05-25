interface Props {
  onClick: () => void;
  dateSortDirection: "asc" | "desc" | null;
  label?: string;
}

function DateSortButton({
  onClick,
  dateSortDirection,
  label = "DataAbertura",
}: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-1 text-left"
    >
      <span>{label}</span>
      {dateSortDirection && (
        <span aria-hidden="true">
          {dateSortDirection === "asc" ? "↑" : "↓"}
        </span>
      )}
    </button>
  );
}

export default DateSortButton;
