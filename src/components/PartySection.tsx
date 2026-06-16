interface Props {
  title: string;
  nameLabel: string;
  name: string;
  addr: string;
  email?: string;
  showEmail?: boolean;
  onChangeName: (v: string) => void;
  onChangeAddr: (v: string) => void;
  onChangeEmail?: (v: string) => void;
}

export default function PartySection({
  title,
  nameLabel,
  name,
  addr,
  email = '',
  showEmail = false,
  onChangeName,
  onChangeAddr,
  onChangeEmail,
}: Props) {
  return (
    <section className="section">
      <div className="section-title">{title}</div>
      <div className="field">
        <label>{nameLabel}</label>
        <input type="text" value={name} onChange={e => onChangeName(e.target.value)} />
      </div>
      <div className="field">
        <label>Address</label>
        <textarea rows={2} value={addr} onChange={e => onChangeAddr(e.target.value)} />
      </div>
      {showEmail && (
        <div className="field">
          <label>Email (optional)</label>
          <input
            type="email"
            value={email}
            placeholder="your@email.com"
            onChange={e => onChangeEmail?.(e.target.value)}
          />
        </div>
      )}
    </section>
  );
}
