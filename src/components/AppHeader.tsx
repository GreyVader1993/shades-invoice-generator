interface Props {
  onPreview: () => void;
}

export default function AppHeader({ onPreview }: Props) {
  return (
    <header className="app-header">
      <div>
        <div className="hd-title">Invoice Generator</div>
        <div className="hd-sub">Shraddha Tiwari</div>
      </div>
      <button className="btn-hd" onClick={onPreview}>
        <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
        Preview
      </button>
    </header>
  );
}
