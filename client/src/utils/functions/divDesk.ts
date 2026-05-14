const divDeskDB = import.meta.env.VITE_DIVDESK_DB;

export interface LineStatusContext {
  enc: string;
  line: string | number;
}

export async function setLineStatus(enc: string, line: string | number) {
  try {
    const params = ` -t setprilinefatoan -f enc:${enc}$ln:${line}$${divDeskDB}$op:setprilinefatoan`;
    launchDivDesk(params);
  } catch {
    console.error(`Setting Line Status Failed. order: ${enc} .. line: ${line}`);
  }
}

export async function updateConnName(enc: string, line: string, con: string) {
  try {
    const params = ` -t updateconnweb -f enc:${enc}$ln:${line}$concode:${con}$${divDeskDB}$op:updateconnweb`;
    launchDivDesk(params);
  } catch {
    console.error(
      `Updating Connector Name Failed. order: ${enc} .. line: ${line} .. con: ${con}`,
    );
  }
}

// Encode the parameters and trigger the custom protocol
function launchDivDesk(params: string) {
  window.location.href = "divdesk:///" + encodeURIComponent(params);
}
