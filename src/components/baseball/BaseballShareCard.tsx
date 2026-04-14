'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameSummary, GameState } from '@/lib/baseball/types';

interface BaseballShareCardProps {
  game: GameState;
  summary: GameSummary;
  difficulty: string;
  playerTeam: string;
  aiTeam: string;
  onClose: () => void;
}

export default function BaseballShareCard({
  game,
  summary,
  difficulty,
  playerTeam,
  aiTeam,
  onClose,
}: BaseballShareCardProps) {
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isWin = summary.winner === 'home';

  const generateImage = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    canvas.width = 600;
    canvas.height = 400;

    // Background
    const grad = ctx.createLinearGradient(0, 0, 600, 400);
    grad.addColorStop(0, '#0a1a2e');
    grad.addColorStop(1, '#12141f');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 600, 400);

    // Accent bar
    ctx.fillStyle = isWin ? '#22c55e' : '#ef4444';
    ctx.fillRect(0, 0, 6, 400);

    // Border
    ctx.strokeStyle = isWin ? '#22c55e40' : '#ef444440';
    ctx.lineWidth = 2;
    ctx.roundRect(8, 8, 584, 384, 16);
    ctx.stroke();

    // Result
    ctx.fillStyle = '#6b7094';
    ctx.font = '12px system-ui';
    ctx.fillText('PUBLIC DOMAIN BASEBALL', 30, 40);

    ctx.fillStyle = isWin ? '#22c55e' : '#ef4444';
    ctx.font = 'bold 14px system-ui';
    ctx.fillText(isWin ? 'VICTORY' : 'DEFEAT', 30, 62);

    // Score
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 60px system-ui';
    ctx.fillText(`${game.score.away} — ${game.score.home}`, 30, 130);

    // Teams
    ctx.fillStyle = '#6b7094';
    ctx.font = '14px system-ui';
    ctx.fillText(`${aiTeam}  vs  ${playerTeam}`, 30, 155);

    // Difficulty + innings
    ctx.fillStyle = difficulty === 'legend' ? '#ef4444' : difficulty === 'veteran' ? '#f59e0b' : '#22c55e';
    ctx.font = 'bold 12px system-ui';
    ctx.fillText(
      `${difficulty.toUpperCase()} · ${game.innings} INNINGS`,
      30,
      185,
    );

    // MVP
    if (summary.mvp.character) {
      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 11px system-ui';
      ctx.fillText('MVP', 30, 220);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 20px system-ui';
      ctx.fillText(summary.mvp.character, 30, 245);
      ctx.fillStyle = '#6b7094';
      ctx.font = '13px system-ui';
      ctx.fillText(
        `${summary.mvp.hits} H · ${summary.mvp.rbis} RBI`,
        30,
        265,
      );
    }

    // Key plays
    if (summary.keyPlays.length > 0) {
      ctx.fillStyle = '#6b7094';
      ctx.font = '11px system-ui';
      ctx.fillText('KEY PLAYS', 30, 300);
      const plays = summary.keyPlays.slice(0, 3);
      plays.forEach((play, i) => {
        ctx.fillStyle = '#4a4d6c';
        ctx.font = '11px system-ui';
        const desc = play.description.length > 55 ? play.description.slice(0, 52) + '...' : play.description;
        ctx.fillText(desc, 30, 318 + i * 16);
      });
    }

    // Branding
    ctx.fillStyle = '#3a3d5c';
    ctx.font = '11px system-ui';
    ctx.fillText('lorevault.app', 30, 380);

    // Large icon watermark
    ctx.fillStyle = isWin ? '#22c55e15' : '#ef444415';
    ctx.font = 'bold 120px system-ui';
    ctx.textAlign = 'right';
    ctx.fillText(isWin ? 'W' : 'L', 570, 350);
    ctx.textAlign = 'left';

    return canvas.toDataURL('image/png');
  }, [game, summary, difficulty, playerTeam, aiTeam, isWin]);

  const handleShare = useCallback(async () => {
    const dataUrl = await generateImage();
    if (!dataUrl) return;

    if (navigator.share && navigator.canShare) {
      try {
        const blob = await (await fetch(dataUrl)).blob();
        const file = new File([blob], 'baseball-result-lorevault.png', { type: 'image/png' });
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: `Baseball ${isWin ? 'Win' : 'Loss'} — LoreVault`,
            text: `${isWin ? 'W' : 'L'} ${game.score.away}-${game.score.home} vs ${aiTeam}${summary.mvp.character ? ` · MVP: ${summary.mvp.character}` : ''}`,
            files: [file],
          });
          return;
        }
      } catch {
        // Fall through to download
      }
    }

    const link = document.createElement('a');
    link.download = 'baseball-result-lorevault.png';
    link.href = dataUrl;
    link.click();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [generateImage, game.score, aiTeam, summary.mvp, isWin]);

  const shareText = `${isWin ? 'W' : 'L'} ${game.score.away}-${game.score.home} vs ${aiTeam} (${difficulty})${summary.mvp.character ? ` · MVP: ${summary.mvp.character}` : ''} #LoreVault #Baseball`;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center px-4"
        onClick={onClose}
      >
        <div className="absolute inset-0 bg-black/80" />
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative z-10 w-full max-w-sm"
          onClick={e => e.stopPropagation()}
        >
          <div className="rounded-2xl bg-surface border border-border p-4">
            <div className="text-xs text-muted uppercase tracking-wider mb-3">Share Result</div>

            {/* Preview */}
            <div
              className="rounded-xl p-4 mb-4 relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #0a1a2e, #12141f)',
                border: `1px solid ${isWin ? '#22c55e30' : '#ef444430'}`,
              }}
            >
              <div className="absolute left-0 top-0 bottom-0 w-1" style={{ background: isWin ? '#22c55e' : '#ef4444' }} />
              <p className="text-[10px] text-muted/40 uppercase tracking-wider">Public Domain Baseball</p>
              <p className={`text-xs font-black ${isWin ? 'text-green-400' : 'text-red-400'}`}>
                {isWin ? 'VICTORY' : 'DEFEAT'}
              </p>
              <p className="text-3xl font-black my-2 tabular-nums">{game.score.away} — {game.score.home}</p>
              <p className="text-[10px] text-muted/50">{aiTeam} vs {playerTeam}</p>
              <p className={`text-[10px] font-bold mt-1 ${
                difficulty === 'legend' ? 'text-red-400' : difficulty === 'veteran' ? 'text-amber-400' : 'text-green-400'
              }`}>
                {difficulty.toUpperCase()} · {game.innings} INN
              </p>
              {summary.mvp.character && (
                <div className="mt-2 pt-2 border-t border-border/20">
                  <span className="text-[9px] text-amber-400/50">MVP</span>
                  <p className="text-sm font-black">{summary.mvp.character}</p>
                  <p className="text-[10px] text-muted/40">{summary.mvp.hits} H · {summary.mvp.rbis} RBI</p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-3 gap-2 mb-2">
              <button
                onClick={() => {
                  window.open(
                    `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`,
                    '_blank',
                    'width=550,height=420',
                  );
                }}
                className="py-2.5 rounded-xl bg-[#1da1f2]/10 border border-[#1da1f2]/20 text-[#1da1f2] text-xs font-bold"
              >
                Twitter
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(shareText).catch(() => {
                    window.prompt('Copy this:', shareText);
                  });
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="py-2.5 rounded-xl bg-surface border border-border text-xs font-bold text-muted"
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
              <button
                onClick={handleShare}
                className="py-2.5 rounded-xl bg-accent text-white text-xs font-bold"
              >
                Image
              </button>
            </div>

            <button
              onClick={onClose}
              className="w-full py-2 rounded-xl bg-surface border border-border text-xs text-muted"
            >
              Close
            </button>
          </div>

          <canvas ref={canvasRef} className="hidden" />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
