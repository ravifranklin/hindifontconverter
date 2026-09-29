import fs from 'node:fs';
import ts from 'typescript';
let source=fs.readFileSync('lib/conversion/engine.ts','utf8');
for(const name of ['krutidev','devlys','chanakya','preeti'])source=source.replace(`import ${name} from './${name}.json';`,`const ${name} = ${fs.readFileSync('lib/conversion/'+name+'.json','utf8').replace(/^\uFEFF/,'')};`);
source=source.replaceAll('export ','');
source+='\nself.onmessage=({data})=>{try{self.postMessage({id:data.id,text:convert(data.text,data.from,data.to)});}catch{self.postMessage({id:data.id,error:true});}};';
fs.writeFileSync('public/converter-worker.js',ts.transpileModule(source,{compilerOptions:{target:ts.ScriptTarget.ES2020,module:ts.ModuleKind.None}}).outputText);
