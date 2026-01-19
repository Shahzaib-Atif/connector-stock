import React from "react";

function HeaderRow() {
  return (
    <tr className="text-slate-300">
      <th className="px-3 py-2 text-left"></th>
      <th className="px-3 py-2 text-left min-w-24">Picture</th>
      <th className="px-3 py-2 text-left">RefCliente</th>
      <th className="px-3 py-2 text-left min-w-32">Projeto</th>
      <th className="px-3 py-2 text-left">Amostra</th>
      <th className="px-5 py-2 text-left">ID</th>
      <th className="px-3 py-2 text-left min-w-32">Cliente</th>
      <th className="px-3 py-2 text-left">ORC</th>
      <th className="px-3 py-2 text-left">Entregue_a</th>
      <th className="px-3 py-2 text-left">N_Envio</th>
      <th className="px-3 py-2 text-left">Data Pedido</th>
    </tr>
  );
}

export default HeaderRow;
