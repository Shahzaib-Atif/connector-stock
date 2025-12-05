import React from "react";

function TableHeader() {
  return (
    <thead>
      <tr className="border-b border-slate-700 bg-slate-800">
        <th className="table-header">No.</th>
        <th className="table-header">Item ID</th>
        <th className="table-header">Type</th>
        <th className="table-header">Item Type</th>
        <th className="table-header">Amount</th>
        <th className="table-header">Department</th>
        <th className="table-header">Date</th>
      </tr>
    </thead>
  );
}

export default TableHeader;
