# Reference inventory — inspected 29 September 2026

Benchmark: https://www.krutidevunicodeconverter.com/. Original page text, images, fonts and scripts are not included in this project.

All 14 tool pages were visited. Actual editor IDs/placeholders and Convert labels, alongside independent smoke inputs/outputs, are saved in `reference-smoke.json`. `reference-corpus.json` records the broader multi-paragraph comparison corpus. Tool groups and supporting-page links were also inspected through the site's navigation.

| Reference path | Input → output labels | Trigger |
|---|---|---|
| `/` | KrutiDev Text → Unicode Text | Convert To Unicode |
| `/unicode-to-krutidev-converter.php` | Unicode Text → Krutidev Text | Convert To Krutidev |
| `/krutidev-to-chanakya-converter.php` | KrutiDev Text → Chanakya Text | Convert To Chanakya; page also describes immediate typing conversion |
| `/kruti-dev-to-mangal-converter.php` | KrutiDev Text → Mangal Text | Convert To Mangal |
| `/mangal-to-kruti-dev-converter.php` | Mangal Text → Krutidev Text | Convert To Krutidev |
| `/preeti-to-unicode-converter.php` | Preeti Text (प्रीति टेक्स्ट) → Unicode Text (युनिकोड टेक्स्ट) | Convert To Unicode |
| `/unicode-to-preeti-converter.php` | Unicode Text → Preeti Text | Convert To Preeti |
| `/chanakya-to-unicode-converter.php` | Chanakya Text → Unicode Text | Convert To Unicode |
| `/unicode-to-chanakya-converter.php` | Unicode Text → Chanakya Text | Convert To Chanakya |
| `/chanakya-to-krutidev-converter.php` | Chanakya Text → KrutiDev Text | Convert To Krutidev |
| `/devlys-to-unicode-converter.php` | DevLys Text → Unicode Text | Convert To Unicode |
| `/unicode-to-devlys-converter.php` | Unicode Text → DevLys Text | Convert To DevLys |
| `/devlys-to-mangal-converter.php` | DevLys Text → Mangal Text | Convert To Mangal |
| `/mangal-to-devlys-converter.php` | Mangal Text → DevLys Text | Convert To DevLys |

Each tool exposes Clear Text, Copy To Clipboard, WhatsApp, Gmail, and Download Word File. Some are links with JavaScript actions and others buttons. Akshar uses semantic buttons, native labelled textareas, visible focus, disabled empty actions and announced status. It enables live conversion on all routes and retains Convert, covering the reference's live behavior without hiding the trigger. The reference's output can be delayed after clicking Convert; recorded corpus checks waited for the nonempty output.

Supporting pages:

* `write-krutidev-get-unicode.php`: live Kruti Dev typing tool, linked from the homepage heading.
* `kruti-dev-010-hindi-font-download.php`: Kruti Dev 010 font information, font download and installation instructions.
* `preeti-font-download.php`: Preeti font information and installation instructions.
* `chanakya-font-download.php`: Chanakya font information and installation instructions.
* `kruti-dev-keyboard.php`: keyboard image and PDF resource.
* `privacy.php`: reference privacy policy. Akshar instead describes its own browser conversion, share destinations, hosting and contact handling.
* `reach-us.php`: reference contact page. Akshar supplies a separately implemented validated webhook form.
* Social profile links and a My Corporator footer link were observed but are unrelated to font conversion and are intentionally not reproduced.

Exact discovered resource URLs are recorded in `reference-resources.json`. Their presence is **not** permission to redistribute. No reference font, keyboard image or PDF is bundled. The only font bundled is OFL-licensed Noto Sans Devanagari; the keyboard PDF is original.
