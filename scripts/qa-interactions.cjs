const {chromium}=require('../.tools/browser/node_modules/playwright');
const {AxeBuilder}=require('../.tools/browser/node_modules/@axe-core/playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const base='http://127.0.0.1:4173';
(async()=>{
 fs.mkdirSync('artifacts/v4',{recursive:true});
 const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
 const result={};
 try {
 const desktopContext=await browser.newContext({viewport:{width:1440,height:1000}});
 const page=await desktopContext.newPage();
 page.setDefaultTimeout(15000);
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(()=>{
   window.__longTasks=[]; window.__shifts=[];
   new PerformanceObserver(list=>window.__longTasks.push(...list.getEntries().map(e=>({start:e.startTime,duration:e.duration})))).observe({type:'longtask',buffered:true});
   new PerformanceObserver(list=>window.__shifts.push(...list.getEntries().filter(e=>!e.hadRecentInput).map(e=>e.value))).observe({type:'layout-shift',buffered:true});
 });
 await page.goto(base+'/?interaction-debug',{waitUntil:'networkidle'});
 await page.waitForFunction(()=>!document.documentElement.hasAttribute('data-intro-running'));
 assert.equal(await page.locator('.editorial-cursor').count(),1);
 assert.equal(await page.locator('html').evaluate(e=>e.classList.contains('pointer-ready')),false,'Native cursor until first pointer');
 await page.keyboard.press('Tab');
 await page.waitForTimeout(100);
 assert.deepEqual(errors,[],'Keyboard before any pointer event');
 await page.evaluate(()=>document.activeElement.blur());
 const portrait=page.locator('.hero-portrait');
 const hero=await page.locator('.hero-composition').boundingBox();
 const read=locator=>locator.evaluate(el=>({x:parseFloat(el.style.getPropertyValue('--pointer-x'))||0,y:parseFloat(el.style.getPropertyValue('--pointer-y'))||0}));
 await page.mouse.move(hero.x+hero.width*.85,hero.y+hero.height*.6,{steps:12});
 await page.waitForTimeout(600);
 const depths={portrait:await read(portrait),type:await read(page.locator('.hero-first')),light:await read(page.locator('.hero-light'))};
 assert.ok(depths.portrait.x>9&&depths.type.x< -4&&depths.light.x>13,'Distinct, measurable layer depth');
 assert.equal(await page.locator('html').evaluate(e=>e.classList.contains('pointer-ready')),true);
 assert.equal(await page.locator('.editorial-cursor').evaluate(el=>getComputedStyle(el).pointerEvents),'none');
 await page.screenshot({path:'artifacts/v4/desktop-parallax.png'});
 await page.mouse.move(20,30,{steps:5});await page.waitForTimeout(700);
 assert.equal((await read(portrait)).x,0,'Hero returns to origin');
 const button=page.locator('.hero-actions .primary');const box=await button.boundingBox();
 await page.mouse.move(box.x+box.width-6,box.y+box.height/2);await page.waitForTimeout(500);
 const magnet=await read(button);assert.ok(magnet.x>2&&magnet.x<=6,'Magnetic bounded movement');
 await page.mouse.move(20,30);await page.waitForTimeout(700);
 assert.equal((await read(button)).x,0,'Magnet return');
 await page.keyboard.press('Tab');
 assert.equal(await page.locator('html').evaluate(e=>e.classList.contains('pointer-ready')),false,'Keyboard restores native cursor');
 const hover=[];
 for(const name of ['regcrim','daw','secretaria','rumbo','nexus']){
   const stage=page.locator(`[data-product="${name}"] .product-stage`);
   await stage.scrollIntoViewIfNeeded();await page.waitForTimeout(800);
   const r=await stage.boundingBox();await page.mouse.move(r.x+r.width*.72,r.y+r.height*.48,{steps:8});await page.waitForTimeout(500);
   assert.equal(await page.locator('.editorial-cursor').getAttribute('data-context'),'project');
   assert.equal(await page.locator('.cursor-shape span').innerText(),'EXPLORAR');
   await page.screenshot({path:`artifacts/v4/project-${name}-hover.png`});
   const selector={regcrim:'.reg-interface',daw:'.daw-primary',secretaria:'.ops-interface',rumbo:'.rumbo-showcase',nexus:'.nexus-sphere'}[name];
   const position=await read(stage.locator(selector));assert.ok(Math.abs(position.x)>.8,name+' parallax');hover.push({name,position});
 }
 await page.locator('.lang').click();
 await page.locator('.regcrim .product-stage').scrollIntoViewIfNeeded();await page.waitForTimeout(800);
 const reg=await page.locator('.regcrim .product-stage').boundingBox();await page.mouse.move(reg.x+reg.width*.7,reg.y+reg.height*.5);
 await page.waitForTimeout(400);assert.equal(await page.locator('.cursor-shape span').innerText(),'EXPLORE');
 const open=page.locator('[data-detail="regcrim"]');await open.hover();await page.waitForTimeout(300);
 assert.equal(await page.locator('.cursor-shape span').innerText(),'OPEN');await open.click();
 assert.equal(await page.locator('.dialog-close').evaluate(el=>getComputedStyle(el).cursor),'pointer','Native cursor in top-layer modal');
 const dialogAxe=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
 assert.equal(dialogAxe.violations.length,0,'Modal accessibility');await page.keyboard.press('Escape');
 await page.locator('.lang').click();await page.evaluate(()=>scrollTo(0,0));await page.waitForTimeout(600);
 await page.mouse.move(20,30);await page.waitForTimeout(700);
 const idleBefore=await page.evaluate(()=>window.__interactionStats.frames);await page.waitForTimeout(700);
 assert.equal(await page.evaluate(()=>window.__interactionStats.frames),idleBefore,'No perpetual animation loop');

 // Measure real rendered frame intervals while moving the pointer for two seconds.
 await page.evaluate(()=>{window.__frameTimes=[];window.__recordFrames=true;let last=performance.now();function record(now){window.__frameTimes.push(now-last);last=now;if(window.__recordFrames)requestAnimationFrame(record);}requestAnimationFrame(record);});
 const start=Date.now();const perfStart=await page.evaluate(()=>performance.now());
 let steps=0;while(Date.now()-start<2000){const phase=(Date.now()-start)/2000;await page.mouse.move(hero.x+hero.width*(.5+.35*Math.sin(phase*Math.PI*4)),hero.y+hero.height*(.5+.2*Math.cos(phase*Math.PI*4)));await page.waitForTimeout(12);steps++;}
 const perf=await page.evaluate(start=>{window.__recordFrames=false;const frames=window.__frameTimes.slice(2).sort((a,b)=>a-b);return {sampleFrames:frames.length,medianFrameMs:frames[Math.floor(frames.length*.5)],p95FrameMs:frames[Math.floor(frames.length*.95)],longTasksDuringInteraction:window.__longTasks.filter(e=>e.start>=start),cls:window.__shifts.reduce((a,b)=>a+b,0),controller:window.__interactionStats};},perfStart);
 const scrollStart=await page.evaluate(()=>performance.now());
 for(let i=0;i<8;i++){await page.mouse.wheel(0,400);await page.waitForTimeout(80);}
 const scroll=await page.evaluate(start=>({position:scrollY,longTasks:window.__longTasks.filter(e=>e.start>=start),pinned:ScrollTrigger.getAll().filter(t=>t.pin).length}),scrollStart);
 assert.ok(scroll.position>2000,'Native wheel scroll progresses');assert.equal(scroll.pinned,0);
 assert.equal((await read(portrait)).x,0,'Offscreen hero resets');
 await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));await page.waitForTimeout(400);
 await page.mouse.move(20,30);await page.waitForTimeout(700);
 await page.screenshot({path:'artifacts/v4/desktop-hero.png'});
 await page.emulateMedia({reducedMotion:'reduce'});await page.waitForFunction(()=>!document.querySelector('.editorial-cursor'));
 assert.equal(await page.evaluate(()=>ScrollTrigger.getAll().length),0);
 assert.equal(await portrait.evaluate(el=>el.style.getPropertyValue('--pointer-x')),'');
 await page.emulateMedia({reducedMotion:'no-preference'});await page.waitForFunction(()=>document.querySelectorAll('.editorial-cursor').length===1);
 await page.emulateMedia({forcedColors:'active'});await page.waitForFunction(()=>!document.querySelector('.editorial-cursor'));
 await page.emulateMedia({forcedColors:'none'});await page.waitForFunction(()=>document.querySelectorAll('.editorial-cursor').length===1);
 await page.mouse.move(200,200);await page.waitForTimeout(200);
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
 assert.deepEqual(errors,[]);
 result.desktop={depths,magnet,hover,perf,scroll,errors,modalAxeViolations:dialogAxe.violations.length};
 await page.close();

 for(const width of [320,390,700,820,1920]){
   const context=await browser.newContext({viewport:{width,height:width<700?844:1080},isMobile:width<=700,hasTouch:width<=700,deviceScaleFactor:width<=700?2:1});
   const p=await context.newPage();await p.goto(base,{waitUntil:'networkidle'});await p.waitForTimeout(1000);
   assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,'Overflow '+width);
   if(width<=700){assert.equal(await p.locator('.editorial-cursor').count(),0);assert.equal(await p.locator('.hero-first').isVisible(),true);}
   await p.screenshot({path:`artifacts/v4/hero-${width}.png`});
   result[width]={noOverflow:true,cursorEnabled:await p.locator('.editorial-cursor').count()===1};
   await context.close();
 }
 fs.writeFileSync('artifacts/v4/interaction-results.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1)});
