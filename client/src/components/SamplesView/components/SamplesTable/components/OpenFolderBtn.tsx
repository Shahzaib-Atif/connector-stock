import { useMemo, useState } from "react";
import { Copy, Check } from "lucide-react";

interface Props {
  N_Envio: string | undefined;
  showFolderBtn: boolean;
}

const folderBasePath = import.meta.env.VITE_FOLDER_BASE_PATH?.trim() ?? "";

const isValidFolderName = (value?: string) => {
  const normalized = value?.trim() ?? "";
  return Boolean(normalized && normalized !== "-" && normalized !== "--");
};

function OpenFolderBtn({ N_Envio, showFolderBtn }: Props) {
  const [copied, setCopied] = useState(false);
  const normalizedFolderName = N_Envio?.trim() ?? "";

  const fullPath = useMemo(() => {
    if (!folderBasePath || !isValidFolderName(normalizedFolderName)) {
      return "";
    }

    const trimmedBase = folderBasePath.replace(/[\\/]+$/, "");
    return `${trimmedBase}\\${normalizedFolderName}`;
  }, [normalizedFolderName]);

  const canCopy = Boolean(showFolderBtn && fullPath);

  const handleCopy = async () => {
    if (!canCopy) return;

    try {
      await navigator.clipboard.writeText(fullPath);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch (error) {
      console.error("Failed to copy folder path:", error);
    }
  };

  return (
    <div className="flex items-center justify-between gap-2">
      <span className="break-all">
        {isValidFolderName(N_Envio) ? N_Envio : "-"}
      </span>
      {canCopy && (
        <button
          onClick={handleCopy}
          className="link-icon text-slate-300 hover:text-blue-300"
          title={copied ? "Copied" : "Copy folder path"}
          aria-label="Copy folder path"
        >
          {copied ? (
            <Check className="w-4 h-4" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
        </button>
      )}
    </div>
  );
}

export default OpenFolderBtn;
