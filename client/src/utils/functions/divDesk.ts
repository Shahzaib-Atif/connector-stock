import {
  createLineStatusLog,
  createUpdateConnNameLog,
} from "@/api/lineStatusLogsApi";
import { refreshAnaliseTabCache } from "@/api/samplesApi";

const divDeskDB = import.meta.env.VITE_DIVDESK_DB;

export interface LineStatusContext {
  enc: string;
  line: string | number;
}

export async function setLineStatus(
  enc: string,
  line: string | number,
  user: string,
) {
  const params = ` -t setprilinefatoan -f enc:${enc}$ln:${line}$${divDeskDB}$op:setprilinefatoan`;

  try {
    await createLineStatusLog({
      enc,
      line,
      divDeskDb: divDeskDB,
      userAgent: user,
    });
  } catch (error) {
    console.error("Creating line status log failed.", error);
  }

  try {
    launchDivDesk(params);
  } catch {
    console.error(`Setting Line Status Failed. order: ${enc} .. line: ${line}`);
  }
}

export async function updateConnName(enc: string, line: string, con: string) {
  try {
    await createUpdateConnNameLog({
      enc,
      line,
      con,
      divDeskDb: divDeskDB,
    });
  } catch (error) {
    console.error("Creating update connector name log failed.", error);
  }

  try {
    const params = ` -t updateconnweb -f enc:${enc}$ln:${line}$concode:${con}$${divDeskDB}$op:updateconnweb`;
    launchDivDesk(params);
  } catch {
    console.error(
      `Updating Connector Name Failed. order: ${enc} .. line: ${line} .. con: ${con}`,
    );
  }

  try {
    await refreshAnaliseTabCache();
  } catch (error) {
    console.error("Refreshing AnaliseTab cache failed.", error);
  }
}

// Encode the parameters and trigger the custom protocol
function launchDivDesk(params: string) {
  window.location.href = "divdesk:///" + encodeURIComponent(params);
}
