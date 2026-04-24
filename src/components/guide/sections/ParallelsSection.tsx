import { PARALLEL_CONFIG, type Parallel } from '@/data/types';
import { getParallelBonus } from '@/data/stats';

const PARALLEL_ORDER: Parallel[] = ['base', 'silver', 'gold', 'holographic', 'obsidian'];

const PARALLEL_DESCRIPTIONS: Record<Parallel, string> = {
  base: 'Standard edition. Clean artwork, no effects. The foundation of every collection.',
  silver: 'Subtle metallic shimmer across the card frame. A step above base.',
  gold: 'Warm golden glow radiating from the frame. Unmistakable premium feel.',
  holographic: 'Rainbow prismatic effect that shifts with viewing angle. Eye-catching and rare.',
  obsidian: 'Deep void-black with iridescent edges. The rarest and most coveted variant.',
};

const PARALLEL_COLORS: Record<Parallel, string> = {
  base: '#6b7094',
  silver: '#C0C0C0',
  gold: '#FFD700',
  holographic: '#ff6ec7',
  obsidian: '#1a1a2e',
};

export default function ParallelsSection() {
  return (
    <>
      {/* Overview */}
      <div>
        <h3 className="text-[11px] uppercase tracking-[0.08em] text-muted mb-3">Understanding Parallels</h3>
        <p className="text-sm text-foreground/80 leading-relaxed">
          Parallels are visual variants of the same card. Every character has a base version and
          four increasingly rare parallel editions. Higher parallels have distinct visual effects
          and grant stat bonuses in battle.
        </p>
      </div>

      {/* Visual Guide */}
      <div>
        <h3 className="text-[11px] uppercase tracking-[0.08em] text-muted mb-3">Visual Guide</h3>
        <div className="space-y-3">
          {PARALLEL_ORDER.map((p) => {
            const cfg = PARALLEL_CONFIG[p];
            const bonus = getParallelBonus(p);
            const color = PARALLEL_COLORS[p];
            return (
              <div key={p} className="rounded-xl bg-surface/60 overflow-hidden">
                <div className="flex items-center gap-3 p-3">
                  <div
                    className="w-10 h-14 rounded-lg border shrink-0 flex items-center justify-center"
                    style={{
                      borderColor: `${color}60`,
                      background: p === 'obsidian'
                        ? 'linear-gradient(135deg, #0a0a1a, #1a1a3e)'
                        : p === 'holographic'
                          ? 'linear-gradient(135deg, #ff6ec7, #7c3aed, #3b82f6, #22c55e)'
                          : p === 'gold'
                            ? 'linear-gradient(135deg, #ffd700, #b8860b)'
                            : p === 'silver'
                              ? 'linear-gradient(135deg, #e0e0e0, #808080)'
                              : '#1a1d2e',
                    }}
                  >
                    <span className="text-[10px] font-mono text-white/60">{cfg.effect === 'none' ? 'STD' : cfg.effect.slice(0, 3).toUpperCase()}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold" style={{ color }}>{cfg.label}</span>
                      {bonus > 0 && (
                        <span className="text-[10px] font-mono text-accent bg-accent/10 px-1.5 py-0.5 rounded">
                          +{bonus} stats
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-foreground/60 mt-0.5 leading-relaxed">
                      {PARALLEL_DESCRIPTIONS[p]}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Rarity Math */}
      <div className="p-4 rounded-xl bg-surface/60 border-l-2" style={{ borderColor: '#ff6ec7' }}>
        <p className="text-sm text-foreground/80 leading-relaxed">
          <strong className="text-holographic">Rarity stacks.</strong> A Legendary Obsidian card is
          the rarest possible combination — scarcity bonus (+8) plus parallel bonus (+5) gives +13
          to every stat. There are only 10 of each Legendary, and Obsidian is the rarest pull.
        </p>
      </div>
    </>
  );
}
