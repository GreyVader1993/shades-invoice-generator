import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Invoice Generator — Shraddha Tiwari',
  description: 'Generate professional invoices',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
