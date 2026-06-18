export function fmt(n: number): string {
  return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function getItemAmount(rate: string, hours: string): number {
  return (parseFloat(rate) || 0) * (parseFloat(hours) || 0);
}

export function uid(): string {
  return `${Date.now()}${Math.random().toString(36).slice(2, 6)}`;
}

export function formatTime(t: string): string {
  if (!t) return '';
  const [hStr, mStr] = t.split(':');
  const h = parseInt(hStr, 10);
  const m = parseInt(mStr, 10);
  const period = h >= 12 ? 'PM' : 'AM';
  const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${h12}:${m.toString().padStart(2, '0')}${period}`;
}

export function formatTimeRange(from: string, to: string): string {
  const f = formatTime(from);
  const t = formatTime(to);
  if (!f && !t) return '';
  if (!f) return t;
  if (!t) return f;
  return `${f} – ${t}`;
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return '—';
  return new Date(dateStr + 'T12:00:00').toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
