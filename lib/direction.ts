import type {Route} from './routes';
import {routes} from './routes';
export type Draft = {input:string;output:string;converted:boolean};
export function reverseRoute(route:Route):Route {
 const reverse=routes.find(r=>r.from===route.to&&r.to===route.from);
 if(!reverse)throw new Error('No reverse converter is available.');
 return reverse;
}
export function switchDraft(current:Draft,previous?:Draft){
 return {input:current.converted?current.output:previous?.input||'',output:'',converted:false,convertNow:current.converted};
}
