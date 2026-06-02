import {
  createLineStatusLog,
  createUpdateConnNameLog,
} from "@/api/lineStatusLogsApi";
import { refreshAnaliseTabCache } from "@/api/analiseApi";
import { UpdateConnNameOptions } from "@/utils/types/divDesk";

const divDeskDB = import.meta.env.VITE_DIVDESK_DB;

// Opens DIVDESK to set production line status.
export async function setLineStatus(
  enc: string,
  line: string | number,
  user: string,
) {
  const params = ` -t setprilinefatoan -f enc:${enc}$ln:${line}$${divDeskDB}$op:setprilinefatoan`;

  try {
    launchDivDesk(params);
  } catch {
    console.error(`Setting Line Status Failed. order: ${enc} .. line: ${line}`);
  }

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
}

// Builds updateconnweb protocol params for DIVDESK.
function buildUpdateConnParams(enc: string, line: string, con: string) {
  return ` -t updateconnweb -f enc:${enc}$ln:${line}$concode:${con}$${divDeskDB}$op:updateconnweb`;
}

// Opens DIVDESK once; call directly from a click handler.
export function openConnNameInDivDesk(
  enc: string,
  line: string | number,
  con: string,
) {
  try {
    launchDivDesk(buildUpdateConnParams(enc, String(line), con));
  } catch {
    console.error(
      `Updating Connector Name Failed. order: ${enc} .. line: ${line} .. con: ${con}`,
    );
  }
}

// Persists one connector update log entry.
export async function recordConnNameUpdate(
  enc: string,
  line: string | number,
  con: string,
  user: string | null,
) {
  try {
    await createUpdateConnNameLog({
      enc,
      line: String(line),
      con,
      divDeskDb: divDeskDB,
      userAgent: user || "undefined",
    });
  } catch (error) {
    console.error("Creating update connector name log failed.", error);
  }
}

// Refreshes analise cache after bulk re-click flow ends.
export async function refreshConnNameCache() {
  try {
    await refreshAnaliseTabCache();
  } catch (error) {
    console.error("Refreshing AnaliseTab cache failed.", error);
  }
}

// Updates one connector via DIVDESK, log, and cache.
export async function updateConnName(
  enc: string,
  line: string,
  con: string,
  options?: UpdateConnNameOptions,
) {
  if (!options?.skipDivDeskLaunch) {
    try {
      launchDivDesk(buildUpdateConnParams(enc, line, con));
    } catch {
      console.error(
        `Updating Connector Name Failed. order: ${enc} .. line: ${line} .. con: ${con}`,
      );
    }
  }

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

  if (options?.skipCacheRefresh) {
    return;
  }

  try {
    await refreshAnaliseTabCache();
  } catch (error) {
    console.error("Refreshing AnaliseTab cache failed.", error);
  }
}

// Clicks a hidden anchor to open the divdesk protocol.
function launchDivDesk(params: string) {
  const url = "divdesk:///" + encodeURIComponent(params);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.style.display = "none";
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
}
