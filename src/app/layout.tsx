import '@fontsource/bebas-neue/latin-400.css';import '@fontsource/barlow-condensed/latin-800.css';import '@fontsource/cormorant-garamond/latin-500.css';import '@fontsource-variable/fraunces';import '@fontsource-variable/space-grotesk';import '@fontsource-variable/syne';
import {headers} from 'next/headers';
import '@fontsource-variable/dm-sans';import '@fontsource/dm-serif-display/400.css';import '@fontsource/dm-serif-display/400-italic.css';import '@fontsource-variable/noto-sans-arabic';import './globals.css';
export const metadata={title:'JOYA — Your business, beautifully put together.',description:'Design, digital presence and practical business systems for Saudi businesses.'};
export default async function RootLayout({children}:{children:React.ReactNode}){const locale=(await headers()).get('x-joya-locale')==='ar'?'ar':'en';return <html lang={locale} dir={locale==='ar'?'rtl':'ltr'} suppressHydrationWarning><body>{children}</body></html>}
