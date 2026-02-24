import React from "react";

function TableHeader() {
  return (
    <thead>
      <tr className="table-header">
        <th className="table-header-cell w-16">No.</th>
        <th className="table-header-cell max-w-40">Item ID</th>
        <th className="table-header-cell">Type</th>
        <th className="table-header-cell">Item Type</th>
        <th className="table-header-cell">Amount</th>
        <th className="table-header-cell min-w-32">Sender</th>
        <th className="table-header-cell">Department</th>
        <th className="table-header-cell">Encomenda</th>
        <th className="table-header-cell min-w-40">Notes</th>
        <th className="table-header-cell min-w-32">Wires</th>
        <th className="table-header-cell min-w-32">Date</th>
      </tr>
    </thead>
  );
}

export default TableHeader;
