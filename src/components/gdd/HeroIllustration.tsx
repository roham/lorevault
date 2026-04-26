interface HeroIllustrationProps {
  prompt: string;
}

function pickGradient(prompt: string): string {
  const lower = prompt.toLowerCase();
  if (
    lower.includes('sepia') ||
    lower.includes('amber') ||
    lower.includes('gaslight') ||
    lower.includes('baker street') ||
    lower.includes('holmes') ||
    lower.includes('tobacco')
  ) {
    return 'linear-gradient(160deg, #2a1a08 0%, #4a2e10 35%, #1B1814 70%, #0a0907 100%)';
  }
  if (
    lower.includes('fog') ||
    lower.includes('blue') ||
    lower.includes('pinafore') ||
    lower.includes('alice') ||
    lower.includes('wonderland') ||
    lower.includes('looking-glass') ||
    lower.includes('tenniel')
  ) {
    return 'linear-gradient(160deg, #0a1220 0%, #1F3A6B 35%, #0d2040 70%, #0a0907 100%)';
  }
  if (
    lower.includes('green') ||
    lower.includes('forest') ||
    lower.includes('enchanted') ||
    lower.includes('rackham') ||
    lower.includes('schwarzwald') ||
    lower.includes('grimm') ||
    lower.includes('wolf')
  ) {
    return 'linear-gradient(160deg, #0a120a 0%, #2C3A23 35%, #111a0d 70%, #0a0907 100%)';
  }
  if (
    lower.includes('violet') ||
    lower.includes('purple') ||
    lower.includes('gothic') ||
    lower.includes('dracula') ||
    lower.includes('whitby') ||
    lower.includes('ship-tar') ||
    lower.includes('demeter') ||
    lower.includes('frankenstein') ||
    lower.includes('carmilla') ||
    lower.includes('stoker')
  ) {
    return 'linear-gradient(160deg, #0a0810 0%, #1a1228 35%, #1B1814 70%, #0a0907 100%)';
  }
  if (
    lower.includes('greek') ||
    lower.includes('persephone') ||
    lower.includes('bronze') ||
    lower.includes('olymp') ||
    lower.includes('pomegranate') ||
    lower.includes('chiton') ||
    lower.includes('marble') ||
    lower.includes('bouguereau') ||
    lower.includes('melaina')
  ) {
    return 'linear-gradient(160deg, #1a0a0a 0%, #3B2A4A 35%, #6F4F1F 70%, #0a0907 100%)';
  }
  if (
    lower.includes('pack') ||
    lower.includes('wax') ||
    lower.includes('ladder') ||
    lower.includes('altarpiece') ||
    lower.includes('whistle') ||
    lower.includes('apex')
  ) {
    return 'linear-gradient(160deg, #1a1208 0%, #3a2810 35%, #5A3A8A 70%, #0a0907 100%)';
  }
  if (
    lower.includes('iceberg') ||
    lower.includes('waterline') ||
    lower.includes('sea') ||
    lower.includes('ocean') ||
    lower.includes('seascape')
  ) {
    return 'linear-gradient(180deg, #0a1830 0%, #0d2848 40%, #0a0907 100%)';
  }
  // Default: multi-pane pentagram/cosmographic
  return 'linear-gradient(160deg, #1a1208 0%, #1B1814 30%, #2C3A23 55%, #1F3A6B 80%, #0a0907 100%)';
}

export function HeroIllustration({ prompt }: HeroIllustrationProps) {
  const gradient = pickGradient(prompt);

  return (
    <figure
      className="relative my-10 mx-auto w-full max-w-2xl overflow-hidden rounded-sm"
      style={{ aspectRatio: '2 / 3' }}
      aria-label="Illustration placeholder"
    >
      {/* Gradient background */}
      <div
        className="absolute inset-0"
        style={{ background: gradient }}
      />

      {/* Subtle texture overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            'repeating-linear-gradient(45deg, rgba(255,255,255,0.03) 0 1px, transparent 1px 6px)',
        }}
      />

      {/* Decorative corner ornaments */}
      <div
        className="absolute top-0 left-0 w-12 h-12 opacity-30"
        style={{
          background:
            'radial-gradient(circle at top left, rgba(201,162,107,0.6) 0, transparent 70%)',
        }}
      />
      <div
        className="absolute top-0 right-0 w-12 h-12 opacity-30"
        style={{
          background:
            'radial-gradient(circle at top right, rgba(201,162,107,0.6) 0, transparent 70%)',
        }}
      />
      <div
        className="absolute bottom-0 left-0 w-12 h-12 opacity-30"
        style={{
          background:
            'radial-gradient(circle at bottom left, rgba(201,162,107,0.4) 0, transparent 70%)',
        }}
      />
      <div
        className="absolute bottom-0 right-0 w-12 h-12 opacity-30"
        style={{
          background:
            'radial-gradient(circle at bottom right, rgba(201,162,107,0.4) 0, transparent 70%)',
        }}
      />

      {/* Placeholder label — top right */}
      <div
        className="absolute top-3 right-3 px-2 py-0.5 text-xs tracking-widest uppercase opacity-50"
        style={{
          fontFamily: 'var(--font-baker-street), serif',
          color: '#C9A26B',
          border: '1px solid rgba(201,162,107,0.3)',
          background: 'rgba(10,9,7,0.6)',
        }}
      >
        Illustration Placeholder
      </div>

      {/* Caption / prompt text */}
      <div className="absolute inset-x-6 bottom-6 top-12 flex items-end">
        <figcaption
          className="text-xs leading-relaxed opacity-60 italic"
          style={{
            fontFamily: 'var(--font-pullquote), Georgia, serif',
            color: '#C9A26B',
            display: '-webkit-box',
            WebkitLineClamp: 8,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {prompt}
        </figcaption>
      </div>

      {/* Lampblack center haze */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 40% at 50% 45%, rgba(27,24,20,0.15) 0%, transparent 100%)',
        }}
      />
    </figure>
  );
}
