interface Props {
  handleCreateNew: () => void;
  handleOpenWizard: () => void;
}

function ActionBar({ handleCreateNew, handleOpenWizard }: Props) {
  return (
    <>
      <div className="flex justify-end gap-3 flex-none">
        <button
          onClick={handleOpenWizard}
          className={
            "bg-purple-600 hover:bg-purple-500 shadow-purple-600/30 " +
            btnStyle1
          }
        >
          Create from Reference
        </button>
        <button
          onClick={handleCreateNew}
          className={
            "bg-green-600 hover:bg-green-500 shadow-green-600/30 " + btnStyle1
          }
        >
          + New Sample
        </button>
      </div>
    </>
  );
}

export default ActionBar;

const btnStyle1 =
  "px-4 py-2 text-sm text-white rounded-lg transition-colors shadow-lg";
