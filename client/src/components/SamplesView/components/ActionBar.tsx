interface Props {
  handleOpenWizard: () => void;
  handleCreateNew: () => void;
}

function ActionBar({ handleOpenWizard, handleCreateNew }: Props) {
  return (
    <div className="flex justify-end gap-3 flex-none">
      <>
        <button
          onClick={handleOpenWizard}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-medium transition-colors shadow-lg shadow-purple-600/30"
        >
          Create from Reference
        </button>
        <button
          onClick={handleCreateNew}
          className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg font-medium transition-colors shadow-lg shadow-green-600/30"
        >
          + New Sample
        </button>
      </>
    </div>
  );
}

export default ActionBar;
