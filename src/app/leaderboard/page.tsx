'use client';

import { motion } from 'framer-motion';
import { SCARCITY_CONFIG, Scarcity } from '@/data/types';

// Mock leaderboard data
const COLLECTORS = [
  { rank: 1, username: 'MythKeeper', score: 12450, legendary: 18, sets: 5, badge: '👑' },
  { rank: 2, username: 'LoreHunter99', score: 10890, legendary: 15, sets: 5, badge: '🥈' },
  { rank: 3, username: 'DarkArchive', score: 9340, legendary: 12, sets: 5, badge: '🥉' },
  { rank: 4, username: 'BookWyrm', score: 8100, legendary: 11, sets: 4, badge: '' },
  { rank: 5, username: 'FableFinder', score: 7650, legendary: 9, sets: 5, badge: '' },
  { rank: 6, username: 'GrimTales', score: 6230, legendary: 8, sets: 4, badge: '' },
  { rank: 7, username: 'QuantumQuill', score: 5890, legendary: 7, sets: 5, badge: '' },
  { rank: 8, username: 'EpicCollector', score: 5120, legendary: 6, sets: 4, badge: '' },
  { rank: 9, username: 'ShadowScribe', score: 4780, legendary: 5, sets: 3, badge: '' },
  { rank: 10, username: 'OlympianAce', score: 4200, legendary: 5, sets: 4, badge: '' },
  { rank: 42, username: 'LoreMaster_42', score: 2847, legendary: 4, sets: 5, badge: '📍', isYou: true },
];

const SET_LEADERS = [
  { set: 'Baker Street Files', icon: '🔍', leader: 'MythKeeper', completion: '100%', cards: 20 },
  { set: 'The Enchanted Kingdom', icon: '👑', leader: 'LoreHunter99', completion: '95%', cards: 19 },
  { set: 'Wonderland Descending', icon: '🐇', leader: 'DarkArchive', completion: '100%', cards: 20 },
  { set: 'The Castle of Otranto', icon: '🦇', leader: 'BookWyrm', completion: '90%', cards: 18 },
  { set: 'Olympus Rising', icon: '⚡', leader: 'OlympianAce', completion: '100%', cards: 20 },
];

export default function LeaderboardPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
      <h1 className="text-2xl font-bold mb-1">Leaderboards</h1>
      <p className="text-sm text-muted mb-8">See how you stack up against other collectors.</p>

      {/* Top Collectors */}
      <section className="mb-10">
        <h2 className="text-lg font-bold mb-4">Top Collectors by Score</h2>
        <div className="rounded-xl border border-border overflow-hidden">
          {/* Header */}
          <div className="grid grid-cols-[60px_1fr_100px_80px_60px] gap-2 px-4 py-2 bg-surface text-xs text-muted font-medium border-b border-border">
            <span>Rank</span>
            <span>Collector</span>
            <span className="text-right">Score</span>
            <span className="text-right">Legendary</span>
            <span className="text-right">Sets</span>
          </div>

          {/* Rows */}
          {COLLECTORS.map((collector, i) => (
            <motion.div
              key={collector.rank}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04, duration: 0.3 }}
              className={`grid grid-cols-[60px_1fr_100px_80px_60px] gap-2 px-4 py-3 items-center border-b border-border/50 last:border-0 ${
                collector.isYou
                  ? 'bg-accent/5 border-l-2 border-l-accent'
                  : collector.rank <= 3
                    ? 'bg-surface/50'
                    : 'hover:bg-surface/30'
              }`}
            >
              <span className="text-sm font-mono">
                {collector.badge || `#${collector.rank}`}
              </span>
              <span className={`text-sm font-medium ${collector.isYou ? 'text-accent' : ''}`}>
                {collector.username}
                {collector.isYou && <span className="text-xs text-accent/60 ml-1">(you)</span>}
              </span>
              <span className="text-sm font-mono text-right text-accent font-bold">
                {collector.score.toLocaleString()}
              </span>
              <span className="text-sm font-mono text-right" style={{ color: SCARCITY_CONFIG.legendary.color }}>
                {collector.legendary}
              </span>
              <span className="text-sm font-mono text-right text-muted">
                {collector.sets}/5
              </span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Set Completion Leaders */}
      <section className="mb-10">
        <h2 className="text-lg font-bold mb-4">Set Completion Leaders</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {SET_LEADERS.map((set, i) => (
            <motion.div
              key={set.set}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="p-4 rounded-xl bg-surface border border-border"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{set.icon}</span>
                <div>
                  <div className="text-sm font-semibold">{set.set}</div>
                  <div className="text-xs text-muted">Leader: {set.leader}</div>
                </div>
                <div className="ml-auto text-right">
                  <div className="text-sm font-bold text-accent">{set.completion}</div>
                  <div className="text-[10px] text-muted">{set.cards}/20 cards</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Rarest Owned */}
      <section>
        <h2 className="text-lg font-bold mb-4">Rarest Cards in Circulation</h2>
        <div className="space-y-2">
          {[
            { name: 'Count Dracula — The Castle at Night', parallel: 'Obsidian', serial: '#1/1', owner: 'MythKeeper' },
            { name: 'Zeus — Wielding the Thunderbolt', parallel: 'Obsidian', serial: '#1/1', owner: 'DarkArchive' },
            { name: 'Sherlock Holmes — The Reichenbach Falls', parallel: 'Obsidian', serial: '#1/1', owner: 'MythKeeper' },
            { name: 'The Evil Queen — Before the Magic Mirror', parallel: 'Holographic', serial: '#1/10', owner: 'LoreHunter99' },
            { name: 'Achilles — At the Gates of Troy', parallel: 'Gold', serial: '#1/50', owner: 'OlympianAce' },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              className="flex items-center justify-between p-3 rounded-lg bg-surface border border-border"
            >
              <div>
                <div className="text-sm font-medium">{item.name}</div>
                <div className="text-xs text-muted">{item.parallel} • {item.serial}</div>
              </div>
              <div className="text-xs text-accent">{item.owner}</div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
