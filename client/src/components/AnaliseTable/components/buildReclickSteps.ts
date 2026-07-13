import { AnaliseTabDto } from "@shared/dto/AnaliseTabDto";
import { ReclickStep } from "./types";

export function buildReclickSteps(
  sourceRow: AnaliseTabDto,
  similarRows: AnaliseTabDto[],
  newConnector: string,
): ReclickStep[] {
  const allRows = [sourceRow, ...similarRows];
  return allRows.map((row) => ({
    enc: row.Encomenda,
    line: row.NumLinha,
    con: newConnector,
    label: `Line Number ${row.NumLinha}`,
    previousConnector: row.Conector ?? undefined,
  }));
}
