type Step = { title: string; text: string };
type Faq = { question: string; answer: string };
type Link = { href: string; text: string };
export type ConversionContent = {
  h1: string; intro: string; howTitle: string; steps: Step[];
  exampleTitle: string; input: string; output: string; inputHindi?: boolean; outputHindi?: boolean;
  explanation: string; hindi?: string; wordTitle?: string; wordSteps?: string[];
  faqTitle: string; faqs: Faq[]; links: Link[];
};
const home: ConversionContent = {
  h1: 'Kruti Dev to Unicode Converter',
  intro: 'Paste Kruti Dev 010 codes from your Hindi document to get readable Unicode Hindi. Review the result, then copy it or download a Word file. Conversion runs in your browser.',
  howTitle: 'How to convert Kruti Dev 010 to Unicode',
  steps: [
    { title: 'Paste Kruti Dev text', text: 'Check the original font is Kruti Dev 010. Paste its codes into the source editor; Hkkjr is a verified example.' },
    { title: 'Review Unicode Hindi', text: 'Conversion runs as you type, or when you select Convert to Unicode. Check names, matras and punctuation against the original.' },
    { title: 'Copy or download', text: 'Copy the Unicode result into your document or message. Download Word creates a new document from the converted text.' },
  ],
  exampleTitle: 'Kruti Dev example: Hkkjr becomes भारत', input: 'Hkkjr', output: 'भारत', outputHindi: true,
  explanation: 'Kruti Dev stores legacy character codes. Unicode stores Hindi letters, so changing the font alone is not the same as converting the text. The Unicode result can be displayed with Mangal or another Unicode Devanagari font.',
  hindi: 'कृतिदेव 010 में लिखा टेक्स्ट पहले बॉक्स में पेस्ट करें। दूसरे बॉक्स में यूनिकोड हिंदी मिलेगी। उदाहरण: Hkkjr से भारत। परिणाम पढ़कर जाँचें, फिर कॉपी करें या Word फ़ाइल डाउनलोड करें।',
  faqTitle: 'Kruti Dev to Unicode: common questions',
  faqs: [
    { question: 'Why does my Kruti Dev source look like English letters?', answer: 'Those are the stored legacy codes. They look like Hindi only with the matching Kruti Dev font. Paste the codes here to convert them to Unicode; for example, Hkkjr becomes भारत.' },
    { question: 'How do I preserve an English name or number?', answer: 'Wrap literal text in double brackets, such as [[Invoice 123]]. The converter keeps the enclosed text and removes the brackets. Review mixed-language text before using the result.' },
    { question: 'Can this convert a scanned PDF or preserve a document’s layout?', answer: 'This tool converts pasted text. It does not read scans or import a document’s layout. A Word download contains the converted text in a new document; review any text copied from a PDF for extraction errors.' },
  ],
  links: [ { href: '/unicode-to-krutidev', text: 'Convert Unicode back to Kruti Dev' }, { href: '/krutidev-to-mangal', text: 'Use Kruti Dev text with Mangal' }, { href: '/keyboard', text: 'Check the Remington keyboard guide' }, { href: '/font-krutidev', text: 'Read the Kruti Dev 010 font guide' } ],
};
export const conversionContent: Record<string, ConversionContent> = {
  home, 'krutidev-to-unicode': home,
  'unicode-to-krutidev': {
    h1: 'Unicode to Kruti Dev 010 Converter',
    intro: 'Paste readable Unicode Hindi to get Kruti Dev 010 legacy codes for a document that requires that font. The result may resemble English letters until you apply a licensed Kruti Dev 010 font.',
    howTitle: 'How to convert Unicode Hindi to Kruti Dev 010',
    steps: [
      { title: 'Paste Unicode Hindi', text: 'Use readable Hindi from a document, website or message. Paste भारत into the source editor to try the verified example.' },
      { title: 'Convert and check', text: 'Use automatic conversion or select Convert to Kruti Dev. भारत becomes Hkkjr; this appearance is expected for raw legacy codes.' },
      { title: 'Use the matching font', text: 'Copy the codes into Word and apply Kruti Dev 010, or download a Word file. Keep a Unicode copy for web and email use.' },
    ],
    exampleTitle: 'Unicode example: भारत becomes Hkkjr', input: 'भारत', output: 'Hkkjr', inputHindi: true,
    explanation: 'The language remains Hindi; the stored codes change. Pasting Hkkjr into a message will not make it appear as Hindi unless the destination uses the matching legacy font.',
    wordTitle: 'Apply Kruti Dev 010 in Microsoft Word',
    wordSteps: [ 'Install a licensed Kruti Dev 010 font on your device and reopen Word if needed.', 'Paste the converted codes, select that text and choose Kruti Dev 010 in Word’s font menu.', 'Compare the Hindi display with your original, especially names and matras. A recipient also needs the font; it is not embedded in the download.' ],
    faqTitle: 'Using converted Kruti Dev codes',
    faqs: [
      { question: 'Is Hkkjr an error when I convert भारत?', answer: 'No. Hkkjr is the verified Kruti Dev 010 output for भारत. Apply the matching font in Word to see the Hindi glyphs.' },
      { question: 'Do I need to convert text between Mangal and Unicode first?', answer: 'No. Mangal displays Unicode Hindi. Readable Hindi copied from a Mangal document can be pasted directly into this Unicode source editor.' },
      { question: 'Will a Word download install or include Kruti Dev?', answer: 'No. The download selects the font for the converted text but does not embed or install a font file. Obtain a licensed copy and review the result on the device where it will be used.' },
    ],
    links: [ { href: '/', text: 'Read Kruti Dev codes as Unicode' }, { href: '/mangal-to-krutidev', text: 'Convert text from a Mangal document' }, { href: '/font-krutidev', text: 'Install a licensed Kruti Dev 010 font' }, { href: '/keyboard', text: 'View the Kruti Dev keyboard guide' } ],
  },
  'krutidev-to-mangal': {
    h1: 'Kruti Dev to Mangal Unicode Converter',
    intro: 'Convert Kruti Dev 010 codes to Unicode Hindi for use with Mangal. Mangal is a Unicode font, not a separate legacy encoding. Copy the result into Word or download a Word file using Mangal.',
    howTitle: 'Convert Kruti Dev text for a Mangal document',
    steps: [
      { title: 'Copy the legacy codes', text: 'Check that the source document uses Kruti Dev 010, then paste its text into the source editor.' },
      { title: 'Read the Unicode result', text: 'Hkkjr converts to भारत. Review the Hindi letters and punctuation before moving the result to Word.' },
      { title: 'Choose Mangal in Word', text: 'Copy the result, paste it into Word and select Mangal for the text. The Word download also selects Mangal; the font must be available on your device.' },
    ],
    exampleTitle: 'Kruti Dev codes to Unicode Hindi for Mangal', input: 'Hkkjr', output: 'भारत', outputHindi: true,
    explanation: 'This direction produces Unicode letters, as the Kruti Dev to Unicode tool does. Mangal changes their appearance, not the stored Hindi text. The browser may use a fallback font when Mangal is unavailable.',
    faqTitle: 'Mangal output: fonts and Unicode',
    faqs: [
      { question: 'Is converting to Mangal different from converting to Unicode?', answer: 'The Hindi character encoding is Unicode in both cases. This page presents the result for a Mangal workflow, and its Word download selects Mangal as the font.' },
      { question: 'Can I change Kruti Dev to Mangal using Word’s font menu alone?', answer: 'No. First convert the legacy codes to Unicode. Then select Mangal in Word; changing the font without conversion can display the wrong characters.' },
      { question: 'What if Mangal is not available on my device?', answer: 'The Unicode text remains readable with another suitable Unicode Devanagari font. To use the Mangal appearance in Word, make sure Mangal is available on that device.' },
    ],
    links: [ { href: '/', text: 'Use the general Kruti Dev to Unicode converter' }, { href: '/mangal-to-krutidev', text: 'Convert Mangal text back to Kruti Dev' }, { href: '/fonts', text: 'Compare Unicode and legacy Hindi fonts' }, { href: '/font-krutidev', text: 'Identify Kruti Dev 010 text' } ],
  },
  'mangal-to-krutidev': {
    h1: 'Mangal to Kruti Dev 010 Converter',
    intro: 'Copy readable Hindi from a Mangal-formatted Word document and paste it here to get Kruti Dev 010 codes. Mangal text uses Unicode; the converted legacy output needs the matching Kruti Dev font.',
    howTitle: 'Move Hindi from a Mangal document to Kruti Dev',
    steps: [
      { title: 'Copy Hindi from Word', text: 'Select the Hindi text in your Mangal-formatted document and copy it. Paste the readable Hindi into this page’s source editor.' },
      { title: 'Convert the Unicode text', text: 'Automatic conversion or Convert to Kruti Dev produces legacy codes. The verified example is भारत to Hkkjr.' },
      { title: 'Apply Kruti Dev 010', text: 'Paste the output into the destination document, select it and choose a licensed Kruti Dev 010 font. Compare the display with the original.' },
    ],
    exampleTitle: 'From Mangal Hindi to Kruti Dev codes', input: 'भारत', output: 'Hkkjr', inputHindi: true,
    explanation: 'Copying Hindi from Mangal preserves its Unicode letters, not a special Mangal encoding. Keep the original Unicode document for searching and sharing; use the converted codes where Kruti Dev 010 is required.',
    wordTitle: 'Check the destination Word document',
    wordSteps: [ 'Install a licensed Kruti Dev 010 font if it is not available in Word.', 'Paste the converted result and choose Kruti Dev 010 for that selection. Download Word creates a new document with that font selected.', 'Proofread the Hindi after applying the font. The download does not embed fonts or preserve the original document’s layout.' ],
    faqTitle: 'Converting Mangal-formatted Hindi',
    faqs: [
      { question: 'Should the source box contain Hindi or English-looking codes?', answer: 'Paste readable Unicode Hindi from the Mangal document. If your copied text already looks like Hkkjr, check the original font and use the Kruti Dev to Unicode direction instead.' },
      { question: 'Why does the converted result look like English letters?', answer: 'Kruti Dev 010 uses legacy codes. भारत becomes Hkkjr, which displays as Hindi only when the matching font is applied. This is a change of encoding, not a translation.' },
      { question: 'Will the converter preserve Word tables and formatting?', answer: 'The editor converts plain text. It does not import tables, images or page layout. Paste the result into your destination layout, or download a new Word document containing the converted text.' },
    ],
    links: [ { href: '/krutidev-to-mangal', text: 'Convert Kruti Dev text to Mangal Unicode' }, { href: '/unicode-to-krutidev', text: 'Use the general Unicode to Kruti Dev converter' }, { href: '/font-krutidev', text: 'Read Kruti Dev 010 installation guidance' }, { href: '/fonts', text: 'Identify your original Hindi font' } ],
  },
};
export function ConversionInstructions({content}:{content:ConversionContent}) {
  return <section className="how"><div><span className="section-kicker">CONVERSION INSTRUCTIONS</span><h2>{content.howTitle}</h2></div>{content.steps.map((step,index)=><div className="step" key={step.title}><b>{String(index+1).padStart(2,'0')}</b><h3>{step.title}</h3><p>{step.text}</p></div>)}</section>;
}
export function ConversionDetails({content}:{content:ConversionContent}) {
  return <section className="typing-guide"><h2>{content.exampleTitle}</h2><p><code lang={content.inputHindi?'hi':undefined}>{content.input}</code> → <code lang={content.outputHindi?'hi':undefined}>{content.output}</code></p><p>{content.explanation}</p>{content.hindi&&<p lang="hi">{content.hindi}</p>}{content.wordSteps&&<><h2>{content.wordTitle}</h2>{content.wordSteps.map((step,index)=><p key={step}><strong>{index+1}.</strong> {step}</p>)}</>}<p>Related guides and converters: {content.links.map((link,index)=><span key={link.href}>{index>0?' · ':''}<a className="back" href={link.href}>{link.text}</a></span>)}</p></section>;
}
export function ConversionFaq({content}:{content:ConversionContent}) {
  return <section className="faq"><div><span className="section-kicker">CONVERSION HELP</span><h2>{content.faqTitle}</h2></div><div>{content.faqs.map(faq=><details key={faq.question}><summary>{faq.question}</summary><p>{faq.answer}</p></details>)}</div></section>;
}
