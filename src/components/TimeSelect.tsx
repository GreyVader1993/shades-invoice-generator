import { useState, useEffect, type ChangeEvent } from 'react';

interface Props {
  value: string; // "HH:MM" 24h, or ""
  onChange: (value: string) => void;
}

const HOURS_12 = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
const MINUTES  = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

interface Parts { h12: number; min: number; period: 'AM' | 'PM' }

// Inverse of formatTime in format.ts — keep in sync if that function changes.
function parse(val: string): Parts {
  const [hStr, mStr] = val.split(':');
  const h24 = parseInt(hStr, 10);
  const min  = parseInt(mStr, 10);
  const period: 'AM' | 'PM' = h24 >= 12 ? 'PM' : 'AM';
  const h12 = h24 === 0 ? 12 : h24 > 12 ? h24 - 12 : h24;
  return { h12, min, period };
}

function toHH24({ h12, min, period }: Parts): string {
  const h24 = period === 'AM' ? (h12 === 12 ? 0 : h12) : (h12 === 12 ? 12 : h12 + 12);
  return `${h24.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
}

export default function TimeSelect({ value, onChange }: Props) {
  const [parts, setParts] = useState<Parts | null>(() => value ? parse(value) : null);

  // Sync when the parent resets value externally (e.g. form clear).
  useEffect(() => {
    setParts(value ? parse(value) : null);
  }, [value]);

  function commit(next: Parts) {
    setParts(next);
    onChange(toHH24(next));
  }

  function onHour(e: ChangeEvent<HTMLSelectElement>) {
    const v = e.target.value;
    if (!v) { setParts(null); onChange(''); return; }
    const h12 = parseInt(v, 10);
    // Preserve existing min/period when changing hour; default to 0/AM on first set.
    commit(parts ? { ...parts, h12 } : { h12, min: 0, period: 'AM' });
  }

  function onMin(e: ChangeEvent<HTMLSelectElement>) {
    if (!parts) return;
    commit({ ...parts, min: parseInt(e.target.value, 10) });
  }

  function onPeriod(e: ChangeEvent<HTMLSelectElement>) {
    if (!parts) return;
    commit({ ...parts, period: e.target.value as 'AM' | 'PM' });
  }

  return (
    <div className="time-select">
      <select value={parts ? parts.h12 : ''} onChange={onHour} aria-label="Hour">
        <option value="">--</option>
        {HOURS_12.map(h => <option key={h} value={h}>{h}</option>)}
      </select>
      <span className="time-select-colon">:</span>
      <select value={parts ? parts.min : ''} onChange={onMin} aria-label="Minute" disabled={!parts}>
        <option value="" disabled>--</option>
        {MINUTES.map(m => <option key={m} value={m}>{m.toString().padStart(2, '0')}</option>)}
      </select>
      <select value={parts ? parts.period : ''} onChange={onPeriod} aria-label="AM or PM" disabled={!parts}>
        <option value="" disabled>--</option>
        <option value="AM">AM</option>
        <option value="PM">PM</option>
      </select>
    </div>
  );
}
