'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { LORE_GRAPH, getLoreNodesBySet, getSecretNodes, type LoreNode } from '@/data/lore-graph';
import { getUnlockedLoreNodes, getCodexCompletionPercent, getOwnedCards } from '@/lib/store';
import { SETS } from '@/data/sets';

type CodexTab = 'all' | 'baker-street' | 'enchanted-kingdom' | 'wonderland' | 'gothic-horror' | 'olympus' | 'asgard' | 'secret';

const TAB_CONFIG: { id: CodexTab; label: string; icon: string }[] = [
  { id: 'all', label: 'All', icon: '📖' },
  { id: 'baker-street', label: 'Baker St.', icon: '🔍' },
  { id: 'enchanted-kingdom', label: 'Enchanted', icon: '👑' },
  { id: 'wonderland', label: 'Wonderland', icon: '🐇' },
  { id: 'gothic-horror', label: 'Gothic', icon: '🦇' },
  { id: 'olympus', label: 'Olympus', icon: '⚡' },
  { id: 'asgard', label: 'Asgard', icon: '❄️' },
  { id: 'secret', label: 'Secrets', icon: '🔮' },
];

interface NodePosition {
  x: number;
  y: number;
  node: LoreNode;
}

export default function CodexPage() {
  const [tab, setTab] = useState<CodexTab>('all');
  const [unlockedIds, setUnlockedIds] = useState<Set<string>>(new Set());
  const [codexPercent, setCodexPercent] = useState(0);
  const [selectedNode, setSelectedNode] = useState<LoreNode | null>(null);
  const [revealedNode, setRevealedNode] = useState<string | null>(null);

  useEffect(() => {
    const ids = getUnlockedLoreNodes();
    setUnlockedIds(new Set(ids));
    setCodexPercent(getCodexCompletionPercent());
  }, []);

  const filteredNodes = useMemo(() => {
    if (tab === 'all') return LORE_GRAPH;
    if (tab === 'secret') return getSecretNodes();
    return getLoreNodesBySet(tab);
  }, [tab]);

  const tabCounts = useMemo(() => {
    const counts: Record<string, { total: number; unlocked: number }> = {};
    counts.all = { total: LORE_GRAPH.length, unlocked: unlockedIds.size };
    counts.secret = { total: getSecretNodes().length, unlocked: getSecretNodes().filter(n => unlockedIds.has(n.id)).length };
    for (const set of SETS) {
      const setNodes = getLoreNodesBySet(set.slug);
      counts[set.slug] = { total: setNodes.length, unlocked: setNodes.filter(n => unlockedIds.has(n.id)).length };
    }
    return counts;
  }, [unlockedIds]);

  // Layout nodes in a graph-like pattern
  const nodePositions = useMemo((): NodePosition[] => {
    const nodes = filteredNodes;
    const positions: NodePosition[] = [];
    const cols = nodes.length <= 7 ? 3 : 4;
    const spacingX = 100 / (cols + 1);
    const spacingY = nodes.length <= 7 ? 140 : 120;

    nodes.forEach((node, i) => {
      const row = Math.floor(i / cols);
      const col = i % cols;
      const offsetX = row % 2 === 1 ? spacingX / 2 : 0;
      positions.push({
        x: spacingX * (col + 1) + offsetX,
        y: 40 + row * spacingY,
        node,
      });
    });

    return positions;
  }, [filteredNodes]);

  const graphHeight = useMemo(() => {
    if (nodePositions.length === 0) return 300;
    const maxY = Math.max(...nodePositions.map(p => p.y));
    return maxY + 120;
  }, [nodePositions]);

  const handleNodeClick = (node: LoreNode) => {
    const isUnlocked = unlockedIds.has(node.id);
    if (isUnlocked && (!revealedNode || revealedNode !== node.id)) {
      setRevealedNode(node.id);
    }
    setSelectedNode(node);
  };

  // Find missing characters for a locked node
  const getMissingCharacters = (node: LoreNode): string[] => {
    const owned = getOwnedCards();
    const ownedChars = new Set(owned.map(c => c.character));
    return node.requiredCharacters.filter(ch => !ownedChars.has(ch));
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="type-heading">Lore Codex</h1>
          <p className="text-xs text-muted">Unlock the hidden stories between the cards</p>
        </div>
        <Link href="/profile" className="text-xs text-muted hover:text-foreground">
          ← Profile
        </Link>
      </div>

      {/* Completion bar */}
      <div className="p-3 rounded-xl bg-surface border border-border mb-4">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs text-muted">Codex Completion</span>
          <span className="text-sm font-bold font-mono text-accent">{codexPercent}%</span>
        </div>
        <div className="h-2 rounded-full bg-border/40 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${codexPercent}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="h-full rounded-full bg-gradient-to-r from-accent to-purple-500"
          />
        </div>
        <div className="flex justify-between mt-1.5">
          <span className="text-[10px] text-muted">{unlockedIds.size} / {LORE_GRAPH.length} nodes unlocked</span>
          {getSecretNodes().filter(n => unlockedIds.has(n.id)).length > 0 && (
            <span className="text-[10px] text-purple-400">
              {getSecretNodes().filter(n => unlockedIds.has(n.id)).length} secrets found
            </span>
          )}
        </div>
      </div>

      {/* Tab switcher */}
      <div className="flex gap-1.5 mb-4 overflow-x-auto no-scrollbar">
        {TAB_CONFIG.map(t => {
          const count = tabCounts[t.id];
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-2.5 py-1.5 rounded-lg text-[10px] font-semibold shrink-0 transition-colors ${
                tab === t.id
                  ? 'bg-accent/20 text-accent border border-accent/30'
                  : 'bg-surface/40 text-muted border border-border/30 hover:text-foreground'
              }`}
            >
              {t.icon} {t.label}
              {count && (
                <span className="ml-1 opacity-60">{count.unlocked}/{count.total}</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Node Graph */}
      <div
        className="relative rounded-xl bg-surface/30 border border-border/40 overflow-hidden"
        style={{ minHeight: graphHeight }}
      >
        {/* Connection lines */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ minHeight: graphHeight }}
        >
          {nodePositions.map(pos => {
            const isUnlocked = unlockedIds.has(pos.node.id);
            return pos.node.connections
              .map(connId => {
                const target = nodePositions.find(p => p.node.id === connId);
                if (!target) return null;
                const targetUnlocked = unlockedIds.has(target.node.id);
                const lineActive = isUnlocked && targetUnlocked;
                return (
                  <line
                    key={`${pos.node.id}-${connId}`}
                    x1={`${pos.x}%`}
                    y1={pos.y + 24}
                    x2={`${target.x}%`}
                    y2={target.y + 24}
                    stroke={lineActive ? '#818cf880' : '#3a3d5c30'}
                    strokeWidth={lineActive ? 1.5 : 0.5}
                    strokeDasharray={lineActive ? 'none' : '4 4'}
                  />
                );
              });
          })}
        </svg>

        {/* Nodes */}
        {nodePositions.map((pos, idx) => {
          const isUnlocked = unlockedIds.has(pos.node.id);
          const isSecret = pos.node.secret;
          const isSelected = selectedNode?.id === pos.node.id;

          return (
            <motion.div
              key={pos.node.id}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.04, type: 'spring', stiffness: 300 }}
              className="absolute"
              style={{
                left: `${pos.x}%`,
                top: pos.y,
                transform: 'translate(-50%, 0)',
              }}
            >
              <button
                onClick={() => handleNodeClick(pos.node)}
                className="group relative flex flex-col items-center gap-1 transition-all cursor-pointer"
              >
                {/* Node circle */}
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg transition-all ${
                    isUnlocked
                      ? isSecret
                        ? 'bg-purple-500/20 border-purple-500/40 shadow-lg shadow-purple-500/10'
                        : 'bg-accent/15 border-accent/30 shadow-lg shadow-accent/10'
                      : 'bg-surface/60 border-border/40'
                  } border`}
                  style={isSelected ? { boxShadow: `0 0 20px ${isSecret ? '#a855f7' : '#818cf8'}40` } : {}}
                >
                  {isUnlocked ? (
                    <span>{pos.node.icon}</span>
                  ) : (
                    <span className="text-muted/40">🔒</span>
                  )}
                </div>

                {/* Node label */}
                <span className={`text-[9px] max-w-[80px] text-center leading-tight ${
                  isUnlocked
                    ? isSecret ? 'text-purple-300 font-semibold' : 'text-foreground/80'
                    : 'text-muted/40'
                }`}>
                  {isUnlocked ? pos.node.title : isSecret ? '???' : pos.node.title}
                </span>

                {/* Unlock glow pulse */}
                {isUnlocked && revealedNode === pos.node.id && (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 1 }}
                    animate={{ scale: 2, opacity: 0 }}
                    transition={{ duration: 1 }}
                    className="absolute inset-0 rounded-xl"
                    style={{ background: isSecret ? '#a855f720' : '#818cf820' }}
                  />
                )}
              </button>
            </motion.div>
          );
        })}
      </div>

      {/* Selected Node Detail */}
      <AnimatePresence mode="wait">
        {selectedNode && unlockedIds.has(selectedNode.id) && (
          <motion.div
            key={selectedNode.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-4 p-4 rounded-xl border"
            style={{
              background: selectedNode.secret
                ? 'linear-gradient(135deg, rgba(168,85,247,0.05), rgba(168,85,247,0.1))'
                : 'linear-gradient(135deg, rgba(129,140,248,0.05), rgba(129,140,248,0.1))',
              borderColor: selectedNode.secret ? '#a855f725' : '#818cf825',
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">{selectedNode.icon}</span>
              <div>
                <h3 className="text-sm font-bold text-foreground">{selectedNode.title}</h3>
                {selectedNode.secret && (
                  <span className="text-[9px] text-purple-400 bg-purple-400/10 px-1.5 py-0.5 rounded font-bold">SECRET THREAD</span>
                )}
              </div>
            </div>
            <p className="text-xs text-muted leading-relaxed mb-3">
              {selectedNode.text}
            </p>
            <div className="flex flex-wrap gap-1">
              {selectedNode.requiredCharacters.map(ch => (
                <span key={ch} className="text-[9px] px-1.5 py-0.5 rounded bg-accent/10 text-accent/80">
                  {ch}
                </span>
              ))}
            </div>
            {selectedNode.connections.length > 0 && (
              <div className="mt-2 pt-2 border-t border-border/20">
                <span className="text-[9px] text-muted">Connected to: </span>
                {selectedNode.connections.map(connId => {
                  const connNode = LORE_GRAPH.find(n => n.id === connId);
                  const connUnlocked = connNode && unlockedIds.has(connId);
                  return connNode ? (
                    <button
                      key={connId}
                      onClick={() => connUnlocked && setSelectedNode(connNode)}
                      className={`text-[9px] mr-1 ${connUnlocked ? 'text-accent hover:underline' : 'text-muted/40'}`}
                    >
                      {connUnlocked ? connNode.title : '???'}
                    </button>
                  ) : null;
                })}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Locked Node Hint */}
      <AnimatePresence mode="wait">
        {selectedNode && !unlockedIds.has(selectedNode.id) && (
          <motion.div
            key={`locked-${selectedNode.id}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-4 p-4 rounded-xl bg-surface/60 border border-border/40"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl opacity-40">🔒</span>
              <h3 className="text-sm font-bold text-muted">Locked Node</h3>
            </div>
            <p className="text-xs text-muted mb-2">Collect these characters to unlock:</p>
            <div className="flex flex-wrap gap-1">
              {getMissingCharacters(selectedNode).map(ch => (
                <span key={ch} className="text-[9px] px-1.5 py-0.5 rounded bg-red-500/10 text-red-400">
                  {ch}
                </span>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Legend */}
      <div className="mt-4 flex items-center gap-4 text-[9px] text-muted">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-accent/15 border border-accent/30" />
          <span>Unlocked</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-surface/60 border border-border/40" />
          <span>Locked</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-purple-500/20 border border-purple-500/40" />
          <span>Secret</span>
        </div>
      </div>
    </div>
  );
}
