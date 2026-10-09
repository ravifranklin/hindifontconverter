import { isIP } from 'node:net';

const MAX_BODY_BYTES = 32768;
const NO_STORE = { 'Cache-Control': 'no-store' };
const json = (message: string, status: number) =>
  Response.json({ message }, { status, headers: NO_STORE });

// Conservative single-mailbox validation; reject lists and header injection.
function validEmail(value: string): boolean {
  if (value.length > 254 || /\s/.test(value)) return false;
  const parts = value.split('@');
  if (parts.length !== 2) return false;
  const [local, domain] = parts;
  if (!local || local.length > 64 || local.startsWith('.') || local.endsWith('.') || local.includes('..')) return false;
  if (!/^[A-Za-z0-9.!#$%&'*+\/=?^_`{|}~-]+$/.test(local)) return false;
  const labels = domain.split('.');
  return domain.length <= 253 && labels.length >= 2 && labels.every(label =>
    /^[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?$/.test(label)
  ) && /^[A-Za-z]{2,63}$/.test(labels[labels.length - 1]);
}

async function rateLimiter(): Promise<RateLimit | null> {
  try {
    // Object bindings must come from the Worker runtime, not process.env.
    const { env } = await import('cloudflare:workers');
    const binding = (env as Cloudflare.Env).CONTACT_RATE_LIMITER;
    return binding && typeof binding.limit === 'function' ? binding : null;
  } catch {
    return null; // No in-memory fallback: missing bindings fail closed.
  }
}

function configuration() {
  // Server-only runtime lookup. This project's nodejs_compat/date expose Worker
  // secrets through process.env. Never return/log these or use public variables.
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const rawRecipient = process.env.CONTACT_RECIPIENT_EMAIL;
  const recipient = rawRecipient?.trim();
  const turnstileSecret = process.env.TURNSTILE_SECRET_KEY?.trim();
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim();
  return apiKey && !/\s/.test(apiKey) && turnstileSecret && !/\s/.test(turnstileSecret) &&
    siteKey && /^[A-Za-z0-9_-]+$/.test(siteKey) && recipient &&
    !/[\x00-\x1f\x7f]/.test(rawRecipient!) && validEmail(recipient)
    ? { apiKey, recipient, turnstileSecret, siteKey } : null;
}

class BodyTooLarge extends Error {}

async function readBody(request: Request): Promise<unknown> {
  // Bound actual streamed bytes; Content-Length can be absent or dishonest.
  if (!request.body) throw new SyntaxError('Empty body');
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_BODY_BYTES) {
        await reader.cancel();
        throw new BodyTooLarge();
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes));
}

export async function GET() {
  const config = configuration();
  const configured = config !== null && await rateLimiter() !== null;
  // Only the public site key is returned. Private keys and recipient stay private.
  return Response.json({ configured, siteKey: configured ? config!.siteKey : null }, { headers: NO_STORE });
}

export async function POST(request: Request) {
  const origin = request.headers.get('origin');
  if (!origin || origin !== new URL(request.url).origin) return json('Request origin is not allowed.', 403);
  const config = configuration();
  const limiter = await rateLimiter();
  if (!config || !limiter) return Response.json({ message: 'Contact email or spam protection is not configured. Nothing was sent.', configured: false }, { status: 503, headers: NO_STORE });
  // Cloudflare supplies this header. Never trust an IP sent in JSON or X-Forwarded-For.
  const remoteip = request.headers.get('CF-Connecting-IP');
  if (!remoteip || isIP(remoteip) === 0) return json('Contact spam protection is unavailable. Please try again later.', 503);
  try {
    const outcome = await limiter.limit({ key: `akshar-contact:${remoteip}` });
    if (outcome.success === false) return Response.json({ message: 'Too many contact attempts. Please wait one minute and try again.' }, { status: 429, headers: { ...NO_STORE, 'Retry-After': '60' } });
    if (outcome.success !== true) throw new Error('Limiter unavailable');
  } catch {
    return json('Contact spam protection is unavailable. Please try again later.', 503);
  }
  if (request.headers.get('content-type')?.split(';')[0].trim().toLowerCase() !== 'application/json') {
    return json('Please submit the contact form as JSON.', 415);
  }
  if (Number(request.headers.get('content-length') || 0) > MAX_BODY_BYTES) return json('Message is too large.', 413);

  let body: unknown;
  try {
    body = await readBody(request);
  } catch (error) {
    return error instanceof BodyTooLarge ? json('Message is too large.', 413) : json('Invalid contact form data.', 400);
  }
  if (!body || typeof body !== 'object' || Array.isArray(body)) return json('Invalid contact form data.', 400);
  const b = body as Record<string, unknown>;
  if (typeof b.name !== 'string' || typeof b.email !== 'string' || typeof b.message !== 'string') {
    return json('Please check your name, email and message.', 400);
  }
  const name = b.name.trim(), email = b.email.trim(), message = b.message.trim();
  if (name.length < 2 || b.name.length > 100 || /[\x00-\x1f\x7f]/.test(b.name) ||
    /[\x00-\x1f\x7f]/.test(b.email) || b.email.length > 254 || !validEmail(email) ||
    message.length < 10 || b.message.length > 5000 || /[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/.test(b.message)) {
    return json('Please check your name, email and message (10–5,000 characters).', 400);
  }
  // Basic spam filters only, not proof of humanity/authentication. Ignore client
  // timestamps. The recipient is server-controlled to prevent an open relay.
  if (b.website !== '' || typeof b.answer !== 'string' || b.answer !== '7') {
    return json('Spam check failed. Please check the form and answer 3 + 4.', 400);
  }

  const token = b['cf-turnstile-response'];
  if (typeof token !== 'string' || !token || token.length > 2048 || /\s/.test(token)) {
    return json('Please complete the security check and try again.', 400);
  }
  try {
    const verification = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST', redirect: 'manual',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret: config.turnstileSecret, response: token, remoteip }),
      signal: AbortSignal.timeout(10000),
    });
    if (!verification.ok) return json('Security verification is unavailable. Please try again later.', 502);
    const result: unknown = await verification.json();
    if (!result || typeof result !== 'object') return json('Security verification is unavailable. Please try again later.', 502);
    const verified = result as Record<string, unknown>;
    // Siteverify enforces five-minute expiry and single use. Never cache success
    // or retry automatically with a consumed token. Bind to this host and form.
    if (verified.success !== true || verified.hostname !== 'krutidevunicodefontconverter.com' ||
      verified.action !== 'contact' || (Array.isArray(verified['error-codes']) && verified['error-codes'].length > 0)) {
      return json('Security check failed or expired. Please complete a new check.', 400);
    }
  } catch {
    return json('Security verification is unavailable. Please try again later.', 502);
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      redirect: 'manual',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${config.apiKey}` },
      body: JSON.stringify({
        from: 'Akshar Contact <contact@krutidevunicodefontconverter.com>',
        to: [config.recipient],
        reply_to: email,
        subject: 'Akshar contact form message',
        text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      }),
      signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) return json('Email delivery was not accepted. Please try again later.', 502);
    const accepted: unknown = await response.json();
    if (!accepted || typeof accepted !== 'object' ||
      typeof (accepted as Record<string, unknown>).id !== 'string' ||
      !(accepted as { id: string }).id.trim() || (accepted as Record<string, unknown>).error) {
      return json('Email delivery could not be confirmed. Please try again later.', 502);
    }
    return json('Your message was accepted for email delivery. Thank you.', 200);
  } catch {
    // Never disclose provider responses, headers, secrets or exceptions.
    return json('Email delivery could not be confirmed. Please try again later.', 502);
  }
}
