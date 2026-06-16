import type { InvoiceFields, LineItem } from '@/types/invoice';
import { fmt, getItemAmount, formatDate } from './format';

const COLS = (usable: number, margin: number) => [
  { label: 'DATES',   x: margin,                 w: usable * 0.18, align: 'left'  as const },
  { label: 'SERVICE', x: margin + usable * 0.18,  w: usable * 0.33, align: 'left'  as const },
  { label: 'TIME',    x: margin + usable * 0.51,  w: usable * 0.21, align: 'left'  as const },
  { label: 'RATE',    x: margin + usable * 0.72,  w: usable * 0.12, align: 'right' as const },
  { label: 'AMOUNT',  x: margin + usable * 0.84,  w: usable * 0.16, align: 'right' as const },
];

export async function generateAndDownloadPDF(
  fields: InvoiceFields,
  lineItems: LineItem[]
): Promise<void> {
  const { jsPDF } = await import('jspdf');

  const doc  = new jsPDF({ unit: 'pt', format: 'letter' });
  const pageW  = doc.internal.pageSize.getWidth();
  const margin = 48;
  const usable = pageW - margin * 2;
  const cols   = COLS(usable, margin);
  const total  = lineItems.reduce((s, i) => s + getItemAmount(i.rate, i.hours), 0);

  // ── Header bar ─────────────────────────────────────────────────────
  const headerH = 80;
  doc.setFillColor('#1a1a1a');
  doc.rect(0, 0, pageW, headerH, 'F');

  doc.setTextColor('#ffffff');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(28);
  doc.text('INVOICE', margin, 54);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(`Invoice #: ${fields.invNum || '001'}`, pageW - margin, 38, { align: 'right' });
  doc.text(`Date: ${formatDate(fields.invDate)}`, pageW - margin, 54, { align: 'right' });

  // ── From / To ──────────────────────────────────────────────────────
  let y = headerH + 28;
  const colW = usable / 2;

  const drawColumn = (
    label: string,
    boldLine: string,
    lines: string[],
    x: number,
    startY: number
  ): number => {
    let ly = startY;

    doc.setTextColor('#999999');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.text(label, x, ly);
    ly += 12;

    doc.setDrawColor('#e0ddd8');
    doc.setLineWidth(0.5);
    doc.line(x, ly, x + colW - 16, ly);
    ly += 12;

    doc.setTextColor('#1a1a1a');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.text(boldLine, x, ly);
    ly += 14;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    lines.forEach(line => { if (line) { doc.text(line, x, ly); ly += 13; } });

    return ly;
  };

  const fromLines = [...fields.fromAddr.split('\n'), fields.fromEmail].filter(Boolean);
  const toLines   = fields.toAddr.split('\n').filter(Boolean);

  const yFromEnd = drawColumn('FROM',    fields.fromName, fromLines, margin,        y);
  const yToEnd   = drawColumn('BILL TO', fields.toName,   toLines,   margin + colW, y);
  y = Math.max(yFromEnd, yToEnd) + 28;

  // ── Table header ───────────────────────────────────────────────────
  const thH = 28;
  doc.setFillColor('#1a1a1a');
  doc.rect(margin, y, usable, thH, 'F');

  doc.setTextColor('#ffffff');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);

  cols.forEach(c => {
    const ty = y + thH / 2 + 3;
    if (c.align === 'right') {
      doc.text(c.label, c.x + c.w - 8, ty, { align: 'right' });
    } else {
      doc.text(c.label, c.x + 8, ty);
    }
  });

  y += thH;

  // ── Table rows ─────────────────────────────────────────────────────
  const lineH = 13;

  lineItems.forEach((item, idx) => {
    const cells = [
      item.dates   || '—',
      item.service || '—',
      item.time    || '—',
      `$${parseFloat(item.rate) || 0}/HR`,
      `$${fmt(getItemAmount(item.rate, item.hours))}`,
    ];

    let maxLines = 1;
    cells.forEach((text, i) => {
      maxLines = Math.max(maxLines, doc.splitTextToSize(text, cols[i].w - 16).length);
    });
    const rowH = Math.max(32, maxLines * lineH + 18);

    if (idx % 2 === 0) {
      doc.setFillColor('#F5F4F0');
    } else {
      doc.setFillColor('#ffffff');
    }
    doc.rect(margin, y, usable, rowH, 'F');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor('#1a1a1a');

    cells.forEach((cellText, i) => {
      const c = cols[i];
      const wrapped = doc.splitTextToSize(cellText, c.w - 16);
      const blockH  = (wrapped.length - 1) * lineH;
      const baseY   = y + rowH / 2 + 4 - blockH / 2;

      wrapped.forEach((line: string, li: number) => {
        const lineY = baseY + li * lineH;
        if (c.align === 'right') {
          doc.text(line, c.x + c.w - 8, lineY, { align: 'right' });
        } else {
          doc.text(line, c.x + 8, lineY);
        }
      });
    });

    y += rowH;
  });

  // Table bottom border
  doc.setDrawColor('#c8c5be');
  doc.setLineWidth(0.75);
  doc.line(margin, y, margin + usable, y);
  y += 20;

  // ── Total block ────────────────────────────────────────────────────
  const totalBlockW = 228;
  const totalBlockH = 36;
  const totalBlockX = margin + usable - totalBlockW;

  doc.setFillColor('#1a1a1a');
  doc.rect(totalBlockX, y, totalBlockW, totalBlockH, 'F');

  doc.setTextColor('#ffffff');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  const midY = y + totalBlockH / 2 + 4;
  doc.text('Total Due:', totalBlockX + 14, midY);
  doc.text(`$${fmt(total)}`, totalBlockX + totalBlockW - 10, midY, { align: 'right' });

  y += totalBlockH + 28;

  // ── Note ──────────────────────────────────────────────────────────
  if (fields.note) {
    doc.setTextColor('#888888');
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(9.5);
    const wrapped = doc.splitTextToSize(fields.note, usable);
    doc.text(wrapped, margin, y);
  }

  doc.save(`Invoice-${fields.invNum || '001'}-Shraddha-Tiwari.pdf`);
}
