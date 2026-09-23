export enum SourceType {
  TEXT = "text",
  FILE_PDF = "file_pdf",
  LINK = "link",
}

export interface Source {
  _id: string;
  type: SourceType;
  file_url?: string;
  name?: string;
  text?: string;
  noteId: string;
  status: "parsing" | "parsed" | "error";
  createdAt: Date;
  updatedAt: Date;
}
