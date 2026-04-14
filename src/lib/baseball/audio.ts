// Public Domain Baseball — Synthesized Audio Engine
// Zero-dependency Web Audio API sound system.
// All sounds generated via oscillators + noise — no audio files needed.
//
// Usage:
//   import { gameAudio } from '@/lib/baseball/audio';
//   gameAudio.play('bat_crack');
//   gameAudio.setMuted(true);

import { SoundCueType } from './stadium-themes';

// ===== Audio Context Singleton =====

let ctx: AudioContext | null = null;

function getContext(): AudioContext {
  if (!ctx) {
    ctx = new AudioContext();
  }
  // Resume if suspended (autoplay policy)
  if (ctx.state === 'suspended') {
    ctx.resume();
  }
  return ctx;
}

// ===== Mute State =====

const MUTE_KEY = 'pdb-audio-muted';

function loadMuted(): boolean {
  try {
    return localStorage.getItem(MUTE_KEY) === 'true';
  } catch {
    return false;
  }
}

let _muted = typeof window !== 'undefined' ? loadMuted() : false;
const _listeners: Set<(muted: boolean) => void> = new Set();

// ===== Core Synthesis Helpers =====

/** Create a gain node with attack-decay envelope. */
function createEnvelope(
  audioCtx: AudioContext,
  attack: number,
  decay: number,
  sustain: number,
  release: number,
  peakGain: number,
): GainNode {
  const now = audioCtx.currentTime;
  const gain = audioCtx.createGain();
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(peakGain, now + attack);
  gain.gain.linearRampToValueAtTime(peakGain * sustain, now + attack + decay);
  gain.gain.linearRampToValueAtTime(0, now + attack + decay + release);
  return gain;
}

/** White noise buffer for percussive/crowd sounds. */
function createNoiseBuffer(audioCtx: AudioContext, duration: number): AudioBuffer {
  const sampleRate = audioCtx.sampleRate;
  const length = sampleRate * duration;
  const buffer = audioCtx.createBuffer(1, length, sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  return buffer;
}

/** Play a noise burst with bandpass filter. */
function playNoiseBurst(
  audioCtx: AudioContext,
  freq: number,
  q: number,
  duration: number,
  gain: number,
  dest: AudioNode,
): void {
  const noise = audioCtx.createBufferSource();
  noise.buffer = createNoiseBuffer(audioCtx, duration);

  const filter = audioCtx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.value = freq;
  filter.Q.value = q;

  const env = createEnvelope(audioCtx, 0.005, duration * 0.3, 0.2, duration * 0.6, gain);

  noise.connect(filter);
  filter.connect(env);
  env.connect(dest);
  noise.start();
}

/** Play a tone with envelope. */
function playTone(
  audioCtx: AudioContext,
  freq: number,
  type: OscillatorType,
  duration: number,
  gain: number,
  dest: AudioNode,
  detune?: number,
): void {
  const osc = audioCtx.createOscillator();
  osc.type = type;
  osc.frequency.value = freq;
  if (detune) osc.detune.value = detune;

  const env = createEnvelope(audioCtx, 0.005, duration * 0.3, 0.3, duration * 0.5, gain);

  osc.connect(env);
  env.connect(dest);
  osc.start();
  osc.stop(audioCtx.currentTime + duration + 0.1);
}

// ===== Sound Definitions =====

type SoundFn = (audioCtx: AudioContext, dest: AudioNode) => void;

const sounds: Record<SoundCueType, SoundFn> = {
  // Bat crack: sharp transient with frequency sweep + noise burst
  bat_crack: (audioCtx, dest) => {
    const now = audioCtx.currentTime;
    // Noise burst at 2kHz bandpass for "crack" texture
    playNoiseBurst(audioCtx, 2000, 1.5, 0.04, 0.5, dest);
    // Square wave sweep 800→200Hz in 80ms for body
    const osc = audioCtx.createOscillator();
    osc.type = 'square';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.linearRampToValueAtTime(200, now + 0.08);
    const env = createEnvelope(audioCtx, 0.002, 0.08, 0, 0.01, 0.3);
    osc.connect(env);
    env.connect(dest);
    osc.start();
    osc.stop(now + 0.1);
    // Low body thud
    playTone(audioCtx, 120, 'sine', 0.06, 0.2, dest);
  },

  // Crowd roar: layered noise at mid-frequency, long sustain
  crowd_roar: (audioCtx, dest) => {
    playNoiseBurst(audioCtx, 400, 0.5, 0.8, 0.25, dest);
    playNoiseBurst(audioCtx, 800, 0.8, 0.6, 0.15, dest);
    // High shimmer
    playNoiseBurst(audioCtx, 2000, 1.2, 0.4, 0.08, dest);
  },

  // Crowd gasp: quick inhale-like noise sweep
  crowd_gasp: (audioCtx, dest) => {
    const noise = audioCtx.createBufferSource();
    noise.buffer = createNoiseBuffer(audioCtx, 0.4);

    const filter = audioCtx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(600, audioCtx.currentTime);
    filter.frequency.linearRampToValueAtTime(2000, audioCtx.currentTime + 0.15);
    filter.Q.value = 2;

    const env = createEnvelope(audioCtx, 0.02, 0.15, 0.3, 0.2, 0.2);

    noise.connect(filter);
    filter.connect(env);
    env.connect(dest);
    noise.start();
  },

  // Crowd groan: low rumble descending
  crowd_groan: (audioCtx, dest) => {
    playNoiseBurst(audioCtx, 200, 0.5, 0.5, 0.2, dest);
    // Descending tone
    const osc = audioCtx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(300, audioCtx.currentTime);
    osc.frequency.linearRampToValueAtTime(100, audioCtx.currentTime + 0.4);

    const env = createEnvelope(audioCtx, 0.02, 0.2, 0.3, 0.3, 0.1);
    osc.connect(env);
    env.connect(dest);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.6);
  },

  // Dice rattle: quick sine-sweep clicks with random spacing
  dice_rattle: (audioCtx, dest) => {
    const now = audioCtx.currentTime;
    for (let i = 0; i < 5; i++) {
      const delay = i * (0.06 + Math.random() * 0.04);
      const osc = audioCtx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, now + delay);
      osc.frequency.linearRampToValueAtTime(400, now + delay + 0.03);

      const gain = audioCtx.createGain();
      gain.gain.setValueAtTime(0, now + delay);
      gain.gain.linearRampToValueAtTime(0.15, now + delay + 0.001);
      gain.gain.linearRampToValueAtTime(0, now + delay + 0.03);

      osc.connect(gain);
      gain.connect(dest);
      osc.start(now + delay);
      osc.stop(now + delay + 0.035);
    }
  },

  // Umpire call: two-tone whistle-like sound
  umpire_call: (audioCtx, dest) => {
    // "Strike!" — descending two-note
    playTone(audioCtx, 880, 'sine', 0.12, 0.2, dest);
    setTimeout(() => {
      if (ctx) playTone(ctx, 660, 'sine', 0.15, 0.18, dest);
    }, 120);
  },

  // Organ riff: classic ballpark ascending motif
  organ_riff: (audioCtx, dest) => {
    const notes = [523, 587, 659, 784, 880]; // C5-D5-E5-G5-A5
    const now = audioCtx.currentTime;

    notes.forEach((freq, i) => {
      const delay = i * 0.1;
      const osc = audioCtx.createOscillator();
      osc.type = 'square';
      osc.frequency.value = freq;

      // Second oscillator slightly detuned for organ richness
      const osc2 = audioCtx.createOscillator();
      osc2.type = 'square';
      osc2.frequency.value = freq;
      osc2.detune.value = 8;

      const gain = audioCtx.createGain();
      gain.gain.setValueAtTime(0, now + delay);
      gain.gain.linearRampToValueAtTime(0.08, now + delay + 0.02);
      gain.gain.setValueAtTime(0.08, now + delay + 0.08);
      gain.gain.linearRampToValueAtTime(0, now + delay + 0.12);

      osc.connect(gain);
      osc2.connect(gain);
      gain.connect(dest);
      osc.start(now + delay);
      osc2.start(now + delay);
      osc.stop(now + delay + 0.15);
      osc2.stop(now + delay + 0.15);
    });
  },
};

// ===== Haptic Feedback =====

function vibrate(pattern: number | number[]): void {
  try {
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  } catch {
    // Silently fail on unsupported platforms
  }
}

const hapticPatterns: Partial<Record<SoundCueType, number | number[]>> = {
  bat_crack: [30],
  dice_rattle: [10, 20, 10, 20, 10],
  crowd_roar: [50, 30, 80],
  umpire_call: [40],
  organ_riff: [20, 20, 20, 20, 40],
};

// ===== Public API =====

export const gameAudio = {
  /** Play a sound cue. Handles mute state and AudioContext activation. */
  play(cue: SoundCueType): void {
    // Always fire haptics (independent of audio mute)
    const haptic = hapticPatterns[cue];
    if (haptic) vibrate(haptic);

    if (_muted) return;
    if (typeof window === 'undefined') return;

    try {
      const audioCtx = getContext();
      // Master gain (keeps volume reasonable)
      const master = audioCtx.createGain();
      master.gain.value = 0.5;
      master.connect(audioCtx.destination);

      const soundFn = sounds[cue];
      if (soundFn) soundFn(audioCtx, master);
    } catch {
      // AudioContext may fail in some environments — fail silently
    }
  },

  /** Play multiple cues with optional delays. */
  playSequence(cues: { cue: SoundCueType; delay?: number }[]): void {
    cues.forEach(({ cue, delay = 0 }) => {
      if (delay > 0) {
        setTimeout(() => this.play(cue), delay);
      } else {
        this.play(cue);
      }
    });
  },

  /** Get mute state. */
  isMuted(): boolean {
    return _muted;
  },

  /** Set mute state, persists to localStorage. */
  setMuted(muted: boolean): void {
    _muted = muted;
    try {
      localStorage.setItem(MUTE_KEY, String(muted));
    } catch { /* ignore */ }
    _listeners.forEach(fn => fn(muted));
  },

  /** Toggle mute state. */
  toggleMute(): boolean {
    this.setMuted(!_muted);
    return _muted;
  },

  /** Subscribe to mute state changes. Returns unsubscribe function. */
  onMuteChange(fn: (muted: boolean) => void): () => void {
    _listeners.add(fn);
    return () => _listeners.delete(fn);
  },
};
