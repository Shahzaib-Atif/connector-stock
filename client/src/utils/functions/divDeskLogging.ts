import {
  createLineStatusLog,
  createUpdateConnNameLog,
} from "@/api/lineStatusLogsApi";
import {
  CreateLineStatusLogDto,
  CreateUpdateConnNameLogDto,
} from "@shared/dto/DivDeskDtos";

const divDeskDB = import.meta.env.VITE_DIVDESK_DB;

// Persists one connector update log entry.
export async function recordConnNameUpdate(
  dto: Omit<CreateUpdateConnNameLogDto, "result" | "divDeskDb">,
  errMsg: string = "",
) {
  try {
    // create payload
    const payload: CreateUpdateConnNameLogDto = {
      ...dto,
      divDeskDb: divDeskDB,
      result: errMsg ? "failure" : "success",
      errMsg,
    };

    // Only include errMsg if there's an error.
    if (!errMsg) delete payload.errMsg;

    // call the API
    await createUpdateConnNameLog(payload);
  } catch (error) {
    console.error("Creating update connector name log failed.", error);
  }
}

export async function recordLineStatusUpdate(
  enc: string,
  line: number,
  user: string,
  errMsg: string,
) {
  try {
    // create payload
    const payload: CreateLineStatusLogDto = {
      enc,
      line,
      userAgent: user,
      divDeskDb: divDeskDB,
      result: errMsg ? "failure" : "success",
      errMsg,
    };

    // Only include errMsg if there's an error.
    if (!errMsg) delete payload.errMsg;

    // call the API
    await createLineStatusLog(payload);
  } catch (error) {
    console.error("Creating line status log failed.", error);
  }
}
