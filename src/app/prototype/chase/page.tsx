'use client';

import { motion } from 'framer-motion';

export default function ChasePrototype() {
  return (
    <div className="px-6 py-8 max-w-md mx-auto text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-4xl mb-4">🎯</div>
        <h1 className="type-heading text-foreground mb-3">Chase the Set</h1>
        <p className="text-sm text-muted leading-relaxed mb-6">
          See what you&apos;re missing. Feel the gap. Fill the gap.
        </p>
        <p className="text-xs text-muted/50">
          Prototype building in Phase 3...
        </p>
      </motion.div>
    </div>
  );
}
