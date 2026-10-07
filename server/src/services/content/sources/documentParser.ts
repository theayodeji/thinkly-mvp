import pdfParse from "pdf-parse";

export async function parsePdfBuffer(buffer: Buffer): Promise<string> {
  console.log(`[DEBUG PDF Parser] Received buffer of size: ${buffer ? buffer.length : 0} bytes`);

  if (!buffer || buffer.length === 0) {
    console.error("[DEBUG PDF Parser Error] Buffer is empty or undefined");
    return "";
  }

  // Ensure we have a valid Node Buffer instance
  const nodeBuf = Buffer.isBuffer(buffer) ? buffer : Buffer.from(buffer);

  // Check magic bytes for %PDF header (%PDF is 0x25 0x50 0x44 0x46)
  const header = nodeBuf.toString("utf-8", 0, 5);
  const isPdfHeader = header.startsWith("%PDF");

  if (!isPdfHeader) {
    console.log("[DEBUG PDF Parser] Buffer does not start with %PDF header (Header: " + JSON.stringify(header) + "). Treating as plain text.");
    const rawText = nodeBuf.toString("utf-8").replace(/\0/g, "").trim();
    return rawText;
  }

  try {
    // Isolate buffer slice to prevent PDFJS shared ArrayBuffer offset bug
    const cleanUint8 = new Uint8Array(
      nodeBuf.buffer.slice(nodeBuf.byteOffset, nodeBuf.byteOffset + nodeBuf.byteLength)
    );
    const cleanBuffer = Buffer.from(cleanUint8);

    // Resolve ES Module vs CJS default export variations
    const parseFn = typeof pdfParse === "function" ? pdfParse : (pdfParse as any)?.default || pdfParse;

    if (typeof parseFn !== "function") {
      console.error("[DEBUG PDF Parser Error] Resolved pdfParse is not a function:", typeof parseFn, parseFn);
      return "";
    }

    const data = await parseFn(cleanBuffer);
    console.log(`[DEBUG PDF Parser] Parsing successful! Total pages: ${data?.numpages}, Extracted text length: ${data?.text?.length || 0}`);

    const text = data?.text || "";
    const cleanedText = text.replace(/\0/g, "").trim();
    console.log(`[DEBUG PDF Parser] Cleaned text length: ${cleanedText.length}`);
    return cleanedText;
  } catch (error: any) {
    console.error("[DEBUG PDF Parser Error] Failed during PDF parsing execution:", error?.message || error);
    if (error?.stack) {
      console.error("[DEBUG PDF Parser Stack Trace]:", error.stack);
    }
    
    // Fallback: try raw string extraction if text stream was uncompressed
    const rawText = nodeBuf.toString("utf-8").replace(/\0/g, "").trim();
    if (rawText.length > 100 && !rawText.includes("%%EOF")) {
      console.log(`[DEBUG PDF Parser Fallback] Recovered raw text length: ${rawText.length}`);
      return rawText;
    }
    
    return "";
  }
}
