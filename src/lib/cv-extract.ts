export async function extractCvText(file: File): Promise<string> {
  const name = file.name.toLowerCase();
  if (name.endsWith(".pdf")) {
    const pdfjsLib = await import("pdfjs-dist");
    const workerSrc = (await import("pdfjs-dist/build/pdf.worker.min.mjs?url")).default;
    pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc as string;
    const buf = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: buf }).promise;
    let text = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      text += content.items.map((it: any) => ("str" in it ? it.str : "")).join(" ") + "\n";
    }
    return text.trim();
  }
  if (name.endsWith(".docx")) {
    // @ts-ignore - no types for browser build
    const mammoth = (await import("mammoth/mammoth.browser")).default;
    const buf = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer: buf });
    return (result.value || "").trim();
  }
  if (name.endsWith(".txt")) {
    return (await file.text()).trim();
  }
  throw new Error("Unsupported file type. Please upload a PDF, DOCX, or TXT file.");
}