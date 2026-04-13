import { SETS } from '@/data/sets';

export default function SetsSection() {
  return (
    <>
      {/* Why Sets Matter */}
      <div>
        <h3 className="text-[11px] uppercase tracking-[0.08em] text-muted mb-3">Why Sets Matter</h3>
        <p className="text-sm text-foreground/80 leading-relaxed">
          Completing a set is the ultimate collector achievement. Each set tells a story —
          owning every character brings that story to life. Complete sets earn massive XP bursts,
          exclusive badges, and bonus packs.
        </p>
      </div>

      {/* Set Directory */}
      <div>
        <h3 className="text-[11px] uppercase tracking-[0.08em] text-muted mb-3">All Sets</h3>
        <div className="space-y-3">
          {SETS.map((set) => (
            <div
              key={set.slug}
              className="rounded-xl overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${set.gradientFrom}, ${set.gradientTo})`,
              }}
            >
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{set.icon}</span>
                  <h4 className="text-sm font-bold text-foreground">{set.name}</h4>
                  <span className="ml-auto text-[10px] font-mono text-foreground/60">
                    {set.cardCount} cards
                  </span>
                </div>
                <p className="text-xs text-foreground/60 leading-relaxed">{set.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Completion Rewards */}
      <div>
        <h3 className="text-[11px] uppercase tracking-[0.08em] text-muted mb-3">Completion Rewards</h3>
        <div className="space-y-2">
          {[
            { milestone: 'First card from a set', reward: '+50 XP set progress bonus' },
            { milestone: '50% complete', reward: 'Set-themed profile badge' },
            { milestone: '100% complete', reward: '+500 XP, exclusive badge, bonus pack' },
            { milestone: 'All sets complete', reward: '"Master Collector" title + legendary pack' },
          ].map((item) => (
            <div key={item.milestone} className="flex items-start gap-3 p-3 rounded-xl bg-surface/60">
              <span className="text-accent text-xs mt-0.5">&#x2713;</span>
              <div>
                <p className="text-sm text-foreground/80">{item.milestone}</p>
                <p className="text-xs text-muted">{item.reward}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
