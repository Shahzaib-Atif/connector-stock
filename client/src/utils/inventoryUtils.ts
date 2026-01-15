export const getHash = (str: string) =>
  str.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);

export const getCoordinates = (
  posId: string,
  masterData?: { positions: Record<string, { cv: string; ch: string }> }
) => {
  if (masterData?.positions?.[posId]) {
    return masterData.positions[posId];
  }

  return null;
};

const BASE_URL = "http://192.168.3.164:59876";
export async function setLineStatus(CDU_Projeto: string, clientRef: string) {
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
