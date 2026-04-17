import { AppNotification } from "@shared/types/Notification";

interface Props {
  selectedConnectorId: string | undefined;
  setSelectedConnectorId: React.Dispatch<
    React.SetStateAction<string | undefined>
  >;
  connectorOptions: string[];
  notification: AppNotification | null;
}

function ConnectorVersionSelect({
  selectedConnectorId,
  setSelectedConnectorId,
  connectorOptions,
  notification,
}: Props) {
  return (
    <div className="bg-blue-500/5 border border-blue-500/15 rounded-xl p-4 space-y-3 shadow-[0_0_20px_rgba(59,130,246,0.05)]">
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">
          Select connector version
        </p>
        <span className="text-[10px] font-black text-amber-500 uppercase tracking-tighter animate-pulse">
          Required
        </span>
      </div>
      <select
        value={selectedConnectorId ?? ""}
        onChange={(e) => setSelectedConnectorId(e.target.value)}
        className="w-full bg-slate-950/60 border border-slate-700/60 rounded-xl px-4 py-3 text-white font-semibold tracking-wide focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/60 outline-none transition-all hover:border-slate-600"
      >
        <option value="" disabled>
          Choose version…
        </option>
        {connectorOptions.map((id) => (
          <option key={id} value={id}>
            {id}
          </option>
        ))}
      </select>
      <p className="text-xs text-slate-500 leading-relaxed">
        No exact match found for{" "}
        <span className="font-extrabold text-slate-300">
          {notification?.parsedConector}
        </span>
        , but versions exist. Select the exact one to take stock from.
      </p>
    </div>
  );
}

export default ConnectorVersionSelect;
