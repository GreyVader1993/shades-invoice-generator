import type { LineItem } from '@/types/invoice';
import { fmt, getItemAmount } from '@/lib/format';

interface Props {
  lineItems: LineItem[];
}

export default function TotalsSection({ lineItems }: Props) {
  const total = lineItems.reduce((s, i) => s + getItemAmount(i.rate, i.hours), 0);

  return (
    <section className="section">
      <div className="section-title">Summary</div>
      <div className="total-row">
        <span className="total-label">Subtotal</span>
        <span>${fmt(total)}</span>
      </div>
      <div className="total-row grand">
        <span className="total-label grand">Total Due</span>
        <span>${fmt(total)}</span>
      </div>
    </section>
  );
}
