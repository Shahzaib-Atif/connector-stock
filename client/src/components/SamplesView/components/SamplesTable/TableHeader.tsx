import React from "react";

const TableHeader: React.FC = () => {
  return (
    <thead className="bg-slate-700/50 text-slate-300 uppercase text-xs">
      <tr>
        <th className="table-header">ID</th>
        <th className="table-header">Cliente</th>
        <th className="table-header">Projeto</th>
        <th className="table-header">EncDivmac</th>
        <th className="table-header">Ref. Descrição</th>
        <th className="table-header">Amostra</th>
        <th className="table-header">Data Pedido</th>
        <th className="table-header">Data Receção</th>
        <th className="table-header">Entregue A</th>
        <th className="table-header text-center">Actions</th>
      </tr>
    </thead>
  );
};

export default TableHeader;
