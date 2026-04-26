interface ScreenshotSlotProps {
  route: string;
}

export function ScreenshotSlot({ route }: ScreenshotSlotProps) {
  return (
    <figure
      className="my-8 mx-auto w-full overflow-hidden rounded-sm"
      aria-label={`Screenshot placeholder for ${route}`}
      style={{
        border: '1px solid rgba(201,162,107,0.2)',
        background: 'rgba(20,17,13,0.6)',
      }}
    >
      <div
        className="flex items-center justify-center"
        style={{ minHeight: '160px', padding: '2rem' }}
      >
        <div className="text-center">
          <div
            className="text-xs tracking-widest uppercase mb-2 opacity-40"
            style={{
              fontFamily: 'var(--font-baker-street), serif',
              color: '#C9A26B',
            }}
          >
            Screenshot Placeholder
          </div>
          <div
            className="font-mono text-sm opacity-60"
            style={{ color: '#6B8FA8', fontFamily: 'monospace' }}
          >
            {route}
          </div>
        </div>
      </div>
      <figcaption
        className="px-4 py-2 text-xs opacity-40 border-t"
        style={{
          fontFamily: 'var(--font-baker-street), serif',
          color: '#C9A26B',
          borderColor: 'rgba(201,162,107,0.15)',
        }}
      >
        {route}
      </figcaption>
    </figure>
  );
}
