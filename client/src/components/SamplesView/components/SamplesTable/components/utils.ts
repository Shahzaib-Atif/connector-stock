import { getConnectorId } from "@/utils/idUtils";

export { getConnectorId };

export function getObservation(Observacoes: string, com_fio: boolean) {
  let obs = com_fio ? "c/fio" : "s/fio";
  if (Observacoes && Observacoes.trim() !== "") obs += ` - ${Observacoes}`;

  return obs;
}

export const btnClass1 =
  "p-1.5 text-slate-400 hover:bg-slate-700 rounded transition-colors";
