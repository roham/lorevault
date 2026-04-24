'use client';

import { memo, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ParticleBurstProps {
  active: boolean;
  count?: number;
  color?: 'gold' | 'red' | 'green';
}

const COLOR_MAP = {
  gold: ['bg-amber-400', 'bg-yellow-300', 'bg-orange-400'],
  red: ['bg-red-400', 'bg-red-500', 'bg-orange-500'],
  green: ['bg-emerald-400', 'bg-green-400', 'bg-teal-400'],
};

function ParticleBurstInner({ active, count = 18, color = 'gold' }: ParticleBurstProps) {
  const particles = useMemo(() => {
    const colors = COLOR_MAP[color];
    return Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * 360 + (Math.random() * 20 - 10);
      const dist = 50 + Math.random() * 90;
      const x = Math.cos((angle * Math.PI) / 180) * dist;
      const y = Math.sin((angle * Math.PI) / 180) * dist;
      const size = 3 + Math.random() * 5;
      const colorClass = colors[i % colors.length];
      const delay = Math.random() * 0.1;
      return { x, y, size, colorClass, delay, id: i };
    });
  }, [count, color]);

  return (
    <AnimatePresence>
      {active && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden z-20">
          {particles.map((p) => (
            <motion.div
              key={p.id}
              className={`absolute left-1/2 top-1/2 rounded-full ${p.colorClass}`}
              style={{ width: p.size, height: p.size }}
              initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
              animate={{ x: p.x, y: p.y, opacity: 0, scale: 0.2 }}
              exit={{ opacity: 0 }}
              transition={{
                type: 'spring',
                stiffness: 100 + Math.random() * 60,
                damping: 12,
                delay: p.delay,
              }}
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  );
}

export const ParticleBurst = memo(ParticleBurstInner);
