import { PGlite } from '@electric-sql/pglite';
import { Pool } from 'pg';
import { mkdir } from 'node:fs/promises';
import seed from '@/content/seed.json';
import type {Data} from './types';
import {isFrontendPreview} from './runtime';
type Engine={query:(sql:string,params?:unknown[])=>Promise<{rows:any[]}>};
const g=globalThis as typeof globalThis & {joyaDB?:Promise<Engine>};
async function initialise():Promise<Engine>{
 if(isFrontendPreview())throw new Error('Persistent data is unavailable in frontend preview mode.');
 let db:Engine;
 if(process.env.DATABASE_URL){db=new Pool({connectionString:process.env.DATABASE_URL,max:5,ssl:process.env.PGSSL==='require'?{rejectUnauthorized:true}:undefined});}
 else {if(process.env.NODE_ENV==='production'&&process.env.REQUIRE_EXTERNAL_DATABASE==='true')throw new Error('DATABASE_URL is required');await mkdir('.data/postgres',{recursive:true});db=new PGlite('.data/postgres');}
 await db.query(`CREATE TABLE IF NOT EXISTS records (entity text NOT NULL,id text NOT NULL,data jsonb NOT NULL,updated_at timestamptz NOT NULL DEFAULT now(),PRIMARY KEY(entity,id));`);
 await db.query(`CREATE TABLE IF NOT EXISTS users (id text PRIMARY KEY,email text UNIQUE NOT NULL,password text NOT NULL,role text NOT NULL DEFAULT 'editor',created_at timestamptz DEFAULT now());`);
 await db.query(`CREATE TABLE IF NOT EXISTS sessions (token text PRIMARY KEY,user_id text NOT NULL REFERENCES users(id) ON DELETE CASCADE,expires_at timestamptz NOT NULL);`);
 await db.query(`CREATE TABLE IF NOT EXISTS rate_limits (key text PRIMARY KEY,count integer NOT NULL,expires_at timestamptz NOT NULL);`);
 const seeded=await db.query("SELECT id FROM records WHERE entity='meta' AND id='initial-seed'");
 if(!seeded.rows.length){
 for(const entity of ['services','projects','discounts','bundles','pages'] as const){for(const row of seed[entity]) await db.query('INSERT INTO records(entity,id,data) VALUES($1,$2,$3::jsonb) ON CONFLICT DO NOTHING',[entity,row.id,JSON.stringify(row)]);}
 await db.query('INSERT INTO records(entity,id,data) VALUES($1,$2,$3::jsonb) ON CONFLICT DO NOTHING',['settings','general',JSON.stringify(seed.settings)]);
 await db.query("INSERT INTO records(entity,id,data) VALUES('meta','initial-seed','{}') ON CONFLICT DO NOTHING");
 }
 return db;
}
export async function db(){return g.joyaDB??=(initialise().catch(e=>{g.joyaDB=undefined;throw e;}));}
export async function query(sql:string,params:unknown[]=[]){return (await db()).query(sql,params);}
export async function list(entity:string){const r=await query('SELECT data FROM records WHERE entity=$1 ORDER BY COALESCE((data->>\'order\')::integer,0),updated_at',[entity]);return r.rows.map(r=>r.data);}
export async function put(entity:string,data:any){await query('INSERT INTO records(entity,id,data) VALUES($1,$2,$3::jsonb) ON CONFLICT(entity,id) DO UPDATE SET data=excluded.data,updated_at=now()',[entity,data.id,JSON.stringify(data)]);return data;}
export async function getData():Promise<Data>{if(isFrontendPreview())return structuredClone(seed) as Data;const [services,projects,discounts,bundles,pages,settings]=await Promise.all(['services','projects','discounts','bundles','pages','settings'].map(list));return {services:services.filter(s=>s.published),projects:projects.filter(p=>p.published),discounts,bundles:bundles.filter(b=>b.published),pages:pages.filter(p=>p.published),settings:settings[0]};}
export async function limited(key:string,max:number,seconds:number){const r=await query(`INSERT INTO rate_limits(key,count,expires_at) VALUES($1,1,now()+($2 * interval '1 second')) ON CONFLICT(key) DO UPDATE SET count=CASE WHEN rate_limits.expires_at<now() THEN 1 ELSE rate_limits.count+1 END,expires_at=CASE WHEN rate_limits.expires_at<now() THEN now()+($2 * interval '1 second') ELSE rate_limits.expires_at END RETURNING count`,[key,seconds]);return r.rows[0].count>max;}
