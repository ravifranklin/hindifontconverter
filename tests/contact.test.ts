import { test, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { GET, POST } from '../app/api/contact/route';
import { env } from './fixtures/contact-worker-env';

const originalFetch = globalThis.fetch;
const envNames = ['TURNSTILE_SECRET_KEY', 'NEXT_PUBLIC_TURNSTILE_SITE_KEY', 'NEXT_PUBLIC_TURNSTILE_SECRET_KEY', 'RESEND_API_KEY', 'CONTACT_RECIPIENT_EMAIL', 'CONTACT_WEBHOOK_URL', 'CONTACT_WEBHOOK_TOKEN', 'NEXT_PUBLIC_RESEND_API_KEY', 'VITE_RESEND_API_KEY'] as const;
const originalEnv = Object.fromEntries(envNames.map(key => [key, process.env[key]]));
const apiKey = 're_test_only_secret';
const recipient = 'operator@example.com';
const secret = 'turnstile_test_only_secret';
const siteKey = 'public_test_site_key';
const siteverifyUrl = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
const verified = { success: true, hostname: 'krutidevunicodefontconverter.com', action: 'contact', 'error-codes': [] };
let rateCalls: string[] = [];
function mockDelivery(reply: () => Promise<Response>) {
  globalThis.fetch = async (url, init) => {
    calls.push({ url: String(url), init: init! });
    return String(url) === siteverifyUrl ? Response.json(verified) : reply();
  };
}
const valid = { name: 'Test Sender', email: 'visitor@example.com', message: 'A sample mapping issue', answer: '7', website: '', 'cf-turnstile-response': 'test-token' };
let calls: { url: string; init: RequestInit }[] = [];

beforeEach(() => {
  for (const key of envNames) delete process.env[key];
  process.env.RESEND_API_KEY = apiKey;
  process.env.CONTACT_RECIPIENT_EMAIL = recipient;
  process.env.TURNSTILE_SECRET_KEY = secret;
  process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY = siteKey;
  rateCalls = [];
  env.CONTACT_RATE_LIMITER = { limit: async ({key}) => {rateCalls.push(key);return {success:true};} };
  calls = [];
  mockDelivery(async () => Response.json({ id: 'accepted-email-id' }));
});
afterEach(() => {
  globalThis.fetch = originalFetch;
  delete env.CONTACT_RATE_LIMITER;
  for (const key of envNames) {
    if (originalEnv[key] === undefined) delete process.env[key];
    else process.env[key] = originalEnv[key];
  }
});
function request(body: unknown = valid, headers: Record<string, string> = {}) {
  return new Request('https://example.com/api/contact', {
    method: 'POST',
    headers: { origin: 'https://example.com', 'Content-Type': 'application/json', 'CF-Connecting-IP': '192.0.2.1', ...headers },
    body: JSON.stringify(body),
  });
}
async function assertRejected(body: unknown, status = 400) {
  const response = await POST(request(body));
  assert.equal(response.status, status);
  assert.equal(calls.length, 0);
}
async function assertSafeFailure(response: Response) {
  assert.equal(response.status, 502);
  assert.equal(response.headers.get('Cache-Control'), 'no-store');
  const text = await response.text();
  for (const privateValue of [apiKey, secret, recipient, valid.email, 'provider-private-detail']) {
    assert.ok(!text.includes(privateValue));
  }
  assert.ok(!text.includes('Thank you'));
}

test('configuration fails closed, never exposes secrets, and ignores public/legacy keys', async () => {
  for (const [key, value] of [
    ['TURNSTILE_SECRET_KEY', undefined],
    ['TURNSTILE_SECRET_KEY', '   '],
    ['NEXT_PUBLIC_TURNSTILE_SITE_KEY', undefined],
    ['NEXT_PUBLIC_TURNSTILE_SITE_KEY', '   '],
    ['RESEND_API_KEY', undefined],
    ['RESEND_API_KEY', '   '],
    ['CONTACT_RECIPIENT_EMAIL', undefined],
    ['CONTACT_RECIPIENT_EMAIL', 'bad@@example.com'],
    ['CONTACT_RECIPIENT_EMAIL', 'first@example.com,second@example.com'],
    ['CONTACT_RECIPIENT_EMAIL', 'operator@example.com\r\n'],
  ] as const) {
    process.env.RESEND_API_KEY = apiKey;
    process.env.CONTACT_RECIPIENT_EMAIL = recipient;
    process.env.TURNSTILE_SECRET_KEY = secret;
    process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY = siteKey;
    if (value === undefined) delete process.env[key]; else process.env[key] = value;
    assert.deepEqual(await (await GET()).json(), { configured: false, siteKey: null });
    await assertRejected(valid, 503);
  }
  delete process.env.RESEND_API_KEY;
  process.env.CONTACT_WEBHOOK_URL = 'https://old-webhook.example';
  process.env.CONTACT_WEBHOOK_TOKEN = 'old-token';
  process.env.NEXT_PUBLIC_RESEND_API_KEY = apiKey;
  process.env.VITE_RESEND_API_KEY = apiKey;
  assert.deepEqual(await (await GET()).json(), { configured: false, siteKey: null });
  await assertRejected(valid, 503);
  process.env.RESEND_API_KEY = apiKey;
  process.env.CONTACT_RECIPIENT_EMAIL = recipient;
  const response = await GET();
  assert.equal(response.headers.get('Cache-Control'), 'no-store');
  assert.deepEqual(await response.json(), { configured: true, siteKey });
});

test('rejects missing/cross origins and non-JSON content types before delivery', async () => {
  for (const origin of ['', 'https://evil.example', 'null']) {
    assert.equal((await POST(request(valid, { origin }))).status, 403);
  }
  for (const type of ['', 'text/plain', 'application/x-www-form-urlencoded']) {
    assert.equal((await POST(request(valid, { 'Content-Type': type }))).status, 415);
  }
  assert.equal(calls.length, 0);
});

test('malformed JSON and non-object bodies return input errors', async () => {
  for (const body of [null, [], 7, 'message', {}]) await assertRejected(body);
  const response = await POST(new Request('https://example.com/api/contact', {
    method: 'POST', headers: { origin: 'https://example.com', 'Content-Type': 'application/json', 'CF-Connecting-IP': '192.0.2.1' }, body: '{',
  }));
  assert.equal(response.status, 400);
  assert.equal(calls.length, 0);
});

test('bounds actual UTF-8 request bytes even with absent or false Content-Length', async () => {
  assert.equal((await POST(request(valid, { 'Content-Length': '32769' }))).status, 413);
  for (const headers of [{}, { 'Content-Length': '1' }] as Record<string, string>[]) {
    assert.equal((await POST(request({ ...valid, message: 'क'.repeat(12000) }, headers))).status, 413);
  }
  let cancelled = false;
  const stream = new ReadableStream<Uint8Array>({
    start(controller) { controller.enqueue(new Uint8Array(32769)); },
    cancel() { cancelled = true; },
  });
  const streamed = new Request('https://example.com/api/contact', {
    method: 'POST', headers: { origin: 'https://example.com', 'Content-Type': 'application/json', 'CF-Connecting-IP': '192.0.2.1' },
    body: stream, duplex: 'half',
  } as RequestInit & { duplex: string });
  assert.equal((await POST(streamed)).status, 413);
  assert.equal(cancelled, true);
  assert.equal(calls.length, 0);
});

test('validates a single email mailbox and rejects header/control injection', async () => {
  for (const email of ['bad', 'a@@example.com', 'a@b@example.com', 'a@localhost', '.a@example.com',
    'a..b@example.com', 'a.@example.com', 'a@-example.com', 'a@example-.com',
    'a@example..com', 'a@example.com,b@example.com', 'Visitor <a@example.com>',
    'a@example.com\r\nBcc: other@example.com', 'a@example.com\n', 'a'.repeat(65) + '@example.com']) {
    await assertRejected({ ...valid, email });
  }
  for (const name of ['', ' ', 'a', 'a'.repeat(101), 'Sender\nBcc: victim']) await assertRejected({ ...valid, name });
  for (const field of ['name', 'email', 'message']) await assertRejected({ ...valid, [field]: 7 });
});

test('enforces trimmed message minimum, raw maximum and safe multiline content', async () => {
  for (const message of ['', ' '.repeat(10), 'short', ' '.repeat(20) + 'short', 'a'.repeat(5001), 'hello\u0000world']) {
    await assertRejected({ ...valid, message });
  }
  assert.equal((await POST(request({ ...valid, message: 'क'.repeat(5000) }))).status, 200);
  assert.equal((await POST(request({ ...valid, message: '1234567890' }))).status, 200);
});

test('strict spam-field checks reject numeric/coerced answers and populated/missing honeypots', async () => {
  for (const answer of [7, null, undefined, {}, ['7'], '07', '7.0', '7 ', '7\n', '8']) {
    await assertRejected({ ...valid, answer });
  }
  for (const website of ['spam', ' ', 0, false, null, undefined, {}]) {
    await assertRejected({ ...valid, website });
  }
});

test('sends the exact Resend payload with fixed sender/recipient and no timestamp dependency', async () => {
  const body = { ...valid, name: '  Visitor Name  ', email: ' visitor+test@sub.example.com ',
    message: '  Conversion issue:\nकृपया जाँच करें\n<script>plain text</script>  ',
    started: Date.now() + 99999999, to: 'attacker@example.com', from: 'attacker@example.com' };
  const response = await POST(request(body, { 'Content-Type': 'application/json; charset=utf-8' }));
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { message: 'Your message was accepted for email delivery. Thank you.' });
  assert.equal(calls.length, 2);
  assert.equal(calls[0].url, siteverifyUrl);
  assert.deepEqual(JSON.parse(calls[0].init.body as string), { secret, response: 'test-token', remoteip: '192.0.2.1' });
  assert.equal(calls[0].init.redirect, 'error');
  assert.ok(calls[0].init.signal instanceof AbortSignal);
  const { url, init } = calls[1];
  assert.equal(url, 'https://api.resend.com/emails');
  assert.equal(init.method, 'POST');
  assert.equal(init.redirect, 'error');
  assert.deepEqual(init.headers, { 'Content-Type': 'application/json', Authorization: 'Bearer ' + apiKey });
  assert.ok(init.signal instanceof AbortSignal);
  assert.deepEqual(JSON.parse(init.body as string), {
    from: 'Akshar Contact <contact@krutidevunicodefontconverter.com>',
    to: [recipient], reply_to: 'visitor+test@sub.example.com', subject: 'Akshar contact form message',
    text: 'Name: Visitor Name\nEmail: visitor+test@sub.example.com\n\nMessage:\nConversion issue:\nकृपया जाँच करें\n<script>plain text</script>',
  });
  // The browser timestamp is neither required nor trusted.
  assert.equal((await POST(request(valid))).status, 200);
});

test('provider rejection, throttling, errors, timeout and unconfirmed responses never report success or leak data', async () => {
  const privateDetail = [apiKey, secret, recipient, valid.email, 'provider-private-detail'].join(' ');
  for (const status of [400, 401, 403, 422, 429, 500]) {
    mockDelivery(async () => Response.json({ message: privateDetail }, { status }));
    await assertSafeFailure(await POST(request()));
  }
  for (const result of [{}, null, { id: '' }, { id: 7 }, { id: 'id', error: privateDetail }]) {
    mockDelivery(async () => Response.json(result));
    await assertSafeFailure(await POST(request()));
  }
  mockDelivery(async () => new Response(privateDetail));
  await assertSafeFailure(await POST(request()));
  for (const error of [new Error(privateDetail), new DOMException(privateDetail, 'TimeoutError')]) {
    mockDelivery(async () => { throw error; });
    await assertSafeFailure(await POST(request()));
  }
});

test('missing or malformed tokens never call Siteverify or Resend', async () => {
  for (const token of [undefined, null, '', ' ', 7, {}, 'a'.repeat(2049), 'token\n']) {
    await assertRejected({ ...valid, 'cf-turnstile-response': token });
  }
});

test('invalid/expired tokens and wrong hostname/action never reach Resend', async () => {
  for (const result of [
    { success: false, 'error-codes': ['invalid-input-response'] },
    { success: false, 'error-codes': ['timeout-or-duplicate'] },
    { ...verified, hostname: 'evil.example' },
    { ...verified, hostname: 'www.krutidevunicodefontconverter.com' },
    { ...verified, action: 'login' },
    { ...verified, success: 'true' },
    { ...verified, 'error-codes': ['timeout-or-duplicate'] },
  ]) {
    calls = [];
    globalThis.fetch = async (url, init) => {
      calls.push({url:String(url),init:init!});
      assert.equal(String(url), siteverifyUrl);
      return Response.json(result);
    };
    const response = await POST(request());
    assert.equal(response.status, 400);
    const text = await response.text();
    assert.ok(!text.includes(secret));
    assert.equal(calls.length, 1);
  }
});

test('every request verifies its token again; reused tokens cannot send twice', async () => {
  let verifiedOnce = false;
  globalThis.fetch = async (url, init) => {
    calls.push({url:String(url),init:init!});
    if(String(url) === siteverifyUrl) {
      const result = verifiedOnce ? {success:false,'error-codes':['timeout-or-duplicate']} : verified;
      verifiedOnce = true;
      return Response.json(result);
    }
    return Response.json({id:'accepted-email-id'});
  };
  assert.equal((await POST(request())).status, 200);
  assert.equal((await POST(request())).status, 400);
  assert.equal(calls.filter(call=>call.url === siteverifyUrl).length, 2);
  assert.equal(calls.filter(call=>call.url === 'https://api.resend.com/emails').length, 1);
});

test('Siteverify outage, malformed replies and timeouts fail safely before Resend', async () => {
  const detail = secret+' '+apiKey+' provider-private-detail';
  for (const reply of [
    async () => new Response(detail, {status:500}),
    async () => new Response(detail),
    async () => Response.json(null),
    async () => {throw new DOMException(detail,'TimeoutError');},
    async () => {throw new Error(detail);},
  ]) {
    calls = [];
    globalThis.fetch = async (url, init) => {
      calls.push({url:String(url),init:init!});
      assert.equal(String(url),siteverifyUrl);
      return reply();
    };
    await assertSafeFailure(await POST(request()));
    assert.equal(calls.length,1);
  }
});

test('missing limiter or private secret fails closed even with public substitutes', async () => {
  delete env.CONTACT_RATE_LIMITER;
  assert.deepEqual(await (await GET()).json(),{configured:false,siteKey:null});
  await assertRejected(valid,503);
  env.CONTACT_RATE_LIMITER = {limit:async()=>({success:true})};
  delete process.env.TURNSTILE_SECRET_KEY;
  process.env.NEXT_PUBLIC_TURNSTILE_SECRET_KEY = secret;
  assert.deepEqual(await (await GET()).json(),{configured:false,siteKey:null});
  await assertRejected(valid,503);
});

test('rate limit rejection has Retry-After and makes no external requests', async () => {
  let count = 0;
  // The fixture models the configured 5/60 binding outcome; production counters
  // live in Cloudflare infrastructure, never in this application/test fixture.
  env.CONTACT_RATE_LIMITER = {limit:async({key})=>{
    rateCalls.push(key);count++;return {success:count <= 5};
  }};
  for(let attempt=0;attempt<5;attempt++) assert.equal((await POST(request())).status,200);
  calls = [];
  const response = await POST(request());
  assert.equal(response.status,429);
  assert.equal(response.headers.get('Retry-After'),'60');
  assert.equal(calls.length,0);
  assert.deepEqual(rateCalls,Array(6).fill('akshar-contact:192.0.2.1'));
});

test('unavailable limiter and absent trusted IP fail closed without network access', async () => {
  for(const remoteip of ['', 'untrusted-value']) {
    assert.equal((await POST(request(valid,{'CF-Connecting-IP':remoteip,'X-Forwarded-For':'192.0.2.44'}))).status,503);
  }
  env.CONTACT_RATE_LIMITER = {limit:async()=>{throw new Error(secret);}};
  const response = await POST(request());
  assert.equal(response.status,503);
  assert.ok(!(await response.text()).includes(secret));
  assert.equal(calls.length,0);
});

test('limiter keys and Siteverify remote IP use only the Cloudflare header', async () => {
  assert.equal((await POST(request({...valid,remoteip:'192.0.2.99'},{
    'CF-Connecting-IP':'2001:db8::1','X-Forwarded-For':'192.0.2.99',
  }))).status,200);
  assert.deepEqual(rateCalls,['akshar-contact:2001:db8::1']);
  assert.equal(JSON.parse(calls[0].init.body as string).remoteip,'2001:db8::1');
});