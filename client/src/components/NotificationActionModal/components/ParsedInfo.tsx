import React from "react";

interface ParsedInfoProps {
  conector: string | null;
  encomenda: string | null;
}

export const ParsedInfo: React.FC<ParsedInfoProps> = ({
  conector,
  encomenda,
}) => {
  if (!conector) return null;

  return (
    <div className="bg-slate-800/50 rounded-lg p-4 space-y-2">
      <p className="text-xs text-slate-500 uppercase tracking-wider">
        Requested Items
      </p>
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2 bg-slate-700 px-3 py-2 rounded">
          <span className="text-slate-400 text-sm">Connector:</span>
          <span className="text-white font-mono font-semibold">
            {conector}
          </span>
        </div>
        {encomenda && (
          <div className="flex items-center gap-2 bg-slate-700 px-3 py-2 rounded">
            <span className="text-slate-400 text-sm">Order:</span>
            <span className="text-white font-mono font-semibold">
              {encomenda}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
