import { NextResponse } from 'next/server';

/**
 * V2 Journal subscription stub. Phase 5 §1 calls for a real Mailchimp/Klaviyo
 * pipeline at launch; for the scaffold we accept the email and redirect back
 * to /v2 with a confirmation flag. Daemon Track A picks up the actual mail
 * sender wiring.
 */
export async function POST(req: Request) {
  const form = await req.formData();
  const email = form.get('email');
  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return NextResponse.redirect(new URL('/v2/welcome?err=email', req.url), {
      status: 303,
    });
  }
  // Stub: log to server console only; no third-party send wired yet.
  // eslint-disable-next-line no-console
  console.log('[v2-journal-subscribe]', email);
  return NextResponse.redirect(new URL('/v2?subscribed=1', req.url), {
    status: 303,
  });
}
