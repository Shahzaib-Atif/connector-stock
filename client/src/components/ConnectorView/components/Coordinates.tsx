import React from "react";
import CoordinateRow from "./CoordinateRow";
import { ConnectorExtended } from "@/utils/types";

interface Props {
  connector: ConnectorExtended;
  PosId: string;
}

function Coordinates({ connector, PosId }: Props) {
  const position = connector.position;
  return (
    <div id="connector-position" className="flex flex-col items-end">
      <div className="flex flex-col gap-1.5">
        {(position?.CV || position?.CH) && (
          <CoordinateRow
            label="PT"
            cv={position.CV ?? ""}
            ch={position.CH ?? ""}
          />
        )}
        {(position?.CV_Ma || position?.CH_Ma) && (
          <CoordinateRow
            label="MA"
            cv={position.CV_Ma ?? ""}
            ch={position.CH_Ma ?? ""}
          />
        )}
      </div>
      <div className="mt-2 text-xs text-slate-500 font-mono">POS: {PosId}</div>
    </div>
  );
}

export default Coordinates;
