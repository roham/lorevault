import { SCARCITY_CONFIG, type Scarcity } from '@/data/types';

const SCARCITY_ORDER: Scarcity[] = ['common', 'uncommon', 'rare', 'epic', 'legendary'];

export default function MarketplaceSection() {
  return (
    <>
      {/* How Prices Work */}
      <div>
        <h3 className="text-[11px] uppercase tracking-[0.08em] text-muted mb-3">How Prices Work</h3>
        <p className="text-sm text-foreground/80 leading-relaxed">
          Card prices are driven by scarcity, demand, and serial number. Lower serial numbers
          command premiums. Prices fluctuate based on market activity — buy low during quiet
          periods, sell during hype.
        </p>
      </div>

      {/* Price Ranges by Scarcity */}
      <div>
        <h3 className="text-[11px] uppercase tracking-[0.08em] text-muted mb-3">Typical Price Ranges</h3>
        <div className="space-y-2">
          {SCARCITY_ORDER.map((s) => {
            const cfg = SCARCITY_CONFIG[s];
            const ranges: Record<string, string> = {
              common: '$1 - $5',
              uncommon: '$5 - $15',
              rare: '$15 - $50',
              epic: '$50 - $150',
              legendary: '$100 - $500+',
            };
            return (
              <div key={s} className="flex items-center gap-3 p-3 rounded-xl bg-surface/60">
                <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: cfg.color }} />
                <span className="text-sm font-semibold flex-1" style={{ color: cfg.color }}>{cfg.label}</span>
                <span className="text-xs font-mono text-foreground/70">{ranges[s]}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Key Concepts */}
      <div>
        <h3 className="text-[11px] uppercase tracking-[0.08em] text-muted mb-3">Key Concepts</h3>
        <div className="space-y-3">
          <div className="p-4 rounded-xl bg-surface/60 border-l-2 border-blue-500">
            <p className="text-sm font-semibold text-blue-400 mb-1">Floor Price</p>
            <p className="text-xs text-foreground/70">The lowest listed price for any serial of a specific card. The baseline for market value.</p>
          </div>
          <div className="p-4 rounded-xl bg-surface/60 border-l-2 border-blue-500">
            <p className="text-sm font-semibold text-blue-400 mb-1">Movers</p>
            <p className="text-xs text-foreground/70">Cards with the biggest 24h price changes. Gainers signal demand surges. Losers may be buying opportunities.</p>
          </div>
          <div className="p-4 rounded-xl bg-surface/60 border-l-2 border-blue-500">
            <p className="text-sm font-semibold text-blue-400 mb-1">Watchlist</p>
            <p className="text-xs text-foreground/70">Track cards you want. Get notified when prices drop below your target or when new listings appear.</p>
          </div>
        </div>
      </div>

      {/* Strategy Tip */}
      <div className="p-4 rounded-xl bg-surface/60 border-l-2 border-green-500">
        <p className="text-sm text-foreground/80 leading-relaxed">
          <strong className="text-green-400">Strategy:</strong> Complete sets by buying the cheapest
          missing cards first. Set completion bonuses often exceed the total cost of the remaining
          cards — filling gaps is almost always profitable.
        </p>
      </div>
    </>
  );
}
