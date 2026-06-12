class DivDeskLogDto {
  enc!: string;
  line!: number;
  result!: "success" | "failure";
  divDeskDb!: string;
  userAgent!: string;
  errMsg?: string;
}

export class CreateLineStatusLogDto extends DivDeskLogDto {}

export class CreateUpdateConnNameLogDto extends DivDeskLogDto {
  con!: string;
}
