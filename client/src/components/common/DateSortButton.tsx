interface Props {
  onClick: () => void;
  dateSortDirection: "asc" | "desc" | null;
}

function DateSortButton({ onClick, dateSortDirection }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-1 text-left"
    >
      <span>DataAbertura</span>
      {dateSortDirection && (
        <span aria-hidden="true">
          {dateSortDirection === "asc" ? "↑" : "↓"}
        </span>
      )}
    </button>
  );
}

export default DateSortButton;
