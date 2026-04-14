// Public Domain Baseball — Stadium Themes
// Visual atmosphere configurations that change per AI team.
// Each theme drives: background gradients, vignette color, diamond accents,
// ambient CSS animation class, and crowd reaction flavor text.
// No UI coupling — pure config objects.

export interface StadiumTheme {
  id: string;
  name: string;
  // Background radial gradient for the play page
  bgGradient: string;
  // Vignette overlay color (edges of screen)
  vignetteColor: string;
  // Diamond SVG: grass tint, base path glow, runner glow
  diamondGrass: string;
  basePath: string;
  baseGlow: string;
  runnerGlow: string;
  // Ambient overlay: subtle radial positioned at top of screen
  ambientGlow: string;
  // CSS class for ambient animation (defined in globals.css)
  ambientAnimClass: string;
  // Scoreboard accent
  scoreboardBg: string;
  // Crowd reaction accent color
  crowdColor: string;
  // Flavor: stadium name shown briefly at game start
  stadiumName: string;
  stadiumTagline: string;
}

// ===== Theme Definitions =====

const OLYMPUS_ARENA: StadiumTheme = {
  id: 'olympus',
  name: 'Olympus Arena',
  bgGradient: 'radial-gradient(ellipse at 50% 0%, rgba(251,191,36,0.06) 0%, rgba(180,130,20,0.02) 30%, transparent 60%)',
  vignetteColor: 'rgba(180,140,20,0.15)',
  diamondGrass: 'rgba(180,160,40,0.08)',
  basePath: 'rgba(251,191,36,0.15)',
  baseGlow: '#f59e0b',
  runnerGlow: '#fbbf24',
  ambientGlow: 'radial-gradient(ellipse at 50% -10%, rgba(251,191,36,0.08) 0%, transparent 50%)',
  ambientAnimClass: 'stadium-olympus',
  scoreboardBg: 'rgba(20,16,8,0.85)',
  crowdColor: '#fbbf24',
  stadiumName: 'Olympus Arena',
  stadiumTagline: 'Where gods compete',
};

const ASGARD_HALL: StadiumTheme = {
  id: 'asgard',
  name: "Asgard's Hall",
  bgGradient: 'radial-gradient(ellipse at 50% 0%, rgba(56,189,248,0.05) 0%, rgba(20,184,166,0.03) 30%, transparent 60%)',
  vignetteColor: 'rgba(20,100,120,0.15)',
  diamondGrass: 'rgba(20,184,166,0.06)',
  basePath: 'rgba(56,189,248,0.12)',
  baseGlow: '#38bdf8',
  runnerGlow: '#22d3ee',
  ambientGlow: 'radial-gradient(ellipse at 30% -10%, rgba(56,189,248,0.06) 0%, transparent 40%), radial-gradient(ellipse at 70% -10%, rgba(20,184,166,0.06) 0%, transparent 40%)',
  ambientAnimClass: 'stadium-asgard',
  scoreboardBg: 'rgba(8,16,20,0.85)',
  crowdColor: '#38bdf8',
  stadiumName: "Asgard's Hall",
  stadiumTagline: 'Beneath the Bifrost',
};

const BAKER_STREET: StadiumTheme = {
  id: 'baker-street',
  name: 'Baker Street Grounds',
  bgGradient: 'radial-gradient(ellipse at 50% 0%, rgba(217,178,119,0.05) 0%, rgba(120,90,40,0.02) 30%, transparent 60%)',
  vignetteColor: 'rgba(80,60,20,0.2)',
  diamondGrass: 'rgba(120,100,50,0.06)',
  basePath: 'rgba(217,178,119,0.10)',
  baseGlow: '#d9b277',
  runnerGlow: '#c9a267',
  ambientGlow: 'radial-gradient(ellipse at 50% 30%, rgba(217,178,119,0.04) 0%, transparent 50%)',
  ambientAnimClass: 'stadium-baker',
  scoreboardBg: 'rgba(16,12,8,0.85)',
  crowdColor: '#d9b277',
  stadiumName: 'Baker Street Grounds',
  stadiumTagline: 'The game is afoot',
};

const WONDERLAND_PARK: StadiumTheme = {
  id: 'wonderland',
  name: 'Wonderland Park',
  bgGradient: 'radial-gradient(ellipse at 50% 0%, rgba(168,85,247,0.05) 0%, rgba(236,72,153,0.03) 30%, transparent 60%)',
  vignetteColor: 'rgba(120,40,120,0.12)',
  diamondGrass: 'rgba(168,85,247,0.06)',
  basePath: 'rgba(168,85,247,0.12)',
  baseGlow: '#a855f7',
  runnerGlow: '#c084fc',
  ambientGlow: 'radial-gradient(ellipse at 30% 0%, rgba(168,85,247,0.05) 0%, transparent 40%), radial-gradient(ellipse at 70% 0%, rgba(236,72,153,0.04) 0%, transparent 40%)',
  ambientAnimClass: 'stadium-wonderland',
  scoreboardBg: 'rgba(16,8,20,0.85)',
  crowdColor: '#c084fc',
  stadiumName: 'Wonderland Park',
  stadiumTagline: 'Curiouser and curiouser',
};

const HORROR_HOLLOW: StadiumTheme = {
  id: 'horror',
  name: 'Horror Hollow',
  bgGradient: 'radial-gradient(ellipse at 50% 0%, rgba(239,68,68,0.04) 0%, rgba(120,20,20,0.02) 30%, transparent 60%)',
  vignetteColor: 'rgba(100,10,10,0.2)',
  diamondGrass: 'rgba(120,30,30,0.05)',
  basePath: 'rgba(239,68,68,0.10)',
  baseGlow: '#ef4444',
  runnerGlow: '#f87171',
  ambientGlow: 'radial-gradient(ellipse at 50% 20%, rgba(239,68,68,0.03) 0%, transparent 50%)',
  ambientAnimClass: 'stadium-horror',
  scoreboardBg: 'rgba(16,8,8,0.85)',
  crowdColor: '#f87171',
  stadiumName: 'Horror Hollow',
  stadiumTagline: 'No one leaves unscathed',
};

const FAIRY_FIELD: StadiumTheme = {
  id: 'fairy',
  name: 'Fairy Tale Field',
  bgGradient: 'radial-gradient(ellipse at 50% 0%, rgba(52,211,153,0.04) 0%, rgba(110,231,183,0.02) 30%, transparent 60%)',
  vignetteColor: 'rgba(20,80,50,0.12)',
  diamondGrass: 'rgba(52,211,153,0.06)',
  basePath: 'rgba(52,211,153,0.10)',
  baseGlow: '#34d399',
  runnerGlow: '#6ee7b7',
  ambientGlow: 'radial-gradient(ellipse at 50% 0%, rgba(52,211,153,0.04) 0%, transparent 50%)',
  ambientAnimClass: 'stadium-fairy',
  scoreboardBg: 'rgba(8,16,12,0.85)',
  crowdColor: '#34d399',
  stadiumName: 'Fairy Tale Field',
  stadiumTagline: 'Once upon a game',
};

const DEFAULT_FIELD: StadiumTheme = {
  id: 'default',
  name: 'Classic Field',
  bgGradient: 'radial-gradient(ellipse at 50% 0%, rgba(34,197,94,0.03) 0%, transparent 50%)',
  vignetteColor: 'rgba(0,0,0,0.6)',
  diamondGrass: 'rgba(26,58,26,0.08)',
  basePath: 'rgba(255,255,255,0.06)',
  baseGlow: '#f59e0b',
  runnerGlow: '#f59e0b',
  ambientGlow: 'none',
  ambientAnimClass: '',
  scoreboardBg: 'rgba(10,14,20,0.85)',
  crowdColor: '#f59e0b',
  stadiumName: 'Classic Field',
  stadiumTagline: 'Play ball',
};

// ===== Team → Theme Mapping =====

const TEAM_THEME_MAP: Record<string, StadiumTheme> = {
  // Rookie
  'The Wonderland Wanderers': WONDERLAND_PARK,
  'The Fairy Tale Misfits': FAIRY_FIELD,
  'Minor Monsters': HORROR_HOLLOW,
  // Veteran
  'The Enchanted Nine': FAIRY_FIELD,
  'The Gothic Horrors': HORROR_HOLLOW,
  'The Baker Street Nine': BAKER_STREET,
  'The Mad Court': WONDERLAND_PARK,
  // Legend
  'The Olympians': OLYMPUS_ARENA,
  "Asgard's Chosen": ASGARD_HALL,
  'The Mythic All-Stars': OLYMPUS_ARENA,
};

/**
 * Get the stadium theme for an AI team.
 * Falls back to DEFAULT_FIELD for unknown teams.
 */
export function getStadiumTheme(teamName: string): StadiumTheme {
  return TEAM_THEME_MAP[teamName] || DEFAULT_FIELD;
}

/**
 * Get all available themes (for future theme selection UI).
 */
export function getAllThemes(): StadiumTheme[] {
  return [
    DEFAULT_FIELD,
    OLYMPUS_ARENA,
    ASGARD_HALL,
    BAKER_STREET,
    WONDERLAND_PARK,
    HORROR_HOLLOW,
    FAIRY_FIELD,
  ];
}

// ===== Crowd Reaction Config =====

export type CrowdReactionType =
  | 'homerun'
  | 'strikeout_good'    // player's pitcher struck out AI batter
  | 'strikeout_bad'     // AI pitcher struck out player's batter
  | 'double_play'
  | 'triple'
  | 'walk_off'
  | 'steal_success'
  | 'steal_caught'
  | 'big_hit';          // double or triple with runners scoring

export interface CrowdReaction {
  type: CrowdReactionType;
  emoji: string;
  text: string;
  intensity: 'low' | 'medium' | 'high' | 'epic';
  duration: number; // ms
}

const CROWD_REACTIONS: Record<CrowdReactionType, CrowdReaction> = {
  homerun: {
    type: 'homerun',
    emoji: '\u26A1', // ⚡
    text: 'GONE!',
    intensity: 'epic',
    duration: 2500,
  },
  strikeout_good: {
    type: 'strikeout_good',
    emoji: '\uD83D\uDD25', // 🔥
    text: 'SIT DOWN!',
    intensity: 'high',
    duration: 1800,
  },
  strikeout_bad: {
    type: 'strikeout_bad',
    emoji: '\uD83D\uDE2C', // 😬
    text: 'STRUCK OUT',
    intensity: 'medium',
    duration: 1500,
  },
  double_play: {
    type: 'double_play',
    emoji: '\u2728', // ✨
    text: 'DOUBLE PLAY!',
    intensity: 'high',
    duration: 2000,
  },
  triple: {
    type: 'triple',
    emoji: '\uD83D\uDCA8', // 💨
    text: 'TRIPLE!',
    intensity: 'high',
    duration: 2000,
  },
  walk_off: {
    type: 'walk_off',
    emoji: '\uD83C\uDF86', // 🎆
    text: 'WALK-OFF!',
    intensity: 'epic',
    duration: 3000,
  },
  steal_success: {
    type: 'steal_success',
    emoji: '\uD83C\uDFC3', // 🏃
    text: 'SAFE!',
    intensity: 'medium',
    duration: 1500,
  },
  steal_caught: {
    type: 'steal_caught',
    emoji: '\uD83D\uDED1', // 🛑
    text: 'OUT!',
    intensity: 'medium',
    duration: 1500,
  },
  big_hit: {
    type: 'big_hit',
    emoji: '\uD83D\uDCAA', // 💪
    text: 'BIG HIT!',
    intensity: 'high',
    duration: 1800,
  },
};

/**
 * Get the crowd reaction for a game event.
 */
export function getCrowdReaction(type: CrowdReactionType): CrowdReaction {
  return CROWD_REACTIONS[type];
}

// ===== Sound Design Hooks =====
// Visual cue definitions for where sound effects would go.
// Each hook specifies a visual indicator (icon + animation) that
// represents what sound the player would hear.

export type SoundCueType =
  | 'bat_crack'
  | 'crowd_roar'
  | 'crowd_gasp'
  | 'crowd_groan'
  | 'dice_rattle'
  | 'umpire_call'
  | 'organ_riff';

export interface SoundCue {
  type: SoundCueType;
  icon: string;       // visual icon character
  label: string;      // accessibility label
  pulseColor: string; // color of the visual pulse
}

export const SOUND_CUES: Record<SoundCueType, SoundCue> = {
  bat_crack: { type: 'bat_crack', icon: '\uD83C\uDFCF', label: 'Bat crack', pulseColor: 'rgba(255,255,255,0.3)' },
  crowd_roar: { type: 'crowd_roar', icon: '\uD83D\uDCE3', label: 'Crowd roar', pulseColor: 'rgba(251,191,36,0.3)' },
  crowd_gasp: { type: 'crowd_gasp', icon: '\uD83D\uDE2E', label: 'Crowd gasp', pulseColor: 'rgba(168,85,247,0.3)' },
  crowd_groan: { type: 'crowd_groan', icon: '\uD83D\uDE29', label: 'Crowd groan', pulseColor: 'rgba(239,68,68,0.3)' },
  dice_rattle: { type: 'dice_rattle', icon: '\uD83C\uDFB2', label: 'Dice rattle', pulseColor: 'rgba(255,255,255,0.2)' },
  umpire_call: { type: 'umpire_call', icon: '\uD83D\uDCE2', label: 'Umpire call', pulseColor: 'rgba(255,255,255,0.25)' },
  organ_riff: { type: 'organ_riff', icon: '\uD83C\uDFB5', label: 'Organ riff', pulseColor: 'rgba(52,211,153,0.2)' },
};
