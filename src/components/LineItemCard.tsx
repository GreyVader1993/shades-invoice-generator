import type { LineItem } from '@/types/invoice';
import { fmt, getItemAmount } from '@/lib/format';

interface Props {
  item: LineItem;
  index: number;
  isOnly: boolean;
  onChange: (id: string, key: keyof Omit<LineItem, 'id'>, value: string) => void;
  onRemove: (id: string) => void;
}

export default function LineItemCard({ item, index, isOnly, onChange, onRemove }: Props) {
  const amount = getItemAmount(item.rate, item.hours);

  return (
    <div className="line-item">
      <div className="line-item-header">
        <span className="line-item-num">Line {index + 1}</span>
        {!isOnly && (
          <button className="btn-remove" onClick={() => onRemove(item.id)}>✕</button>
        )}
      </div>

      <div className="field" style={{ marginBottom: 8 }}>
        <label style={{ fontSize: 12, color: '#888', marginBottom: 4, display: 'block' }}>Dates</label>
        <input
          type="text"
          placeholder="e.g. June 1–5, 2026"
          value={item.dates}
          onChange={e => onChange(item.id, 'dates', e.target.value)}
        />
      </div>

      <div className="field" style={{ marginBottom: 8 }}>
        <label style={{ fontSize: 12, color: '#888', marginBottom: 4, display: 'block' }}>Service description</label>
        <input
          type="text"
          placeholder="e.g. Week 1 World Exploration and Physics"
          value={item.service}
          onChange={e => onChange(item.id, 'service', e.target.value)}
        />
      </div>

      <div className="field" style={{ marginBottom: 8 }}>
        <label style={{ fontSize: 12, color: '#888', marginBottom: 4, display: 'block' }}>Time</label>
        <div className="time-range">
          <input
            type="time"
            value={item.timeFrom}
            onChange={e => onChange(item.id, 'timeFrom', e.target.value)}
          />
          <span className="time-dash">–</span>
          <input
            type="time"
            value={item.timeTo}
            onChange={e => onChange(item.id, 'timeTo', e.target.value)}
          />
        </div>
      </div>

      <div className="line-row-2" style={{ marginBottom: 6 }}>
        <div>
          <label style={{ fontSize: 12, color: '#888', display: 'block', marginBottom: 4 }}>Rate ($/hr)</label>
          <input
            type="number"
            placeholder="40"
            value={item.rate}
            min={0}
            style={{ textAlign: 'right' }}
            onChange={e => onChange(item.id, 'rate', e.target.value)}
          />
        </div>
        <div>
          <label style={{ fontSize: 12, color: '#888', display: 'block', marginBottom: 4 }}>Hours</label>
          <input
            type="number"
            placeholder="10"
            value={item.hours}
            min={0}
            step={0.5}
            style={{ textAlign: 'right' }}
            onChange={e => onChange(item.id, 'hours', e.target.value)}
          />
        </div>
      </div>

      <div className="line-amount">${fmt(amount)}</div>
    </div>
  );
}
