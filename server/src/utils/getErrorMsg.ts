export default function getErrorMsg(error: unknown): string {
  if (error instanceof Error) return error.message;
  else return 'Unknown error';
}
