import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pierre-Menard Triptych — LoreVault Moodboard',
  description:
    'Four cards. One axiom. Four cosmological meanings. The Pierre-Menard mechanic demonstrated.',
};

export default function PierreMenardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
