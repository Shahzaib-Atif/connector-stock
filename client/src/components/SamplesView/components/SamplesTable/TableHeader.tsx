import React from "react";

const TableHeader: React.FC = () => {
  return (
    <thead className="table-header">
      <tr>
        <th className="table-header-cell w-16">ID</th>
        <th className="table-header-cell w-48">Cliente</th>
        <th className="table-header-cell w-40">Projeto</th>
        <th className="table-header-cell w-32">EncDivmac</th>
        <th className="table-header-cell w-40">Ref. Descrição</th>
        <th className="table-header-cell w-40">Amostra</th>
        <th className="table-header-cell w-48">N_Envio</th>
        <th className="table-header-cell">Entregue_A</th>
        <th className="table-header-cell">Data Receção</th>
        <th className="table-header-cell text-center">Actions</th>
      </tr>
    </thead>
  );
};

export default TableHeader;
