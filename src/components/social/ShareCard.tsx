'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, SCARCITY_CONFIG } from '@/data/types';
import { getPopulationData, getAgingTiers, getOriginBadge } from '@/lib/store';
import { PROFILE } from '@/data/profile';

interface ShareCardProps {
  card: Card;
  onClose: () => void;
}

export default function ShareCard({ card, onClose }: ShareCardProps) {
  const [copied, setCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scarcityConfig = SCARCITY_CONFIG[card.scarcity];
  const popData = getPopulationData(card);
  const agingTiers = getAgingTiers(card.id);
  const originBadge = getOriginBadge(card.id);

  const generateImage = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    canvas.width = 600;
    canvas.height = 340;

    // Background
    const grad = ctx.createLinearGradient(0, 0, 600, 340);
    grad.addColorStop(0, '#0a0b14');
    grad.addColorStop(1, '#12141f');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 600, 340);

    // Border accent
    ctx.strokeStyle = scarcityConfig.color;
    ctx.lineWidth = 2;
    ctx.roundRect(8, 8, 584, 324, 16);
    ctx.stroke();

    // Card color bar
    ctx.fillStyle = scarcityConfig.color;
    ctx.fillRect(0, 0, 6, 340);

    // Character name
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 28px system-ui';
    ctx.fillText(card.character, 30, 50);

    // Moment
    ctx.fillStyle = '#6b7094';
    ctx.font = '14px system-ui';
    ctx.fillText(card.moment, 30, 72);

    // Scarcity badge
    ctx.fillStyle = scarcityConfig.color;
    ctx.font = 'bold 13px system-ui';
    ctx.fillText(scarcityConfig.label.toUpperCase(), 30, 105);

    // Serial
    if (card.scarcity !== 'common') {
      ctx.fillStyle = '#818cf8';
      ctx.font = 'bold 13px monospace';
      ctx.fillText(`#${card.serialNumber} of ${popData.totalMinted}`, 30, 125);
    }

    // Population
    ctx.fillStyle = '#6b7094';
    ctx.font = '12px system-ui';
    ctx.fillText(`${popData.totalMinted} minted · ${popData.currentOwners} collectors`, 30, 150);

    // Set
    ctx.fillText(card.set, 30, 170);

    // Origin badge
    if (originBadge) {
      ctx.fillStyle = originBadge.color;
      ctx.font = 'bold 12px system-ui';
      ctx.fillText(`${originBadge.icon} ${originBadge.label}`, 30, 195);
    }

    // Aging
    if (agingTiers?.battle) {
      ctx.fillStyle = '#d4a76a';
      ctx.font = '12px system-ui';
      ctx.fillText(`Aging: ${agingTiers.battle}${agingTiers.time ? ` + ${agingTiers.time}` : ''}`, 30, 215);
    }

    // Owner
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 14px system-ui';
    ctx.fillText(`Owned by ${PROFILE.username}`, 30, 280);

    // LoreVault branding
    ctx.fillStyle = '#3a3d5c';
    ctx.font = '11px system-ui';
    ctx.fillText('lorevault.app', 30, 310);

    // Price/value watermark
    ctx.fillStyle = scarcityConfig.color + '40';
    ctx.font = 'bold 80px system-ui';
    ctx.textAlign = 'right';
    ctx.fillText(card.symbol, 570, 280);
    ctx.textAlign = 'left';

    return canvas.toDataURL('image/png');
  }, [card, scarcityConfig, popData, agingTiers, originBadge]);

  const handleShare = useCallback(async () => {
    const dataUrl = await generateImage();
    if (!dataUrl) return;

    // Try native share API
    if (navigator.share && navigator.canShare) {
      try {
        const blob = await (await fetch(dataUrl)).blob();
        const file = new File([blob], `${card.character}-lorevault.png`, { type: 'image/png' });
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: `${card.character} — LoreVault`,
            text: `Check out my ${scarcityConfig.label} ${card.character} #${card.serialNumber}/${popData.totalMinted}!`,
            files: [file],
          });
          return;
        }
      } catch {
        // Fall through to download
      }
    }

    // Fallback: download
    const link = document.createElement('a');
    link.download = `${card.character.toLowerCase().replace(/\s+/g, '-')}-lorevault.png`;
    link.href = dataUrl;
    link.click();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [card, generateImage, scarcityConfig, popData]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center px-4"
        onClick={onClose}
      >
        <div className="absolute inset-0 bg-black/70" />
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative z-10 w-full max-w-md"
          onClick={e => e.stopPropagation()}
        >
          <div className="rounded-2xl bg-surface border border-border p-4">
            <div className="text-xs text-muted uppercase tracking-wider mb-3">Share Card</div>

            {/* Preview */}
            <div
              className="rounded-xl p-4 mb-4 relative overflow-hidden"
              style={{
                background: `linear-gradient(135deg, #0a0b14, #12141f)`,
                border: `1px solid ${scarcityConfig.color}30`,
              }}
            >
              <div className="absolute left-0 top-0 bottom-0 w-1" style={{ background: scarcityConfig.color }} />
              <div className="text-lg font-bold text-foreground">{card.character}</div>
              <div className="text-xs text-muted mb-2">{card.moment}</div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold uppercase" style={{ color: scarcityConfig.color }}>{scarcityConfig.label}</span>
                {card.scarcity !== 'common' && (
                  <span className="text-[10px] font-mono text-muted">#{card.serialNumber}/{popData.totalMinted}</span>
                )}
              </div>
              <div className="text-[10px] text-muted">{popData.totalMinted} minted · {popData.currentOwners} collectors</div>
              {originBadge && (
                <div className="text-[10px] mt-1" style={{ color: originBadge.color }}>{originBadge.icon} {originBadge.label}</div>
              )}
              <div className="text-xs text-foreground mt-3 font-semibold">Owned by {PROFILE.username}</div>
              <div className="absolute bottom-2 right-4 text-4xl opacity-10">{card.symbol}</div>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-2">
              <button
                onClick={() => {
                  const text = `Check out my ${scarcityConfig.label} ${card.character} #${card.serialNumber}/${popData.totalMinted} on LoreVault!`;
                  const url = `${window.location.origin}/card/${card.id}`;
                  window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank', 'width=550,height=420');
                }}
                className="py-2.5 rounded-xl bg-[#1da1f2]/10 border border-[#1da1f2]/20 text-[#1da1f2] text-xs font-bold"
              >
                Twitter
              </button>
              <button
                onClick={() => {
                  const url = `${window.location.origin}/card/${card.id}`;
                  navigator.clipboard.writeText(url).catch(() => {
                    // Fallback: prompt user to copy manually
                    window.prompt('Copy this link:', url);
                  });
                  setLinkCopied(true);
                  setTimeout(() => setLinkCopied(false), 2000);
                }}
                className="py-2.5 rounded-xl bg-surface border border-border text-xs font-bold text-muted"
              >
                {linkCopied ? '✓ Copied!' : '🔗 Link'}
              </button>
              <button
                onClick={handleShare}
                className="py-2.5 rounded-xl bg-accent text-white text-xs font-bold"
              >
                {copied ? '✓ Saved!' : '💾 Image'}
              </button>
            </div>
            <button
              onClick={onClose}
              className="w-full py-2 rounded-xl bg-surface border border-border text-xs text-muted"
            >
              Close
            </button>
          </div>

          {/* Hidden canvas for image generation */}
          <canvas ref={canvasRef} className="hidden" />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
