import type {Encoding} from './conversion/engine';
export const names:Record<Encoding,string>={krutidev:'Kruti Dev',unicode:'Unicode',mangal:'Mangal',preeti:'Preeti',chanakya:'Chanakya',devlys:'DevLys'};
export const pairs:[Encoding,Encoding][]=[['krutidev','unicode'],['unicode','krutidev'],['krutidev','chanakya'],['krutidev','mangal'],['mangal','krutidev'],['preeti','unicode'],['unicode','preeti'],['chanakya','unicode'],['unicode','chanakya'],['chanakya','krutidev'],['devlys','unicode'],['unicode','devlys'],['devlys','mangal'],['mangal','devlys']];
export const routes=pairs.map(([from,to])=>({from,to,slug:`${from}-to-${to}`,title:`${names[from]} → ${names[to]}`,group:from==='preeti'||to==='preeti'?'Preeti':from==='devlys'||to==='devlys'?'DevLys':from==='chanakya'||to==='chanakya'?'Chanakya':'Kruti Dev'}));
export type Route=typeof routes[number];
