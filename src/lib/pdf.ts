import type { InvoiceFields, LineItem } from '@/types/invoice';
import { fmt, getItemAmount, formatDate } from './format';

export async function generateAndDownloadPDF(
  fields: InvoiceFields,
  lineItems: LineItem[]
): Promise<void> {
  const { jsPDF } = await import('jspdf');

  const doc = new jsPDF({ unit: 'pt', format: 'letter' });
  const margin = 56;
  const pageW = doc.internal.pageSize.getWidth();
  const usable = pageW - margin * 2;
  let y = margin;

  const fromAddrLines = fields.fromAddr.split('\n');
  const toAddrLines = fields.toAddr.split('\n');
  const total = lineItems.reduce((s, i) => s + getItemAmount(i.rate, i.hours), 0);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(28);
  doc.text('INVOICE', margin, y);
  y += 36;

  const colW = usable / 2;
  doc.setFontSize(11);

  const drawParty = (label: string, name: string, addr: string[], email: string, x: number): number => {
    let ly = y;
    doc.setFont('helvetica', 'bold');
    doc.text(label, x, ly); ly += 15;
    doc.setFont('helvetica', 'normal');
    doc.text(name, x, ly); ly += 15;
    addr.forEach(line => { doc.text(line, x, ly); ly += 14; });
    if (email) { doc.text(email, x, ly); ly += 14; }
    return ly;
  };

  const yFromEnd = drawParty('From:', fields.fromName, fromAddrLines, fields.fromEmail, margin);
  const yToEnd = drawParty('To:', fields.toName, toAddrLines, '', margin + colW);
  y = Math.max(yFromEnd, yToEnd) + 10;

  doc.setFont('helvetica', 'bold');
  doc.text('Invoice #: ', margin, y);
  const numW = doc.getTextWidth('Invoice #: ');
  doc.setFont('helvetica', 'normal');
  doc.text(fields.invNum || '—', margin + numW, y);

  const dateLabel = 'Invoice Date: ';
  const dateLabelW = doc.getTextWidth(dateLabel);
  doc.setFont('helvetica', 'bold');
  doc.text(dateLabel, margin + colW, y);
  doc.setFont('helvetica', 'normal');
  doc.text(formatDate(fields.invDate), margin + colW + dateLabelW, y);
  y += 24;

  doc.setLineWidth(1.5);
  doc.line(margin, y, margin + usable, y); y += 10;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');

  const cols = [
    { label: 'Dates',   x: margin,                w: usable * 0.18, align: 'left' as const },
    { label: 'Service', x: margin + usable * 0.18, w: usable * 0.32, align: 'left' as const },
    { label: 'Time',    x: margin + usable * 0.50, w: usable * 0.22, align: 'left' as const },
    { label: 'Rate',    x: margin + usable * 0.72, w: usable * 0.12, align: 'right' as const },
    { label: 'Amount',  x: margin + usable * 0.84, w: usable * 0.16, align: 'right' as const },
  ];

  cols.forEach(c => {
    if (c.align === 'right') {
      doc.text(c.label, c.x + c.w, y, { align: 'right' });
    } else {
      doc.text(c.label, c.x, y);
    }
  });
  y += 6;
  doc.line(margin, y, margin + usable, y); y += 12;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);

  lineItems.forEach(item => {
    const cells = [
      item.dates || '—',
      item.service || '—',
      item.time || '—',
      `$${parseFloat(item.rate) || 0}/HR`,
      `$${fmt(getItemAmount(item.rate, item.hours))}`,
    ];

    let maxH = 14;
    cells.forEach((text, i) => {
      const wrapped = doc.splitTextToSize(text, cols[i].w - 4);
      maxH = Math.max(maxH, wrapped.length * 13);
    });

    cells.forEach((text, i) => {
      const c = cols[i];
      const wrapped = doc.splitTextToSize(text, c.w - 4);
      if (c.align === 'right') {
        wrapped.forEach((line: string, li: number) =>
          doc.text(line, c.x + c.w, y + li * 13, { align: 'right' })
        );
      } else {
        doc.text(wrapped, c.x, y);
      }
    });

    y += maxH;
    doc.setLineWidth(0.5);
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, y, margin + usable, y);
    doc.setDrawColor(0, 0, 0);
    y += 10;
  });

  y += 6;

  const rightEdge = margin + usable;
  const labelX = rightEdge - 200;

  doc.setLineWidth(1.5);
  doc.line(labelX, y, rightEdge, y); y += 10;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Total Amount Due:', labelX, y);
  doc.text(`$${fmt(total)}`, rightEdge, y, { align: 'right' });
  y += 24;

  if (fields.note) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    const wrapped = doc.splitTextToSize(fields.note, usable);
    doc.text(wrapped, margin, y);
    doc.setTextColor(0, 0, 0);
  }

  doc.save(`Invoice-${fields.invNum || '001'}-Shraddha-Tiwari.pdf`);
}
