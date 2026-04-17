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
    <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-4 space-y-2">
      <p className="text-slate-300 text-sm font-medium">
        Select connector version
      </p>
      <select
        value={selectedConnectorId ?? ""}
        onChange={(e) => setSelectedConnectorId(e.target.value)}
        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all"
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
      <p className="text-xs text-slate-500">
        No exact match found for{" "}
        <span className="font-semibold text-slate-400">
          {notification?.parsedConector}
        </span>
        , but versions exist.
      </p>
    </div>
  );
}

export default ConnectorVersionSelect;
