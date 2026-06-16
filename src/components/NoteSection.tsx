interface Props {
  note: string;
  onChange: (v: string) => void;
}

export default function NoteSection({ note, onChange }: Props) {
  return (
    <section className="section">
      <div className="section-title">Note (optional)</div>
      <div className="field" style={{ margin: 0 }}>
        <textarea rows={2} value={note} onChange={e => onChange(e.target.value)} />
      </div>
    </section>
  );
}
