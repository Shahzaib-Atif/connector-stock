import { getConnectorId } from "@/utils/idUtils";

export { getConnectorId };

export function getObservation(
  Observacoes: string,
  qty_com_fio?: number,
  qty_sem_fio?: number,
) {
  // before observation, add c/fio and s/fio based on quantities
  const com_fio = qty_com_fio && qty_com_fio > 0;
  const sem_fio = qty_sem_fio && qty_sem_fio > 0;

  let obs = "";
  if (com_fio && sem_fio) {
    obs = `${qty_com_fio} c/f, ${qty_sem_fio} s/f`;
  } else if (com_fio) {
    obs = `${qty_com_fio} c/f`;
  } else if (sem_fio) {
    obs = `${qty_sem_fio} s/f`;
  }

  if (Observacoes && Observacoes.trim() !== "") obs += ` - ${Observacoes}`;

  return obs;
}

export const btnClass1 =
  "p-1.5 text-slate-400 hover:bg-slate-700 rounded transition-colors";
