import {convert} from './engine';
self.onmessage=({data})=>{try{self.postMessage({id:data.id,text:convert(data.text,data.from,data.to)});}catch{self.postMessage({id:data.id,error:true});}};
