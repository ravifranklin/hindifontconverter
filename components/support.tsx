'use client';

import {useState,useEffect,useRef} from 'react';
import {decode} from '@/lib/conversion/engine';
export function KeyboardGuide(){return <><p>Remington keys produce legacy codes. The guide shows the Unicode reading of each key. Hold Shift for the upper row; a dotted circle marks a combining sign. Type <code>f</code> before a consonant for ि, and <code>Z</code> after a syllable for reph.</p><div className="keyboard" aria-label="Kruti Dev Remington layout">{['1234567890-=','qwertyuiop[]','asdfghjkl;\'','zxcvbnm,./'].map(row=><div className="key-row" key={row}>{Array.from(row).map(key=><div className="keycap" key={key}><small>{key.toUpperCase()}</small><strong>{displayKey(key)}</strong><span>{displayKey(shiftKey(key))}</span></div>)}</div>)}</div><p><code>Hkkjr</code> → भारत · <code>fd</code> → कि · <code>deZ</code> → कर्म</p><a className="button-link" href="/keyboard.pdf" download>Download keyboard guide (PDF)</a> <a className="button-link" href="/typing">Start live typing</a><p className="fine">Original reference chart. No third-party keyboard artwork or legacy fonts are redistributed. Key readings apply to Kruti Dev 010; font variants can differ.</p></>;}
function shiftKey(key:string){const a="1234567890-=[];',./",b='!@#$%^&*()_+{}:"<>?';const i=a.indexOf(key);return i<0?key.toUpperCase():b[i];}
function displayKey(k:string){const v=decode(k,'krutidev');return /^[\u093a-\u094f\u0900-\u0903]/.test(v)?'◌'+v:v;}
type TurnstileApi = {
  ready(callback: () => void): void;
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
      if(!active || !window.turnstile || !container.current)return;
      window.turnstile.ready(()=>{
        if(!active || !container.current || !window.turnstile)return;
        try{
          widget.current=window.turnstile.render(container.current,{
            sitekey:siteKey,action:'contact',theme:'light',size:'flexible','response-field':false,
            callback:value=>{if(active){setToken(value);setSecurityError(false);}},
            'expired-callback':()=>{if(active){setToken('');setState('Security check expired. Complete a new check before sending.');}},
            'error-callback':()=>{fail();return true;},
          });
        }catch{fail();}
      });
    };
    let script=document.querySelector<HTMLScriptElement>('script[data-akshar-turnstile]');
    if(script?.dataset.failed==='true'){script.remove();script=null;}
    if(window.turnstile){render();}
    else{
      if(!script){
        script=document.createElement('script');
        script.src='https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
        script.async=true;script.dataset.aksharTurnstile='true';
        document.head.appendChild(script);
      }
      script.addEventListener('load',render);
      script.addEventListener('error',fail);
    }
    const markFailed=()=>{if(script)script.dataset.failed='true';};
    script?.addEventListener('error',markFailed);
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
    <form className="contact-form" onSubmit={async e=>{
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
        <button className="primary" disabled={busy||availability!=='ready'||!token}>{busy?'Sending…':'Send message'}</button>
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
export default function Support({slug}:{slug:string}){const font=slug.includes('preeti')?'Preeti':slug.includes('chanakya')?'Chanakya':'Kruti Dev 010';return <section className="support"><a href="/" className="back">← All converters</a><h1>{slug==='keyboard'?'Kruti Dev keyboard guide':slug==='fonts'?'The font library':slug==='privacy'?'Your words stay yours.':slug==='contact'?'Let’s make text work better.':`${font} font guide`}</h1>{slug==='keyboard'?<KeyboardGuide/>:slug==='contact'?<Contact/>:slug==='privacy'?<><p>Text conversion and Word document generation happen in your browser. We do not upload, store or log text from the editors. Reloading the page clears your text. The application does not use analytics or advertising scripts.</p><h2>When you choose to share</h2><p>WhatsApp, Gmail and email actions place the result in a draft through an encoded URL. The destination provider receives the text when you open that link, and its privacy policy applies. Nothing is sent automatically. Copy places your text on your device clipboard.</p><h2>Contact messages</h2><p>If delivery is configured, the contact form sends your name, email and message to the site operator’s delivery service. This application does not save a database copy. The provider may retain delivery records. When delivery is not configured, the form clearly says so and does not accept submissions.</p><h2>Hosting and access</h2><p>The hosting provider may process request metadata, including IP address and browser information, for serving and securing the site. A private hosted preview may require sign-in and use access cookies. Conversion text is not included in those requests. External resource links have their own policies.</p><p>Updated 29 September 2026. Contact the site operator through the <a href="/contact">contact page</a> for privacy questions.</p></>:slug==='fonts'?<><p>Choose the font that matches the original document. Installing a font changes how codes look; conversion changes the codes themselves.</p><div className="font-cards">{[['krutidev','Kruti Dev 010','Hindi · Remington layout'],['preeti','Preeti','Nepali · legacy font'],['chanakya','Chanakya','Hindi · publishing workflows']].map(([id,name,desc])=><a href={'/font-'+id} key={id}><strong>{name}</strong><p>{desc}</p><span>Installation & licensing →</span></a>)}</div><h2>Already using Mangal?</h2><p>Mangal uses Unicode. You can read its text with another Unicode Devanagari font; you only need a converter when moving to or from legacy codes.</p><a className="back" href="https://learn.microsoft.com/en-us/typography/font-list/mangal" target="_blank" rel="noreferrer">Microsoft’s Mangal font information ↗</a></>:<><p>{font} is a legacy font. Its letters are stored as Latin and extended character codes. A recipient needs the matching font installed to see those codes as Devanagari.</p><div className="notice"><strong>Font download availability</strong><p>We have not verified redistribution permission or an authorized public download for {font}. We therefore do not host a font file. Obtain a licensed copy from its publisher, your institution or the supplier of your original document.</p></div><h2>Install a licensed font</h2><ol><li>Check the font’s license allows installation on your device.</li><li>On Windows, open the .ttf or .otf file and choose Install. On macOS, open it in Font Book and choose Install.</li><li>Restart Word, select the converted legacy text and choose {font} in the font menu.</li><li>Keep a Unicode copy for email, search and accessibility.</li></ol><p>No legacy font is embedded in this website or in downloaded Word documents. The raw-code editor remains readable and copyable without one.</p><a className="button-link" href={'/'+(slug.includes('preeti')?'preeti':slug.includes('chanakya')?'chanakya':'krutidev')+'-to-unicode'}>Open converter →</a></>}</section>;}
