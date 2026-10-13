export const WORD_GUIDE = '/hindi-font-conversion-in-word';
export const TROUBLESHOOTING_GUIDE = '/hindi-font-conversion-troubleshooting';

export function GuideLinks() {
  return <nav className="guide-links" aria-label="Hindi conversion help">
    <a href={WORD_GUIDE}>Hindi conversion in Microsoft Word</a>
    <a href={TROUBLESHOOTING_GUIDE}>Troubleshoot Hindi conversion</a>
  </nav>;
}

export function MixedTextExportHelp({slug}:{slug:string}) {
  const unicodeOutput = slug === 'home' || slug === 'krutidev-to-unicode';
  return <aside className="conversion-help" aria-label="Mixed text, Word export and sharing help">
    <p><strong>Keep literal text unchanged:</strong> wrap English names, references or numbers in <code>[[double brackets]]</code>. For example, <code>{unicodeOutput ? 'Hkkjr [[Invoice 123]]' : 'भारत [[Invoice 123]]'}</code> becomes <code>{unicodeOutput ? 'भारत Invoice 123' : 'Hkkjr Invoice 123'}</code>. The brackets are removed. Protected text bypasses conversion, so do not wrap Hindi that you want converted. Check mixed text in Word; apply a Latin font to English selections when a legacy font changes their display.</p>
    <p><strong>Word export:</strong> Download Word File creates a new .docx from the converted text, with {unicodeOutput ? 'Nirmala UI selected for Unicode Hindi' : 'Kruti Dev 010 selected for the legacy codes'}. It does not import the source layout or install or embed fonts. {unicodeOutput ? 'Choose Mangal or another available Unicode Devanagari font if needed.' : 'Use a licensed Kruti Dev 010 font on the destination device.'} <a href={WORD_GUIDE}>Follow the Word workflow</a>.</p>
    <p><strong>Sharing long text:</strong> WhatsApp, Gmail and email links open drafts using the result in a URL. Long drafts may be truncated or fail depending on the app or browser. Check the draft before sending; use Copy or download the Word file and attach it yourself when needed. {unicodeOutput ? 'Review the Hindi before sharing.' : 'Use Unicode Hindi for ordinary messages; raw Kruti Dev codes need the matching font.'} <a href={TROUBLESHOOTING_GUIDE}>Find troubleshooting checks</a>.</p>
  </aside>;
}

function WordGuide() {
  return <>
    <h1>Convert Hindi Text in Microsoft Word</h1>
    <p>Move selected Hindi text between a legacy font and Unicode without confusing a font change with a text conversion. This workflow uses pasted text and the existing converters. Keep your original document and work on a copy.</p>
    <p lang="hi">पहले मूल दस्तावेज़ का फ़ॉन्ट पहचानें। छोटे हिस्से को बदलकर जाँचें, फिर Word में सही फ़ॉन्ट चुनें। केवल फ़ॉन्ट बदलना टेक्स्ट का रूपांतरण नहीं है।</p>
    <h2>1. Identify the source font and required destination</h2>
    <p>Select a few Hindi words in Word and check the font menu. A blank or mixed selection may contain more than one font; check smaller selections separately. Kruti Dev 010, DevLys 010 and the supported Chanakya mapping store legacy codes. Mangal and Nirmala UI display Unicode Hindi.</p>
    <p>Choose the destination required by the recipient. Unicode is useful for readable Hindi in messages and searchable documents; choose legacy codes only when the destination workflow requires that font. <a href="/fonts">Compare source fonts and licensing guidance</a>.</p>
    <ul>
      <li>Kruti Dev 010 source: use <a href="/">Kruti Dev to Unicode</a>, or <a href="/krutidev-to-mangal">Kruti Dev to Mangal</a> for a Mangal destination.</li>
      <li>Readable Unicode Hindi: use <a href="/unicode-to-krutidev">Unicode to Kruti Dev</a>. For text copied from a Mangal document, use <a href="/mangal-to-krutidev">Mangal to Kruti Dev</a>.</li>
      <li>DevLys 010: use <a href="/devlys-to-unicode">DevLys to Unicode</a> or <a href="/unicode-to-devlys">Unicode to DevLys</a>.</li>
      <li>Chanakya: use <a href="/chanakya-to-unicode">Chanakya to Unicode</a> or <a href="/unicode-to-chanakya">Unicode to Chanakya</a>. <a href="/chanakya-to-krutidev">Chanakya to Kruti Dev</a> serves a legacy-to-legacy destination.</li>
    </ul>
    <h2>2. Select and copy a short passage</h2>
    <p>Start with a sentence rather than the whole document. Copy it from Word and paste it into the converter’s source box. Legacy text may appear as Latin-looking codes after pasting; that appearance alone is not a failure. Compare the copied text with the original, especially if it came from a PDF.</p>
    <p>If the document contains different legacy fonts, convert each selection with its matching tool. Do not process all runs as one font. Wrap literal English content you want preserved in double brackets, such as <code>[[Invoice 123]]</code>. The brackets are removed and the enclosed content is not converted.</p>
    <h2>3. Convert and proofread the text</h2>
    <p>Use automatic conversion or the Convert button. These examples illustrate the existing mappings:</p>
    <ul>
      <li>Kruti Dev 010 or DevLys 010 <code>Hkkjr</code> → Unicode <span lang="hi">भारत</span>. This shared example does not mean the two mappings are identical.</li>
      <li>Unicode <span lang="hi">भारत</span> → Kruti Dev 010 <code>Hkkjr</code>.</li>
      <li>Supported Chanakya <code>ÖæÚUÌ</code> → Unicode <span lang="hi">भारत</span>.</li>
      <li>Kruti Dev <code>Hkkjr [[Invoice 123]]</code> → <span lang="hi">भारत</span> <code>Invoice 123</code>.</li>
    </ul>
    <p>Check names, short-i matras, reph, half letters, punctuation and numbers against the original. Similar keyboard layouts do not establish compatibility with every font variant. Keep the original when exact source codes matter; converting back may use different equivalent legacy sequences.</p>
    <h2>4. Paste into Word and choose the destination font</h2>
    <p>Copy the result into a new Word document or a selected destination area. Word paste options vary by version; choose plain-text or Keep Text Only when you want to avoid bringing source formatting with the clipboard.</p>
    <p>For Unicode output, choose an available Unicode Devanagari font, such as Mangal or Nirmala UI. For legacy output, select that text and apply the exact matching licensed font. <code>Hkkjr</code> needs Kruti Dev 010 when generated by the Kruti Dev converter; applying Mangal to those codes does not convert them.</p>
    <p>For mixed Hindi and English, apply fonts to the appropriate selections. Literal protection preserves characters, not Word styling; an English name may still look different under a legacy font. Obtain fonts from a licensed publisher, institution or original document supplier. Read the <a href="/font-krutidev">Kruti Dev installation guide</a> or <a href="/font-chanakya">Chanakya installation guide</a>.</p>
    <h2>5. Use Word export with clear limits</h2>
    <p>Download Word File creates a new .docx containing the result. It preserves text paragraph breaks and tabs and selects the output font; it does not embed or install fonts. General Unicode export selects Nirmala UI, while a Mangal conversion selects Mangal.</p>
    <p>This site does not upload or convert a whole Word file. Original tables, images, styles, headers, footnotes and page layout are not imported. Rebuild formatting in the destination document or paste reviewed text into your own template. Check the file on the device where it will be used.</p>
    <h2>6. Review and share the finished document</h2>
    <p>Save a separate converted copy and compare it with the original after selecting the font. A legacy recipient needs the matching font available. Keep a Unicode copy for searching and ordinary messages.</p>
    <p>Sharing buttons open drafts; they do not attach the downloaded document. Long URL-based drafts can fail or be truncated. Review the draft, or download the Word file and attach it yourself. Conversion and Word generation happen in your browser.</p>
    <p><a href={TROUBLESHOOTING_GUIDE}>Diagnose wrong output, missing fonts and PDF-copy problems</a> · <a href="/keyboard">Check matra and reph key sequences</a>.</p>
  </>;
}

function TroubleshootingGuide() {
  const rows = [
    {symptom:'Legacy output looks like Hkkjr or other English letters',cause:'The result is stored as legacy codes; the matching font is not applied.',action:<>Paste it in Word and select the exact licensed destination font. <a href="/font-krutidev">Check Kruti Dev installation</a>. Use <a href="/">Unicode output</a> for ordinary messages.</>},
    {symptom:'Converted Hindi has wrong letters or half letters',cause:'The source font, conversion direction or font variant may not match.',action:<>Check a short selection in the original Word file. <a href="/fonts">Identify the source font</a>; use <a href="/devlys-to-unicode">DevLys 010</a> for DevLys, not the Kruti Dev tool.</>},
    {symptom:'Short-i matras or reph appear in the wrong place',cause:'Copied codes may have been reordered, or typing used the wrong sequence.',action:<>Compare with the source and <a href="/keyboard">Remington guide</a>. For Kruti Dev 010, <code>fd</code> becomes कि and <code>deZ</code> becomes कर्म. Other mappings need their own checks.</>},
    {symptom:'Matras or characters change after a publishing import',cause:'Smart-quote replacement or automatic hyphenation may have altered legacy codes.',action:<>Disable quote substitution and automatic hyphenation before importing legacy text, then paste fresh output. <a href="/unicode-to-devlys">DevLys 010 guidance</a> explains the straight quote used for ष.</>},
    {symptom:'PDF copying produces missing, reordered or unrelated characters',cause:'The PDF extraction may not preserve its original text encoding, or the page may be a scan.',action:<>Compare copied text with the PDF and obtain the original editable document where possible. This converter cannot perform OCR or recover missing glyphs. <a href={WORD_GUIDE}>Use the selected-text Word workflow</a>.</>},
    {symptom:'Boxes or incorrect glyphs remain in Word',cause:'The selected font may be missing, unsuitable or different from the required variant.',action:<>Check the destination font and licensed installation. <a href="/font-chanakya">Read Chanakya font guidance</a>. For Unicode Hindi, select an available Unicode Devanagari font.</>},
    {symptom:'English names or reference codes changed',cause:'Legacy letters overlap with ordinary Latin characters.',action:<>Protect literal content with <code>[[Invoice 123]]</code> before converting. Review the output and apply an appropriate Latin font to English selections in Word.</>},
    {symptom:'Word download does not match the source layout',cause:'Export creates a new document from text; it does not import source formatting.',action:<>Reapply layout in Word or paste into your destination template. <a href={WORD_GUIDE}>Check export and formatting limits</a>.</>},
    {symptom:'A long sharing draft fails or is incomplete',cause:'The app or browser may limit URL-based drafts.',action:<>Compare the draft with the full result. Use Copy, or download the Word file and attach it yourself. Legacy text still needs its matching font.</>},
  ];
  return <>
    <h1>Troubleshoot Hindi Font Conversion</h1>
    <p>Start by checking the original font, the direction and a short passage. A display problem, damaged copied text and an encoding mismatch need different fixes. Preserve your original document while investigating.</p>
    <p lang="hi">गलत परिणाम मिलने पर पहले मूल फ़ॉन्ट और सही कन्वर्टर जाँचें। मात्रा, रेफ और विराम चिह्न मूल दस्तावेज़ से मिलाएँ।</p>
    <h2>Match the symptom to a check</h2>
    <p className="fine">On a narrow screen, swipe the table sideways to read all three columns. Keyboard users can focus the table region and use the arrow keys.</p>
    <div className="guide-table-wrap" role="region" aria-label="Hindi conversion troubleshooting table" tabIndex={0}>
      <table className="guide-table"><caption>Possible causes are checks to investigate, not automatic diagnoses.</caption><thead><tr><th scope="col">Symptom</th><th scope="col">Possible cause</th><th scope="col">Recommended action</th></tr></thead><tbody>{rows.map(row=><tr key={row.symptom}><th scope="row">{row.symptom}</th><td>{row.cause}</td><td>{row.action}</td></tr>)}</tbody></table>
    </div>
    <h2>Choose the source encoding before changing fonts</h2>
    <p>Readable Hindi copied from Mangal is Unicode. Use <a href="/mangal-to-krutidev">Mangal to Kruti Dev</a> when a destination requires Kruti Dev codes; no Mangal-to-Unicode step is needed. For legacy sources choose <a href="/">Kruti Dev to Unicode</a>, <a href="/devlys-to-unicode">DevLys 010 to Unicode</a>, or <a href="/chanakya-to-unicode">Chanakya to Unicode</a>.</p>
    <p>Kruti Dev and DevLys can both store भारत as <code>Hkkjr</code>, but <code>F</code> decodes as थ् in Kruti Dev and थ in DevLys 010. One shared word cannot identify every mapping. Check the original font and compare more than one example.</p>
    <h2>Check matras, reph and composition</h2>
    <p>In Kruti Dev 010 Remington typing, the short-i code <code>f</code> precedes the consonant and reph <code>Z</code> follows the syllable. Practice <code>fd</code> → कि and <code>deZ</code> → कर्म on the <a href="/typing">live typing page</a>. That page pauses automatic updates during input-method composition and resumes afterward; it is not phonetic transliteration.</p>
    <h2>Keep legacy punctuation intact</h2>
    <p>Do not replace quote-shaped characters simply because they look unusual. Some are part of the legacy encoding. DevLys 010 uses a straight double quote for ष; supported Preeti uses straight quotes for matras. Kruti Dev output also contains quote-shaped glyph codes. Turn off automatic punctuation replacement before a publishing import and compare fresh output after applying the matching font. The <a href="/font-preeti">existing Hindi Preeti guide</a> covers its import cautions.</p>
    <h2>Know what conversion cannot recover</h2>
    <p>Font installation changes display; it does not repair lost PDF characters or convert stored codes. A scanned page requires a separate OCR process and proofreading before using a text converter. This site does not read scans, import Word files or restore original page layout. Ambiguous legacy sequences and unsupported characters require review; exact round trips are not guaranteed.</p>
    <p>For an installation problem, use a licensed font and restart the destination application if necessary. No legacy font downloads are hosted here. <a href="/fonts">Compare font guides</a> · <a href={WORD_GUIDE}>Follow the Word conversion workflow</a>.</p>
  </>;
}

export default function ConversionGuide({slug}:{slug:string}) {
  return <article className="support conversion-guide">
    <a href="/" className="back">← All converters</a>
    {slug === WORD_GUIDE.slice(1) ? <WordGuide/> : <TroubleshootingGuide/>}
    <GuideLinks/>
  </article>;
}
