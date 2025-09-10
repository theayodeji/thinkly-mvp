export interface Source {
    _id: string;
    type: "pdf" | "website" | "text" | "image";
    file_url?: string;
    name?: string;
    text?: string;
    noteId: string;
    status: "parsing" | "parsed" | "error";
    createdAt: Date;
    updatedAt: Date;
}