'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { TRIVIA_QUESTIONS, TriviaQuestion } from '@/data/trivia';
import { saveTriviaRecord } from '@/lib/store';
import { getReferralLink } from '@/lib/referral';
import { ALL_CARDS } from '@/data/cards';
import { SCARCITY_CONFIG, Achievement } from '@/data/types';
import { checkAchievements, getAchievementById } from '@/lib/achievements';
import AchievementCelebration from '@/components/AchievementCelebration';

type Phase = 'intro' | 'question' | 'answered' | 'results';

const QUESTIONS_PER_GAME = 10;
const BASE_TIME = 15; // seconds per question

// Shuffle with seed
function shuffle<T>(arr: T[], seed: number): T[] {
  let s = seed;
  const next = () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(next() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// Map character names to card data for showing art
function getCardForCharacter(name: string) {
  return ALL_CARDS.find(c => c.character === name);
}

export default function TriviaPage() {
  const [phase, setPhase] = useState<Phase>('intro');
  const [questions, setQuestions] = useState<TriviaQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [shuffledOptions, setShuffledOptions] = useState<string[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(BASE_TIME);
  const [totalTimeMs, setTotalTimeMs] = useState(0);
  const [answeredCharacters, setAnsweredCharacters] = useState<string[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef(Date.now());
  const [multiplier, setMultiplier] = useState(1);
  const [celebrationQueue, setCelebrationQueue] = useState<Achievement[]>([]);
  const [showCelebration, setShowCelebration] = useState(false);

  // Check achievements when trivia results are shown
  useEffect(() => {
    if (phase === 'results') {
      const newIds = checkAchievements();
      if (newIds.length > 0) {
        const achievements = newIds
          .map(id => getAchievementById(id))
          .filter(Boolean) as Achievement[];
        setCelebrationQueue(achievements);
        setTimeout(() => setShowCelebration(true), 1200);
      }
    }
  }, [phase]);

  // Prepare question set
  const startGame = useCallback(() => {
    const seed = Date.now();
    // Pick questions: start easy, get harder with streak
    const easy = TRIVIA_QUESTIONS.filter(q => q.difficulty === 'easy');
    const medium = TRIVIA_QUESTIONS.filter(q => q.difficulty === 'medium');
    const hard = TRIVIA_QUESTIONS.filter(q => q.difficulty === 'hard');

    // Mix: 4 easy, 3 medium, 3 hard (but shuffle order)
    const pool = [
      ...shuffle(easy, seed).slice(0, 4),
      ...shuffle(medium, seed + 1).slice(0, 3),
      ...shuffle(hard, seed + 2).slice(0, 3),
    ];
    const picked = shuffle(pool, seed + 3).slice(0, QUESTIONS_PER_GAME);
    setQuestions(picked);
    setCurrentIdx(0);
    setScore(0);
    setStreak(0);
    setMaxStreak(0);
    setMultiplier(1);
    setSelectedAnswer(null);
    setTotalTimeMs(0);
    setAnsweredCharacters([]);
    startTimeRef.current = Date.now();

    // Shuffle first question options
    if (picked.length > 0) {
      const opts = shuffle([picked[0].correctAnswer, ...picked[0].wrongAnswers], seed + 4);
      setShuffledOptions(opts);
    }

    setTimeLeft(BASE_TIME);
    setPhase('question');
  }, []);

  // Timer countdown
  useEffect(() => {
    if (phase !== 'question') {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          // Time's up — auto-wrong
          handleAnswer('__timeout__');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [phase, currentIdx]);

  // Handle answer
  const handleAnswer = useCallback((answer: string) => {
    if (phase !== 'question' || selectedAnswer !== null) return;
    const q = questions[currentIdx];
    if (!q) return;

    setSelectedAnswer(answer);
    setPhase('answered');
    setAnsweredCharacters(prev => [...prev, q.correctAnswer]);

    const correct = answer === q.correctAnswer;
    if (correct) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > maxStreak) setMaxStreak(newStreak);

      // Multiplier: 1x base, 2x at 3 streak, 3x at 5 streak
      const mult = newStreak >= 5 ? 3 : newStreak >= 3 ? 2 : 1;
      setMultiplier(mult);

      // Points: base 100 + time bonus + multiplier
      const timeBonus = timeLeft * 10;
      const points = (100 + timeBonus) * mult;
      setScore(prev => prev + points);
    } else {
      setStreak(0);
      setMultiplier(1);
    }

    // Move to next question after delay
    setTimeout(() => {
      const nextIdx = currentIdx + 1;
      if (nextIdx >= questions.length) {
        // Game over
        const elapsed = Date.now() - startTimeRef.current;
        setTotalTimeMs(elapsed);
        const finalScore = correct ? score + ((100 + timeLeft * 10) * (streak >= 5 ? 3 : streak >= 3 ? 2 : 1)) : score;

        saveTriviaRecord({
          id: `trivia-${Date.now()}`,
          date: new Date().toISOString(),
          score: finalScore,
          total: questions.length,
          streak: correct ? Math.max(maxStreak, streak + 1) : maxStreak,
          xpEarned: Math.round(finalScore / 10),
          timeMs: elapsed,
        });

        setPhase('results');
      } else {
        setCurrentIdx(nextIdx);
        setSelectedAnswer(null);
        setTimeLeft(BASE_TIME);

        // Shuffle options for next question
        const nextQ = questions[nextIdx];
        const opts = shuffle(
          [nextQ.correctAnswer, ...nextQ.wrongAnswers],
          Date.now() + nextIdx,
        );
        setShuffledOptions(opts);
        setPhase('question');
      }
    }, 1500);
  }, [phase, selectedAnswer, questions, currentIdx, streak, maxStreak, timeLeft, score]);

  // ===== INTRO =====
  if (phase === 'intro') {
    return (
      <div className="min-h-screen px-4 pt-8 pb-24 flex flex-col items-center justify-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-sm">
          <motion.span
            className="text-6xl block mb-4"
            animate={{ rotate: [0, -10, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🧠
          </motion.span>
          <h1 className="text-2xl font-bold mb-2">Lore Trivia</h1>
          <p className="text-sm text-muted mb-2">
            Test your knowledge of literary legends. {QUESTIONS_PER_GAME} questions, {BASE_TIME} seconds each.
          </p>
          <div className="flex flex-col gap-2 text-xs text-muted mb-6">
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-surface">
              <span>🔥</span>
              <span>Build streaks for score multipliers</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-surface">
              <span>⏱️</span>
              <span>Faster answers earn bonus points</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-surface">
              <span>⭐</span>
              <span>Earn XP based on your score</span>
            </div>
          </div>

          <div className="flex gap-3 justify-center">
            <motion.button
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-500 text-white font-bold text-lg shadow-xl"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={startGame}
            >
              Start Quiz
            </motion.button>
            <Link
              href="/games"
              className="px-6 py-4 rounded-2xl bg-surface border border-border text-sm font-medium flex items-center"
            >
              &larr; Back
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  // ===== RESULTS =====
  if (phase === 'results') {
    const xpEarned = Math.round(score / 10);
    const correctCount = answeredCharacters.length; // approximate
    const timeStr = totalTimeMs > 0 ? `${Math.round(totalTimeMs / 1000)}s` : '';

    return (
      <div className="min-h-screen px-4 pt-8 pb-24 flex flex-col items-center justify-center">
        <motion.div
          className="text-center max-w-sm"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <motion.span
            className="text-6xl block mb-4"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 0.5 }}
          >
            {score > 3000 ? '🏆' : score > 1500 ? '🌟' : '📚'}
          </motion.span>

          <h1 className="type-display mb-1">
            {score > 3000 ? 'Lore Master!' : score > 1500 ? 'Well Played!' : 'Keep Learning!'}
          </h1>

          {/* Score display */}
          <motion.div
            className="text-5xl font-bold font-mono text-accent mb-1"
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.2, 1] }}
            transition={{ delay: 0.3 }}
          >
            {score.toLocaleString()}
          </motion.div>
          <p className="text-sm text-muted mb-4">points</p>

          {/* Stats grid */}
          <div className="grid grid-cols-3 gap-2 mb-6">
            <div className="p-3 rounded-xl bg-surface border border-border">
              <div className="text-lg font-bold text-green-400">{maxStreak}</div>
              <div className="text-[10px] text-muted">Best Streak</div>
            </div>
            <div className="p-3 rounded-xl bg-surface border border-border">
              <div className="text-lg font-bold text-accent">+{xpEarned}</div>
              <div className="text-[10px] text-muted">XP Earned</div>
            </div>
            <div className="p-3 rounded-xl bg-surface border border-border">
              <div className="text-lg font-bold text-yellow-400">{timeStr}</div>
              <div className="text-[10px] text-muted">Total Time</div>
            </div>
          </div>

          {/* Characters that appeared */}
          {answeredCharacters.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xs text-muted uppercase tracking-wider mb-2">Characters Featured</h3>
              <div className="flex flex-wrap gap-1.5 justify-center">
                {[...new Set(answeredCharacters)].map(name => {
                  const card = getCardForCharacter(name);
                  return card ? (
                    <div
                      key={name}
                      className="flex items-center gap-1 px-2 py-1 rounded-md bg-surface border border-border"
                    >
                      <span className="text-sm">{card.symbol}</span>
                      <span className="text-[10px] font-medium">{name}</span>
                    </div>
                  ) : (
                    <div key={name} className="px-2 py-1 rounded-md bg-surface border border-border">
                      <span className="text-[10px] font-medium">{name}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 justify-center flex-wrap">
            <motion.button
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-500 text-white font-bold text-sm"
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setPhase('intro');
              }}
            >
              Play Again
            </motion.button>
            <button
              onClick={() => {
                const stars = '⭐'.repeat(Math.min(5, Math.floor(score / 1000)));
                const text = `🧠 LoreVault Trivia\n📊 ${score.toLocaleString()} pts | ${maxStreak} streak\n${stars}\n\nCan you beat my score?`;
                const url = `${window.location.origin}/games/trivia`;
                window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank', 'width=550,height=420');
              }}
              className="px-5 py-3 rounded-xl bg-[#1da1f2]/10 border border-[#1da1f2]/20 text-[#1da1f2] text-sm font-bold"
            >
              Share Score
            </button>
            <Link href="/games" className="px-6 py-3 rounded-xl bg-surface border border-border text-sm font-medium flex items-center">
              Games Hub
            </Link>
          </div>

          {/* Post-achievement invite prompt */}
          {score > 2000 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="mt-6 p-3 rounded-xl bg-accent/5 border border-accent/15 text-center max-w-sm mx-auto"
            >
              <div className="text-[10px] text-muted mb-1">Know someone who loves trivia?</div>
              <button
                onClick={() => {
                  const url = getReferralLink();
                  navigator.clipboard.writeText(url).catch(() => window.prompt('Copy this link:', url));
                }}
                className="text-xs font-bold text-accent"
              >
                Invite a friend to LoreVault →
              </button>
            </motion.div>
          )}
        </motion.div>

        {/* Achievement celebration */}
        <AchievementCelebration
          visible={showCelebration && celebrationQueue.length > 0}
          achievement={celebrationQueue[0] ?? null}
          onDone={() => {
            if (celebrationQueue.length <= 1) {
              setShowCelebration(false);
              setCelebrationQueue([]);
            } else {
              setCelebrationQueue(prev => prev.slice(1));
            }
          }}
        />
      </div>
    );
  }

  // ===== QUESTION / ANSWERED =====
  const q = questions[currentIdx];
  if (!q) return null;

  const correctCard = getCardForCharacter(q.correctAnswer);
  const timerPct = (timeLeft / BASE_TIME) * 100;
  const timerColor = timeLeft <= 3 ? '#ef4444' : timeLeft <= 7 ? '#f59e0b' : '#22c55e';

  return (
    <div className="min-h-screen px-4 pt-6 pb-24">
      {/* Top bar: progress + streak */}
      <div className="flex items-center justify-between mb-4">
        <Link href="/games" className="w-8 h-8 rounded-full bg-surface flex items-center justify-center text-muted text-sm">
          &larr;
        </Link>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted font-mono">{currentIdx + 1}/{questions.length}</span>
          {streak > 0 && (
            <motion.div
              className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/20"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              key={`streak-${streak}`}
            >
              <span className="text-xs">🔥</span>
              <span className="text-xs font-bold text-orange-400">{streak}</span>
            </motion.div>
          )}
          {multiplier > 1 && (
            <motion.div
              className="px-2 py-0.5 rounded-full bg-accent/10 border border-accent/20"
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.3, 1] }}
              key={`mult-${multiplier}`}
            >
              <span className="text-xs font-bold text-accent">{multiplier}x</span>
            </motion.div>
          )}
        </div>
        <div className="text-sm font-bold font-mono text-accent">{score.toLocaleString()}</div>
      </div>

      {/* Timer ring */}
      <div className="flex justify-center mb-4">
        <div className="relative w-16 h-16">
          <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
            <circle cx="32" cy="32" r="28" fill="none" stroke="#1f2237" strokeWidth="4" />
            <motion.circle
              cx="32" cy="32" r="28"
              fill="none"
              stroke={timerColor}
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 28}`}
              strokeDashoffset={`${2 * Math.PI * 28 * (1 - timerPct / 100)}`}
              transition={{ duration: 0.3 }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.span
              className="text-lg font-bold font-mono"
              style={{ color: timerColor }}
              animate={timeLeft <= 3 ? { scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 0.5, repeat: Infinity }}
            >
              {timeLeft}
            </motion.span>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1 rounded-full bg-surface mb-6 overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-accent"
          animate={{ width: `${((currentIdx) / questions.length) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIdx}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.3 }}
        >
          {/* Question type badge */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-surface border border-border font-bold uppercase text-muted">
              {q.type === 'quote' ? '💬 Quote' : '📖 Fact'}
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase"
              style={{
                backgroundColor: q.difficulty === 'hard' ? '#ef444420' : q.difficulty === 'medium' ? '#f59e0b20' : '#22c55e20',
                color: q.difficulty === 'hard' ? '#ef4444' : q.difficulty === 'medium' ? '#f59e0b' : '#22c55e',
                border: `1px solid ${q.difficulty === 'hard' ? '#ef444440' : q.difficulty === 'medium' ? '#f59e0b40' : '#22c55e40'}`,
              }}
            >
              {q.difficulty}
            </span>
          </div>

          {/* Question text */}
          <div className="p-5 rounded-2xl bg-surface border border-border mb-6">
            <p className="text-base font-medium leading-relaxed">
              {q.question}
            </p>
            <p className="text-[10px] text-muted mt-2 italic">{q.source}</p>
          </div>

          {/* Answer options — using card art */}
          <div className="grid grid-cols-2 gap-3">
            {shuffledOptions.map((option, i) => {
              const card = getCardForCharacter(option);
              const isSelected = selectedAnswer === option;
              const isCorrect = option === q.correctAnswer;
              const showResult = phase === 'answered';

              let borderColor = '#1f2237';
              let bgColor = '#12141f';

              if (showResult) {
                if (isCorrect) {
                  borderColor = '#22c55e';
                  bgColor = '#22c55e15';
                } else if (isSelected && !isCorrect) {
                  borderColor = '#ef4444';
                  bgColor = '#ef444415';
                }
              } else if (isSelected) {
                borderColor = '#818cf8';
                bgColor = '#818cf815';
              }

              return (
                <motion.button
                  key={option}
                  className="relative p-3 rounded-xl border-2 text-left transition-all overflow-hidden"
                  style={{ borderColor, backgroundColor: bgColor }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  whileTap={!showResult ? { scale: 0.96 } : undefined}
                  onClick={() => !showResult && handleAnswer(option)}
                  disabled={showResult}
                >
                  {/* Card art background */}
                  {card && (
                    <div
                      className="absolute inset-0 opacity-15"
                      style={{
                        background: `linear-gradient(145deg, ${card.gradientFrom}, ${card.gradientTo})`,
                      }}
                    />
                  )}

                  <div className="relative flex items-center gap-2">
                    {card && <span className="text-2xl">{card.symbol}</span>}
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-semibold truncate block">{option}</span>
                      {card && (
                        <span className="text-[9px] font-mono uppercase" style={{ color: SCARCITY_CONFIG[card.scarcity]?.color || '#6b7094' }}>
                          {card.set}
                        </span>
                      )}
                    </div>
                    {showResult && isCorrect && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="text-xl"
                      >
                        ✓
                      </motion.span>
                    )}
                    {showResult && isSelected && !isCorrect && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="text-xl"
                      >
                        ✗
                      </motion.span>
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
