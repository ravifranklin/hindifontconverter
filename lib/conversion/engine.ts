import krutidev from './krutidev.json';
import chanakya from './chanakya.json';
import devlys from './devlys.json';
import preeti from './preeti.json';
export type Encoding = 'krutidev' | 'chanakya' | 'devlys' | 'preeti' | 'unicode' | 'mangal';
const I='\uE000', R='\uE001', consonant='[क-हक़-य़]़?';
const cluster=`${consonant}(?:्[‍‌]?${consonant})*`, signs='[ािीुूृॄॅेैॉोौंँः]*';
const maps:Record<string,Record<string,string>>={krutidev,chanakya,devlys,preeti};
type Node = { value?:string; children:Map<string,Node> };
function trie(map:Record<string,string>):Node {const root:Node={children:new Map()};for(const [key,value] of Object.entries(map)){let n=root;for(const ch of key){if(!n.children.has(ch))n.children.set(ch,{children:new Map()});n=n.children.get(ch)!;}n.value=value;}return root;}
function replace(text:string,root:Node):string {const chars=Array.from(text),out:string[]=[];for(let i=0;i<chars.length;){let n=root,j=i,end=i,value:string|undefined;while(j<chars.length && n.children.has(chars[j])){n=n.children.get(chars[j++])!;if(n.value!==undefined){value=n.value;end=j;}}if(value!==undefined){out.push(value);i=end;}else out.push(chars[i++]);}return out.join('');}
const forward=Object.fromEntries(Object.entries(maps).map(([name,map])=>[name,trie(map)]));
const reverse=Object.fromEntries(Object.entries(maps).map(([name,map])=>{const rev:Record<string,string>={};for(const [k,v] of Object.entries(map))if(v && !v.includes(I) && !v.includes(R) && (!rev[v] || k.length<rev[v].length))rev[v]=k;
if(name==='krutidev'||name==='devlys')Object.assign(rev,{'भ':'Hk','क':'d','श':"'k",'ष':'"k','ई':'bZ','ि':'f','र्':'Z','़':'+','फ़्':'¶+','क़':'d+','फ़':'Q+','।':'A','-':'&'});
// Verified against Kruti Dev 010 glyphs: avoid straight quotes that editors smarten.
if(name==='krutidev')Object.assign(rev,{'श':'“k','श्':'“','ष':'‘k','ष्':'‘',':':'%','क्त':'Dr','क्क':'Dd','ड्ड':'M~M','ब्र':'cz'});
if(name==='devlys')Object.assign(rev,{'श':'’k','श्':'’','ब्र':'cz'});
if(name==='chanakya'){Object.assign(rev,{'ि':'ç','र्':'ü','भ':'Ö','भ्य':'Ö÷Ø','़':'¸','र':'ÚU','क':'·¤','ट':'ÅU','फ':'È¤','के':'·Ô¤','कै':'·ñ¤','रु':'L¤','रू':'M¤','क्र':'R¤','क्त':'Q¤','क्क':'P¤','प्र':'Âý','त्र':'˜æ','ं':'´','े':'ð','श':'àæ','श्':'à','क्':'·¤÷','ब्':'†','त्त':'ˆÌ','त्त्':'ˆˆ','ब्र':'Õý','श्र':'Ÿæ','च्':'‘','च्च्':'‘‘','च्च':'‘¿','क़':'·¤¸','ख़':'¹¸','ग़':'»¸','ज़':'Á¸','ड़':'Ç¸','ढ़':'É¸','फ़':'È¤¸','ज़्':'Á¸÷'});Array.from('®vwxyz{|}~').forEach((v,i)=>rev[String.fromCharCode(0x966+i)]=v);}
if(name==='preeti')Object.assign(rev,{'ि':'l','र्':'{','फ':'km','झ':'´','ह्म':'x\\d','ह्न':'x\\g','ऊ':'pm','क्र':'s|','क्त':'St','आ':'cf','ओ':'cf]','औ':'cf}','ऐ':'P]','ई':'O{','क्ष':'If','क्ष्':'I','ण':'0f','ष':'if','ो':'f]','ौ':'f}','प्र':'k|','ब्र':'a|','-':'–'});return [name,trie(rev)];}));
export const isUnicode=(e:Encoding)=>e==='unicode'||e==='mangal';
export function decode(text:string,font:Encoding):string {if(isUnicode(font))return text.normalize('NFC');if(font==='preeti')text=text.replace(/[‘’]/g,"'").replace(/[“”]/g,'"');let result=replace(text,forward[font]);result=result.replace(new RegExp(`${I}(ं?)(${cluster})`,'gu'),'$2ि$1');result=result.replace(new RegExp(`(${cluster}${signs})${R}`,'gu'),'र्$1');result=result.replaceAll(I,'ि').replaceAll(R,'र्');if(font==='preeti')result=result.replace(/्ा/g,'').replace(/अाे/g,'ओ').replace(/अाै/g,'औ').replace(/अा/g,'आ').replace(/एे/g,'ऐ');return result.replace(/ाे/g,'ो').replace(/ाै/g,'ौ').normalize('NFC');}
export function encode(text:string,font:Encoding):string {if(isUnicode(font))return text.normalize('NFC');let result=text.normalize('NFC');
// A word-final virama needs a full letter and visible halant in Preeti.
if(font==='preeti')result=result.replace(/([क-हक़-य़]़?)्(?=$|[^\p{L}\p{M}‍‌])/gu,'$1\uE002');
result=result.replace(new RegExp(`र्(${cluster}${signs})`,'gu'),`$1${R}`);result=result.replace(new RegExp(`(${cluster})ि`,'gu'),`${I}$1`);result=replace(result,reverse[font]);if(font==='preeti')result=result.replaceAll('\uE002','\\');return result.replaceAll(I,font==='preeti'?'l':font==='chanakya'?'ç':'f').replaceAll(R,font==='preeti'?'{':font==='chanakya'?'ü':'Z');}
export function convert(text:string,from:Encoding,to:Encoding):string {return text.split(/(\[\[[\s\S]*?\]\])/g).map(part=>part.startsWith('[[')&&part.endsWith(']]')?part.slice(2,-2):encode(decode(part,from),to)).join('');}
