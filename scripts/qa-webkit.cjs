const {webkit,devices}=require('../.tools/browser/node_modules/playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
(async()=>{
 const browser=await webkit.launch();const results=[];fs.mkdirSync('artifacts/v4',{recursive:true});
 try{
 for(const [name,width,height] of [['iphone-se',375,667],['iphone-13',390,844],['iphone-landscape',844,390]]){
   const context=await browser.newContext({...devices['iPhone 13'],viewport:{width,height}});
   const page=await context.newPage();page.setDefaultTimeout(15000);
   const errors=[];page.on('pageerror',e=>errors.push(e.message));
   await page.goto('http://127.0.0.1:4173',{waitUntil:'networkidle'});
   await page.waitForTimeout(1000);
   assert.equal(await page.locator('.editorial-cursor').count(),0,'No mouse tracking on touch');
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
   assert.equal(await page.locator('.hero-portrait img').evaluate(i=>i.complete&&i.naturalWidth===920),true);
   assert.equal(await page.locator('.hero-first').isVisible(),true);
   await page.screenshot({path:`artifacts/v4/webkit-${name}.png`});
   if(width<701){await page.locator('.menu-button').click();assert.equal(await page.locator('.menu-button').getAttribute('aria-expanded'),'true');await page.locator('#menu a[href="#projects"]').click();assert.equal(await page.locator('.menu-button').getAttribute('aria-expanded'),'false');}
   for(const selector of ['[data-detail="regcrim"]','.rumbo-detail-open']){
     await page.locator(selector).click();assert.equal(await page.locator('dialog[open]').count(),1);await page.keyboard.press('Escape');assert.equal(await page.locator('dialog[open]').count(),0);
   }
   await page.locator('.lang').click();assert.equal(await page.locator('html').getAttribute('lang'),'en');
   await page.emulateMedia({reducedMotion:'reduce'});await page.waitForFunction(()=>ScrollTrigger.getAll().length===0);
   assert.deepEqual(errors,[]);
   results.push({name,engine:'WebKit',width,height,errors,noOverflow:true,noCustomCursor:true,menu:true,dialogs:true,language:true,reducedMotion:true});
   await context.close();
 }
 fs.writeFileSync('artifacts/v4/webkit-results.json',JSON.stringify(results,null,2));console.log(JSON.stringify(results,null,2));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1)});
