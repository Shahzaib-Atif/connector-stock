import React from "react";
import CoordinateRow from "./CoordinateRow";
import { Connector } from "@/utils/types";

interface Props {
  connector: Connector;
  PosId: string;
}

function Coordinates({ connector, PosId }: Props) {
  return (
    <div id="connector-position" className="flex flex-col items-end">
      <div className="flex flex-col gap-1.5">
        {(connector.cv || connector.ch) && (
          <CoordinateRow label="PT" cv={connector.cv} ch={connector.ch} />
        )}
        {(connector.cv_ma || connector.ch_ma) && (
          <CoordinateRow label="MA" cv={connector.cv_ma} ch={connector.ch_ma} />
        )}
      </div>
      <div className="mt-2 text-xs text-slate-500 font-mono">POS: {PosId}</div>
    </div>
  );
}

export default Coordinates;
