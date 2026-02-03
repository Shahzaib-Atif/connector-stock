export const getHash = (str: string) =>
  str.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);

export const getCoordinates = (
  posId: string,
  masterData?: {
    positions: Record<
      string,
      {
        cv: string | null;
        ch: string | null;
        cv_ma: string | null;
        ch_ma: string | null;
      }
    >;
  }
) => {
  if (masterData?.positions?.[posId]) {
    return masterData.positions[posId];
  }

  return null;
};

// const BASE_URL = "http://192.168.3.164:59876";
const BASE_URL = import.meta.env.VITE_PRI_API_BASE_URL;
export async function setLineStatus(CDU_Projeto: string, clientRef: string) {
  if (!BASE_URL) console.error("VITE_PRI_API_BASE_URL was not found!");

  const serie = CDU_Projeto.slice(0, 2);
  const enc = CDU_Projeto.slice(2, 6);

  const payload = {
    Enc: enc,
    ClientRef: clientRef,
    serie: serie,
  };

  const response = await fetch(BASE_URL + "/api/pri/set-an-line-status", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    console.error(
      `Setting Line Status Failed. CDU_Projeto: ${CDU_Projeto} .. clientRef: ${clientRef}`
    );
  }
}
