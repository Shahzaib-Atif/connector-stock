interface Props {
  loading: boolean;
  handleUpdateConnectorName: () => Promise<void>;
  handleSkipConnectorUpdate: () => void;
  pendingConnectorUpdate: {
    enc: string;
    line: number;
    con: string;
  };
}

function ConfirmConnectorRename({
  pendingConnectorUpdate,
  handleUpdateConnectorName,
  loading,
  handleSkipConnectorUpdate,
}: Props) {
  return (
    <div className="p-8 text-center flex flex-col items-center justify-center gap-6 bg-slate-900 rounded-b-xl border-t border-slate-800">
      <h3 className="text-xl font-bold text-slate-100">
        Sample Created Successfully!
      </h3>
      <p className="text-slate-400 max-w-md text-sm leading-relaxed">
        You changed the connector name to{" "}
        <span className="text-blue-400 font-semibold underline decoration-blue-500/50 decoration-2">
          {pendingConnectorUpdate.con}
        </span>
        . To make this change in primavera also, please click the button below.
      </p>
      <div className="flex gap-4 mt-2">
        <button
          type="button"
          onClick={handleUpdateConnectorName}
          disabled={loading}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold text-sm transition-all shadow-lg shadow-blue-600/25 active:scale-95 disabled:opacity-50"
        >
          {loading ? "Updating..." : "Update Connector Name"}
        </button>
        <button
          type="button"
          onClick={handleSkipConnectorUpdate}
          disabled={loading}
          className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-semibold text-sm transition-all border border-slate-700 hover:border-slate-600 active:scale-95 disabled:opacity-50"
        >
          Skip / Finish
        </button>
      </div>
    </div>
  );
}

export default ConfirmConnectorRename;
