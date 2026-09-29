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

Copy `.env.example` to `.env` for local configuration. Set `CONTACT_WEBHOOK_URL` to an HTTPS endpoint under your control and `CONTACT_WEBHOOK_TOKEN` to its bearer token. In hosted Sites, set these as server environment values/secrets. The endpoint receives JSON `{ name, email, message }` and must return a 2xx response only when it accepts delivery. Configure the recipient at that endpoint. This site never reports success when delivery is unconfigured, times out or returns failure. Honeypot, elapsed-time, same-origin, bounded field validation and a simple challenge reject basic spam; the delivery service should enforce its own rate limit.

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
