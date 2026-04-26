import type { Metadata } from 'next';
import { WelcomeFlow } from '@/components/v2/welcome/WelcomeFlow';

export const metadata: Metadata = {
  title: 'LoreVault — 90 seconds',
  description:
    'One of five Panes. Somewhere else, he is saying it again.',
};

export default function WelcomePage() {
  return <WelcomeFlow />;
}
