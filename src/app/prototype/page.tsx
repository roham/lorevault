'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

const VISIONS = [
  {
    id: 'story',
    title: 'Discover the Story',
    subtitle: 'Cards unlock chapters. Collecting IS reading.',
    emotion: 'Curiosity',
    color: '#818cf8',
    href: '/prototype/story',
  },
  {
    id: 'chase',
    title: 'Chase the Set',
    subtitle: 'See the gap. Feel the gap. Fill the gap.',
    emotion: 'Desire',
    color: '#f59e0b',
    href: '/prototype/chase',
  },
  {
    id: 'play',
    title: 'Play to Collect',
    subtitle: 'Win games. Earn cards. Build power.',
    emotion: 'Mastery',
    color: '#22c55e',
    href: '/prototype/play',
  },
] as const;

export default function PrototypeHub() {
  return (
    <div className="px-6 py-8 max-w-md mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 text-center"
      >
        <h1 className="type-heading text-foreground mb-2">Three Visions</h1>
        <p className="text-sm text-muted leading-relaxed">
          Each strips the product to one emotion.
          <br />
          One verb. One answer to &ldquo;why do I open this?&rdquo;
        </p>
      </motion.div>

      <div className="space-y-4">
        {VISIONS.map((v, i) => (
          <motion.div
            key={v.id}
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + i * 0.1 }}
          >
            <Link href={v.href}>
              <div
                className="p-5 rounded-2xl border transition-all active:scale-[0.98]"
                style={{
                  borderColor: `${v.color}20`,
                  background: `linear-gradient(135deg, ${v.color}08, transparent)`,
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <h2 className="type-subheading text-foreground">{v.title}</h2>
                  <span
                    className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                    style={{ color: v.color, background: `${v.color}15` }}
                  >
                    {v.emotion}
                  </span>
                </div>
                <p className="text-xs text-muted">{v.subtitle}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
