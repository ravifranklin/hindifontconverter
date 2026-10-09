# Akshar — Hindi & Nepali font conversion

Original responsive website with 14 direct converter routes, a Remington typing desk, local conversion, real OOXML Word exports, font guides, an original keyboard PDF, privacy page and configurable contact delivery.

## Run

Node.js 22.13+ and npm are required.

```sh
npm ci
npm run dev
# http://localhost:5173
npm run typecheck
npm test
npm run build
npm start
```

For the portable Sites starter, `npm start` runs the built Cloudflare Worker locally. See its printed URL. To run the portable Playwright suite against a running dev server:

```sh
npx playwright install chromium
npm run test:e2e
```

The workspace was empty. TypeScript, React and the supplied Vinext/Vite starter provide direct server-rendered routes, a small contact endpoint and Cloudflare-compatible output. The conversion engine is independent of React. Browser workers keep long conversions off the main thread; a revision counter prevents outdated results. No converter text is sent to the server.

## Configuration

Contact delivery uses the existing form and `/api/contact`, Cloudflare Turnstile, and the Resend HTTPS API. No email SDK or database is needed.

### Contact configuration

- `RESEND_API_KEY`: private Cloudflare Worker secret. Never expose through public variables, browser responses or logs.
- `TURNSTILE_SECRET_KEY`: private Cloudflare Worker secret, used only for Siteverify.
- `CONTACT_RECIPIENT_EMAIL`: server-side destination inbox; a single email address.
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY`: public key of a **Managed** Turnstile widget. Create the widget for `krutidevunicodefontconverter.com` when setting up production.
- `CONTACT_RATE_LIMITER`: required Cloudflare Workers Rate Limiting object binding. It cannot be supplied as a string environment variable.

Private secrets are read at request time through server-side `process.env` with the existing `nodejs_compat` flag and compatibility date. The rate limiter is read from `cloudflare:workers`. GET `/api/contact` exposes only configuration availability and the public site key; no private keys or recipient. Sending stays disabled if any key, recipient or binding is missing. The public key is delivered through this configuration endpoint, avoiding a mismatch between a build-time key and runtime configuration.

The release source `localBindingConfig` in `vite.config.ts` declares the existing production binding below, targets Worker `hindifontconverter`, and preserves dashboard variables with `keep_vars: true`. Production and preview workers.dev access remain enabled. Custom domains stay dashboard-managed: no routes are declared. Compatibility remains `2026-05-15` with `nodejs_compat`. No deployment or live configuration change has been performed. Do not edit generated `dist/server/wrangler.json` as a permanent configuration source.

```jsonc
{
  "ratelimits": [{
    "name": "CONTACT_RATE_LIMITER",
    "namespace_id": "1",
    "simple": { "limit": 5, "period": 60 }
  }]
}
```

This allows roughly five Contact attempts per minute per `CF-Connecting-IP`. Rejected and malformed attempts also consume the limit; rate limiting happens before either external provider is called. Limit exhaustion returns 429 with `Retry-After: 60`. An unavailable binding, failed limiter or missing/invalid Cloudflare IP header fails closed. No application in-memory fallback is used. These Cloudflare-backed counters are local to each Cloudflare location and eventually consistent, so they are abuse protection rather than a strict global/email quota. People sharing an IP share the allowance. No D1, KV or Durable Object is required. [Cloudflare rate-limit binding documentation](https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/).

Every submitted `cf-turnstile-response` token is checked against `https://challenges.cloudflare.com/turnstile/v0/siteverify`, with the trusted Cloudflare IP. Email sending requires `success: true`, hostname exactly `krutidevunicodefontconverter.com`, and action `contact`. Siteverify enforces token expiration after five minutes and single use; invalid, expired and reused tokens never reach Resend. No verification success is cached. The browser clears tokens on expiry/error and resets the widget after each attempted submission, including Resend/network failures; a load error offers a retry button. Existing fields and styling remain, with the Managed widget above the send/copy buttons. [Turnstile verification documentation](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/).

Verify `krutidevunicodefontconverter.com` in Resend before sending from `Akshar Contact <contact@krutidevunicodefontconverter.com>`. Emails preserve plain-text name, email and message, the fixed server-side recipient, and the visitor's email as Reply-To. Success means Resend accepted the email, not guaranteed inbox delivery. Provider failures/timeouts produce generic messages without private data. Existing bounded field/email/request validation, same-origin checks, honeypot and exact arithmetic answer remain; client timestamps are ignored.

### Local testing

Use placeholders only, copied from `.env.example` into an ignored local `.dev.vars` file as appropriate. No real keys are needed for `node --loader ./scripts/test-loader.mjs --test tests/contact.test.ts`: the test-only loader supplies mock Worker bindings, while Siteverify and Resend calls are mocked. The fixtures contain only placeholder keys/tokens and reserved example IPs. Do not import test fixtures into production. Tests exercise rejection of expired/reused tokens via official Siteverify error responses and rate-limit outcomes, without making real API calls.

A live local form will remain disabled until a local Worker rate-limit binding and keys are configured. The strict production hostname/action check is intentional and has no localhost bypass. Full production-domain integration testing needs separately authorized setup; do not put real secrets into the example or tests.

## Routes

| Route | Function |
|---|---|
| `/` | Default converter and directory of all groups |
| `/krutidev-to-unicode` | Kruti Dev 010 → Unicode |
| `/unicode-to-krutidev` | Unicode → Kruti Dev 010 |
| `/krutidev-to-chanakya` | Kruti Dev → Unicode → Chanakya |
| `/krutidev-to-mangal` | Kruti Dev → Unicode, Mangal output presentation |
| `/mangal-to-krutidev` | Mangal Unicode → Kruti Dev |
| `/preeti-to-unicode` | Preeti → Nepali Unicode |
| `/unicode-to-preeti` | Nepali Unicode → Preeti |
| `/chanakya-to-unicode` | Chanakya → Unicode |
| `/unicode-to-chanakya` | Unicode → Chanakya |
| `/chanakya-to-krutidev` | Chanakya → Unicode → Kruti Dev |
| `/devlys-to-unicode` | DevLys 010 → Unicode |
| `/unicode-to-devlys` | Unicode → DevLys 010 |
| `/devlys-to-mangal` | DevLys → Unicode, Mangal output presentation |
| `/mangal-to-devlys` | Mangal Unicode → DevLys |
| `/typing` | Live Remington source editor and Unicode result |
| `/keyboard` | Original keyboard viewer and PDF download |
| `/fonts` | Font guide directory |
| `/font-krutidev`, `/font-preeti`, `/font-chanakya` | Installation and rights information |
| `/contact` | Validated, configurable contact delivery |
| `/privacy` | Actual application data handling |

Every converter has labelled editors, code-point counts, live mode, a visible Convert button, Clear, Copy, WhatsApp draft, Gmail compose, email fallback, and Word download. All result actions are disabled for empty text. Editing the source immediately clears a previous result. The typing page keeps the raw source as the editing buffer so native caret/selection/undo/paste behavior is retained; it suspends conversion during composition and resumes on compositionend.

## Mapping design and limitations

`lib/conversion/engine.ts` uses longest-match tries: replacement output is never passed through the input table again. It reorders pre-base i-matra and reph across Devanagari consonant clusters, normalizes to NFC and uses Unicode as the intermediate encoding. Mangal is deliberately an alias for Unicode data. DevLys has its own data file, calibrated against 214 independently observed reference outputs (including the distinct standalone `F`). Tests also cover longest-match ligatures, nukta, marks, tabs, paragraphs and large input.

Legacy ASCII is inherently ambiguous with English. Wrap literal spans in `[[double brackets]]`; brackets are removed and the contents preserved. Other unmapped code points are retained. Font variants, malformed PDF extraction and unusual glyph combinations require review. Multiple glyph sequences can map to one Unicode sequence; reverse output is canonical, not byte-for-byte restoration. Chanakya's reference digit round trip is inconsistent; this implementation deliberately preserves Devanagari digit semantics. See `docs/TEST-REPORT.md` for precise evidence and remaining limitations.

`lib/export.ts` creates a ZIP/OOXML `.docx` with correct CRCs, content types and document relationships. It preserves paragraph boundaries, empty paragraphs and tabs. Font names are assigned to runs; fonts are not embedded in Word files. Legacy output deliberately exposes raw character codes rather than claiming they are readable without the font.

## Sources and rights

* Behavior benchmark: https://www.krutidevunicodeconverter.com/ — independently observed UI/outputs only; no branding, copy, artwork or proprietary converter code reused.
* Kruti Dev / Chanakya lookup data adapted from https://github.com/deepakkamboj/indianlanguageconverter (`src/lib/krutidev-converter.ts`, `src/lib/chanakya-converter.ts`). The repository supplies MIT and GPL v2 notices, states the original converter algorithms are GPL v2, and its full notices are retained in `licenses/mapping-sources.txt`. The original sequential-replacement engines are **not** used. This application's distribution is GPL v2; full corresponding source is included in `/source.zip`.
* Preeti keyboard facts were transcribed separately; ordering/reverse logic is original. See `licenses/Preeti-provenance.md` and independently recorded reference fixtures. No CC noncommercial conversion implementation is vendored.
* Noto Sans Devanagari from `notofonts/noto-fonts` is SIL OFL 1.1. Its license is in `licenses/Noto-OFL.txt`. It is the only bundled font and is used for Unicode text and the original PDF chart.
* Legacy Kruti Dev, Chanakya, Preeti and DevLys font binaries are not bundled. Redistribution rights and an authorized public font download could not be verified. Font pages explain this instead of offering unverified files. Microsoft’s Mangal information page is linked as an authoritative Unicode font resource.

## Verification

See `docs/TEST-REPORT.md`, `docs/reference-smoke.json`, `docs/reference-fixtures.json`, `docs/devlys-observations.json`, `docs/browser-checks.json` and `docs/REFERENCE-INVENTORY.md`. Unit expectations are written Hindi/Nepali text, not copies of the mapping table. Browser checks were also run interactively through the connected in-app browser. The Playwright suite is included for reproducible CI and covers additional composition and share interception scenarios.

No accuracy percentage or guarantee of perfect round trips is claimed.

### InDesign and Kruti Dev 010
Kruti output uses verified U+201C/U+2018 glyph codes for श/ष, avoiding straight-quote substitution during import. Apply Kruti Dev 010 to the entire result; disable automatic hyphenation for legacy text and keep typographic-quote replacement off. The codes look like curly punctuation without the font, which is expected. These aliases were checked by rendering the installed font, rather than by round-trip tests alone.

Kruti Dev 010 punctuation: a Unicode colon `:` is encoded as `%` to display correctly. The raw code `:` represents रू. Colon and visarga share the `%` glyph, so reverse conversion cannot distinguish them and returns ः.
