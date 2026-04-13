'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, SCARCITY_CONFIG } from '@/data/types';
import { getCardMarketData, addToWatchlist } from '@/lib/marketData';

interface PriceAlertModalProps {
  card: Card | null;
  onClose: () => void;
  onSave: (cardId: string, targetPrice: number) => void;
}

export default function PriceAlertModal({ card, onClose, onSave }: PriceAlertModalProps) {
  const [targetPrice, setTargetPrice] = useState('');

  if (!card) return null;

  const data = getCardMarketData(card.id);
  const currentPrice = data?.currentPrice || card.price;

  const quickPrices = [
    { label: '-10%', value: Math.round(currentPrice * 0.9 * 100) / 100 },
    { label: '-25%', value: Math.round(currentPrice * 0.75 * 100) / 100 },
    { label: '-50%', value: Math.round(currentPrice * 0.5 * 100) / 100 },
    { label: 'Floor', value: Math.round((data?.floorPrice || currentPrice * 0.8) * 100) / 100 },
  ];

  const handleSave = () => {
    const price = parseFloat(targetPrice);
    if (price > 0) {
      onSave(card.id, price);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center px-4"
        onClick={onClose}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-sm rounded-2xl bg-surface border border-border shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="p-4 border-b border-border/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg">{card.symbol}</span>
                <div>
                  <div className="text-sm font-bold">{card.character}</div>
                  <div className="text-[10px] text-muted">{card.moment}</div>
                </div>
              </div>
              <button onClick={onClose} className="text-muted hover:text-foreground text-sm">x</button>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 space-y-4">
            {/* Current price */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted">Current Price</span>
              <span className="text-sm font-bold text-green-400 font-mono">${currentPrice.toFixed(2)}</span>
            </div>

            {/* Target price input */}
            <div>
              <label className="text-[10px] text-muted uppercase tracking-wider block mb-1">
                Alert me when price drops to
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-sm">$</span>
                <input
                  type="number"
                  value={targetPrice}
                  onChange={(e) => setTargetPrice(e.target.value)}
                  placeholder={quickPrices[0].value.toString()}
                  className="w-full px-3 py-2.5 pl-7 rounded-xl bg-background border border-border text-sm font-mono text-foreground placeholder-muted focus:outline-none focus:border-accent/50"
                  autoFocus
                />
              </div>
            </div>

            {/* Quick price buttons */}
            <div className="flex gap-2">
              {quickPrices.map(qp => (
                <button
                  key={qp.label}
                  onClick={() => setTargetPrice(qp.value.toString())}
                  className="flex-1 py-2 rounded-lg bg-background border border-border text-center hover:border-accent/30 transition-colors"
                >
                  <div className="text-[10px] text-muted">{qp.label}</div>
                  <div className="text-xs font-mono font-bold text-foreground">${qp.value.toFixed(2)}</div>
                </button>
              ))}
            </div>

            {/* Save button */}
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleSave}
              className="w-full py-2.5 rounded-xl bg-accent text-white text-sm font-bold hover:bg-accent/90 transition-colors"
            >
              Set Price Alert
            </motion.button>

            <p className="text-[9px] text-muted text-center">
              Price alerts are simulated in this prototype.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
