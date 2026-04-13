'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { getFloorPrices, FloorPrice } from '@/lib/marketData';
import { SCARCITY_CONFIG, Scarcity } from '@/data/types';

interface FloorPriceTableProps {
  onCharacterClick?: (character: string) => void;
}

export default function FloorPriceTable({ onCharacterClick }: FloorPriceTableProps) {
  const [sortCol, setSortCol] = useState<'floor' | 'change' | 'volume'>('volume');
  const [expanded, setExpanded] = useState(false);

  const floors = useMemo(() => {
    const data = getFloorPrices();
    const sorted = [...data];
    switch (sortCol) {
      case 'floor': sorted.sort((a, b) => b.floor - a.floor); break;
      case 'change': sorted.sort((a, b) => b.change24h - a.change24h); break;
      case 'volume': sorted.sort((a, b) => b.volume7d - a.volume7d); break;
    }
    return sorted;
  }, [sortCol]);

  const displayed = expanded ? floors : floors.slice(0, 10);

  return (
    <div className="rounded-xl border border-border overflow-hidden">
      <div className="flex items-center justify-between px-3 py-2 bg-surface">
        <span className="text-[10px] text-muted uppercase tracking-wider font-bold">Floor Prices</span>
        <div className="flex gap-1">
          {(['volume', 'floor', 'change'] as const).map(col => (
            <button
              key={col}
              onClick={() => setSortCol(col)}
              className={`px-2 py-0.5 rounded text-[10px] font-medium transition-colors ${
                sortCol === col ? 'bg-accent/20 text-accent' : 'text-muted hover:text-foreground'
              }`}
            >
              {col === 'volume' ? 'Volume' : col === 'floor' ? 'Price' : 'Change'}
            </button>
          ))}
        </div>
      </div>
      <table className="w-full text-[11px]">
        <thead>
          <tr className="border-b border-border/50 text-muted">
            <th className="px-3 py-1.5 text-left">Character</th>
            <th className="px-3 py-1.5 text-left">Scarcity</th>
            <th className="px-3 py-1.5 text-right">Floor</th>
            <th className="px-3 py-1.5 text-right">24h</th>
            <th className="px-3 py-1.5 text-right">7d Vol</th>
            <th className="px-3 py-1.5 text-right">Listed</th>
          </tr>
        </thead>
        <tbody>
          {displayed.map((fp, i) => {
            const isUp = fp.change24h > 0;
            const changeColor = Math.abs(fp.change24h) < 0.5 ? 'text-muted' : isUp ? 'text-green-400' : 'text-red-400';
            return (
              <tr
                key={`${fp.character}-${fp.scarcity}-${i}`}
                className="border-b border-border/30 hover:bg-surface-hover transition-colors cursor-pointer"
                onClick={() => onCharacterClick?.(fp.character)}
              >
                <td className="px-3 py-1.5 font-medium text-foreground truncate max-w-[120px]">{fp.character}</td>
                <td className="px-3 py-1.5">
                  <span className="font-mono font-bold uppercase" style={{ color: SCARCITY_CONFIG[fp.scarcity].color }}>
                    {SCARCITY_CONFIG[fp.scarcity].label}
                  </span>
                </td>
                <td className="px-3 py-1.5 text-right font-mono font-bold text-green-400">${fp.floor.toFixed(2)}</td>
                <td className={`px-3 py-1.5 text-right font-mono ${changeColor}`}>
                  {Math.abs(fp.change24h) < 0.5 ? '--' : `${isUp ? '+' : ''}${fp.change24h.toFixed(1)}%`}
                </td>
                <td className="px-3 py-1.5 text-right font-mono text-muted">{fp.volume7d}</td>
                <td className="px-3 py-1.5 text-right font-mono text-muted">{fp.listings}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {floors.length > 10 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full py-2 text-[10px] text-accent hover:text-accent/80 bg-surface border-t border-border/50"
        >
          {expanded ? 'Show less' : `Show all ${floors.length} floors`}
        </button>
      )}
    </div>
  );
}
