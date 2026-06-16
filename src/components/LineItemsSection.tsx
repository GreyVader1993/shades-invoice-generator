import type { LineItem } from '@/types/invoice';
import LineItemCard from './LineItemCard';

interface Props {
  items: LineItem[];
  onAdd: () => void;
  onChange: (id: string, key: keyof Omit<LineItem, 'id'>, value: string) => void;
  onRemove: (id: string) => void;
}

export default function LineItemsSection({ items, onAdd, onChange, onRemove }: Props) {
  return (
    <section className="section">
      <div className="section-title">Services</div>
      <div className="line-items">
        {items.map((item, idx) => (
          <LineItemCard
            key={item.id}
            item={item}
            index={idx}
            isOnly={items.length === 1}
            onChange={onChange}
            onRemove={onRemove}
          />
        ))}
      </div>
      <button className="btn-add" onClick={onAdd}>+ Add service</button>
    </section>
  );
}
