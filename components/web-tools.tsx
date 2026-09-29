'use client';
import {useEffect} from 'react';
import {convert,type Encoding} from '@/lib/conversion/engine';
import {routes} from '@/lib/routes';
type Context={registerTool:(tool:unknown)=>void;unregisterTool:(name:string)=>void};
export default function WebTools(){useEffect(()=>{const ctx=(navigator as Navigator&{modelContext?:Context}).modelContext;if(!ctx)return;ctx.registerTool({name:'convert_devanagari_text',description:'Convert text locally between a supported legacy font and Unicode. Returns text only; does not send or share it.',inputSchema:{type:'object',properties:{text:{type:'string'},route:{type:'string',enum:routes.map(r=>r.slug)}},required:['text','route']},execute:async(args:{text:string;route:string})=>{const r=routes.find(r=>r.slug===args.route);if(!r||typeof args.text!=='string')throw Error('Invalid text or route');return {content:[{type:'text',text:convert(args.text,r.from as Encoding,r.to as Encoding)}]};}});return()=>ctx.unregisterTool('convert_devanagari_text');},[]);return null;}
