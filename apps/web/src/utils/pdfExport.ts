import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export interface PdfExportOptions {
  filename?: string;
  onProgress?: (stage: string) => void;
}

/**
 * Exports a DOM element (the Blueprint document) into a high-fidelity,
 * multi-page A4 PDF document without clipping or cutting cards in half.
 */
export async function exportBlueprintToPdf(
  elementIdOrEl: string | HTMLElement,
  options: PdfExportOptions = {}
): Promise<boolean> {
  const { filename = 'stackmatch-blueprint.pdf', onProgress } = options;

  try {
    onProgress?.('Preparing document for PDF generation...');

    const element: HTMLElement | null =
      typeof elementIdOrEl === 'string'
        ? document.getElementById(elementIdOrEl)
        : elementIdOrEl;

    if (!element) {
      throw new Error(`Target blueprint element not found: ${elementIdOrEl}`);
    }

    // Ensure all images are loaded
    onProgress?.('Verifying document assets & fonts...');
    const images = Array.from(element.querySelectorAll('img'));
    await Promise.all(
      images.map((img) => {
        if (img.complete) return Promise.resolve();
        return new Promise((resolve) => {
          img.onload = () => resolve(true);
          img.onerror = () => resolve(false);
          // Timeout fallback in case image hangs
          setTimeout(() => resolve(false), 2000);
        });
      })
    );

    if (document.fonts) {
      await document.fonts.ready;
    }

    onProgress?.('Rendering high-resolution blueprint canvas...');

    // Save initial style overrides if needed
    const prevScrollY = window.scrollY;

    // Capture with high quality (scale 2 gives retina 300-DPI equivalent quality)
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: '#FFFFFF',
      windowWidth: 1200,
      onclone: (clonedDoc) => {
        // Ensure the cloned blueprint container has auto height and full visibility
        const clonedEl = clonedDoc.getElementById(
          typeof elementIdOrEl === 'string' ? elementIdOrEl : element.id || 'stackmatch-blueprint-doc'
        );
        if (clonedEl) {
          clonedEl.style.height = 'auto';
          clonedEl.style.maxHeight = 'none';
          clonedEl.style.overflow = 'visible';
          clonedEl.style.boxShadow = 'none';
          clonedEl.style.border = 'none';
          clonedEl.style.padding = '24px';
          clonedEl.style.backgroundColor = '#FFFFFF';
        }
      },
    });

    window.scrollTo(0, prevScrollY);

    onProgress?.('Calculating multi-page layout...');

    // A4 dimensions in PDF points (72 pt / inch)
    // 210mm x 297mm -> 595.28 pt x 841.89 pt
    const pdfWidth = 595.28;
    const pdfHeight = 841.89;
    const margin = 28; // ~10mm margins
    const printableWidth = pdfWidth - margin * 2;
    const printableHeight = pdfHeight - margin * 2;

    // Scale canvas width to printable width
    const scaleFactor = printableWidth / canvas.width;
    const totalPdfHeight = canvas.height * scaleFactor;

    // Initialize jsPDF (portrait, points, A4)
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: 'a4',
      compress: true,
    });

    // Detect card boundary positions in original DOM for smart break placement
    const elementRect = element.getBoundingClientRect();
    const breakAvoidElements = Array.from(
      element.querySelectorAll<HTMLElement>('.blueprint-card, .blueprint-section-header, section')
    );

    const safeBreakPoints: number[] = [];
    const canvasScale = canvas.width / element.offsetWidth;

    breakAvoidElements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      const relativeTop = (rect.top - elementRect.top) * canvasScale;
      if (relativeTop > 0 && relativeTop < canvas.height) {
        safeBreakPoints.push(relativeTop);
      }
    });

    safeBreakPoints.sort((a, b) => a - b);

    // Page slicing logic:
    // Standard page height in canvas pixels
    const maxPageCanvasHeight = Math.floor(printableHeight / scaleFactor);

    let currentSourceY = 0;
    const pageSlices: { sourceY: number; height: number }[] = [];

    while (currentSourceY < canvas.height) {
      const remainingHeight = canvas.height - currentSourceY;

      if (remainingHeight <= maxPageCanvasHeight) {
        pageSlices.push({
          sourceY: currentSourceY,
          height: remainingHeight,
        });
        break;
      }

      // Desired break point in canvas coords
      const targetBreakY = currentSourceY + maxPageCanvasHeight;

      // Find the closest card boundary before targetBreakY (within the last 20% of the page)
      const minAcceptableBreakY = currentSourceY + maxPageCanvasHeight * 0.75;
      let optimalBreakY = targetBreakY;

      for (let i = safeBreakPoints.length - 1; i >= 0; i--) {
        const bp = safeBreakPoints[i];
        if (bp <= targetBreakY && bp >= minAcceptableBreakY) {
          optimalBreakY = bp;
          break;
        }
      }

      const sliceHeight = optimalBreakY - currentSourceY;
      pageSlices.push({
        sourceY: currentSourceY,
        height: sliceHeight,
      });

      currentSourceY = optimalBreakY;
    }

    const totalPages = pageSlices.length;

    onProgress?.(`Composing ${totalPages} pages into PDF...`);

    // Render each slice onto its corresponding PDF page
    for (let pageIdx = 0; pageIdx < totalPages; pageIdx++) {
      const slice = pageSlices[pageIdx];

      if (pageIdx > 0) {
        pdf.addPage('a4', 'portrait');
      }

      // Create a temporary canvas for this specific slice
      const sliceCanvas = document.createElement('canvas');
      sliceCanvas.width = canvas.width;
      sliceCanvas.height = slice.height;

      const sliceCtx = sliceCanvas.getContext('2d');
      if (sliceCtx) {
        sliceCtx.fillStyle = '#FFFFFF';
        sliceCtx.fillRect(0, 0, sliceCanvas.width, sliceCanvas.height);
        sliceCtx.drawImage(
          canvas,
          0,
          slice.sourceY,
          canvas.width,
          slice.height,
          0,
          0,
          canvas.width,
          slice.height
        );
      }

      const sliceImgData = sliceCanvas.toDataURL('image/jpeg', 0.95);
      const renderedPdfHeight = slice.height * scaleFactor;

      // Add image to page
      pdf.addImage(
        sliceImgData,
        'JPEG',
        margin,
        margin,
        printableWidth,
        renderedPdfHeight,
        undefined,
        'FAST'
      );

      // Clean running header (pages 2+)
      if (pageIdx > 0) {
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(7.5);
        pdf.setTextColor(100, 116, 139);
        pdf.text(
          'STACKMATCH  •  ENGINEERING SPECIFICATION & BLUEPRINT',
          margin,
          margin - 12
        );
        pdf.setDrawColor(226, 232, 240);
        pdf.setLineWidth(0.5);
        pdf.line(margin, margin - 8, pdfWidth - margin, margin - 8);
      }

      // Restrained running footer
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(7.5);
      pdf.setTextColor(148, 163, 184);
      pdf.setDrawColor(226, 232, 240);
      pdf.setLineWidth(0.5);
      pdf.line(margin, pdfHeight - margin + 8, pdfWidth - margin, pdfHeight - margin + 8);

      pdf.text(
        'Confidential • Prepared with StackMatch Planning Studio',
        margin,
        pdfHeight - margin + 18
      );
      pdf.text(
        `Page ${pageIdx + 1} of ${totalPages}`,
        pdfWidth - margin - 50,
        pdfHeight - margin + 18
      );
    }

    onProgress?.('Finalizing and downloading PDF file...');
    pdf.save(filename);

    return true;
  } catch (error) {
    console.error('Failed to export blueprint PDF:', error);
    throw error;
  }
}
