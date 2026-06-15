import { refreshAnaliseTabCache } from "@/api/analiseApi";
import { UpdateConnNameOptions } from "@/utils/types/divDesk";
import { CreateUpdateConnNameLogDto } from "@shared/dto/DivDeskDtos";
import { recordConnNameUpdate, recordLineStatusUpdate } from "./divDeskLogging";

const divDeskDB = import.meta.env.VITE_DIVDESK_DB;

// Opens DIVDESK to set production line status.
export async function setLineStatus(enc: string, line: number, user: string) {
  // launch divdesk and capture any error message
  const params = ` -t setprilinefatoan -f enc:${enc}$ln:${line}$${divDeskDB}$op:setprilinefatoan`;
  const errMsg = await launchDivDesk(params); // Capture any error message from launching DIVDESK.

  // log the line status update
  await recordLineStatusUpdate(enc, line, user, errMsg);
}

// Refreshes analise cache after bulk re-click flow ends.
export async function refreshConnNameCache() {
  try {
    await refreshAnaliseTabCache();
  } catch (error) {
    console.error("Refreshing AnaliseTab cache failed.", error);
  }
}

// Updates one connector via DIVDESK, logs it, and optionally refreshes the cache.
export async function updateConnName(
  dto: Omit<CreateUpdateConnNameLogDto, "result" | "divDeskDb">,
  options?: UpdateConnNameOptions,
) {
  let errMsg = "";

  // Launch DIVDESK to update connector name
  const params = buildUpdateConnParams(dto.enc, dto.line, dto.con);
  errMsg = await launchDivDesk(params);

  // Log the update attempt.
  await recordConnNameUpdate(dto, errMsg);

  if (options?.skipCacheRefresh) return;

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

// Builds updateconnweb protocol params for DIVDESK.
function buildUpdateConnParams(enc: string, line: number, con: string) {
  return ` -t updateconnweb -f enc:${enc}$ln:${line}$concode:${con}$${divDeskDB}$op:updateconnweb`;
}
