import {isFrontendPreview} from './runtime';
import {cookies} from 'next/headers';
import {createHash,randomBytes} from 'node:crypto';
import {query} from './db';
export const digest=(s:string)=>createHash('sha256').update(s).digest('hex');
export async function currentUser(){if(isFrontendPreview())return null;const token=(await cookies()).get('joya_session')?.value;if(!token)return null;const r=await query('SELECT u.id,u.email,u.role FROM sessions s JOIN users u ON u.id=s.user_id WHERE s.token=$1 AND s.expires_at>now()',[digest(token)]);return r.rows[0]??null;}
export async function createSession(userId:string){const token=randomBytes(32).toString('hex');await query('INSERT INTO sessions(token,user_id,expires_at) VALUES($1,$2,now()+interval \'12 hours\')',[digest(token),userId]);(await cookies()).set('joya_session',token,{httpOnly:true,secure:process.env.COOKIE_SECURE==='true'||process.env.VERCEL==='1',sameSite:'strict',path:'/',maxAge:43200});}
export function sameOrigin(request:Request){const origin=request.headers.get('origin');if(!origin)return false;try{const parsed=new URL(origin);if(process.env.SITE_URL)return parsed.origin===new URL(process.env.SITE_URL).origin;return ['http:','https:'].includes(parsed.protocol)&&parsed.host===request.headers.get('host');}catch{return false;}}
