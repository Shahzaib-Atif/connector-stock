import {
  createLineStatusLog,
  createUpdateConnNameLog,
} from "@/api/lineStatusLogsApi";
import { refreshAnaliseTabCache } from "@/api/analiseApi";
import { UpdateConnNameOptions } from "@/utils/types/divDesk";
import { CreateUpdateConnNameLogDto } from "@shared/dto/DivDeskDtos";

const divDeskDB = import.meta.env.VITE_DIVDESK_DB;

// Opens DIVDESK to set production line status.
export async function setLineStatus(enc: string, line: number, user: string) {
  const params = ` -t setprilinefatoan -f enc:${enc}$ln:${line}$${divDeskDB}$op:setprilinefatoan`;

  const errMsg = await launchDivDesk(params); // Capture any error message from launching DIVDESK.

  try {
    await createLineStatusLog({
      enc,
      line,
      result: errMsg ? "failure" : "success",
      divDeskDb: divDeskDB,
      userAgent: user,
      errMsg,
    });
  } catch (error) {
    console.error("Creating line status log failed.", error);
  }
}

// Builds updateconnweb protocol params for DIVDESK.
function buildUpdateConnParams(enc: string, line: number, con: string) {
  return ` -t updateconnweb -f enc:${enc}$ln:${line}$concode:${con}$${divDeskDB}$op:updateconnweb`;
}

// Opens DIVDESK once; call directly from a click handler.
export async function openConnNameInDivDesk(
  enc: string,
  line: number,
  con: string,
) {
  const params = buildUpdateConnParams(enc, line, con);
  const errMsg = await launchDivDesk(params);
  return errMsg;
}

// Persists one connector update log entry.
export async function recordConnNameUpdate(
  dto: Omit<CreateUpdateConnNameLogDto, "divDeskDb">,
) {
  try {
    await createUpdateConnNameLog({
      ...dto,
      divDeskDb: divDeskDB,
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
  dto: Omit<CreateUpdateConnNameLogDto, "result" | "divDeskDb">,
  options?: UpdateConnNameOptions,
) {
  const { enc, line, con, userAgent } = dto;
  let errMsg = "";

  // Launch DIVDESK to update connector name unless explicitly skipped.
  if (!options?.skipDivDeskLaunch) {
    errMsg = await launchDivDesk(buildUpdateConnParams(enc, line, con));
  }

  try {
    await createUpdateConnNameLog({
      enc,
      line,
      result: errMsg ? "failure" : "success",
      userAgent,
      con,
      divDeskDb: divDeskDB,
      errMsg,
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
function launchDivDesk(params: string): Promise<string> {
  return new Promise((resolve) => {
    const url = "divdesk:///" + encodeURIComponent(params);
    let settled = false;
    let blurSeen = false;

    const cleanup = () => {
      window.removeEventListener("blur", handleBlur);
    };

    const finish = (message: string) => {
      if (settled) return;
      settled = true;
      cleanup();
      resolve(message);
    };

    const handleBlur = () => {
      blurSeen = true;

      window.setTimeout(() => {
        if (!settled && blurSeen && !document.hasFocus()) {
          finish("");
        }
      }, 250);
    };

    window.addEventListener("blur", handleBlur, { once: true });

    window.setTimeout(() => {
      if (!settled) {
        finish("App may not be installed or failed to launch");
      }
    }, 1500);

    window.location.href = url;
  });
}
