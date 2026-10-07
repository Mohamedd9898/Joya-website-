import {query} from '../src/lib/db';import {randomBytes,randomUUID} from 'node:crypto';import bcrypt from 'bcryptjs';import {writeFile} from 'node:fs/promises';
async function main(){const email='qa-'+randomBytes(5).toString('hex')+'@joya.test';const password=randomBytes(30).toString('base64url');
await query('INSERT INTO users(id,email,password,role) VALUES($1,$2,$3,$4)',[randomUUID(),email,await bcrypt.hash(password,12),'owner']);await writeFile('/tmp/joya-qa-access.json',JSON.stringify({email,password}),{mode:0o600});console.log('Temporary QA account provisioned; credentials not logged.');process.exit(0);
}
main().catch(e=>{console.error(e.message);process.exit(1);});
