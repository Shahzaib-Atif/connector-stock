import { Connector } from "@/utils/types";
import React from "react";

interface Props {
  currentStock: number;
  connector: Connector;
}

function StockDiv({ currentStock, connector }: Props) {
  return (
    <div id="stock-div" className="flex flex-col gap-3">
      <div>
        <h2 className="text-lg sm:text-2xl font-bold text-white">
          {currentStock}
        </h2>
        <p className="text-slate-400 font-medium text-base sm:text-base">
          Units Available
        </p>
      </div>

      <div className="flex gap-2.5">
        <div
          className={`${divStyle1} ${
            (connector.Qty_com_fio || 0) > 0
              ? "bg-blue-500/10 border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.05)]"
              : { divStyle2 }
          }`}
        >
          <div
            className={`${divStyle3} ${
              (connector.Qty_com_fio || 0) > 0
                ? "bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.6)]"
                : "bg-slate-600"
            }`}
          />
          <div className="flex flex-col leading-none">
            <span className={spanStyle1}>With Wires</span>
            <span
              className={`text-sm font-bold ${(connector.Qty_com_fio || 0) > 0 ? "text-blue-100" : "text-slate-500"}`}
            >
              {connector.Qty_com_fio || 0}
            </span>
          </div>
        </div>

        <div
          className={`${divStyle1} ${
            (connector.Qty_sem_fio || 0) > 0
              ? "bg-indigo-500/10 border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.05)]"
              : { divStyle2 }
          }`}
        >
          <div
            className={`${divStyle3} ${
              (connector.Qty_sem_fio || 0) > 0
                ? "bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.6)]"
                : "bg-slate-600"
            }`}
          />
          <div className="flex flex-col leading-none">
            <span className={spanStyle1}>No Wires</span>
            <span
              className={`text-sm font-bold ${(connector.Qty_sem_fio || 0) > 0 ? "text-indigo-100" : "text-slate-500"}`}
            >
              {connector.Qty_sem_fio || 0}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

const divStyle1 =
  "flex items-center gap-2.5 px-3.5 py-2 rounded-xl border transition-all duration-300";

const divStyle2 = "bg-slate-800/40 border-slate-700/50 opacity-50";

const divStyle3 = "w-1.5 h-1.5 rounded-full transition-colors";

const spanStyle1 =
  "text-[9px] uppercase text-slate-500 font-black tracking-widest mb-1";

export default StockDiv;
