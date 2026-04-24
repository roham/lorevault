#!/usr/bin/env python3
import json
from collections import defaultdict

with open('.taste-daemon/latest-votes.json') as f:
    data = json.load(f)
votes = data['votes']

with open('public/moodboard-art/manifest.json') as f:
    manifest = json.load(f)

item_map = {item['id']: item for item in manifest.get('items', [])}

style_tally = defaultdict(lambda: {'yes': 0, 'no': 0, 'other': 0})
char_tally = defaultdict(lambda: {'yes': 0, 'no': 0, 'other': 0})
charXstyle_tally = defaultdict(lambda: {'yes': 0, 'no': 0, 'other': 0})
unmatched = []

for v in votes:
    item_id = v['itemId']
    vote = v.get('vote', 'other')
    if item_id in item_map:
        item = item_map[item_id]
        s = item.get('styleSlug', 'unknown')
        c = item.get('characterSlug', 'unknown')
        style_tally[s][vote] = style_tally[s].get(vote, 0) + 1
        char_tally[c][vote] = char_tally[c].get(vote, 0) + 1
        charXstyle_tally[f'{c}::{s}'][vote] = charXstyle_tally[f'{c}::{s}'].get(vote, 0) + 1
    else:
        unmatched.append(item_id)

def approval_pct(counts):
    total = counts['yes'] + counts['no']
    return (counts['yes'] / total * 100) if total else None, total

print('=== STYLE APPROVAL RATES (sorted by total yes+no votes) ===')
for style, counts in sorted(style_tally.items(), key=lambda x: -(x[1]['yes']+x[1]['no'])):
    pct, total = approval_pct(counts)
    if pct is None:
        print(f'{style}: no yes/no votes')
        continue
    flag = ''
    if total >= 10:
        if pct >= 55: flag = ' *** APPROVED'
        elif pct <= 20: flag = ' --- REJECTED'
    print(f'{style}: {pct:.0f}% ({counts["yes"]}/{total}, {counts["other"]} other){flag}')

print()
print('=== CHARACTER APPROVAL RATES ===')
for char, counts in sorted(char_tally.items(), key=lambda x: -(x[1]['yes']+x[1]['no'])):
    pct, total = approval_pct(counts)
    if pct is None:
        print(f'{char}: no yes/no votes')
        continue
    print(f'{char}: {pct:.0f}% ({counts["yes"]}/{total})')

print()
print('=== CHAR x STYLE PINS (>= 5 yes+no votes, >= 80%) ===')
pins = []
for key, counts in sorted(charXstyle_tally.items()):
    pct, total = approval_pct(counts)
    if pct is None: continue
    if total >= 5 and pct >= 80:
        print(f'  PIN: {key}: {pct:.0f}% ({counts["yes"]}/{total})')
        pins.append(key)
if not pins:
    print('  (none yet — need 5+ votes on a single char×style pair)')

print()
print(f'Unmatched: {len(unmatched)} votes (IDs not in current manifest)')
if unmatched:
    print('  e.g.:', unmatched[:3])

print()
# Rejection clusters — styles with 0% approval on 3+ votes
print('=== STRONG REJECTION SIGNALS (0% with 3+ votes) ===')
for style, counts in sorted(style_tally.items()):
    pct, total = approval_pct(counts)
    if pct is not None and pct == 0 and total >= 3:
        print(f'  {style}: 0% ({counts["no"]} no votes)')
