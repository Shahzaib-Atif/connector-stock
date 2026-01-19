interface Props {
  onClose: () => void;
  isEditing: boolean;
  loading: boolean;
}

function ActionButtons({ onClose, isEditing, loading }: Props) {
  return (
    <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-700">
      <button
        type="button"
        onClick={onClose}
        className="px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg font-medium transition-colors"
      >
        Cancel
      </button>
      <button
        type="submit"
        disabled={loading}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors shadow-lg shadow-blue-600/30 disabled:opacity-50"
      >
        {loading ? "Saving..." : isEditing ? "Update" : "Create"}
      </button>
    </div>
  );
}

export default ActionButtons;
