import { XP_VALUES, getTierForLevel, getXPForLevel } from '@/data/types';

const XP_SOURCES: { source: string; xp: number; note: string }[] = [
  { source: 'Open a pack', xp: XP_VALUES.pack_open, note: 'Per pack' },
  { source: 'Acquire a card', xp: XP_VALUES.card_acquired, note: 'Per card' },
  { source: 'Set progress', xp: XP_VALUES.set_progress, note: 'Per new set milestone' },
  { source: 'Win a battle', xp: XP_VALUES.battle_win, note: 'Per victory' },
  { source: 'Trivia correct', xp: XP_VALUES.trivia_correct, note: 'Per answer' },
  { source: 'Daily login', xp: XP_VALUES.daily_login, note: 'Once per day' },
  { source: 'Streak bonus', xp: XP_VALUES.streak_bonus, note: 'Per consecutive day' },
];

const TIER_THRESHOLDS = [
  { level: 1, tier: 'Newcomer', color: '#6b7094' },
  { level: 6, tier: 'Collector', color: '#22c55e' },
  { level: 16, tier: 'Enthusiast', color: '#3b82f6' },
  { level: 26, tier: 'Connoisseur', color: '#a855f7' },
  { level: 36, tier: 'Elite', color: '#f59e0b' },
  { level: 46, tier: 'Legendary', color: '#ef4444' },
];

export default function RewardsSection() {
  return (
    <>
      {/* XP Sources */}
      <div>
        <h3 className="text-[11px] uppercase tracking-[0.08em] text-muted mb-3">XP Sources</h3>
        <div className="space-y-1.5">
          {XP_SOURCES.map((s) => (
            <div key={s.source} className="flex items-center gap-3 p-2.5 rounded-lg bg-surface/40">
              <span className="text-sm font-mono font-bold text-accent w-8 text-right">+{s.xp}</span>
              <span className="text-sm text-foreground/80 flex-1">{s.source}</span>
              <span className="text-[10px] text-muted">{s.note}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Level Progression */}
      <div>
        <h3 className="text-[11px] uppercase tracking-[0.08em] text-muted mb-3">Collector Levels</h3>
        <p className="text-sm text-foreground/80 leading-relaxed mb-3">
          50 levels across 6 tiers. Each level unlocks features, badges, showcase themes, or card frames.
          XP required accelerates — early levels are fast, later levels reward dedication.
        </p>
        <div className="space-y-2">
          {TIER_THRESHOLDS.map((t, i) => {
            const nextLevel = TIER_THRESHOLDS[i + 1]?.level || 50;
            const xpStart = getXPForLevel(t.level);
            const xpEnd = getXPForLevel(nextLevel);
            return (
              <div key={t.tier} className="flex items-center gap-3 p-3 rounded-xl bg-surface/60">
                <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: t.color }} />
                <div className="flex-1">
                  <span className="text-sm font-semibold" style={{ color: t.color }}>{t.tier}</span>
                  <span className="text-xs text-muted ml-2">Lv. {t.level}-{nextLevel - 1}</span>
                </div>
                <span className="text-[10px] text-muted font-mono">
                  {xpStart.toLocaleString()}-{xpEnd.toLocaleString()} XP
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Battle Pass */}
      <div>
        <h3 className="text-[11px] uppercase tracking-[0.08em] text-muted mb-3">Season Battle Pass</h3>
        <div className="p-4 rounded-xl bg-surface/60 border-l-2 border-green-500">
          <p className="text-sm text-foreground/80 leading-relaxed">
            Each season has a 30-tier track with escalating rewards. Free track gives basic items.
            Premium track unlocks exclusive parallels, frames, and showcase themes. Advance the
            track through daily and weekly missions.
          </p>
        </div>
      </div>
    </>
  );
}
