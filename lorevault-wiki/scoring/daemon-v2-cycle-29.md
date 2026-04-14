# Daemon v2 — Cycle 29
Phase: 2
Date: 2026-04-14
Version: v8.72

## What Was Built

### Synthesized Audio Engine (`src/lib/baseball/audio.ts`)
- Zero-dependency Web Audio API sound system — no audio files
- Lazy AudioContext initialization (created on first user gesture for autoplay policy)
- Master gain bus at 0.5 volume for reasonable levels
- 7 synthesized sounds mapped to existing `SoundCueType`:
  - **bat_crack**: white noise burst at 2kHz bandpass + square wave sweep 800→200Hz in 80ms + sine body thud at 120Hz
  - **crowd_roar**: layered bandpass noise at 400Hz/800Hz/2kHz with varying Q and durations
  - **crowd_gasp**: swept bandpass noise 600→2000Hz with fast attack for "inhale" texture
  - **crowd_groan**: descending sawtooth 300→100Hz over 400ms + low-freq noise
  - **dice_rattle**: 5 sine-sweep clicks (1200→400Hz, 30ms each) with random spacing
  - **umpire_call**: two-tone descending sine 880Hz→660Hz with 120ms gap
  - **organ_riff**: ascending C5-D5-E5-G5-A5 motif with detuned +8¢ square waves for organ richness
- `gameAudio.play(cue)` — fire and forget, handles mute + AudioContext activation
- `gameAudio.playSequence([{cue, delay}])` — chained multi-sound events

### Mute System
- `localStorage` key `pdb-audio-muted` for persistence across sessions
- `gameAudio.toggleMute()` / `gameAudio.setMuted(bool)` API
- Observable: `gameAudio.onMuteChange(fn)` returns unsubscribe function
- Mute button in scoreboard strip (speaker icon) with real-time state sync

### Haptic Feedback
- `navigator.vibrate()` patterns for mobile devices (Android Chrome)
- Fire independently of audio mute (haptics always on)
- Patterns: bat_crack [30ms], dice_rattle [10-20-10-20-10], crowd_roar [50-30-80], umpire_call [40], organ_riff [20-20-20-20-40]

### Play Page Integration (`src/app/games/baseball/play/page.tsx`)
- `handleRoll` → `dice_rattle` on control roll
- `resolveFullAtBat` → `dice_rattle` on outcome roll
- `onOutcomeDiceLand`:
  - Hits (single/double/triple/HR) → `bat_crack`
  - Home run → `bat_crack` + `crowd_roar` (150ms) + `organ_riff` (500ms)
  - Strikeout → `umpire_call` + `crowd_groan` (player) or `crowd_roar` (AI)
  - Double play → `crowd_gasp`
  - Triple → `crowd_roar`
  - Scoring play → `crowd_roar`
  - Walk-off → additional `organ_riff` (300ms)
- `handleSteal` → `dice_rattle` on steal attempt
- Steal resolution → `crowd_roar` (success) or `crowd_groan` (caught)
- Mute toggle button in scoreboard: 🔊/🔇 icon, syncs via `onMuteChange`

Files changed:
- `src/lib/baseball/audio.ts` — New (290 lines)
- `src/app/games/baseball/play/page.tsx` — Modified (imports, mute state, sound triggers, mute button)

## Frigga Research Summary
- Lazy `AudioContext` init inside click handler — never at module load time
- Each sound creates + destroys own nodes (no pooling for short SFX)
- Bat crack = noise burst (crack texture) + low sine (body thud) + square sweep (resonance)
- Dice click = sine 1200→400Hz sweep in 30ms, fire 3-6 times with random spacing
- Home run fanfare = 3-note triangle arpeggio (C5-E5-G5) with optional octave double
- `setTargetAtTime` for mute toggle ramp (50ms) to avoid clicks
- `navigator.vibrate()` feature-detect; iOS Safari unsupported
- Master gain node for global volume control, single icon button for MVP mute

## Scores (post-Cycle-29 estimate)
- Engine completeness: 9.5/10
- UI quality: 8.5/10 (up from 8 — audio adds immersion)
- Strategic depth: 9/10
- Visual polish: 8/10 (up from 7.5 — audio/haptic adds polish layer)
- Fun factor: 9.5/10 (up from 9 — sound makes dice rolls visceral)
- Game modes: 5 (quick, full, tournament, lineup builder, draft)

## Key Decisions
1. Pure synthesis over audio files — zero network requests, instant load, tiny bundle
2. Haptics fire independently of mute — tactile feedback is separate from audio preference
3. Master gain at 0.5 — conservative default; game sounds are additive, not ambient
4. Sound triggers in callbacks, not reducer — avoids side effects in pure state management
5. Observable mute state — React component syncs via `onMuteChange` subscriber pattern
6. `setTimeout`-based `playSequence` for delayed multi-sound events (not AudioContext scheduling) — simpler, good enough for game timing

## Next Target
Cycle 30: Final polish — achievement sounds, lineup builder UX, game mode selector enhancements

## Deploy URL
https://lorevault-site-eikuk8sqz-ros-projects-9a9bb0c9.vercel.app
