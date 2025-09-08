export interface Source {
    _id: string;
    type: "pdf" | "url" | "text" | "image";
    file_url?: string;
    text?: string;
    noteId: string;
    status: "parsing" | "parsed" | "error";
    createdAt: Date;
    updatedAt: Date;
}