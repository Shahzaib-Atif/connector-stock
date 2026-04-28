import React from "react";
import { QRData } from "@/utils/types";
import TableHeader from "./components/TableHeader";
import TableRow from "./components/TableRow";
import NoSamplesFound from "./components/NoSamplesFound";
import { SamplesDto } from "@shared/dto/SamplesDto";
import { SampleFilters } from "../../constants";

interface SamplesTableProps {
  samples: SamplesDto[];
  onEdit: (sample: SamplesDto) => void;
  onDelete: (sample: SamplesDto) => void;
  onOpenQR?: (qrData: QRData) => void;
  onClone?: (sample: SamplesDto) => void;
  showActions?: boolean;
  showFilters?: boolean;
  filters: SampleFilters;
  setFilterField: (key: keyof SampleFilters, value: string) => void;
  entregueOptions: string[];
}

export const SamplesTable: React.FC<SamplesTableProps> = ({
  samples,
  onEdit,
  onDelete,
  onOpenQR,
  onClone,
  showActions = true,
  showFilters = false,
  filters,
  setFilterField,
  entregueOptions,
}) => {
  return (
    <div id="samples-table" className="table-container-inner">
      <table className="w-full table-fixed">
        <TableHeader
          showActions={showActions}
          showFilters={showFilters}
          filters={filters}
          setFilterField={setFilterField}
          entregueOptions={entregueOptions}
        />
        <tbody>
          {samples.length === 0 ? (
            <NoSamplesFound showActions={showActions} />
          ) : (
            samples.map((sample, index) => (
              <TableRow
                key={sample.ID}
                sample={sample}
                index={index}
                onEdit={onEdit}
                onDelete={onDelete}
                onOpenQR={onOpenQR}
                onClone={onClone}
                showActions={showActions}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
