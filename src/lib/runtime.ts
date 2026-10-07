/** Vercel's filesystem is ephemeral. Public previews use read-only seed content. */
export function isFrontendPreview(){return process.env.JOYA_FRONTEND_PREVIEW==='true'||(process.env.VERCEL==='1'&&!process.env.DATABASE_URL);}
