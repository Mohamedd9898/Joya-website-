import {isFrontendPreview} from '@/lib/runtime';
import {currentUser} from '@/lib/auth';import {Admin} from '@/components/admin';export const dynamic='force-dynamic';export const metadata={title:'JOYA Studio — Administration',robots:{index:false,follow:false}};export default async function Page(){return <Admin initialUser={await currentUser()} frontendPreview={isFrontendPreview()}/>}
