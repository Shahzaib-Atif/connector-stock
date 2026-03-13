interface Props {
  N_Envio: string | undefined;
  showFolderBtn: boolean;
}

function OpenFolderBtn({ N_Envio }: Props) {
  // const { openFolder, isOpeningFolder } = useOpenFolder();

  return (
    <div className="flex-row justify-between">
      <span>{N_Envio || "-"}</span>
      {/* {N_Envio && showFolderBtn && (
        <button
          onClick={() => openFolder(N_Envio)}
          disabled={isOpeningFolder}
          className={`link-icon ${
            isOpeningFolder ? "opacity-50 cursor-wait" : ""
          }`}
          title="Open Folder"
        >
          <FolderOpen className="w-4 h-4" />
        </button>
      )} */}
    </div>
  );
}

export default OpenFolderBtn;
