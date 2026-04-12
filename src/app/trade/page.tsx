'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CardItem from '@/components/CardItem';
import { OWNED_CARDS, ALL_CARDS } from '@/data/cards';
import { Card, SCARCITY_CONFIG } from '@/data/types';

// Mock trade proposals
const INCOMING_TRADES = [
  {
    id: 'trade-1',
    from: 'DarkArchive',
    offering: [ALL_CARDS[42], ALL_CARDS[67]],
    requesting: [OWNED_CARDS[3]],
    status: 'pending' as const,
    timeAgo: '2 hours ago',
  },
  {
    id: 'trade-2',
    from: 'MythKeeper',
    offering: [ALL_CARDS[85]],
    requesting: [OWNED_CARDS[7], OWNED_CARDS[12]],
    status: 'pending' as const,
    timeAgo: '5 hours ago',
  },
];

export default function TradePage() {
  const [myOffer, setMyOffer] = useState<Card[]>([]);
  const [theirOffer, setTheirOffer] = useState<Card[]>([]);
  const [showMyPicker, setShowMyPicker] = useState(false);
  const [showTheirPicker, setShowTheirPicker] = useState(false);
  const [tradePartner, setTradePartner] = useState('');

  const addToMyOffer = (card: Card) => {
    if (myOffer.length < 5 && !myOffer.find(c => c.id === card.id)) {
      setMyOffer([...myOffer, card]);
    }
    setShowMyPicker(false);
  };

  const addToTheirRequest = (card: Card) => {
    if (theirOffer.length < 5 && !theirOffer.find(c => c.id === card.id)) {
      setTheirOffer([...theirOffer, card]);
    }
    setShowTheirPicker(false);
  };

  const myOfferValue = myOffer.reduce((sum, c) => sum + c.price, 0);
  const theirOfferValue = theirOffer.reduce((sum, c) => sum + c.price, 0);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
      <h1 className="text-2xl font-bold mb-1">Trade Center</h1>
      <p className="text-sm text-muted mb-8">Propose trades with other collectors. Build the collection you want.</p>

      {/* Incoming Trade Proposals */}
      <section className="mb-10">
        <h2 className="text-lg font-bold mb-4">Incoming Proposals ({INCOMING_TRADES.length})</h2>
        <div className="space-y-4">
          {INCOMING_TRADES.map((trade) => (
            <motion.div
              key={trade.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-xl bg-surface border border-border"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-sm">👤</div>
                  <div>
                    <span className="text-sm font-semibold">{trade.from}</span>
                    <span className="text-xs text-muted ml-2">{trade.timeAgo}</span>
                  </div>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                  Pending
                </span>
              </div>

              <div className="grid grid-cols-[1fr_auto_1fr] gap-4 items-center">
                {/* They offer */}
                <div>
                  <div className="text-xs text-muted mb-2">They offer:</div>
                  <div className="flex gap-2">
                    {trade.offering.map(card => card && (
                      <CardItem key={card.id} card={card} size="sm" />
                    ))}
                  </div>
                </div>

                {/* Arrow */}
                <div className="flex flex-col items-center gap-1">
                  <span className="text-xl">⇄</span>
                </div>

                {/* They want */}
                <div>
                  <div className="text-xs text-muted mb-2">They want:</div>
                  <div className="flex gap-2">
                    {trade.requesting.map(card => card && (
                      <CardItem key={card.id} card={card} size="sm" />
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <button className="px-4 py-2 rounded-lg bg-green-500/20 text-green-400 text-xs font-semibold hover:bg-green-500/30 transition-colors border border-green-500/20">
                  Accept Trade
                </button>
                <button className="px-4 py-2 rounded-lg bg-red-500/10 text-red-400 text-xs font-semibold hover:bg-red-500/20 transition-colors border border-red-500/20">
                  Decline
                </button>
                <button className="px-4 py-2 rounded-lg bg-surface text-muted text-xs font-semibold hover:bg-surface-hover transition-colors border border-border">
                  Counter-Offer
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Create New Trade */}
      <section>
        <h2 className="text-lg font-bold mb-4">Create a Trade</h2>
        <div className="p-6 rounded-xl bg-surface border border-border">
          {/* Trade partner */}
          <div className="mb-6">
            <label className="text-xs text-muted mb-2 block">Trade with:</label>
            <input
              type="text"
              placeholder="Enter collector username..."
              value={tradePartner}
              onChange={(e) => setTradePartner(e.target.value)}
              className="px-3 py-2 rounded-lg bg-background border border-border text-sm text-foreground placeholder-muted focus:outline-none focus:border-accent/50 w-64"
            />
          </div>

          <div className="grid grid-cols-[1fr_auto_1fr] gap-6 items-start">
            {/* Your offer */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold">You offer:</h3>
                <span className="text-xs text-green-400 font-mono">${myOfferValue.toFixed(2)}</span>
              </div>
              <div className="min-h-[220px] p-4 rounded-xl border-2 border-dashed border-accent/20 bg-accent/5">
                {myOffer.length === 0 ? (
                  <button
                    onClick={() => setShowMyPicker(true)}
                    className="w-full h-full min-h-[196px] flex flex-col items-center justify-center text-muted/40 hover:text-muted/60 transition-colors"
                  >
                    <span className="text-3xl mb-2">+</span>
                    <span className="text-xs">Add cards from your collection</span>
                  </button>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {myOffer.map(card => (
                      <div key={card.id} className="relative group">
                        <CardItem card={card} size="sm" />
                        <button
                          onClick={() => setMyOffer(myOffer.filter(c => c.id !== card.id))}
                          className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500/80 text-white text-[10px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
                        >
                          x
                        </button>
                      </div>
                    ))}
                    {myOffer.length < 5 && (
                      <button
                        onClick={() => setShowMyPicker(true)}
                        className="w-[140px] h-[196px] rounded-xl border-2 border-dashed border-border/40 flex items-center justify-center text-muted/40 hover:text-muted/60"
                      >
                        <span className="text-2xl">+</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Trade arrow */}
            <div className="flex flex-col items-center justify-center pt-20">
              <span className="text-2xl text-accent">⇄</span>
              <div className="text-[10px] text-muted mt-1">
                {myOfferValue > theirOfferValue ? (
                  <span className="text-green-400">You overpay</span>
                ) : myOfferValue < theirOfferValue ? (
                  <span className="text-red-400">They overpay</span>
                ) : (
                  <span>Even trade</span>
                )}
              </div>
            </div>

            {/* You request */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold">You request:</h3>
                <span className="text-xs text-green-400 font-mono">${theirOfferValue.toFixed(2)}</span>
              </div>
              <div className="min-h-[220px] p-4 rounded-xl border-2 border-dashed border-purple-500/20 bg-purple-500/5">
                {theirOffer.length === 0 ? (
                  <button
                    onClick={() => setShowTheirPicker(true)}
                    className="w-full h-full min-h-[196px] flex flex-col items-center justify-center text-muted/40 hover:text-muted/60 transition-colors"
                  >
                    <span className="text-3xl mb-2">+</span>
                    <span className="text-xs">Add cards you want</span>
                  </button>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {theirOffer.map(card => (
                      <div key={card.id} className="relative group">
                        <CardItem card={card} size="sm" />
                        <button
                          onClick={() => setTheirOffer(theirOffer.filter(c => c.id !== card.id))}
                          className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500/80 text-white text-[10px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
                        >
                          x
                        </button>
                      </div>
                    ))}
                    {theirOffer.length < 5 && (
                      <button
                        onClick={() => setShowTheirPicker(true)}
                        className="w-[140px] h-[196px] rounded-xl border-2 border-dashed border-border/40 flex items-center justify-center text-muted/40 hover:text-muted/60"
                      >
                        <span className="text-2xl">+</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Send trade button */}
          <div className="mt-6 flex justify-center">
            <button
              className={`px-8 py-3 rounded-xl text-sm font-semibold transition-colors ${
                myOffer.length > 0 && theirOffer.length > 0 && tradePartner
                  ? 'bg-accent text-white hover:bg-accent/90'
                  : 'bg-surface text-muted cursor-not-allowed border border-border'
              }`}
              disabled={myOffer.length === 0 || theirOffer.length === 0 || !tradePartner}
            >
              Send Trade Proposal
            </button>
          </div>
        </div>
      </section>

      {/* Card Picker Modal */}
      <AnimatePresence>
        {(showMyPicker || showTheirPicker) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
            onClick={() => { setShowMyPicker(false); setShowTheirPicker(false); }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-surface rounded-2xl border border-border p-6 max-w-3xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-bold mb-4">
                {showMyPicker ? 'Select from your collection' : 'Select cards you want'}
              </h3>
              <div className="flex flex-wrap gap-3">
                {(showMyPicker ? OWNED_CARDS : ALL_CARDS.filter(c => !c.owned)).slice(0, 20).map(card => (
                  <div
                    key={card.id}
                    onClick={() => showMyPicker ? addToMyOffer(card) : addToTheirRequest(card)}
                    className="cursor-pointer hover:ring-2 hover:ring-accent rounded-xl transition-all"
                  >
                    <CardItem card={card} size="sm" showPrice />
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
