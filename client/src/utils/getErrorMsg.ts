export default function getErrorMsg(error: unknown, msg?: string): string {
  if (error instanceof Error) return error.message;
  if (msg) return msg;
  else return "Unknown error";
}
