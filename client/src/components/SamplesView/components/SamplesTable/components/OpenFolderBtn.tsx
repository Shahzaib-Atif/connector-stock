import { useOpenFolder } from "@/hooks/useOpenFolder";
import { FolderOpen } from "lucide-react";

interface Props {
  N_Envio: string | undefined;
  showFolderBtn: boolean;
}

function OpenFolderBtn({ N_Envio, showFolderBtn }: Props) {
  const { openFolder, isOpeningFolder } = useOpenFolder();
  console.log(showFolderBtn);

  return (
    <div className="flex items-center gap-2 justify-between">
      <span>{N_Envio || "-"}</span>
      {N_Envio && showFolderBtn && (
        <button
          onClick={() => openFolder(N_Envio)}
          disabled={isOpeningFolder}
          className={`text-slate-400 hover:text-blue-400 transition-colors ${
            isOpeningFolder ? "opacity-50 cursor-wait" : ""
          }`}
          title="Open Folder"
        >
          <FolderOpen className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

export default OpenFolderBtn;
