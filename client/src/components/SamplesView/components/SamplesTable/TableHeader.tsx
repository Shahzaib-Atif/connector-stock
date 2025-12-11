import React from "react";

const TableHeader: React.FC = () => {
  return (
    <thead className="bg-slate-700/50 text-slate-300 uppercase text-xs">
      <tr>
        <th className="table-header w-16">ID</th>
        <th className="table-header w-40">Cliente</th>
        <th className="table-header w-36">Projeto</th>
        <th className="table-header w-24">EncDivmac</th>
        <th className="table-header w-40">Ref. Descrição</th>
        <th className="table-header w-28">Amostra</th>
        <th className="table-header w-40">N_Envio</th>
        <th className="table-header w-28">Data Receção</th>
        <th className="table-header w-28">Entregue A</th>
        <th className="table-header w-20 text-center">Actions</th>
      </tr>
    </thead>
  );
};

export default TableHeader;
