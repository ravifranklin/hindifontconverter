import Site from '@/components/site';
import {routes} from '@/lib/routes';
import {pageMetadata} from '@/lib/seo';
import {notFound} from 'next/navigation';
const extra=['typing','keyboard','fonts','font-krutidev','font-preeti','font-chanakya','contact','privacy'];
export async function generateMetadata({params}:{params:Promise<{slug:string}>}){const {slug}=await params;return pageMetadata(slug);}
export default async function Page({params}:{params:Promise<{slug:string}>}){const {slug}=await params;if(!routes.some(r=>r.slug===slug)&&!extra.includes(slug))notFound();return <Site slug={slug}/>;}
