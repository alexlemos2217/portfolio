const {chromium,webkit,devices}=require('../.tools/browser/node_modules/playwright');
const fs=require('node:fs');const crypto=require('node:crypto');const assert=require('node:assert/strict');
const hash=value=>crypto.createHash('sha256').update(value).digest('hex');
(async()=>{
 const folder='artifacts/portrait-editorial';fs.mkdirSync(folder,{recursive:true});
 const before=JSON.parse(fs.readFileSync('.tools/portrait-scope-before.json','utf8'));
 for(const [file,digest] of Object.entries(before.files))assert.equal(hash(fs.readFileSync(file)),digest,'Unchanged '+file);
 const html=fs.readFileSync('index.html','utf8');
 assert.equal(hash(html.slice(html.indexOf('    <section class="projects"'))),before.projectAndFollowingHTML,'Other sections unchanged');
 const results=[];
 for(const [name,engine,options] of [
   ['desktop',chromium,{viewport:{width:1440,height:1000},deviceScaleFactor:1}],
   ['chrome-mobile',chromium,{viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:true,hasTouch:true}],
   ['webkit-iphone',webkit,{...devices['iPhone 13']}]
 ]){
  const browser=await engine.launch(engine===chromium?{executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'}:{});
  try{
   const context=await browser.newContext(options);const page=await context.newPage();
   const errors=[],failed=[];page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)failed.push(r.url())});
   await page.goto('http://127.0.0.1:4173',{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(1100);
   const image=await page.locator('.hero-portrait img').evaluate(i=>({source:i.currentSrc,width:i.naturalWidth,height:i.naturalHeight,displayWidth:i.getBoundingClientRect().width,filter:getComputedStyle(i).filter,mask:getComputedStyle(i).maskImage}));
   assert.ok(image.source.endsWith('img/alex-editorial-halftone.webp'));assert.equal(image.width,920);assert.equal(image.height,920);assert.ok(image.displayWidth<=461);assert.equal(image.filter,'grayscale(0.65)');assert.equal(image.mask,'none');
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
   assert.equal(await page.locator('.hero-first').innerText(),'ALEXANDER');
   if(name==='desktop'){
     const hero=await page.locator('.hero-composition').boundingBox();await page.mouse.move(hero.x+hero.width*.8,hero.y+hero.height*.6);await page.waitForTimeout(500);
     assert.ok(await page.locator('.hero-portrait').evaluate(e=>parseFloat(e.style.getPropertyValue('--pointer-x'))>5),'Parallax preserved');
     await page.mouse.move(10,10);await page.waitForTimeout(600);
   }else assert.equal(await page.locator('.editorial-cursor').count(),0);
   await page.screenshot({path:`${folder}/hero-${name}.png`});
   await page.locator('.lang').click();assert.equal(await page.locator('html').getAttribute('lang'),'en');
   await page.locator('[data-detail="regcrim"]').click();assert.equal(await page.locator('dialog[open]').count(),1);await page.keyboard.press('Escape');
   assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);
   results.push({name,image,errors,failed,noOverflow:true,languageAndDialog:true});
  }finally{await browser.close();}
 }
 fs.writeFileSync(`${folder}/browser-validation.json`,JSON.stringify({scopePreserved:true,results},null,2));console.log(JSON.stringify({scopePreserved:true,results},null,2));
})().catch(e=>{console.error(e);process.exit(1)});
