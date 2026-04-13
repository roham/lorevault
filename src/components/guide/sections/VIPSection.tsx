const VIP_TIERS = [
  {
    name: 'Bronze',
    color: '#CD7F32',
    xp: '0-499',
    benefits: ['1 free pack/week', 'Base rewards'],
  },
  {
    name: 'Silver',
    color: '#C0C0C0',
    xp: '500-1,499',
    benefits: ['2 free packs/week', '5% marketplace rebate', '15 min early access'],
  },
  {
    name: 'Gold',
    color: '#FFD700',
    xp: '1,500-3,999',
    benefits: ['3 free packs/week', '10% rebate', '30 min early access', 'Gold card frame'],
  },
  {
    name: 'Platinum',
    color: '#E5E4E2',
    xp: '4,000-9,999',
    benefits: ['5 free packs/week', '15% rebate', '1 hour early access', 'Exclusive showcase theme', 'Priority support'],
  },
  {
    name: 'Diamond',
    color: '#B9F2FF',
    xp: '10,000+',
    benefits: ['Daily free pack', '20% rebate', 'First access to all drops', 'Obsidian parallel variants', 'Diamond profile badge'],
  },
];

export default function VIPSection() {
  return (
    <>
      <div>
        <h3 className="text-[11px] uppercase tracking-[0.08em] text-muted mb-3">How VIP Works</h3>
        <p className="text-sm text-foreground/80 leading-relaxed">
          Your VIP tier is based on XP earned each month. Higher tiers unlock better rewards,
          marketplace rebates, and exclusive content. Maintain your XP to keep your tier —
          tiers reset monthly.
        </p>
      </div>

      <div className="space-y-3">
        {VIP_TIERS.map((tier) => (
          <div key={tier.name} className="rounded-xl bg-surface/60 overflow-hidden">
            <div className="flex items-center gap-3 p-3 border-b border-border/20">
              <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: tier.color }} />
              <span className="text-sm font-bold" style={{ color: tier.color }}>{tier.name}</span>
              <span className="ml-auto text-xs text-muted font-mono">{tier.xp} XP/mo</span>
            </div>
            <div className="px-3 py-2.5">
              {tier.benefits.map((b, i) => (
                <div key={i} className="flex items-start gap-2 py-1">
                  <span className="text-[10px] mt-0.5" style={{ color: tier.color }}>+</span>
                  <span className="text-xs text-foreground/70">{b}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 rounded-xl bg-surface/60 border-l-2" style={{ borderColor: '#ffd700' }}>
        <p className="text-sm text-foreground/80 leading-relaxed">
          <strong className="text-legendary">Tip:</strong> Opening packs and winning battles are
          the fastest XP sources. A daily routine of 1 pack + 2 battles earns ~110 XP/day — enough
          for Gold tier by mid-month.
        </p>
      </div>
    </>
  );
}
