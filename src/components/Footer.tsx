import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="hidden md:block border-t border-border bg-surface/50 mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">📜</span>
              <span className="font-bold text-foreground">LoreVault</span>
            </div>
            <p className="text-xs text-muted leading-relaxed">
              Premium digital collectible cards featuring the greatest characters from public domain literature, mythology, and folklore.
            </p>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-3">Collect</h4>
            <div className="space-y-2">
              <Link href="/packs" className="block text-xs text-muted hover:text-accent transition-colors">Open Packs</Link>
              <Link href="/marketplace" className="block text-xs text-muted hover:text-accent transition-colors">Marketplace</Link>
              <Link href="/collection" className="block text-xs text-muted hover:text-accent transition-colors">My Collection</Link>
            </div>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-3">Play</h4>
            <div className="space-y-2">
              <Link href="/challenges" className="block text-xs text-muted hover:text-accent transition-colors">Challenges</Link>
              <Link href="/leaderboard" className="block text-xs text-muted hover:text-accent transition-colors">Leaderboards</Link>
              <Link href="/profile" className="block text-xs text-muted hover:text-accent transition-colors">Profile</Link>
            </div>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-3">Sets</h4>
            <div className="space-y-2">
              <Link href="/collection?set=baker-street" className="block text-xs text-muted hover:text-accent transition-colors">🔍 Baker Street Files</Link>
              <Link href="/collection?set=enchanted-kingdom" className="block text-xs text-muted hover:text-accent transition-colors">👑 Enchanted Kingdom</Link>
              <Link href="/collection?set=wonderland" className="block text-xs text-muted hover:text-accent transition-colors">🐇 Wonderland Descending</Link>
              <Link href="/collection?set=gothic-horror" className="block text-xs text-muted hover:text-accent transition-colors">🦇 Castle of Otranto</Link>
              <Link href="/collection?set=olympus" className="block text-xs text-muted hover:text-accent transition-colors">⚡ Olympus Rising</Link>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-4 border-t border-border text-center text-xs text-muted/50">
          LoreVault — All characters are from the public domain. No rights reserved.
        </div>
      </div>
    </footer>
  );
}
