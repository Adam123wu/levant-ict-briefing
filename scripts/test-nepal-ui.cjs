const fs=require('node:fs');
const http=require('node:http');
const path=require('node:path');
const assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const root=path.resolve('out');
const server=http.createServer((req,res)=>{
 let route=decodeURIComponent(new URL(req.url,'http://localhost').pathname).replace(/^\/levant-ict-briefing/,'');
 if(route.endsWith('/'))route+='index.html';
 const file=path.resolve(root,'.'+route);
 if(!file.startsWith(root+path.sep)||!fs.existsSync(file)){res.writeHead(404).end();return;}
 res.setHeader('Content-Type',file.endsWith('.js')?'application/javascript':file.endsWith('.css')?'text/css':file.endsWith('.html')?'text/html':'application/octet-stream');res.end(fs.readFileSync(file));
});
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));
 let browser;
 try{
 browser=await chromium.launch({headless:true,channel:'chrome'});
 const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const base=process.env.NEPAL_LIVE_BASE||`http://127.0.0.1:${server.address().port}/levant-ict-briefing`;
 for(const route of ['','briefings','sources','people','compliance','archive']){
  await page.goto(base+'/'+(route?route+'/':''));await page.getByRole('button',{name:'English',exact:true}).click();
  await page.getByRole('heading',{level:1}).first().waitFor();
  assert((await page.locator('h1').innerText()).match(/Nepal|Historical/));
  await page.getByRole('button',{name:'中文',exact:true}).click();
  assert((await page.locator('h1').innerText()).match(/尼泊尔|历史/));
  if(route!=='archive')assert(!/伊拉克|约旦|黎巴嫩/.test(await page.locator('main').innerText()));
 }
 await page.goto(base+'/briefings/');assert.equal(await page.locator('[data-country="np"]').count(),1);assert.equal(await page.locator('.accordion-trigger').count(),11);
 await page.goto(base+'/sources/');await page.getByRole('textbox').fill('Ncell');assert.equal(await page.locator('tbody tr').count(),3);
 await page.setViewportSize({width:390,height:844});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth));
 assert.deepEqual(errors,[]);console.log('Six routes, Chinese/English, Nepal isolation, 11 sections, source filtering and mobile width passed.');
 }finally{if(browser)await browser.close();await new Promise(r=>server.close(r));}
})().catch(e=>{console.error(e);process.exitCode=1;});
