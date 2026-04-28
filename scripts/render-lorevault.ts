// scripts/render-lorevault.ts
// TypeScript entry point — runtime is identical to scripts/render-lorevault.mjs.
// Repo runs Node 22 (no bun, no ts-node available); the .mjs file is the
// canonical executable. This .ts file documents the API contract and lets
// IDEs/typecheckers see the script under its TypeScript name.
//
// To run:    node scripts/render-lorevault.mjs           (canonical)
//   or:      npm run render
//
// CLI (both files):
//   --force                 re-render even if PNG exists
//   --dry-run               print plan without API calls
//   --pane=<pane>           filter by pane id
//   --card=<card_id>        filter by card id
//   --no-wait               do not poll for manifest
//   --max-cards=<n>         cap card count
//   --variants=a,b,c        subset of {silhouette,hero,gesture}
//   --prefer=<openai|flux>  force model preference

export {};
