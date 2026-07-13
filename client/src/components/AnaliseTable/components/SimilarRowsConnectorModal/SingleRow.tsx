import { AnaliseTabDto } from "@shared/dto/AnaliseTabDto";

interface Props {
  row: AnaliseTabDto;
  sourceRow: boolean;
}

function SingleRow({ row, sourceRow }: Props) {
  return (
    <tr
      key={`${row.Encomenda}-${row.NumLinha}`}
      className={
        "border-t border-slate-700/80" + (sourceRow ? " bg-blue-500/10" : "")
      }
    >
      <td className="px-3 py-2 text-white">{row.NumLinha}</td>
      <td
        className={
          "px-3 py-2" +
          (sourceRow ? " text-slate-400 line-through" : " text-amber-300")
        }
      >
        {row.Conector || "-"}
      </td>

      <td className={rowStyle}>{row.RefCliente}</td>
      <td className={rowStyle}>{row.Estado}</td>
      <td className={rowStyle}>{row.Descricao}</td>
    </tr>
  );
}

export default SingleRow;

const rowStyle = "px-3 py-2 text-slate-400 truncate max-w-[200px]";
