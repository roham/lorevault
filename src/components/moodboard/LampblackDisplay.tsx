interface LampblackData {
  gesture: string;
  cosmological_relation: string;
  wound: string;
  forbidden_act: string;
  role: string;
  silhouette: string;
  prop: string;
}

interface LampblackDisplayProps {
  lampblack: LampblackData;
}

const LAYERS: { key: keyof LampblackData; label: string }[] = [
  { key: 'gesture',              label: 'Gesture' },
  { key: 'cosmological_relation', label: 'Cosmological Relation' },
  { key: 'wound',                label: 'Wound' },
  { key: 'forbidden_act',        label: 'Forbidden Act' },
  { key: 'role',                 label: 'Role' },
  { key: 'silhouette',           label: 'Silhouette' },
  { key: 'prop',                 label: 'Prop' },
];

export function LampblackDisplay({ lampblack }: LampblackDisplayProps) {
  return (
    <div className="border border-zinc-800 rounded bg-zinc-900/40">
      <div className="px-4 py-3 border-b border-zinc-800">
        <span className="text-amber-400 uppercase tracking-widest text-xs">
          Lampblack residue · gesture-first hierarchy
        </span>
      </div>

      {/* Gesture as featured pull */}
      <div className="px-4 py-4 border-b border-zinc-800">
        <span className="block text-zinc-500 uppercase tracking-widest text-[0.6rem] mb-1">
          Gesture
        </span>
        <p className="italic text-zinc-100 text-lg leading-snug border-l-2 border-amber-500 pl-3">
          {lampblack.gesture}
        </p>
      </div>

      {/* Remaining layers */}
      <div>
        {LAYERS.slice(1).map(({ key, label }, i) => {
          const opacity = Math.max(0.45, 1 - (i + 1) * 0.09);
          return (
            <div
              key={key}
              className="grid grid-cols-[minmax(9rem,30%)_1fr] gap-3 px-4 py-3 border-b border-zinc-800/60 last:border-b-0 items-baseline"
              style={{ opacity }}
            >
              <span className="text-zinc-500 uppercase tracking-widest text-[0.55rem]">
                {label}
              </span>
              <p className="text-zinc-300 text-sm leading-relaxed m-0">
                {lampblack[key]}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
