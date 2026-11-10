const {chromium}=require('../.tools/browser/node_modules/playwright');
const fs=require('node:fs');
(async()=>{
 fs.mkdirSync('artifacts/v2',{recursive:true});
 const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
 try{
 const page=await browser.newPage({viewport:{width:1440,height:1000}});
 await page.goto('https://profitize.com.br/build/landing-pages/kairo',{waitUntil:'domcontentloaded',timeout:45000});
 await page.waitForTimeout(3000);
 const info=await page.evaluate(()=>({title:document.title,iframes:[...document.querySelectorAll('iframe')].map(i=>i.src),links:[...document.querySelectorAll('a')].map(a=>({text:a.innerText.slice(0,90),href:a.href})).filter(a=>/kairo|preview|demo|ver site|visualizar/i.test(a.text+' '+a.href)),text:document.body.innerText.slice(0,12000)}));
 fs.writeFileSync('artifacts/v2/reference.json',JSON.stringify(info,null,2));
 await page.screenshot({path:'artifacts/v2/reference-page.png'});
 console.log(JSON.stringify(info,null,2));
 }finally{await browser.close();}
})().catch(e=>{console.error(e.message);process.exit(1)});
