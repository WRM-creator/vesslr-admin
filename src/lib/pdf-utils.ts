import * as pdfjsLib from "pdfjs-dist";

pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

export async function generatePdfThumbnail(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib
    .getDocument({
      data: arrayBuffer,
      cMapUrl: `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/cmaps/`,
      cMapPacked: true,
    })
    .promise;

  const page = await pdf.getPage(1);
  const viewport = page.getViewport({ scale: 1.0 });
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  if (!context) throw new Error("Could not get canvas context");

  canvas.height = viewport.height;
  canvas.width = viewport.width;

  await page.render({ canvasContext: context, viewport } as any).promise;
  return canvas.toDataURL("image/png");
}
