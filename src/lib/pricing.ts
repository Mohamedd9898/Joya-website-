import type {Service,Discount,Locale} from './types';
export function effectivePrice(service:Service,discounts:Discount[],now=new Date(),bundleId?:string){
 if(service.price===null)return {regular:null,price:null,discount:null};
 const valid=discounts.filter(d=>d.published&&(d.bundleId?d.bundleId===bundleId:d.serviceIds.includes(service.id))&&new Date(d.starts)<=now&&new Date(d.ends)>now);
 let price=service.price,discount:Discount|null=null;
 for(const d of valid){const n=Math.max(0,d.type==='percentage'?service.price*(1-d.value/100):d.type==='fixed'?service.price-d.value:d.value);if(n<price){price=n;discount=d;}}
 return {regular:service.price,price:Math.round(price*100)/100,discount};
}
export function money(value:number,locale:Locale='en'){return new Intl.NumberFormat(locale==='ar'?'ar-SA':'en-SA',{maximumFractionDigits:2}).format(value);}
