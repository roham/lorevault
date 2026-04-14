import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// eBay Marketplace Account Deletion Notification endpoint
// Required to enable eBay API keysets
// Docs: https://developer.ebay.com/marketplace-account-deletion

const VERIFICATION_TOKEN = process.env.EBAY_VERIFICATION_TOKEN || 'lorevault-cardvault-verification-2026';
const ENDPOINT_URL = process.env.EBAY_ENDPOINT_URL || 'https://lorevault-site.vercel.app/api/ebay/account-deletion';

// GET — eBay challenge verification
// eBay sends: ?challenge_code=xxx
// We respond with: { challengeResponse: hash(challenge_code + verification_token + endpoint) }
export async function GET(request: NextRequest) {
  const challengeCode = request.nextUrl.searchParams.get('challenge_code');

  if (!challengeCode) {
    return NextResponse.json({ status: 'active', message: 'eBay Account Deletion endpoint is live' });
  }

  // Hash: SHA-256 of (challengeCode + verificationToken + endpoint)
  const hash = crypto
    .createHash('sha256')
    .update(challengeCode + VERIFICATION_TOKEN + ENDPOINT_URL)
    .digest('hex');

  return NextResponse.json(
    { challengeResponse: hash },
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }
  );
}

// POST — Account deletion notification
// eBay sends user account deletion events here
// We acknowledge receipt (we don't store user PII, so nothing to delete)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('[eBay] Account deletion notification received:', JSON.stringify(body).slice(0, 200));

    // Acknowledge receipt — CardVault doesn't store eBay user PII
    // so there's nothing to delete, but we must acknowledge
    return NextResponse.json({ status: 'ok' }, { status: 200 });
  } catch {
    return NextResponse.json({ status: 'ok' }, { status: 200 });
  }
}
