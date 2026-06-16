export function fmt(n: number): string {
  return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function getItemAmount(rate: string, hours: string): number {
  return (parseFloat(rate) || 0) * (parseFloat(hours) || 0);
}

export function uid(): string {
  return `${Date.now()}${Math.random().toString(36).slice(2, 6)}`;
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return '—';
  return new Date(dateStr + 'T12:00:00').toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
