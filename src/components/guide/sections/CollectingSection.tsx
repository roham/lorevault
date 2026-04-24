import { SCARCITY_CONFIG, PARALLEL_CONFIG, type Scarcity } from '@/data/types';

const SCARCITY_ORDER: Scarcity[] = ['common', 'uncommon', 'rare', 'epic', 'legendary'];

export default function CollectingSection() {
  return (
    <>
      {/* How Packs Work */}
      <div>
        <h3 className="text-[11px] uppercase tracking-[0.08em] text-muted mb-3">How Packs Work</h3>
        <p className="text-sm text-foreground/80 leading-relaxed">
          Every pack contains 5 cards. Tap <strong>Open Packs</strong> to reveal them one by one.
          Each card has a scarcity tier and parallel variant — rarer combinations are harder to pull.
          You earn pack credits through daily logins, level-ups, and completing challenges.
        </p>
      </div>

      {/* Scarcity Tiers */}
      <div>
        <h3 className="text-[11px] uppercase tracking-[0.08em] text-muted mb-3">Scarcity Tiers</h3>
        <div className="space-y-2">
          {SCARCITY_ORDER.map((s) => {
            const cfg = SCARCITY_CONFIG[s];
            return (
              <div key={s} className="flex items-center gap-3 p-3 rounded-xl bg-surface/60">
                <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: cfg.color }} />
                <div className="flex-1">
                  <span className="text-sm font-semibold" style={{ color: cfg.color }}>{cfg.label}</span>
                </div>
                <span className="text-xs text-muted font-mono">
                  {cfg.maxSerial === 9999 ? '10,000' : cfg.maxSerial.toLocaleString()} minted
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Parallels */}
      <div>
        <h3 className="text-[11px] uppercase tracking-[0.08em] text-muted mb-3">Parallel Variants</h3>
        <p className="text-sm text-foreground/80 leading-relaxed mb-3">
          Every card exists in multiple parallel versions. Higher parallels have distinct visual
          effects and provide stat bonuses in battle.
        </p>
        <div className="grid grid-cols-5 gap-2">
          {(Object.keys(PARALLEL_CONFIG) as Array<keyof typeof PARALLEL_CONFIG>).map((p) => {
            const cfg = PARALLEL_CONFIG[p];
            const colors: Record<string, string> = {
              base: '#1a1d2e',
              silver: 'linear-gradient(135deg, #e0e0e0, #808080)',
              gold: 'linear-gradient(135deg, #ffd700, #b8860b)',
              holographic: 'linear-gradient(135deg, #ff6ec7, #7c3aed, #3b82f6)',
              obsidian: 'linear-gradient(135deg, #0a0a1a, #1a1a3e)',
            };
            const bg = colors[p] || '#1a1d2e';
            return (
              <div key={p} className="text-center">
                <div
                  className="w-full aspect-square rounded-lg border border-border/40 flex items-center justify-center"
                  style={{ background: bg }}
                />
                <span className="text-[10px] text-muted mt-1 block">{cfg.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Serial Numbers */}
      <div>
        <h3 className="text-[11px] uppercase tracking-[0.08em] text-muted mb-3">Serial Numbers</h3>
        <div className="p-4 rounded-xl bg-surface/60 border-l-2 border-accent">
          <p className="text-sm text-foreground/80 leading-relaxed">
            Every card has a unique serial number. <span className="font-mono text-accent">#007/250</span> means
            this is the 7th of 250 minted. Lower serial numbers are more collectible —
            <span className="font-mono text-legendary"> #001</span> is the rarest.
          </p>
        </div>
      </div>
    </>
  );
}
