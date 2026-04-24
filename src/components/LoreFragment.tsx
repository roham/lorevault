'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { getLoreNodesForCard } from '@/lib/store';
import type { LoreNode } from '@/data/lore-graph';
import { getUnlockedLoreNodes } from '@/lib/store';

interface LoreFragmentProps {
  character: string;
}

export default function LoreFragment({ character }: LoreFragmentProps) {
  const [nodes, setNodes] = useState<LoreNode[]>([]);
  const [unlockedIds, setUnlockedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const related = getLoreNodesForCard(character);
    setNodes(related);
    setUnlockedIds(new Set(getUnlockedLoreNodes()));
  }, [character]);

  if (nodes.length === 0) return null;

  const unlockedNodes = nodes.filter(n => unlockedIds.has(n.id));
  const lockedNodes = nodes.filter(n => !unlockedIds.has(n.id));

  return (
    <div className="mt-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs font-bold text-foreground">Lore Threads</span>
        <span className="text-[9px] text-muted">{unlockedNodes.length}/{nodes.length} unlocked</span>
      </div>

      <div className="space-y-2">
        {unlockedNodes.map(node => (
          <motion.div
            key={node.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Link
              href="/codex"
              className="block p-3 rounded-xl border transition-all hover:border-accent/30"
              style={{
                background: node.secret
                  ? 'linear-gradient(135deg, rgba(168,85,247,0.05), rgba(168,85,247,0.08))'
                  : 'linear-gradient(135deg, rgba(129,140,248,0.05), rgba(129,140,248,0.08))',
                borderColor: node.secret ? '#a855f720' : '#818cf820',
              }}
            >
              <div className="flex items-center gap-2">
                <span className="text-sm">{node.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-foreground truncate">{node.title}</span>
                    {node.secret && (
                      <span className="text-[7px] text-purple-400 bg-purple-400/10 px-1 py-0.5 rounded font-bold shrink-0">SECRET</span>
                    )}
                  </div>
                  <p className="text-[10px] text-muted line-clamp-1">{node.text}</p>
                </div>
                <span className="text-[9px] text-accent shrink-0">View →</span>
              </div>
            </Link>
          </motion.div>
        ))}

        {lockedNodes.map(node => (
          <div
            key={node.id}
            className="p-3 rounded-xl bg-surface/30 border border-border/20"
          >
            <div className="flex items-center gap-2">
              <span className="text-sm opacity-30">🔒</span>
              <div className="flex-1">
                <span className="text-xs text-muted/50">{node.secret ? 'Secret Thread' : 'Locked Lore'}</span>
                <p className="text-[10px] text-muted/30">Collect more characters to unlock</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
