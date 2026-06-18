import type { ChangeEvent } from 'react';

interface Props {
  value: string; // "HH:MM" 24h, or ""
  onChange: (value: string) => void;
}

const HOURS_12 = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
const MINUTES  = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

function parse(val: string): { h12: number; min: number; period: 'AM' | 'PM' } {
  const [hStr, mStr] = val.split(':');
  const h24 = parseInt(hStr, 10);
  const min  = parseInt(mStr, 10);
  const period: 'AM' | 'PM' = h24 >= 12 ? 'PM' : 'AM';
  const h12 = h24 === 0 ? 12 : h24 > 12 ? h24 - 12 : h24;
  return { h12, min, period };
}

function toHH24(h12: number, min: number, period: 'AM' | 'PM'): string {
  let h24: number;
  if (period === 'AM') {
    h24 = h12 === 12 ? 0 : h12;
  } else {
    h24 = h12 === 12 ? 12 : h12 + 12;
  }
  return `${h24.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
}

export default function TimeSelect({ value, onChange }: Props) {
  const filled = Boolean(value);
  const { h12, min, period } = filled ? parse(value) : { h12: 12, min: 0, period: 'AM' as const };

  function update(newH: number, newM: number, newP: 'AM' | 'PM') {
    onChange(toHH24(newH, newM, newP));
  }

  function onHour(e: ChangeEvent<HTMLSelectElement>) {
    const v = e.target.value;
    if (!v) { onChange(''); return; }
    update(parseInt(v, 10), min, period);
  }

  function onMin(e: ChangeEvent<HTMLSelectElement>) {
    update(h12, parseInt(e.target.value, 10), period);
  }

  function onPeriod(e: ChangeEvent<HTMLSelectElement>) {
    update(h12, min, e.target.value as 'AM' | 'PM');
  }

  return (
    <div className="time-select">
      <select value={filled ? h12 : ''} onChange={onHour} aria-label="Hour">
        <option value="">--</option>
        {HOURS_12.map(h => <option key={h} value={h}>{h}</option>)}
      </select>
      <span className="time-select-colon">:</span>
      <select value={filled ? min : ''} onChange={onMin} aria-label="Minute">
        <option value="" disabled>--</option>
        {MINUTES.map(m => <option key={m} value={m}>{m.toString().padStart(2, '0')}</option>)}
      </select>
      <select value={filled ? period : ''} onChange={onPeriod} aria-label="AM or PM">
        <option value="" disabled>--</option>
        <option value="AM">AM</option>
        <option value="PM">PM</option>
      </select>
    </div>
  );
}
