import { STAT_LABELS, STAT_COLORS, STAT_ICONS, type StatKey, getScarcityBonus, getParallelBonus } from '@/data/stats';

const STAT_ORDER: StatKey[] = ['power', 'intelligence', 'mystery', 'legend', 'charm'];

export default function BattleSection() {
  return (
    <>
      {/* How Battle Works */}
      <div>
        <h3 className="text-[11px] uppercase tracking-[0.08em] text-muted mb-3">How Battle Works</h3>
        <p className="text-sm text-foreground/80 leading-relaxed">
          Card battles are Top Trumps-style: pick a stat, highest value wins the round. Best of 5
          rounds wins the match. Choose your deck of 5 cards wisely — each character has different
          stat strengths.
        </p>
      </div>

      {/* 5 Stats */}
      <div>
        <h3 className="text-[11px] uppercase tracking-[0.08em] text-muted mb-3">Battle Stats</h3>
        <div className="space-y-2">
          {STAT_ORDER.map((stat, i) => {
            // Representative bar widths showing stat diversity (not random)
            const barWidths = [85, 70, 60, 90, 75];
            return (
              <div key={stat} className="flex items-center gap-3 p-3 rounded-xl bg-surface/60">
                <span className="text-lg w-8 text-center">{STAT_ICONS[stat]}</span>
                <span className="text-sm font-semibold flex-1" style={{ color: STAT_COLORS[stat] }}>
                  {STAT_LABELS[stat]}
                </span>
                <div className="w-20 h-2 rounded-full bg-border/40 overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      backgroundColor: STAT_COLORS[stat],
                      width: `${barWidths[i]}%`,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Scarcity & Parallel Bonuses */}
      <div>
        <h3 className="text-[11px] uppercase tracking-[0.08em] text-muted mb-3">Stat Bonuses</h3>
        <p className="text-sm text-foreground/80 leading-relaxed mb-3">
          Rarer cards get stat bonuses in battle. Scarcity and parallel bonuses stack.
        </p>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-surface/60 p-3">
            <p className="text-[10px] uppercase tracking-[0.08em] text-muted mb-2">Scarcity</p>
            {(['legendary', 'epic', 'rare', 'uncommon', 'common'] as const).map((s) => (
              <div key={s} className="flex justify-between py-1">
                <span className="text-xs text-foreground/70 capitalize">{s}</span>
                <span className="text-xs font-mono text-accent">+{getScarcityBonus(s)}</span>
              </div>
            ))}
          </div>
          <div className="rounded-xl bg-surface/60 p-3">
            <p className="text-[10px] uppercase tracking-[0.08em] text-muted mb-2">Parallel</p>
            {(['obsidian', 'holographic', 'gold', 'silver', 'base'] as const).map((p) => (
              <div key={p} className="flex justify-between py-1">
                <span className="text-xs text-foreground/70 capitalize">{p}</span>
                <span className="text-xs font-mono text-accent">+{getParallelBonus(p)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Trivia */}
      <div>
        <h3 className="text-[11px] uppercase tracking-[0.08em] text-muted mb-3">Lore Trivia</h3>
        <div className="p-4 rounded-xl bg-surface/60 border-l-2 border-red-500">
          <p className="text-sm text-foreground/80 leading-relaxed">
            Test your knowledge of the characters and stories. 15-second timer per question.
            Build streaks for bonus XP — 5 correct in a row triggers a score multiplier.
            Questions get harder as your streak grows.
          </p>
        </div>
      </div>
    </>
  );
}
