// Delivery secrets are server-only. Configure an HTTPS webhook under your control.
const json=(message:string,status:number)=>Response.json({message},{status});
export async function GET(){return Response.json({configured:!!process.env.CONTACT_WEBHOOK_URL && !!process.env.CONTACT_WEBHOOK_TOKEN});}
export async function POST(request:Request){
 const origin=request.headers.get('origin');if(!origin||origin!==new URL(request.url).origin)return json('Request origin is not allowed.',403);
 if(!process.env.CONTACT_WEBHOOK_URL||!process.env.CONTACT_WEBHOOK_TOKEN)return json('Contact delivery is not configured. Nothing was sent.',503);
 if(!process.env.CONTACT_WEBHOOK_URL.startsWith('https://'))return json('Contact delivery is unavailable. Nothing was sent.',503);
 if(Number(request.headers.get('content-length')||0)>16000)return json('Message is too large.',413);
 try{const raw=await request.text();if(raw.length>12000)return json('Message is too large.',413);const b=JSON.parse(raw);
 if(typeof b.name!=='string'||typeof b.email!=='string'||typeof b.message!=='string'||b.name.trim().length<2||b.name.length>100||!/^\S+@\S+\.\S+$/.test(b.email)||b.email.length>254||b.message.trim().length<10||b.message.length>5000)return json('Please check your name, email and message.',400);
 if(b.website||b.answer!=='7'||typeof b.started!=='number'||Date.now()-b.started<3000||Date.now()-b.started>86400000)return json('Spam check failed. Please wait a moment and try again.',400);
 const response=await fetch(process.env.CONTACT_WEBHOOK_URL,{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${process.env.CONTACT_WEBHOOK_TOKEN}`},body:JSON.stringify({name:b.name.trim(),email:b.email.trim(),message:b.message.trim()}),signal:AbortSignal.timeout(10000)});
 if(!response.ok)return json('Delivery failed. Nothing was confirmed sent; please try again later.',502);
 return json('Your message was accepted by the delivery service.',200);
 }catch{return json('Unable to deliver your message. Please try again later.',502);}
}
