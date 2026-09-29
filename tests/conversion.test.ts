import {test} from 'node:test';
import assert from 'node:assert/strict';
import {convert,decode,encode,type Encoding} from '../lib/conversion/engine';
import {routes} from '../lib/routes';
import {wordBytes} from '../lib/export';
// Human-readable fixtures assembled from keyboard readings, not generated from maps.
const cases=[
 {u:'भारत',k:'Hkkjr',p:'ef/t',c:'ÖæÚÌ'},
 {u:'भारत की भाषा।',k:'Hkkjr dh Hkk"kkA',p:'ef/t sL efiff.',c:'ÖæÚÌ ·è ÖæáæÐ'},
 {u:'क्ष त्र ज्ञ श्र',k:'{k = K J',p:'If q 1 >',c:'ÿæ ˜æ ™æ Ÿæ'},
 {u:'कि की कु कू कृ के कै को कौ',k:'fd dh dq dw d` ds dS dks dkS',p:'ls sL s\' s" s[ s] s} sf] sf}',c:'ç· ·è ·é ·ê ·ë ·ð ·ñ ·ô ·õ'},
 {u:'कर्म प्रकार अर्क',k:'deZ izdkj vdZ',p:'sd{ k|sf/ cs{',c:'·×ü Âý·æÚ ¥·ü'},
 {u:'अँ अं अः',k:'v¡ va v%',p:'cF c+ cM',c:'¥¡ ¥´ ¥Ñ'},
 {u:'०१२३४५६७८९',k:'åƒ„…†‡ˆ‰Š‹',p:')!@#$%^&*(',c:'®vwxyz{|}~'},
 {u:'भारत\n\nभारत\tभारत',k:'Hkkjr\n\nHkkjr\tHkkjr',p:'ef/t\n\nef/t\tef/t',c:'ÖæÚÌ\n\nÖæÚÌ\tÖæÚÌ'},
 {u:'भारत 🙂 中文',k:'Hkkjr 🙂 中文',p:'ef/t 🙂 中文',c:'ÖæÚÌ 🙂 中文'},
 {u:'',k:'',p:'',c:''},
];
const input=(c:typeof cases[number],font:Encoding)=>font==='krutidev'||font==='devlys'?c.k:font==='preeti'?c.p:font==='chanakya'?c.c:c.u;
for(const r of routes){for(const [i,c] of cases.entries())test(`${r.slug}: fixture ${i}`,()=>{const result=convert(input(c,r.from),r.from,r.to);assert.equal(decode(result,r.to),c.u);});test(`${r.slug}: long paragraphs`,()=>{const c=cases[1];assert.equal(decode(convert((input(c,r.from)+'\n').repeat(5000),r.from,r.to),r.to),(c.u+'\n').repeat(5000));});test(`${r.slug}: explicit literal span`,()=>assert.equal(convert('[[Invoice 123 <a>&]]',r.from,r.to),'Invoice 123 <a>&'));}
test('required smoke',()=>assert.equal(convert('Hkkjr','krutidev','unicode'),'भारत'));
for(const r of routes)test(`${r.slug}: independent exact output`,()=>{const fixture={krutidev:'Hkkjr',devlys:'Hkkjr',preeti:'ef/t',unicode:'भारत',mangal:'भारत',chanakya:'ÖæÚUÌ'};assert.equal(convert(fixture[r.from],r.from,r.to),fixture[r.to]);});
for(const r of routes)test(`${r.slug}: punctuation is preserved in literal spans`,()=>assert.equal(convert('[[(),.-? 123]]',r.from,r.to),'(),.-? 123'));
test('Chanakya glyph carriers and corrected numeral semantics',()=>{assert.equal(decode('ÖæÚUÌ ·¤è ÖæáæÐ','chanakya'),'भारत की भाषा।');assert.equal(decode('®vwxyz{|}~','chanakya'),'०१२३४५६७८९');});
test('Preeti extended probe corrections and unmapped symbols',()=>{assert.equal(decode('° Ì','preeti'),'ड्ढ त्र');assert.equal(decode('« ¤ ¥ © ÷ ‘','preeti'),'« ¤ ¥ © ÷ ‘');});
test('Preeti reverse emits real legacy codes for sha and compound vowel signs',()=>{assert.equal(encode('भाषा को कौ प्रकार','preeti'),'efiff sf] sf} k|sf/');assert.equal(/[\u0900-\u097f]/.test(encode('भाषा को कौ प्रकार','preeti')),false);});
test('longest-match and no replacement cascading',()=>{assert.equal(decode('[+k d+ Q+ M+','krutidev'),'ख़ क़ फ़ ड़');assert.equal(encode('क्क','krutidev'),'ô');});
test('Nepali words and syllables',()=>{assert.equal(decode('g]kfnL efiff','preeti'),'नेपाली भाषा');assert.equal(decode('g]kfn /fd|f] 5.','preeti'),'नेपाल राम्रो छ।');assert.equal(decode('sf7df08"','preeti'),'काठमाण्डू');});
test('nukta normalization',()=>assert.equal(decode(encode('क़ ख़ ग़ ज़ ड़ ढ़ फ़','krutidev'),'krutidev'),'क़ ख़ ग़ ज़ ड़ ढ़ फ़'));
test('DevLys independently observed F differs from Kruti Dev half-tha',()=>{assert.equal(decode('F','devlys'),'थ');assert.equal(decode('F','krutidev'),'थ्');});
test('reph across conjunct, i before conjunct, and at start',()=>{for(const font of ['krutidev','preeti','chanakya','devlys'] as Encoding[])for(const text of ['अर्क','र्क','र्कि','क्ति','स्त्रि','राष्ट्र','र्क्ष'])assert.equal(decode(encode(text,font),font),text,`${font}: ${text}`);});
test('paragraphs and unrelated Unicode preserved',()=>assert.equal(decode('Hkkjr\n\n🙂\t中文','krutidev'),'भारत\n\n🙂\t中文'));
test('Word output is a ZIP with real OOXML, escaped text and tabs',()=>{const data=wordBytes('भारत\n\nनेपाल\t<&>','unicode');assert.equal(new DataView(data.buffer).getUint32(0,true),0x04034b50);const xml=new TextDecoder().decode(data);assert.ok(xml.includes('<w:p>'));assert.ok(xml.includes('भारत'));assert.ok(xml.includes('<w:tab/>'));assert.ok(xml.includes('&lt;&amp;&gt;'));assert.ok(xml.includes('officeDocument'));assert.throws(()=>wordBytes('','unicode'));});

// Independent glyph render check using the user's installed Kruti Dev 010:
// U+201C/U+201D show half-sha; U+2018/U+2019 show half-ssa.
test('Kruti Dev quote-safe output: screenshot regression words',()=>{
 const cases=[['पश्चिम','if“pe'],['एशिया',',f“k;k'],['देशों','ns“kksa'],['प्रतिशत','çfr“kr'],['शुल्क','“kqYd'],['राष्ट्र','jk‘Vª']];
 for(const [unicode,legacy] of cases){assert.equal(encode(unicode,'krutidev'),legacy);assert.equal(decode(legacy,'krutidev'),unicode);}
});
test('Kruti Dev half sha, half ssa and curly glyph aliases decode accurately',()=>{
 assert.equal(decode('“k ”k ‘k ’k Ük','krutidev'),'श श ष ष श्र');
 assert.equal(encode('श ष श् ष्','krutidev'),'“k ‘k “ ‘');
 assert.equal(encode('शक्ति राष्ट्र शुल्क','krutidev').includes("'"),false);
 assert.equal(encode('शक्ति राष्ट्र शुल्क','krutidev').includes('"'),false);
});

test('Kruti Dev colon punctuation uses the colon glyph, not the roo glyph',()=>{
 for(const from of ['unicode','mangal'] as Encoding[]){
  assert.equal(convert('समय: 10:30',from,'krutidev'),'le;% 10%30');
  assert.equal(convert(': रू रूस अः',from,'krutidev'),'% : :l v%');
 }
 // Colon and visarga share a glyph in the font; preserve canonical decoding.
 assert.equal(decode('% :','krutidev'),'ः रू');
 assert.equal(convert('[[:]]','unicode','krutidev'),':');
});

test('Kruti Dev 010 kta uses verified half-ka plus ta rather than the broken ä glyph',()=>{
 for(const from of ['unicode','mangal'] as Encoding[]){
  assert.equal(convert('आयुक्तों',from,'krutidev'),'vk;qDrksa');
  assert.equal(convert('क्त शक्ति भक्त रक्त',from,'krutidev'),'Dr “kfDr HkDr jDr');
 }
 assert.equal(decode('vk;qDrksa','krutidev'),'आयुक्तों');
 assert.equal(convert('Q¤','chanakya','krutidev'),'Dr');
});


test('Preeti Hindi nukta glyph: screenshot regression words',()=>{
 const examples=[['सज़ा',';hÞf'],['बरक़रार','a/sÞ/f/'],['सिर्फ़','l;kmÞ{'],['ख़ुद',"vÞ'b"],['दरवाज़ा','b/jfhÞf'],['फ़िरोज़पुर',"lkmÞ/f]hÞk'/"],['बुज़ुर्ग',"a'hÞ'u{"]];
 for(const [unicode,legacy] of examples){assert.equal(encode(unicode,'preeti'),legacy);assert.equal(decode(legacy,'preeti'),unicode);}
});
test('Preeti nukta normalization, conjuncts and preservation',()=>{
 for(const text of ['क़ ख़ ग़ ज़ ड़ ढ़ फ़','क़ि ख़ु फ़ी ज़ों','क़्त फ़्र ज़्य']){
  const encoded=encode(text,'preeti');assert.equal(/[\u0900-\u097f]/.test(encoded),false);assert.equal(decode(encoded,'preeti'),text.normalize('NFC'));
 }
 assert.equal(decode('Þ','preeti'),'़');
});

test('Preeti standard kra glyph: क्रमश screenshot regression',()=>{
 for(const [unicode,legacy] of [['क्रमश','s|dz'],['क्रमशः','s|dzM'],['क्रम','s|d'],['क्रिया','ls|of'],['प्रक्रिया','k|ls|of']]){
  assert.equal(encode(unicode,'preeti'),legacy);assert.equal(decode(legacy,'preeti'),unicode);
 }
 assert.equal(decode('qm','preeti'),'क्र'); // Older alternate glyph remains readable.
});

test('Preeti visible word-final halant: वाक् screenshot regression',()=>{
 for(const [unicode,legacy] of [['वाक्','jfs\\'],['वाक् ','jfs\\ '],['वाक्।','jfs\\.'],['वाक्\nवाक्','jfs\\\njfs\\'],['क् त् म् र्','s\\ t\\ d\\ /\\'],['क़्','sÞ\\']]){
  assert.equal(encode(unicode,'preeti'),legacy);assert.equal(decode(legacy,'preeti'),unicode);
 }
 assert.equal(encode('वाक्य शक्ति','preeti'),'jfSo zlQm');
});
