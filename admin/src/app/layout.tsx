import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Athloboard Admin | Central Gatekeeper Console',
  description: 'National verification, video refereeing studio & ecosystem operations',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#0D0E15] text-white min-h-screen">
        {children}
      </body>
    </html>
  );
}
