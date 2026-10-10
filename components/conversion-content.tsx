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
const secondaryContent: Record<string, ConversionContent> = {
  "devlys-to-unicode": {
    "h1": "DevLys 010 to Unicode Hindi Converter",
    "intro": "Paste codes from a DevLys 010 document to get readable Unicode Hindi. Check the original font name before converting; DevLys variants may use different codes.",
    "howTitle": "Read DevLys 010 codes as Unicode Hindi",
    "steps": [
      {
        "title": "Confirm DevLys 010",
        "text": "Select a few words in the original document and check its font. Paste the copied legacy codes into the source editor."
      },
      {
        "title": "Review the Hindi result",
        "text": "Use automatic conversion or Convert to Unicode. Compare matras, half letters and punctuation with the original."
      },
      {
        "title": "Copy readable Hindi",
        "text": "Copy the Unicode result into a message or document, or download a Word file. Keep the original for proofreading."
      }
    ],
    "exampleTitle": "DevLys 010 example: Hkkjr to भारत",
    "input": "Hkkjr",
    "output": "भारत",
    "outputHindi": true,
    "explanation": "DevLys 010 and Kruti Dev can share some codes without sharing every mapping. For example, F converts to थ with DevLys 010 but थ् with Kruti Dev. Choose the source font rather than guessing from one word.",
    "hindi": "DevLys 010 के कोड पहले बॉक्स में पेस्ट करें। यूनिकोड हिंदी को मूल दस्तावेज़ से मिलाकर जाँचें।",
    "faqTitle": "Checking a DevLys source document",
    "faqs": [
      {
        "question": "Can I use the Kruti Dev converter for DevLys 010?",
        "answer": "Use the DevLys direction when the source font is DevLys 010. Similar-looking codes can decode differently, especially half letters."
      },
      {
        "question": "Does this cover every DevLys font variant?",
        "answer": "This converter targets DevLys 010. Check a short passage before converting a document made with another variant."
      },
      {
        "question": "What if copied PDF text produces incorrect Hindi?",
        "answer": "Compare it with the original document and check its font. PDF extraction can reorder or omit characters; this text converter cannot recover missing glyphs or read a scan."
      }
    ],
    "links": [
      {
        "href": "/unicode-to-devlys",
        "text": "Convert Unicode back to DevLys 010"
      },
      {
        "href": "/devlys-to-mangal",
        "text": "Use DevLys text with Mangal"
      },
      {
        "href": "/fonts",
        "text": "Identify DevLys 010 and other Hindi fonts"
      }
    ]
  },
  "unicode-to-devlys": {
    "h1": "Unicode Hindi to DevLys 010 Converter",
    "intro": "Convert readable Unicode Hindi to DevLys 010 legacy codes for a document that requires that font. Apply a licensed DevLys 010 font to the result in your destination document.",
    "howTitle": "Prepare Unicode Hindi for DevLys 010",
    "steps": [
      {
        "title": "Paste Unicode letters",
        "text": "Use readable Hindi from a website, message or Unicode document. Do not paste English-looking legacy codes as Unicode input."
      },
      {
        "title": "Convert to DevLys codes",
        "text": "भारत becomes Hkkjr. Review the raw result without expecting the browser to display DevLys glyphs."
      },
      {
        "title": "Apply DevLys 010 in Word",
        "text": "Copy the output into Word, select it and choose your licensed DevLys 010 font. Proofread the displayed Hindi; the Word download does not embed the font."
      }
    ],
    "exampleTitle": "Unicode to DevLys 010: भारत to Hkkjr",
    "input": "भारत",
    "output": "Hkkjr",
    "inputHindi": true,
    "explanation": "The output is still Hindi content, stored as legacy codes. Keep a Unicode copy for searching and sharing. A recipient needs the matching font to display those codes.",
    "faqTitle": "Using DevLys 010 output",
    "faqs": [
      {
        "question": "Why does the result look like English letters?",
        "answer": "The editor displays stored DevLys codes. Apply DevLys 010 in a document to display Hindi; changing the browser font is not part of this tool."
      },
      {
        "question": "Can smart quotes change the result?",
        "answer": "Yes. DevLys 010 uses a straight double quote for ष. Disable typographer’s quote replacement and automatic hyphenation when importing legacy text into InDesign; re-paste fresh output if characters changed."
      },
      {
        "question": "Does Download Word install DevLys 010?",
        "answer": "No. It creates a document with the output font selected, but does not install or embed a font. Obtain a licensed copy for the device where the document will be used."
      }
    ],
    "links": [
      {
        "href": "/devlys-to-unicode",
        "text": "Read DevLys 010 as Unicode"
      },
      {
        "href": "/mangal-to-devlys",
        "text": "Convert Hindi copied from Mangal"
      },
      {
        "href": "/fonts",
        "text": "Read DevLys font and licensing guidance"
      }
    ]
  },
  "devlys-to-mangal": {
    "h1": "DevLys 010 to Mangal Unicode Converter",
    "intro": "Convert DevLys 010 codes to Unicode Hindi for a Mangal-formatted document. Mangal displays Unicode letters; it does not have a separate legacy encoding.",
    "howTitle": "Move DevLys text into a Mangal document",
    "steps": [
      {
        "title": "Copy DevLys 010 text",
        "text": "Check the original document’s font, then paste its legacy codes into the source editor."
      },
      {
        "title": "Check the Unicode letters",
        "text": "Convert to Mangal and compare the readable Hindi with the source. Pay attention to half letters and text extracted from PDFs."
      },
      {
        "title": "Choose Mangal in Word",
        "text": "Copy the result into Word and select Mangal for that text. Download Word also selects Mangal; it must be available on your device."
      }
    ],
    "exampleTitle": "DevLys codes to Hindi displayed with Mangal",
    "input": "Hkkjr",
    "output": "भारत",
    "outputHindi": true,
    "explanation": "DevLys to Mangal produces the same Unicode letters as DevLys to Unicode. Selecting Mangal changes their appearance. If Mangal is unavailable, another Unicode Devanagari font can display the result.",
    "hindi": "DevLys के कोड को पहले यूनिकोड में बदलें। फिर Word में परिणाम पेस्ट करके Mangal फ़ॉन्ट चुनें।",
    "faqTitle": "Mangal display after DevLys conversion",
    "faqs": [
      {
        "question": "Can I select Mangal without converting DevLys codes?",
        "answer": "No. Convert the legacy codes to Unicode first, then apply Mangal. A font-menu change alone does not rewrite the stored codes."
      },
      {
        "question": "Why does the browser display a different style from Word?",
        "answer": "Mangal may not be installed on your device, so the browser can use a fallback. The Unicode letters remain the same."
      },
      {
        "question": "What if the original font is another DevLys variant?",
        "answer": "This mapping targets DevLys 010. Test and compare a short passage; do not assume every variant has identical character codes."
      }
    ],
    "links": [
      {
        "href": "/mangal-to-devlys",
        "text": "Return Mangal Hindi to DevLys 010"
      },
      {
        "href": "/devlys-to-unicode",
        "text": "Use the general DevLys to Unicode tool"
      },
      {
        "href": "/fonts",
        "text": "Compare Mangal and legacy fonts"
      }
    ]
  },
  "mangal-to-devlys": {
    "h1": "Mangal Hindi to DevLys 010 Converter",
    "intro": "Copy Unicode Hindi from a Mangal-formatted document to produce DevLys 010 codes. The output needs a licensed DevLys 010 font in the destination document.",
    "howTitle": "Copy Mangal Hindi into a DevLys workflow",
    "steps": [
      {
        "title": "Copy readable Hindi",
        "text": "Select text in the Mangal document and paste it here. Mangal uses Unicode, so the source should contain Hindi letters."
      },
      {
        "title": "Convert to legacy codes",
        "text": "Automatic conversion or Convert to DevLys produces the raw codes. भारत becomes Hkkjr."
      },
      {
        "title": "Set the destination font",
        "text": "Paste the codes into Word and choose DevLys 010. Compare with the original Mangal document and keep the Unicode copy."
      }
    ],
    "exampleTitle": "Mangal Unicode input to DevLys 010 codes",
    "input": "भारत",
    "output": "Hkkjr",
    "inputHindi": true,
    "explanation": "This converts Unicode text, not the appearance or layout of a Mangal document. A Word download creates a new document with the output font selected; it does not preserve tables or embed DevLys.",
    "faqTitle": "Preparing a DevLys document from Mangal",
    "faqs": [
      {
        "question": "What if copied source text already looks like Hkkjr?",
        "answer": "Check the source font. Raw legacy codes should use the matching legacy-to-Unicode converter, rather than this Unicode input direction."
      },
      {
        "question": "Will my Mangal document’s formatting be preserved?",
        "answer": "Only pasted text is converted. Copy the output into your destination layout; tables, images and page formatting are not imported."
      },
      {
        "question": "Why are some characters wrong after pasting?",
        "answer": "Confirm DevLys 010 is selected and that quote replacement has not changed the codes. Review the result against the original; other DevLys variants may differ."
      }
    ],
    "links": [
      {
        "href": "/devlys-to-mangal",
        "text": "Read DevLys text with Mangal"
      },
      {
        "href": "/unicode-to-devlys",
        "text": "Use Unicode to DevLys 010"
      },
      {
        "href": "/fonts",
        "text": "Identify and install the appropriate font"
      }
    ]
  },
  "chanakya-to-unicode": {
    "h1": "Chanakya to Unicode Hindi Converter",
    "intro": "Paste legacy Chanakya text from a Hindi publishing document to get Unicode Hindi. Identify the original font and review extracted text before using the result.",
    "howTitle": "Convert a Chanakya passage to Unicode",
    "steps": [
      {
        "title": "Check the publishing font",
        "text": "Confirm Chanakya in the original document, then paste a short selection of its stored codes."
      },
      {
        "title": "Review letters and marks",
        "text": "Convert to Unicode and compare the Hindi with the original, including matras, conjuncts and punctuation."
      },
      {
        "title": "Use Unicode text",
        "text": "Copy the result for a Unicode document or message, or download a Word file. Rebuild layout separately if the source was a publishing file."
      }
    ],
    "exampleTitle": "Chanakya codes: ÖæÚUÌ becomes भारत",
    "input": "ÖæÚUÌ",
    "output": "भारत",
    "outputHindi": true,
    "explanation": "Chanakya codes include Latin and extended characters. They need conversion before use as Unicode Hindi. Text copied from a PDF may have extraction errors that changing an encoding cannot repair.",
    "faqTitle": "Troubleshooting Chanakya source text",
    "faqs": [
      {
        "question": "Can this import a publishing file or scanned page?",
        "answer": "No. Paste extracted text into the editor. It does not import page layout, perform OCR or recover letters omitted during extraction."
      },
      {
        "question": "Why are some copied words still incorrect?",
        "answer": "Confirm the source is the supported Chanakya mapping, compare a short passage and check for missing or reordered PDF characters."
      },
      {
        "question": "Will converting back restore exactly the same codes?",
        "answer": "Not necessarily. Different legacy sequences can represent the same Hindi letters. Keep your original file if exact source codes matter."
      }
    ],
    "links": [
      {
        "href": "/unicode-to-chanakya",
        "text": "Convert Unicode back to Chanakya"
      },
      {
        "href": "/chanakya-to-krutidev",
        "text": "Move Chanakya text to Kruti Dev"
      },
      {
        "href": "/font-chanakya",
        "text": "Read Chanakya installation and licensing guidance"
      }
    ]
  },
  "unicode-to-chanakya": {
    "h1": "Unicode Hindi to Chanakya Converter",
    "intro": "Convert readable Unicode Hindi to the supported Chanakya legacy codes. Apply a licensed Chanakya font in the destination document and compare the display with your Unicode original.",
    "howTitle": "Prepare Unicode Hindi for Chanakya",
    "steps": [
      {
        "title": "Paste readable Unicode Hindi",
        "text": "Copy Hindi from a Unicode document or website. Keep a copy of the original text for proofreading."
      },
      {
        "title": "Generate Chanakya codes",
        "text": "Use automatic conversion or Convert to Chanakya. भारत becomes ÖæÚUÌ in the raw result editor."
      },
      {
        "title": "Apply the matching Chanakya font",
        "text": "Paste the codes into the destination document, select Chanakya and check the display. Download Word does not install or embed fonts."
      }
    ],
    "exampleTitle": "Unicode Hindi to Chanakya: भारत to ÖæÚUÌ",
    "input": "भारत",
    "output": "ÖæÚUÌ",
    "inputHindi": true,
    "explanation": "Extended characters in the result are part of the legacy encoding. They do not become searchable Unicode Hindi merely by applying the font. Retain the Unicode source for web use.",
    "faqTitle": "Working with converted Chanakya codes",
    "faqs": [
      {
        "question": "Are ÖæÚUÌ characters a conversion failure?",
        "answer": "They are the verified codes for भारत in this Chanakya mapping. Apply the matching licensed font to display the Hindi glyphs."
      },
      {
        "question": "Can I share these codes as ordinary Hindi in email?",
        "answer": "Use Unicode Hindi for email and messages. Chanakya codes need the matching font in the recipient’s application."
      },
      {
        "question": "Will this recreate my original page design?",
        "answer": "No. It converts text only. Paste the output into your own layout and proofread it with the appropriate font."
      }
    ],
    "links": [
      {
        "href": "/chanakya-to-unicode",
        "text": "Read Chanakya codes as Unicode"
      },
      {
        "href": "/krutidev-to-chanakya",
        "text": "Convert an existing Kruti Dev document"
      },
      {
        "href": "/font-chanakya",
        "text": "Install a licensed Chanakya font"
      }
    ]
  },
  "krutidev-to-chanakya": {
    "h1": "Kruti Dev 010 to Chanakya Hindi Converter",
    "intro": "Convert Kruti Dev 010 legacy codes to Chanakya codes for a Hindi publishing workflow. Both editors show stored codes; apply Chanakya in the destination document to check the Hindi display.",
    "howTitle": "Move Kruti Dev text to Chanakya",
    "steps": [
      {
        "title": "Confirm Kruti Dev 010 input",
        "text": "Copy text from the Kruti Dev document and paste its stored codes. Hkkjr is a verified input."
      },
      {
        "title": "Convert between legacy encodings",
        "text": "Convert to Chanakya; Hkkjr becomes ÖæÚUÌ. The result is Chanakya codes, rather than readable Unicode output."
      },
      {
        "title": "Review with Chanakya selected",
        "text": "Paste the result into your destination document and apply a licensed Chanakya font. Compare its Hindi display with the original Kruti Dev document."
      }
    ],
    "exampleTitle": "Kruti Dev Hkkjr to Chanakya ÖæÚUÌ",
    "input": "Hkkjr",
    "output": "ÖæÚUÌ",
    "explanation": "The two fonts use different legacy mappings. Changing Kruti Dev to Chanakya in a font menu alone does not convert the codes. Use Unicode output instead when the destination is a website or message.",
    "faqTitle": "Checking Kruti Dev to Chanakya output",
    "faqs": [
      {
        "question": "Why do both boxes show Latin-looking characters?",
        "answer": "Both directions use legacy encodings. The source needs Kruti Dev 010 for display, while the result needs the supported Chanakya font."
      },
      {
        "question": "What if my source already contains readable Hindi?",
        "answer": "Use Unicode to Chanakya for readable Unicode input. This page expects Kruti Dev 010 codes."
      },
      {
        "question": "Will mixed English text stay unchanged?",
        "answer": "Wrap literal English text in double brackets, such as [[Invoice 123]]. The converter preserves the enclosed text and removes the brackets; review the resulting document."
      }
    ],
    "links": [
      {
        "href": "/chanakya-to-krutidev",
        "text": "Convert Chanakya back to Kruti Dev"
      },
      {
        "href": "/font-chanakya",
        "text": "Check the destination Chanakya font"
      },
      {
        "href": "/font-krutidev",
        "text": "Identify Kruti Dev 010 source text"
      },
      {
        "href": "/",
        "text": "Read Kruti Dev codes as Unicode"
      }
    ]
  },
  "chanakya-to-krutidev": {
    "h1": "Chanakya to Kruti Dev 010 Hindi Converter",
    "intro": "Convert legacy Chanakya text to Kruti Dev 010 codes for a document requiring the Remington font. Review the result with a licensed Kruti Dev 010 font applied.",
    "howTitle": "Transfer Chanakya Hindi to Kruti Dev 010",
    "steps": [
      {
        "title": "Paste Chanakya codes",
        "text": "Check the original font is Chanakya. Copy a short passage, including its extended characters, into the source editor."
      },
      {
        "title": "Convert to Kruti Dev 010",
        "text": "ÖæÚUÌ becomes Hkkjr. Do not replace the extended source characters manually before converting."
      },
      {
        "title": "Check the destination display",
        "text": "Copy the result into Word, select Kruti Dev 010 and proofread against the original. The font is not embedded in a Word download."
      }
    ],
    "exampleTitle": "Chanakya ÖæÚUÌ to Kruti Dev Hkkjr",
    "input": "ÖæÚUÌ",
    "output": "Hkkjr",
    "explanation": "This changes the legacy encoding without translating the language. Keep the original publishing file; exact codes and document layout are not guaranteed to round-trip through conversion.",
    "faqTitle": "Reviewing a Chanakya to Kruti Dev transfer",
    "faqs": [
      {
        "question": "Can I just select Kruti Dev in the Chanakya document?",
        "answer": "Convert the codes first. Choosing another legacy font without conversion can display incorrect Hindi glyphs."
      },
      {
        "question": "What should I do if PDF copying loses characters?",
        "answer": "Compare extracted text against the original before conversion. Missing characters cannot be recovered by this text tool; use the source document where possible."
      },
      {
        "question": "Where can I obtain the output font?",
        "answer": "Use a licensed Kruti Dev 010 copy from its publisher, your institution or the document supplier. This site does not distribute unlicensed font files."
      }
    ],
    "links": [
      {
        "href": "/krutidev-to-chanakya",
        "text": "Return Kruti Dev text to Chanakya"
      },
      {
        "href": "/font-krutidev",
        "text": "Install Kruti Dev 010"
      },
      {
        "href": "/font-chanakya",
        "text": "Check Chanakya source-font guidance"
      },
      {
        "href": "/chanakya-to-unicode",
        "text": "Use Unicode for sharing and searching"
      }
    ]
  },
  "preeti-to-unicode": {
    "h1": "Preeti to Unicode Converter for Hindi Text",
    "intro": "Paste Hindi text stored as Preeti legacy codes to get Unicode Hindi. This page covers the supported Preeti mapping for Hindi text; compare matras, nukta letters and punctuation with the original.",
    "howTitle": "Read Hindi Preeti codes as Unicode",
    "steps": [
      {
        "title": "Check the source is Preeti",
        "text": "Copy text from the Preeti-formatted document and paste its raw codes. ef/t is a verified example for भारत."
      },
      {
        "title": "Review the Unicode result",
        "text": "Convert to Unicode and check the readable Hindi, especially marks and punctuation that may have changed during copying."
      },
      {
        "title": "Copy Unicode Hindi",
        "text": "Copy into your Unicode document or message, or download a Word file. Keep the original Preeti document for comparison."
      }
    ],
    "exampleTitle": "Hindi Preeti example: ef/t to भारत",
    "input": "ef/t",
    "output": "भारत",
    "outputHindi": true,
    "explanation": "Preeti stores legacy codes, so the source may look like Latin letters. Curly quotes introduced by a publishing application can change those codes. Copy from the original where possible and check the result rather than assuming perfect recovery.",
    "hindi": "प्रीति फ़ॉन्ट में लिखे हिंदी टेक्स्ट के कोड पेस्ट करें। यूनिकोड परिणाम में मात्राएँ और नुक्ते मूल पाठ से मिलाकर जाँचें।",
    "faqTitle": "Checking Hindi text copied from Preeti",
    "faqs": [
      {
        "question": "Why does the copied source look like ef/t?",
        "answer": "Preeti stores legacy codes. In this mapping ef/t converts to भारत. The original codes display as Hindi only with the matching font."
      },
      {
        "question": "Can curly quotes cause incorrect matras?",
        "answer": "Yes. Preeti uses straight apostrophes and double quotes for ु and ू. Compare copied punctuation with the original; quote substitution may alter legacy codes."
      },
      {
        "question": "Can this correct every Preeti document automatically?",
        "answer": "No. This is a text conversion tool for the supported mapping. Font variants and extraction errors need review, particularly matras, nukta letters and punctuation."
      }
    ],
    "links": [
      {
        "href": "/unicode-to-preeti",
        "text": "Convert Hindi Unicode back to Preeti"
      },
      {
        "href": "/font-preeti",
        "text": "Identify and install a licensed Preeti font"
      },
      {
        "href": "/fonts",
        "text": "Compare legacy codes with Unicode Hindi"
      }
    ]
  },
  "unicode-to-preeti": {
    "h1": "Unicode to Preeti Converter for Hindi Text",
    "intro": "Convert readable Unicode Hindi to Preeti legacy codes for a document using that font. Apply a licensed Preeti font and review the Hindi display before using the document.",
    "howTitle": "Prepare Hindi Unicode text for Preeti",
    "steps": [
      {
        "title": "Paste Unicode Hindi",
        "text": "Use readable Hindi from a document or message. भारत is a verified Unicode input."
      },
      {
        "title": "Generate Preeti codes",
        "text": "Use automatic conversion or Convert to Preeti. भारत becomes ef/t; the browser displays raw codes."
      },
      {
        "title": "Apply Preeti and proofread",
        "text": "Paste the result into Word or your publishing application and apply Preeti. Check matras, nukta letters and quotes against the Unicode original."
      }
    ],
    "exampleTitle": "Hindi Unicode to Preeti: भारत to ef/t",
    "input": "भारत",
    "output": "ef/t",
    "inputHindi": true,
    "explanation": "The converted codes need the matching Preeti font. Keep Unicode for web and email use. A Word download selects Preeti without installing or embedding a font.",
    "wordTitle": "Avoid quote substitution in publishing applications",
    "wordSteps": [
      "In InDesign, turn off Edit → Preferences → Type → Use Typographer’s Quotes before pasting Preeti codes.",
      "For Word imports into InDesign, also turn off typographer’s quotes in import options and disable automatic hyphenation for legacy text.",
      "Preeti uses straight apostrophes and double quotes for ु and ू. Re-paste freshly converted codes if quote replacement has already changed them."
    ],
    "faqTitle": "Using Hindi Preeti output safely",
    "faqs": [
      {
        "question": "Why does भारत become ef/t?",
        "answer": "ef/t is the verified Preeti output in this mapping. Apply Preeti in the destination application to display the Hindi letters."
      },
      {
        "question": "Why do boxes or wrong matras appear after importing?",
        "answer": "Confirm the matching font is applied and disable smart-quote replacement. Re-paste fresh codes after changing import settings, then compare with the original."
      },
      {
        "question": "Does the download include a Preeti font file?",
        "answer": "No. It does not install or embed legacy fonts. Obtain a licensed font from its publisher, your institution or the original document supplier."
      }
    ],
    "links": [
      {
        "href": "/preeti-to-unicode",
        "text": "Read Preeti Hindi as Unicode"
      },
      {
        "href": "/font-preeti",
        "text": "Read Preeti installation and quote guidance"
      },
      {
        "href": "/fonts",
        "text": "Choose the correct Hindi source font"
      }
    ]
  },
  "typing": {
    "h1": "Remington Hindi Typing to Unicode",
    "intro": "Enter Kruti Dev 010 Remington key codes in the source editor and read Unicode Hindi alongside them. Use the keyboard chart below to check keys and review your text before copying.",
    "howTitle": "Type Hindi using Kruti Dev Remington keys",
    "steps": [
      {
        "title": "Enter Remington key codes",
        "text": "With an English keyboard input layout, type codes such as Hkkjr into the source editor. The chart shows each key’s Unicode reading."
      },
      {
        "title": "Review Unicode as you type",
        "text": "Keep Convert as I type enabled for live output, or select Convert to Unicode. Edit, select and correct text in the source editor."
      },
      {
        "title": "Copy your Hindi text",
        "text": "Copy the Unicode result into your document or message. Download Word creates a new document from the text."
      }
    ],
    "exampleTitle": "Remington practice: fd becomes कि",
    "input": "fd",
    "output": "कि",
    "outputHindi": true,
    "explanation": "Type f before d to produce कि: the Kruti Dev code for the short-i matra precedes the consonant. For reph, deZ produces कर्म. These examples use the existing Kruti Dev 010 mapping.",
    "hindi": "अंग्रेज़ी कीबोर्ड लेआउट में Remington के कोड टाइप करें। उदाहरण: fd से कि और deZ से कर्म। दूसरे बॉक्स में यूनिकोड हिंदी पढ़कर जाँचें।",
    "faqTitle": "Remington Hindi typing questions",
    "faqs": [
      {
        "question": "Is this an InScript or phonetic keyboard?",
        "answer": "No. This tool reads Kruti Dev 010 Remington codes. Use the chart for key positions; it does not transliterate English words into Hindi."
      },
      {
        "question": "Why does output stop updating while I type?",
        "answer": "Check that Convert as I type is enabled. You can also use Convert to Unicode to update the result after editing the source."
      },
      {
        "question": "Can I practice without installing Kruti Dev?",
        "answer": "Yes. The source editor accepts raw key codes and the result shows Unicode Hindi. A matching legacy font is needed only when displaying legacy codes in another application."
      }
    ],
    "links": [
      {
        "href": "/keyboard",
        "text": "Open the full Kruti Dev keyboard guide"
      },
      {
        "href": "/",
        "text": "Convert an existing Kruti Dev passage"
      },
      {
        "href": "/unicode-to-krutidev",
        "text": "Create Kruti Dev codes from Unicode Hindi"
      },
      {
        "href": "/font-krutidev",
        "text": "Read Kruti Dev 010 font guidance"
      }
    ]
  }
};
export const conversionContent: Record<string, ConversionContent> = {
  ...secondaryContent,
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
