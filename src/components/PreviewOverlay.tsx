'use client';

import { useState, useEffect } from 'react';
import type { InvoiceFields, LineItem } from '@/types/invoice';
import { fmt, getItemAmount, formatDate } from '@/lib/format';
import { generateAndDownloadPDF } from '@/lib/pdf';

interface Props {
  open: boolean;
  fields: InvoiceFields;
  lineItems: LineItem[];
  onClose: () => void;
}

function InvoicePreview({ fields, lineItems }: { fields: InvoiceFields; lineItems: LineItem[] }) {
  const total = lineItems.reduce((s, i) => s + getItemAmount(i.rate, i.hours), 0);

  return (
    <>
      <div className="p-title">INVOICE</div>

      <div className="p-parties">
        <div>
          <span className="p-bold">From:</span><br />
          {fields.fromName}<br />
          {fields.fromAddr.split('\n').map((line, i) => (
            <span key={i}>{line}<br /></span>
          ))}
          {fields.fromEmail}
        </div>
        <div>
          <span className="p-bold">To:</span><br />
          {fields.toName}<br />
          {fields.toAddr.split('\n').map((line, i) => (
            <span key={i}>{line}<br /></span>
          ))}
        </div>
      </div>

      <div className="p-meta">
        <span className="p-bold">Invoice #:</span> {fields.invNum || '—'}&nbsp;&nbsp;&nbsp;
        <span className="p-bold">Invoice Date:</span> {formatDate(fields.invDate)}
      </div>

      <table>
        <colgroup>
          <col /><col /><col /><col /><col />
        </colgroup>
        <thead>
          <tr>
            <th>Dates</th>
            <th>Service</th>
            <th>Time</th>
            <th>Rate</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {lineItems.map(item => (
            <tr key={item.id}>
              <td>{item.dates || '—'}</td>
              <td>{item.service || '—'}</td>
              <td>{item.time || '—'}</td>
              <td>${parseFloat(item.rate) || 0}/HR</td>
              <td>${fmt(getItemAmount(item.rate, item.hours))}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="p-total-wrap">
        <div className="p-total-inner">
          <div className="p-total-row grand">
            <span>Total Amount Due:</span>
            <span>${fmt(total)}</span>
          </div>
        </div>
      </div>

      {fields.note && <div className="p-note">{fields.note}</div>}
    </>
  );
}

export default function PreviewOverlay({ open, fields, lineItems, onClose }: Props) {
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  async function handleDownload() {
    setDownloading(true);
    try {
      await generateAndDownloadPDF(fields, lineItems);
    } catch (err) {
      alert('PDF generation failed: ' + (err as Error).message);
    } finally {
      setDownloading(false);
    }
  }

  function handleBackdropClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) onClose();
  }

  return (
    <div className={`overlay${open ? ' active' : ''}`} onClick={handleBackdropClick}>
      <div className="preview-card">
        <div id="inv-preview-wrap">
          <button className="p-close" onClick={onClose}>✕</button>
          <InvoicePreview fields={fields} lineItems={lineItems} />
        </div>
        <div className="preview-actions">
          <button className="btn-cl" onClick={onClose}>← Edit</button>
          <button className="btn-dl" onClick={handleDownload} disabled={downloading}>
            {downloading ? 'Generating…' : '↓ Download PDF'}
          </button>
        </div>
      </div>
    </div>
  );
}
