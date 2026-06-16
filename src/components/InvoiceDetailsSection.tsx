interface Props {
  invNum: string;
  invDate: string;
  onChangeNum: (v: string) => void;
  onChangeDate: (v: string) => void;
}

export default function InvoiceDetailsSection({ invNum, invDate, onChangeNum, onChangeDate }: Props) {
  return (
    <section className="section">
      <div className="section-title">Invoice Details</div>
      <div className="row-2">
        <div className="field">
          <label>Invoice #</label>
          <input type="text" value={invNum} onChange={e => onChangeNum(e.target.value)} />
        </div>
        <div className="field">
          <label>Date</label>
          <input type="date" value={invDate} onChange={e => onChangeDate(e.target.value)} />
        </div>
      </div>
    </section>
  );
}
