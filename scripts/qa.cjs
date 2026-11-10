const { chromium } = require('../.tools/browser/node_modules/playwright');
const { AxeBuilder } = require('../.tools/browser/node_modules/@axe-core/playwright');
const fs = require('node:fs');
const assert = require('node:assert/strict');
(async()=>{
  fs.mkdirSync('artifacts',{recursive:true});
  const browser = await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
  const results=[];
  for(const [name,width,height] of [['desktop',1440,1000],['iphone',390,844],['small',320,740],['tablet',820,1180]]){
    console.log('Checking',name);
    const context = await browser.newContext({viewport:{width,height},deviceScaleFactor:1,isMobile:width<700,hasTouch:width<700});
    const page=await context.newPage();
    page.setDefaultTimeout(12000);
    const errors=[]; const failed=[];
    page.on('pageerror', e=>errors.push(e.message));
    page.on('response',r=>{if(r.status()>=400)failed.push(r.url()+':'+r.status())});
    await page.goto('http://127.0.0.1:4173',{waitUntil:'networkidle'});
    await page.evaluate(()=>document.fonts.ready);
    await page.waitForTimeout(1100);
    assert.equal(await page.locator('main').count(),1);
    assert.equal(await page.locator('.product').count(),5);
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,'horizontal overflow '+name);
    for(const image of await page.locator('img').all()) await image.evaluate(i=>{i.loading='eager';});
    await page.waitForFunction(()=>[...document.images].every(i=>i.complete&&i.naturalWidth>0),null,{timeout:12000});
    assert.deepEqual(await page.locator('img').evaluateAll(images=>images.filter(i=>!i.complete||i.naturalWidth===0).map(i=>i.src)),[],'images');
    await page.screenshot({path:`artifacts/${name}-hero.png`});
    console.log(name,'images and layout passed');
    for (const button of await page.locator('.project-detail').all()){
      await button.click();
      assert.equal(await page.locator('dialog[open]').count(),1);
      await page.keyboard.press('Escape');
      assert.equal(await page.locator('dialog[open]').count(),0);
      assert.equal(await button.evaluate(el=>el===document.activeElement),true,'focus restoration');
    }
    await page.locator('.lang').click();
    console.log(name,'dialogs passed');
    assert.equal(await page.locator('html').getAttribute('lang'),'en');
    assert.equal(await page.locator('.hero-actions a').first().innerText(),'Explore projects\n↘');
    await page.reload({waitUntil:'networkidle'});
    assert.equal(await page.locator('html').getAttribute('lang'),'en');
    await page.locator('.lang').click();
    if(width<700){await page.locator('.menu-button').click();assert.equal(await page.locator('.menu-button').getAttribute('aria-expanded'),'true');await page.locator('#menu a[href="#projects"]').click();assert.equal(await page.locator('.menu-button').getAttribute('aria-expanded'),'false');}
    const badAnchors=await page.locator('a[href^="#"]').evaluateAll(links=>links.filter(l=>!document.getElementById(l.hash.slice(1))).map(l=>l.hash));
    assert.deepEqual(badAnchors,[]);
    await page.locator('#projects').scrollIntoViewIfNeeded();
    await page.waitForTimeout(800);
    await page.screenshot({path:`artifacts/${name}-projects.png`});
    const axe=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
    console.log(name,'axe finished');
    results.push({name,width,errors,failed,axe:axe.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>n.target)})),metrics:await page.evaluate(()=>({height:document.body.scrollHeight,resources:performance.getEntriesByType('resource').length,dom:document.querySelectorAll('*').length,scrollTriggers:window.ScrollTrigger?.getAll().length||0,pinned:window.ScrollTrigger?.getAll().filter(t=>t.pin).length||0}))});
    await context.close();
  }
  for(const options of [{reducedMotion:'reduce'},{javaScriptEnabled:false}]){
    const context=await browser.newContext({...options,viewport:{width:390,height:844}});const page=await context.newPage();await page.goto('http://127.0.0.1:4173',{waitUntil:'networkidle'});await page.screenshot({path:`artifacts/${options.javaScriptEnabled===false?'no-js':'reduced'}-hero.png`});assert.equal(await page.locator('h1').isVisible(),true);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);if(options.reducedMotion)assert.equal(await page.evaluate(()=>window.ScrollTrigger?.getAll().length||0),0);results.push({mode:options,passed:true});await context.close();
  }
  fs.writeFileSync('artifacts/qa-results.json',JSON.stringify(results,null,2));
  assert.deepEqual(results.flatMap(result=>result.errors||[]),[],'JavaScript exceptions');
  assert.deepEqual(results.flatMap(result=>result.failed||[]),[],'Resource errors');
  assert.deepEqual(results.flatMap(result=>result.axe||[]),[],'Accessibility violations');
  console.log(JSON.stringify(results,null,2));await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
