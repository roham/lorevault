'use client';

import { useEffect, useRef, memo, type ReactNode } from 'react';

interface ScreenShakeProps {
  trigger: boolean;
  intensity?: 'light' | 'medium' | 'heavy';
  children: ReactNode;
}

const SHAKE_STYLES = `
@keyframes shake-light {
  0%, 100% { transform: translate3d(0, 0, 0); }
  20% { transform: translate3d(-3px, 2px, 0); }
  40% { transform: translate3d(3px, -2px, 0); }
  60% { transform: translate3d(-2px, 1px, 0); }
  80% { transform: translate3d(2px, -1px, 0); }
}
@keyframes shake-medium {
  0%, 100% { transform: translate3d(0, 0, 0); }
  15% { transform: translate3d(-6px, 3px, 0); }
  30% { transform: translate3d(6px, -3px, 0); }
  45% { transform: translate3d(-4px, 4px, 0); }
  60% { transform: translate3d(4px, -2px, 0); }
  75% { transform: translate3d(-2px, 2px, 0); }
}
@keyframes shake-heavy {
  0%, 100% { transform: translate3d(0, 0, 0); }
  10% { transform: translate3d(-10px, 5px, 0); }
  20% { transform: translate3d(10px, -5px, 0); }
  30% { transform: translate3d(-8px, 6px, 0); }
  40% { transform: translate3d(8px, -4px, 0); }
  50% { transform: translate3d(-6px, 4px, 0); }
  60% { transform: translate3d(6px, -3px, 0); }
  70% { transform: translate3d(-4px, 3px, 0); }
  80% { transform: translate3d(3px, -2px, 0); }
}
`;

const DURATIONS = {
  light: '0.3s',
  medium: '0.4s',
  heavy: '0.5s',
};

function ScreenShakeInner({ trigger, intensity = 'medium', children }: ScreenShakeProps) {
  const ref = useRef<HTMLDivElement>(null);
  const injected = useRef(false);

  // Inject keyframes once
  useEffect(() => {
    if (injected.current) return;
    const style = document.createElement('style');
    style.textContent = SHAKE_STYLES;
    document.head.appendChild(style);
    injected.current = true;
  }, []);

  useEffect(() => {
    if (!trigger || !ref.current) return;
    const el = ref.current;
    el.style.willChange = 'transform';
    el.style.animation = `shake-${intensity} ${DURATIONS[intensity]} cubic-bezier(.36,.07,.19,.97) both`;

    const cleanup = () => {
      el.style.animation = '';
      el.style.willChange = 'auto';
    };

    el.addEventListener('animationend', cleanup, { once: true });
    return () => {
      el.removeEventListener('animationend', cleanup);
      cleanup();
    };
  }, [trigger, intensity]);

  return (
    <div ref={ref}>
      {children}
    </div>
  );
}

export const ScreenShake = memo(ScreenShakeInner);
