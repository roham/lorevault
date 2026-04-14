'use client';

import Link from 'next/link';
import { SOCIAL_FEED, SOCIAL_FEED_CONFIG } from '@/data/social-feed';

function FeedItem({ item }: { item: typeof SOCIAL_FEED[0] }) {
  const config = SOCIAL_FEED_CONFIG[item.type];

  const content = (
    <div className="flex items-start gap-3 p-3 rounded-xl bg-surface/40 border border-border/20 hover:bg-surface/60 transition-colors">
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center text-sm shrink-0"
        style={{ backgroundColor: `${item.accent}15` }}
      >
        {item.icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span
            className="text-[8px] uppercase tracking-[0.1em] font-bold px-1.5 py-0.5 rounded-full"
            style={{ backgroundColor: `${config.color}20`, color: config.color }}
          >
            {config.label}
          </span>
          <span className="text-[10px] text-muted/50">{item.timestamp}</span>
        </div>
        <div className="text-xs font-medium text-foreground/90 leading-snug">{item.text}</div>
        {item.subtext && (
          <div className="text-[10px] text-muted mt-0.5">{item.subtext}</div>
        )}
      </div>
    </div>
  );

  if (item.link) {
    return <Link href={item.link}>{content}</Link>;
  }
  return content;
}

export default function SocialFeed() {
  return (
    <div className="space-y-2">
      {SOCIAL_FEED.slice(0, 6).map((item) => (
        <FeedItem key={item.id} item={item} />
      ))}
    </div>
  );
}
