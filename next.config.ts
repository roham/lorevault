import type { NextConfig } from "next";

/**
 * `/` → `/v2` per Phase 4-5 site-scaffold directive.
 *
 * The v1 13-module retention dashboard is preserved at /v1 so it can be
 * referenced for taste comparison, but it is no longer the user's first
 * impression of LoreVault.
 */
const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/v2',
        permanent: false,
      },
      {
        source: '/v3/gdd',
        destination: '/v3/gdd-v2',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
