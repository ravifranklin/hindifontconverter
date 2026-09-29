# Test report — 29 September 2026

## Passed
- 225 automated tests: every conversion direction, independently captured reference fixtures, ordinary words/sentences, conjuncts, matras, reph, nasal/nukta marks, digits, punctuation, empty text, tabs/paragraphs, mixed protected text and long inputs; contact validation/error paths and complete share URL encoding.
- TypeScript typecheck and production Worker build.
- Actual connected-browser checks on all 14 converter routes: example conversion, clear and disabled empty actions. Manual conversion clears stale output.
- Live typing: caret movement, delete, selection replacement and multiline clipboard paste.
- Production Worker preview: home, supporting pages, contact configuration endpoint, keyboard PDF and worker asset return 200; unknown route returns 404.
- Desktop layout inspected. Phone layout inspected in a 390px iframe (375px content plus scrollbar): no horizontal overflow; actual conversion works. The browser viewport override did not take effect, so an iframe was used instead of pretending to test a device emulator.
- Real DOCX ZIP structure, CRC and XML validated; independently opened with python-docx, including blank paragraphs, tabs and Devanagari. Keyboard PDF rendered and visually inspected.

## Reference comparison
All 14 routes were compared with the live reference. See reference-smoke.json, reference-corpus.json and reference-comparison.json. The broad corpus matches exactly on 12 routes. Chanakya→Unicode and Chanakya→Kruti Dev deliberately retain Devanagari digits and visarga: reference decodes `¥Ñ` to `अ:` while Akshar returns `अः`; reference converts encoded Devanagari numerals to ASCII. Regression tests document this decision. DevLys uses its own table, calibrated with 214 reference probes. Preeti has 135 independent probes.

Production preview also passed keyboard Tab focus on Skip to content and a 6,000-character background-worker conversion. A framework link-prefetch error found in production was removed by using ordinary semantic anchors.

## Specific limitations and remaining acceptance work
- Preeti source symbols `« ¤ ¥ © ÷ ‘` have no verified reference decoding; they are preserved unchanged. Rare font-version glyph variants remain unverified. Lossless round trips are not claimed.
- Plain Latin text is indistinguishable from legacy codes. Use [[literal spans]] to preserve English/punctuation explicitly. Unmapped Unicode survives legacy encoding with a visible warning.
- Native OS IME composition was not exercised. Composition event guards are implemented and a synthetic Playwright regression is supplied, but that suite was not executed in this environment.
- Clipboard API reported success in the browser. OS clipboard readback could not be verified because the browser tool uses a separate virtual clipboard. Fallback and failure handling are implemented.
- Browser download-event capture timed out although DOCX generation and its contents passed independent validation. Verify a saved browser download on the deployment in the target browser. UI says the document was prepared, not that disk saving was confirmed.
- Playwright browser regression source is included; it was not run with the Playwright CLI. Actual browser checks above were performed through the connected browser instead.
- No verified redistribution permission was found for Kruti Dev 010, Preeti or Chanakya font binaries; they are not bundled. Font pages explain obtaining licensed files. The included Noto font is SIL OFL; the keyboard PDF is original.
- Contact has no configured delivery destination. It accurately stays unavailable, with copyable message fallback. Configure CONTACT_WEBHOOK_URL and optional CONTACT_WEBHOOK_TOKEN; real delivery to an owner-provided destination remains to be tested. Unit tests use a mocked webhook.
- No exhaustive assistive-technology, mobile OS or cross-browser certification was performed. Authentication on the private hosted preview is separate from the site's account-free converter.

## Reproduce
`npm ci`, `npm run typecheck`, `npm test`, `npm run build`, `node scripts/preview-worker.mjs`. Run `npx playwright install chromium` and `npm run test:e2e` for the supplied browser suite against port 5173. The direct Miniflare preview avoids a Windows sandbox directory-access failure in Wrangler's CLI bundling path.

## Publication status
Private Site registration succeeded, but source publication is blocked by Windows sandbox ACLs: `.git/index.lock` remains permission-denied even after the filesystem permission request was granted. No successful hosted deployment is claimed. The complete source ZIP and local production preview are available. The final production build passed; its conversion Worker ran successfully.

## Kruti Dev 010 / InDesign correction — 29 September 2026
A user-rendered paragraph revealed श→ष substitutions. Direct rendering with the locally installed Kruti Dev 010 verified that U+201C/U+201D are half-sha glyphs, whereas U+2018/U+2019 are half-ssa. The encoder now emits the appropriate preselected curly glyph codes instead of straight quote codes susceptible to typographic substitution. Both full and half forms decode correctly. The existing Ü/Ük entries were also corrected to श्र्/श्र after direct font rendering; they are not safe alternatives for श.

Regression words: पश्चिम, एशिया, देशों, प्रतिशत, शुल्क, राष्ट्र. All 227 unit tests, typecheck, generated browser Worker and production build pass. Existing browser sample now outputs the corrected codes without changing its Unicode source. Reference-byte comparison tests explicitly accept these verified glyph aliases for Kruti Dev output; raw reference observations remain unchanged. The user's installed font was used locally for verification and is not redistributed. InDesign itself was not automated or its settings changed. Disable automatic hyphenation for legacy text; keep typographer quote replacement off when importing. No new hosted publication was attempted because the previously established Git-write block remains unresolved.

## Colon correction — 29 September 2026
Unicode/Mangal→Kruti Dev now encodes ASCII colon as `%`, the colon-shaped glyph verified in the user's installed Kruti Dev 010. Previously `:` passed through and rendered as रू. Actual रू continues to encode as `:`. Regression checks cover समय: 10:30, isolated colon, रू/रूस, visarga and literal spans. All 228 tests, typecheck and production build pass. Colon and visarga share this glyph: reverse conversion canonically yields ः because their original semantic distinction is unrecoverable from a single legacy code. Explicit [[literal spans]] continue to bypass all conversion by design.

## क्त correction — 29 September 2026
The installed Kruti Dev 010 renders the inherited ä alias as a stacked form that loses the visible क in आयुक्तों. Direct comparison confirms `vk;qDrksa` displays आयुक्तों correctly. All Kruti Dev output now uses `Dr` (half-ka plus ta) for क्त. Decoding older ä input remains supported for compatibility. Regression tests cover आयुक्तों, क्त, शक्ति, भक्त, रक्त, Unicode/Mangal sources and Chanakya cross-conversion. All 229 tests, typecheck and production build pass. Raw reference fixtures remain unchanged; reference assertions allow the independently font-verified Dr form. No font binaries are redistributed.

## Preeti nukta correction — 30 September 2026
The user's Hindi sample revealed missing boxes in सज़ा, बरक़रार, सिर्फ़, ख़ुद, दरवाज़ा, फ़िरोज़पुर and बुज़ुर्ग. The installed preeti.otf contains a zero-advance below-base nukta glyph at U+00DE (Þ), verified by direct rendering and glyph metrics. The converter previously preserved unmapped U+093C, which this legacy font cannot display. Added Þ↔़ mapping; existing longest-match and normalization logic now handles composed/decomposed nukta letters, pre-base i, reph and half-letter conjuncts without dropping dots. Seven independently transcribed word fixtures and normalization/conjunct regressions pass. All 231 tests, typecheck and production build pass. Corrected words were rendered with the installed font and inspected. The font itself is not redistributed. This correction addresses the missing Hindi-letter boxes; native InDesign rendering was not automated.

## Preeti क्र form correction — 30 September 2026
Changed canonical Unicode→Preeti क्र from the alternate qm ligature to s| (क plus rakar). Both forms were rendered directly using the installed preeti.otf; s| produces the standard क्र appearance requested for क्रमश / क्रमशः. Older qm input remains decodable. Regression fixtures cover क्रमश, क्रमशः, क्रम, क्रिया and प्रक्रिया; reference comparison accepts this explicitly verified glyph alternative without rewriting observations. All 232 tests, typecheck and production build pass.

## Preeti final halant correction — 30 September 2026
Word-final consonant+virama now encodes as the full consonant followed by the visible Preeti halant, instead of a half-letter glyph. Direct rendering with installed preeti.otf confirms `jfs\` displays वाक्, while prior `jfS` lacks the explicit halant. Regression cases cover end-of-input, trailing space, punctuation, newline, multiple final consonants, nukta, and unchanged internal conjuncts (वाक्य / शक्ति). All 233 tests, typecheck and production build pass. Existing input half-letter codes remain decodable.
