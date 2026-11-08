import { toPng, toJpeg } from 'html-to-image';
import { jsPDF } from 'jspdf';
import JSZip from 'jszip';
import { CertificateElement, CertificateProject, PageOrientation, PageFormat } from '../types/certificate';

export interface ExportOptions {
  filename?: string;
  quality?: number;
  pixelRatio?: number;
  format?: 'pdf' | 'png' | 'jpeg';
}

export async function exportElementAsPng(
  node: HTMLElement,
  options: ExportOptions = {}
): Promise<string> {
  const pixelRatio = options.pixelRatio || 2;
  return await toPng(node, {
    quality: options.quality || 0.95,
    pixelRatio,
    cacheBust: true,
    style: {
      transform: 'none',
      transformOrigin: 'top left'
    }
  });
}

export async function exportElementAsJpeg(
  node: HTMLElement,
  options: ExportOptions = {}
): Promise<string> {
  const pixelRatio = options.pixelRatio || 2;
  return await toJpeg(node, {
    quality: options.quality || 0.95,
    pixelRatio,
    backgroundColor: '#FFFFFF',
    cacheBust: true,
    style: {
      transform: 'none',
      transformOrigin: 'top left'
    }
  });
}

export async function downloadPng(
  node: HTMLElement,
  filename: string = 'certificate.png'
): Promise<void> {
  const dataUrl = await exportElementAsPng(node, { pixelRatio: 2.5 });
  const link = document.createElement('a');
  link.download = filename.endsWith('.png') ? filename : `${filename}.png`;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export async function downloadJpeg(
  node: HTMLElement,
  filename: string = 'certificate.jpg'
): Promise<void> {
  const dataUrl = await exportElementAsJpeg(node, { pixelRatio: 2.5 });
  const link = document.createElement('a');
  link.download = filename.endsWith('.jpg') ? filename : `${filename}.jpg`;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export async function downloadPdf(
  node: HTMLElement,
  orientation: PageOrientation = 'landscape',
  format: PageFormat = 'A4',
  filename: string = 'certificate.pdf',
  customWidthPx?: number,
  customHeightPx?: number
): Promise<void> {
  // Capture high-res image
  const dataUrl = await exportElementAsPng(node, { pixelRatio: 2.5 });

  const pdfOrientation = orientation === 'landscape' ? 'l' : 'p';
  
  let pdf: jsPDF;
  if (format === 'Custom' && customWidthPx && customHeightPx) {
    // 96 DPI to mm: px * 25.4 / 96
    const widthMm = (customWidthPx * 25.4) / 96;
    const heightMm = (customHeightPx * 25.4) / 96;
    pdf = new jsPDF({
      orientation: pdfOrientation,
      unit: 'mm',
      format: [widthMm, heightMm]
    });
  } else {
    const pdfFormat = format === 'Letter' ? 'letter' : 'a4';
    pdf = new jsPDF({
      orientation: pdfOrientation,
      unit: 'mm',
      format: pdfFormat
    });
  }

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  pdf.addImage(dataUrl, 'PNG', 0, 0, pageWidth, pageHeight, undefined, 'FAST');
  pdf.save(filename.endsWith('.pdf') ? filename : `${filename}.pdf`);
}

// Helper to replace placeholders in text content
export function replacePlaceholders(
  text: string,
  data: Record<string, string>
): string {
  if (!text) return text;
  let result = text;
  for (const [key, val] of Object.entries(data)) {
    // Replace [KEY], {KEY}, or KEY directly
    const pattern = new RegExp(`\\[${key}\\]|\\{${key}\\}`, 'gi');
    result = result.replace(pattern, val || '');
  }
  return result;
}

export function substituteElementsForBulk(
  elements: CertificateElement[],
  rowData: Record<string, string>,
  mapping: Record<string, string> // placeholderKey -> csvColumnName
): CertificateElement[] {
  return elements.map(el => {
    if (el.type !== 'text' && el.type !== 'qr') return el;

    if (el.type === 'text') {
      let updatedContent = el.content || '';
      let replacedBracketCount = 0;

      // 1. First replace all bracketed or braced placeholders [KEY] or {KEY}
      for (const [placeholderKey, colName] of Object.entries(mapping)) {
        if (colName && rowData[colName] !== undefined) {
          const val = rowData[colName];
          const pattern = new RegExp(`\\[${placeholderKey}\\]|\\{${placeholderKey}\\}`, 'gi');
          if (pattern.test(updatedContent)) {
            updatedContent = updatedContent.replace(pattern, val);
            replacedBracketCount++;
          }
        }
      }

      // 2. If no bracket was replaced, check if this element is tagged with a direct placeholderKey
      if (replacedBracketCount === 0 && el.placeholderKey && mapping[el.placeholderKey]) {
        const col = mapping[el.placeholderKey];
        if (rowData[col] !== undefined) {
          updatedContent = rowData[col];
        }
      }

      return {
        ...el,
        content: updatedContent
      };
    }

    if (el.type === 'qr' && el.qrValue) {
      let updatedQr = el.qrValue;
      for (const [placeholderKey, colName] of Object.entries(mapping)) {
        if (colName && rowData[colName] !== undefined) {
          const pattern = new RegExp(`\\[${placeholderKey}\\]|\\{${placeholderKey}\\}`, 'gi');
          updatedQr = updatedQr.replace(pattern, rowData[colName]);
        }
      }
      return {
        ...el,
        qrValue: updatedQr
      };
    }

    return el;
  });
}

// Bulk Generation: Generates ZIP of PDFs using a hidden headless renderer
export async function generateBulkZip(
  renderCallback: (rowData: Record<string, string>) => Promise<string>,
  rows: Record<string, string>[],
  project: CertificateProject,
  nameColumnKey: string = 'Recipient Name',
  idColumnKey: string = 'Certificate ID',
  onProgress?: (current: number, total: number) => void,
  shouldCancel?: () => boolean
): Promise<Blob> {
  const zip = new JSZip();
  const total = rows.length;
  const pdfOrientation = project.orientation === 'landscape' ? 'l' : 'p';
  const isCustom = project.format === 'Custom' && project.width && project.height;
  const customFormat: [number, number] = isCustom
    ? [(project.width * 25.4) / 96, (project.height * 25.4) / 96]
    : [297, 210];
  const pdfFormat = isCustom ? customFormat : (project.format === 'Letter' ? 'letter' : 'a4');

  for (let i = 0; i < total; i++) {
    if (shouldCancel && shouldCancel()) {
      throw new Error('Bulk generation cancelled by user');
    }

    const row = rows[i];
    const recipient = row[nameColumnKey] || `Recipient_${i + 1}`;
    const certId = row[idColumnKey] || `ID_${i + 1}`;
    const safeName = recipient.trim().replace(/[^a-zA-Z0-9_-]/g, '_');

    // Render row into high-res PNG
    const dataUrl = await renderCallback(row);

    // Create PDF
    const pdf = new jsPDF({
      orientation: pdfOrientation,
      unit: 'mm',
      format: pdfFormat
    });
    const pw = pdf.internal.pageSize.getWidth();
    const ph = pdf.internal.pageSize.getHeight();
    pdf.addImage(dataUrl, 'PNG', 0, 0, pw, ph, undefined, 'FAST');

    const pdfBlob = pdf.output('blob');
    zip.file(`Certificate_${safeName}_${certId}.pdf`, pdfBlob);

    if (onProgress) {
      onProgress(i + 1, total);
    }

    // Yield to the event loop to ensure progress UI updates smoothly
    await new Promise(resolve => setTimeout(resolve, 0));
  }

  return await zip.generateAsync({ type: 'blob' });
}

// Bulk Generation: Generates Single Multi-Page PDF
export async function generateBulkMultiPagePdf(
  renderCallback: (rowData: Record<string, string>) => Promise<string>,
  rows: Record<string, string>[],
  project: CertificateProject,
  onProgress?: (current: number, total: number) => void,
  shouldCancel?: () => boolean
): Promise<Blob> {
  const total = rows.length;
  const pdfOrientation = project.orientation === 'landscape' ? 'l' : 'p';
  const isCustom = project.format === 'Custom' && project.width && project.height;
  const customFormat: [number, number] = isCustom
    ? [(project.width * 25.4) / 96, (project.height * 25.4) / 96]
    : [297, 210];
  const pdfFormat = isCustom ? customFormat : (project.format === 'Letter' ? 'letter' : 'a4');

  const pdf = new jsPDF({
    orientation: pdfOrientation,
    unit: 'mm',
    format: pdfFormat
  });

  const pw = pdf.internal.pageSize.getWidth();
  const ph = pdf.internal.pageSize.getHeight();

  for (let i = 0; i < total; i++) {
    if (shouldCancel && shouldCancel()) {
      throw new Error('Bulk generation cancelled by user');
    }

    const row = rows[i];
    if (i > 0) {
      pdf.addPage(pdfFormat, pdfOrientation);
    }

    const dataUrl = await renderCallback(row);
    pdf.addImage(dataUrl, 'PNG', 0, 0, pw, ph, undefined, 'FAST');

    if (onProgress) {
      onProgress(i + 1, total);
    }

    // Yield to the event loop
    await new Promise(resolve => setTimeout(resolve, 0));
  }

  return pdf.output('blob');
}
