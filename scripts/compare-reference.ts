import fs from 'node:fs';import {convert,decode,type Encoding} from '../lib/conversion/engine';
const data=JSON.parse(fs.readFileSync('docs/reference-corpus.json','utf8')) as {path:string;input:string;output:string}[];
function route(path:string):[Encoding,Encoding]{const p=path.replace('-converter.php','').replaceAll('kruti-dev','krutidev');if(!p)return ['krutidev','unicode'];return p.split('-to-') as [Encoding,Encoding];}
const comparison=data.map(row=>{const [from,to]=route(row.path),actual=convert(row.input,from,to);return {path:row.path,from,to,exact:actual===row.output,semantic:decode(actual,to)===decode(row.output,to).normalize('NFC'),differences:actual.split('\n').flatMap((line,i)=>line===row.output.split('\n')[i]?[]:[{line:i+1,ours:line,reference:row.output.split('\n')[i]}])};});
fs.writeFileSync('docs/reference-comparison.json',JSON.stringify(comparison,null,2));console.log(JSON.stringify(comparison,null,2));
