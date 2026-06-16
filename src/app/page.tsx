'use client';

import { useState, useCallback } from 'react';
import AppHeader from '@/components/AppHeader';
import InvoiceDetailsSection from '@/components/InvoiceDetailsSection';
import PartySection from '@/components/PartySection';
import LineItemsSection from '@/components/LineItemsSection';
import TotalsSection from '@/components/TotalsSection';
import NoteSection from '@/components/NoteSection';
import PreviewOverlay from '@/components/PreviewOverlay';
import type { InvoiceFields, LineItem } from '@/types/invoice';
import { uid } from '@/lib/format';

const DEFAULT_FIELDS: InvoiceFields = {
  invNum:   '001',
  invDate:  new Date().toISOString().split('T')[0],
  fromName: 'Shraddha Tiwari',
  fromAddr: '7319 Parkwood Cir, Apt A\nDublin, CA 94568',
  fromEmail: '',
  toName:   'India Community Center (ICC)',
  toAddr:   '525 Los Coches Street\nMilpitas, CA 95035',
  note:     'Thank you for the opportunity to work with ICC. I appreciate your support and collaboration.',
};

const DEFAULT_LINE_ITEMS: Omit<LineItem, 'id'>[] = [
  { dates: 'June 1–5, 2026', service: 'Week 1 World Exploration and Physics', time: '8:45am – 10:45am', rate: '40', hours: '10' },
  { dates: 'June 1–5, 2026', service: 'Week 1 Art',                           time: '10:45am – 12:45pm', rate: '40', hours: '10' },
];

export default function HomePage() {
  const [fields, setFields] = useState<InvoiceFields>(DEFAULT_FIELDS);
  const [lineItems, setLineItems] = useState<LineItem[]>(() =>
    DEFAULT_LINE_ITEMS.map(item => ({ ...item, id: uid() }))
  );
  const [previewOpen, setPreviewOpen] = useState(false);

  const updateField = useCallback(<K extends keyof InvoiceFields>(key: K, value: InvoiceFields[K]) => {
    setFields(prev => ({ ...prev, [key]: value }));
  }, []);

  const addLineItem = useCallback(() => {
    setLineItems(prev => [...prev, { id: uid(), dates: '', service: '', time: '', rate: '40', hours: '10' }]);
  }, []);

  const removeLineItem = useCallback((id: string) => {
    setLineItems(prev => prev.filter(item => item.id !== id));
  }, []);

  const updateLineItem = useCallback((id: string, key: keyof Omit<LineItem, 'id'>, value: string) => {
    setLineItems(prev => prev.map(item => item.id === id ? { ...item, [key]: value } : item));
  }, []);

  return (
    <>
      <AppHeader onPreview={() => setPreviewOpen(true)} />

      <div className="container">
        <InvoiceDetailsSection
          invNum={fields.invNum}
          invDate={fields.invDate}
          onChangeNum={v => updateField('invNum', v)}
          onChangeDate={v => updateField('invDate', v)}
        />

        <PartySection
          title="From"
          nameLabel="Name"
          name={fields.fromName}
          addr={fields.fromAddr}
          email={fields.fromEmail}
          showEmail
          onChangeName={v => updateField('fromName', v)}
          onChangeAddr={v => updateField('fromAddr', v)}
          onChangeEmail={v => updateField('fromEmail', v)}
        />

        <PartySection
          title="Bill To"
          nameLabel="Organization / Name"
          name={fields.toName}
          addr={fields.toAddr}
          onChangeName={v => updateField('toName', v)}
          onChangeAddr={v => updateField('toAddr', v)}
        />

        <LineItemsSection
          items={lineItems}
          onAdd={addLineItem}
          onChange={updateLineItem}
          onRemove={removeLineItem}
        />

        <TotalsSection lineItems={lineItems} />

        <NoteSection note={fields.note} onChange={v => updateField('note', v)} />

        <div style={{ paddingBottom: 30 }}>
          <button className="btn-pdf" onClick={() => setPreviewOpen(true)}>
            Preview &amp; Download PDF
          </button>
          <div className="print-note">Review the invoice, then download as a PDF file</div>
        </div>
      </div>

      <PreviewOverlay
        open={previewOpen}
        fields={fields}
        lineItems={lineItems}
        onClose={() => setPreviewOpen(false)}
      />
    </>
  );
}
