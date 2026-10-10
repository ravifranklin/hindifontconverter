'use client';

import {useState,useEffect,useRef} from 'react';
import {decode} from '@/lib/conversion/engine';
export function KeyboardGuide(){return <><p>Remington keys produce legacy codes. The guide shows the Unicode reading of each key. Hold Shift for the upper row; a dotted circle marks a combining sign. Type <code>f</code> before a consonant for ि, and <code>Z</code> after a syllable for reph.</p><div className="keyboard" aria-label="Kruti Dev Remington layout">{['1234567890-=','qwertyuiop[]','asdfghjkl;\'','zxcvbnm,./'].map(row=><div className="key-row" key={row}>{Array.from(row).map(key=><div className="keycap" key={key}><small>{key.toUpperCase()}</small><strong>{displayKey(key)}</strong><span>{displayKey(shiftKey(key))}</span></div>)}</div>)}</div><p><code>Hkkjr</code> → भारत · <code>fd</code> → कि · <code>deZ</code> → कर्म</p><a className="button-link" href="/keyboard.pdf" download>Download keyboard guide (PDF)</a> <a className="button-link" href="/typing">Start live typing</a><p className="fine">Original reference chart. No third-party keyboard artwork or legacy fonts are redistributed. Key readings apply to Kruti Dev 010; font variants can differ.</p></>;}
function shiftKey(key:string){const a="1234567890-=[];',./",b='!@#$%^&*()_+{}:"<>?';const i=a.indexOf(key);return i<0?key.toUpperCase():b[i];}
function displayKey(k:string){const v=decode(k,'krutidev');return /^[\u093a-\u094f\u0900-\u0903]/.test(v)?'◌'+v:v;}
type TurnstileApi = {
  render(container: HTMLElement, options: {
    sitekey: string; action: string; theme: string; size: string; 'response-field': boolean;
    callback(token: string): void; 'expired-callback'(): void; 'error-callback'(): boolean;
  }): string;
  reset(id: string): void;
  remove(id: string): void;
};
declare global { interface Window { turnstile?: TurnstileApi } }

function Contact() {
  const [state,setState]=useState('');
  const [busy,setBusy]=useState(false);
  const [formValid,setFormValid]=useState(false);
  const [availability,setAvailability]=useState<'loading'|'ready'|'unavailable'|'failed'>('loading');
  const [siteKey,setSiteKey]=useState('');
  const [token,setToken]=useState('');
  const [securityError,setSecurityError]=useState(false);
  const [securityAttempt,setSecurityAttempt]=useState(0);
  const container=useRef<HTMLDivElement>(null);
  const widget=useRef<string | null>(null);
  const sending=useRef(false);

  useEffect(()=>{
    let active=true;
    fetch('/api/contact',{cache:'no-store'}).then(r=>{
      if(!r.ok)throw new Error('Configuration check failed');
      return r.json();
    }).then(raw=>{
      if(!active)return;
      const x=(raw && typeof raw==='object' ? raw : {}) as {configured?:unknown;siteKey?:unknown};
      if(x.configured===true && typeof x.siteKey==='string' && x.siteKey){
        setSiteKey(x.siteKey);setAvailability('ready');
      }else{setAvailability('unavailable');}
    }).catch(()=>{if(active)setAvailability('failed');});
    return()=>{active=false;};
  },[]);

  useEffect(()=>{
    if(availability!=='ready'||!siteKey)return;
    let active=true;
    const fail=()=>{
      if(active){setToken('');setSecurityError(true);}
    };
    const render=()=>{
      if(!active || widget.current!==null)return;
      if(!window.turnstile || !container.current){fail();return;}
      try{
        widget.current=window.turnstile.render(container.current,{
          sitekey:siteKey,action:'contact',theme:'light',size:'flexible','response-field':false,
          callback:value=>{if(active){setToken(value);setSecurityError(false);}},
          'expired-callback':()=>{if(active){setToken('');setState('Security check expired. Complete a new check before sending.');}},
          'error-callback':()=>{fail();return true;},
        });
      }catch{fail();}
    };
    let script=document.querySelector<HTMLScriptElement>('script[data-akshar-turnstile]');
    if(script?.dataset.failed==='true'){script.remove();script=null;}
    if(window.turnstile){render();}
    else{
      if(!script){
        script=document.createElement('script');
        script.src='https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
        script.async=true;script.dataset.aksharTurnstile='true';
      }
      script.addEventListener('load',render);
      script.addEventListener('error',fail);
    }
    const markFailed=()=>{if(script)script.dataset.failed='true';};
    script?.addEventListener('error',markFailed);
    if(script&&!script.isConnected)document.head.appendChild(script);
    return()=>{
      active=false;
      script?.removeEventListener('load',render);
      script?.removeEventListener('error',fail);
      script?.removeEventListener('error',markFailed);
      if(widget.current!==null){
        try{window.turnstile?.remove(widget.current);}catch{/* Already removed. */}
        widget.current=null;
      }
    };
  },[siteKey,availability,securityAttempt]);

  function resetSecurity(){
    setToken('');
    if(widget.current!==null){
      try{window.turnstile?.reset(widget.current);}catch{setSecurityError(true);}
    }
  }

  return <><p>Report a conversion issue or ask about the site. For a mapping issue, include a short, non-sensitive example, its original font and the expected text.</p>
    {availability!=='ready'&&<p className="notice">{availability==='loading'?'Checking contact email and security availability…':availability==='failed'?'Unable to check contact availability. Please reload and try again.':'Contact email or spam protection is not configured. Your message will not be sent or saved. You can still prepare it below and copy it for the site operator.'}</p>}
    <form className="contact-form" onInput={e=>setFormValid(e.currentTarget.checkValidity())} onSubmit={async e=>{
      e.preventDefault();
      if(sending.current||availability!=='ready'||!token)return;
      sending.current=true;setBusy(true);
      const body=Object.fromEntries(new FormData(e.currentTarget));
      try{
        const r=await fetch('/api/contact',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...body,'cf-turnstile-response':token})});
        const data=await r.json() as {message?:unknown;configured?:unknown};
        if(r.status===503&&data.configured===false)setAvailability('unavailable');
        setState(r.ok?'Your message was accepted for email delivery. Thank you.':typeof data.message==='string'?data.message:'Email delivery could not be confirmed. Please try again later.');
      }catch{setState('Delivery failed. Your message remains here; try again later.');}
      finally{sending.current=false;setBusy(false);resetSecurity();}
    }}>
      <label htmlFor="name">Your name</label><input id="name" name="name" required minLength={2} maxLength={100} autoComplete="name"/>
      <label htmlFor="email">Email address</label><input id="email" name="email" type="email" required maxLength={254} autoComplete="email"/>
      <label htmlFor="message">Message</label><textarea id="message" name="message" required minLength={10} maxLength={5000}/>
      <div className="honeypot" aria-hidden="true"><label>Leave this field empty<input name="website" tabIndex={-1} autoComplete="off"/></label></div>
      <label htmlFor="answer">Spam check: what is 3 + 4?</label><input id="answer" name="answer" required inputMode="numeric" pattern="7"/>
      <div ref={container} aria-label="Contact security check"/>
      {availability==='ready'&&!token&&!securityError&&<p className="fine">Complete the security check to enable sending.</p>}
      {securityError&&<p className="notice">The security check could not load. <button type="button" className="secondary" disabled={busy} onClick={()=>{setSecurityError(false);setToken('');setSecurityAttempt(value=>value+1);}}>Retry security check</button></p>}
      <div className="form-actions">
        <button className="primary" disabled={busy||availability!=='ready'||!token||!formValid}>{busy?'Sending…':'Send message'}</button>
        <button type="button" className="secondary" onClick={async()=>{
          const text=(document.getElementById('message') as HTMLTextAreaElement).value;
          try{await navigator.clipboard.writeText(text);setState('Message copied. Nothing was sent.');}
          catch{setState('Select your message and press Ctrl+C to copy.');}
        }}>Copy message</button>
      </div>
      <p role="status">{state}</p>
    </form>
    <p className="fine">Submitting sends your name, email and message through Resend to the site operator. Cloudflare Turnstile checks for spam. Never include private documents, passwords or identity numbers.</p>
  </>;
}
export default function Support({slug}:{slug:string}){const font=slug.includes('preeti')?'Preeti':slug.includes('chanakya')?'Chanakya':'Kruti Dev 010';return <section className="support"><a href="/" className="back">← All converters</a><h1>{slug==='keyboard'?'Kruti Dev 010 Remington Hindi Keyboard Guide':slug==='fonts'?'Hindi Font Installation and Conversion Guides':slug==='privacy'?'Privacy Policy':slug==='contact'?'Let’s make text work better.':fontGuides[slug]?.title ?? `${font} font guide`}</h1>{slug==='keyboard'?<><KeyboardGuide/><KeyboardHelp/></>:slug==='contact'?<Contact/>:slug==='privacy'?<><p>Text conversion and Word document generation happen in your browser. We do not upload, store or log text from the editors. Reloading the page clears your text.</p><h2>Google Analytics 4</h2><p>This website loads Google Analytics 4 to measure visits, including page views, page URLs and page titles. These analytics requests go to Google separately from the browser-based converter. Our Analytics code does not attach converter text or Contact Form message contents to those requests.</p><h2>When you choose to share</h2><p>WhatsApp, Gmail and email actions place the result in a draft through an encoded URL. The destination provider receives the text when you open that link, and its privacy policy applies. Nothing is sent automatically. Copy places your text on your device clipboard.</p><h2>Contact messages</h2><p>If delivery is configured, the contact form sends your name, email and message to the site operator’s delivery service. This application does not save a database copy. The provider may retain delivery records. When delivery is not configured, the form clearly says so and does not accept submissions.</p><h2>Hosting and access</h2><p>The hosting provider may process request metadata, including IP address and browser information, for serving and securing the site. A private hosted preview may require sign-in and use access cookies. Conversion text is not included in those requests. External resource links have their own policies.</p><p>Updated 11 October 2026. Contact the site operator through the <a href="/contact">contact page</a> for privacy questions.</p></>:slug==='fonts'?<FontLibrary/>:<FontInstallation slug={slug}/>}</section>;}

function FontLibrary(){
 return <>
  <p>Check the font name of a short selection in the original Word document. Kruti Dev 010, DevLys 010, Preeti and Chanakya use legacy codes; Mangal displays Unicode Hindi. Choose the converter that matches the source, rather than guessing from similar-looking codes.</p>
  <h2>Identify your source font</h2>
  <p>If copied text looks like Hkkjr, check the original font before converting: both Kruti Dev 010 and DevLys 010 can store भारत this way, but their mappings are not identical. Readable Hindi from a Mangal document is Unicode and can be used directly as Unicode input.</p>
  <div className="font-cards">{[['krutidev','Kruti Dev 010','Hindi · Remington layout'],['preeti','Preeti','Legacy font · Hindi text'],['chanakya','Chanakya','Hindi · publishing workflows']].map(([id,name,desc])=><a href={'/font-'+id} key={id}><strong>{name}</strong><p>{desc}</p><span>Installation & licensing →</span></a>)}<a href="/devlys-to-unicode"><strong>DevLys 010</strong><p>Hindi · legacy font</p><span>Convert DevLys 010 to Unicode →</span></a></div>
  <h2>Choose the matching Hindi converter</h2>
  <p><strong>Kruti Dev 010:</strong> use <a className="back" href="/">Kruti Dev to Unicode</a> for readable Hindi, or <a className="back" href="/unicode-to-krutidev">Unicode to Kruti Dev 010</a> for a legacy document.</p>
  <p><strong>DevLys 010:</strong> use <a className="back" href="/devlys-to-unicode">DevLys to Unicode</a> or <a className="back" href="/unicode-to-devlys">Unicode to DevLys</a>. The code F becomes थ with DevLys but थ् with Kruti Dev, so selecting the right font matters. Do not assume every DevLys variant uses the same mapping.</p>
  <p><strong>Preeti:</strong> convert Hindi text with <a className="back" href="/preeti-to-unicode">Preeti to Unicode</a> or <a className="back" href="/unicode-to-preeti">Unicode to Preeti</a>. Check matras, nukta letters and quote characters against the original.</p>
  <p><strong>Chanakya:</strong> use <a className="back" href="/chanakya-to-unicode">Chanakya to Unicode</a> or <a className="back" href="/unicode-to-chanakya">Unicode to Chanakya</a> for the supported legacy mapping. Review text copied from publishing files or PDFs.</p>
  <h2>Already using Mangal?</h2>
  <p>Mangal uses Unicode. To use that text in Kruti Dev, open <a className="back" href="/mangal-to-krutidev">Mangal to Kruti Dev</a>. To move Kruti Dev text into a Mangal document, use <a className="back" href="/krutidev-to-mangal">Kruti Dev to Mangal</a>. Choosing another Unicode font changes appearance rather than encoding.</p>
  <a className="back" href="https://learn.microsoft.com/en-us/typography/font-list/mangal" target="_blank" rel="noreferrer">Microsoft’s Mangal font information ↗</a>
  <h2>Use licensed fonts</h2>
  <p>We do not host legacy font downloads or embed legacy fonts in Word files. Obtain a licensed copy from the publisher, your institution or the supplier of the original document. The existing Kruti Dev, Preeti and Chanakya guides explain installation and licensing.</p>
 </>;
}

const fontGuides: Record<string, {title:string; name:string; intro:string; input:string; output:string; forward:string; reverse:string; check:string; faq:[string,string][]}> = {
 'font-krutidev': {title:'Kruti Dev 010 Hindi Font Installation Guide',name:'Kruti Dev 010',intro:'Kruti Dev 010 displays legacy Hindi codes using a Remington layout. Install a licensed copy when a document requires this font; use Unicode conversion for web text and messages.',input:'Hkkjr',output:'भारत',forward:'/',reverse:'/unicode-to-krutidev',check:'Check that Word selects Kruti Dev 010 for the pasted codes. Selecting Mangal for Hkkjr does not convert it to Unicode Hindi.',faq:[['Do I need Kruti Dev installed to use the converter?','No. The browser converts raw codes without the legacy font. Install a licensed copy to display the converted legacy text in Word.'],['Can I use any Kruti Dev variant?','This converter targets Kruti Dev 010. Check the source font and compare a short passage before using another variant.'],['Why does the recipient see Hkkjr instead of Hindi?','The recipient needs the matching font selected for legacy codes. Send Unicode Hindi when font availability is uncertain.']]},
 'font-chanakya': {title:'Chanakya Hindi Font Installation Guide',name:'Chanakya',intro:'Chanakya uses legacy codes for Hindi publishing text. A licensed matching font displays those codes; conversion is needed when moving the text to Unicode or Kruti Dev.',input:'ÖæÚUÌ',output:'भारत',forward:'/chanakya-to-unicode',reverse:'/unicode-to-chanakya',check:'Retain the extended source characters when copying Chanakya text. Compare extracted PDF text with the original before conversion; missing glyphs cannot be restored by installing a font.',faq:[['Will installing Chanakya convert text to Unicode?','No. Installing a font changes glyph display. Use Chanakya to Unicode to change the stored legacy codes into Hindi letters.'],['Can I move Chanakya text into Kruti Dev?','Use the Chanakya to Kruti Dev converter, then select a licensed Kruti Dev 010 font in the destination document.'],['Why do copied publishing passages contain wrong characters?','Check the original font and supported mapping. PDF extraction may omit or reorder characters; compare a short passage against the source.']]},
 'font-preeti': {title:'Preeti Font Installation Guide for Hindi Text',name:'Preeti',intro:'Use a licensed Preeti font to display Hindi text stored in the supported legacy mapping. Keep a Unicode version for sharing and review matras, nukta letters and punctuation when converting.',input:'ef/t',output:'भारत',forward:'/preeti-to-unicode',reverse:'/unicode-to-preeti',check:'Preeti uses straight apostrophes and double quotes for ु and ू. In InDesign, disable Use Typographer’s Quotes before pasting and in Word import options; disable automatic hyphenation for legacy text. Re-paste fresh converted codes if quote replacement changed them.',faq:[['Why does copied Preeti Hindi look like ef/t?','These are legacy codes. In the supported mapping ef/t becomes भारत. Apply Preeti to display the codes, or convert them to Unicode.'],['What if imported text shows boxes or wrong matras?','Confirm Preeti is installed and selected, and disable quote substitution before importing. Re-paste fresh codes and compare the result with the original Hindi.'],['Does this site provide a Preeti font download?','No. Redistribution permission has not been verified. Obtain a licensed copy from the publisher, your institution or the original document supplier.']]},
};
function FontInstallation({slug}:{slug:string}){
 const guide=fontGuides[slug];if(!guide)return null;
 return <><p>{guide.intro}</p><div className="notice"><strong>Font download availability</strong><p>We have not verified redistribution permission or an authorized public download for {guide.name}. We therefore do not host a font file. Obtain a licensed copy from its publisher, your institution or the supplier of your original document.</p></div><h2>Install a licensed {guide.name} font</h2><ol><li>Check the font’s license allows installation on your device.</li><li>On Windows, open the .ttf or .otf file and choose Install. On macOS, open it in Font Book and choose Install.</li><li>Restart Word, select the converted legacy text and choose {guide.name} in the font menu.</li><li>Keep a Unicode copy for email, search and accessibility.</li></ol><h2>Check {guide.name} display and conversion</h2><p><code>{guide.input}</code> → <span lang="hi">{guide.output}</span> is verified with this site’s converter. The left side is legacy code; the right side is Unicode Hindi.</p><p>{guide.check}</p><p>No legacy font is embedded in this website or in downloaded Word documents. The raw-code editor remains readable and copyable without one.</p><p><a className="back" href={guide.forward}>Convert {guide.name} to Unicode</a> · <a className="back" href={guide.reverse}>Convert Unicode to {guide.name}</a> · <a className="back" href="/fonts">Compare Hindi source fonts</a>{slug==='font-chanakya'&&<> · <a className="back" href="/chanakya-to-krutidev">Convert Chanakya to Kruti Dev</a></>}{slug==='font-krutidev'&&<> · <a className="back" href="/keyboard">Check Remington keys</a></>}</p><h2>{guide.name} installation questions</h2>{guide.faq.map(([question,answer])=><details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</>;
}
function KeyboardHelp(){return <><h2>Practice matras and reph with Remington codes</h2><ol><li>Use an English keyboard input layout and enter the chart’s codes in the live typing editor.</li><li>Type <code>fd</code> for <span lang="hi">कि</span>: the short-i code comes before the consonant. Type <code>deZ</code> for <span lang="hi">कर्म</span>: the reph code comes after the syllable.</li><li>Read the Unicode result and compare it with the intended Hindi before copying.</li></ol><p lang="hi">छोटी इ की मात्रा के लिए f पहले टाइप करें। रेफ के लिए Z अक्षर समूह के बाद टाइप करें। उदाहरण: fd से कि, deZ से कर्म।</p><h2>Kruti Dev keyboard troubleshooting</h2><details><summary>Why is there a dotted circle on some keys?</summary><p>It marks a combining sign so you can see it in isolation. The circle is part of the chart’s display, not a character to type into your text.</p></details><details><summary>Is this the same as an InScript or phonetic layout?</summary><p>No. The chart reads Kruti Dev 010 Remington codes. Use the live typing page to practice these sequences; it does not transliterate English words.</p></details><details><summary>Why do key readings differ from my document?</summary><p>Check that the source uses Kruti Dev 010 and the intended input layout. Other font variants or keyboard layouts may differ.</p></details><p><a className="back" href="/typing">Practice Remington Hindi typing</a> · <a className="back" href="/font-krutidev">Install a licensed Kruti Dev 010 font</a> · <a className="back" href="/">Convert existing Kruti Dev text to Unicode</a></p></>;}
