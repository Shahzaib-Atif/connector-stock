import { formatDateToIso } from "@/utils/functions/formatDate";
import { AnaliseTabDto } from "@shared/dto/AnaliseTabDto";
import { useAppSelector } from "@/store/hooks";
import { UserRoles } from "@shared/enums/UserRoles";
import ConnectorEditableCell from "./ConnectorEditableCell";

interface Props {
  paginatedItems: AnaliseTabDto[];
  isCheckingSimilar?: boolean;
  onConnectorSave: (row: AnaliseTabDto, newConnector: string) => void | Promise<void>;
}

// Renders analise table body rows and connector cells.
export default function TableRows({
  paginatedItems,
  isCheckingSimilar = false,
  onConnectorSave,
}: Props) {
  const { role } = useAppSelector((state) => state.auth);
  const isAdmin = role === UserRoles.Admin || role === UserRoles.Master;

  return paginatedItems.length === 0 ? (
    <tr>
      <td colSpan={13} className="table-row-not-found">
        No AnaliseTab rows found
      </td>
    </tr>
  ) : (
    paginatedItems.map((row, index) => (
      <tr
        className="table-row table-row-bg"
        key={`${row.Encomenda}-${row.NumLinha}-${row.Conector}-${index}`}
      >
        <td className="table-data">{row.Encomenda || "-"}</td>
        <td className="table-data">{row.NumLinha ?? "-"}</td>
        <td className="table-data">{row.Estado || "-"}</td>
        <td className="table-data break-all">{row.Descricao || "-"}</td>
        <td className="table-data break-all">
          <ConnectorEditableCell
            initialValue={row.Conector || ""}
            isAdmin={isAdmin}
            isSaving={isCheckingSimilar}
            onSave={(newConnector) => onConnectorSave(row, newConnector)}
          />
        </td>
        <td className="table-data break-all">{row.RefCliente || "-"}</td>
        <td className="table-data break-all">{row.Cliente || "-"}</td>
        <td className="table-data font-mono">
          {formatDateToIso(toDateString(row.DataAbertura))}
        </td>
        <td className="table-data font-mono">
          {formatDateToIso(toDateString(row.DataEntrega))}
        </td>
        <td className="table-data break-all">
          {row.CDU_ProjetoCliente || "-"}
        </td>
      </tr>
    ))
  );
}

// Normalizes date values to ISO strings.
function toDateString(value: string | Date | null | undefined): string | null {
  if (!value) return null;
  return value instanceof Date ? value.toISOString() : value;
}
