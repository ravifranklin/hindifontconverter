import {test,expect} from '@playwright/test';
const directions=['krutidev-to-unicode','unicode-to-krutidev','krutidev-to-chanakya','krutidev-to-mangal','mangal-to-krutidev','preeti-to-unicode','unicode-to-preeti','chanakya-to-unicode','unicode-to-chanakya','chanakya-to-krutidev','devlys-to-unicode','unicode-to-devlys','devlys-to-mangal','mangal-to-devlys'];
for(const slug of directions)test(slug+' converts, clears and disables empty actions',async({page})=>{await page.goto('/'+slug);await page.getByRole('button',{name:'Try an example'}).click();await expect(page.locator('#result')).not.toHaveValue('');await page.getByRole('button',{name:'Clear',exact:true}).click();await expect(page.locator('#source')).toHaveValue('');await expect(page.locator('#result')).toHaveValue('');await expect(page.getByRole('button',{name:'Copy',exact:true})).toBeDisabled();});
test('manual conversion invalidates stale result',async({page})=>{await page.goto('/');await page.getByRole('switch').uncheck();await page.locator('#source').fill('Hkkjr');await page.getByRole('button',{name:'Convert to Unicode',exact:true}).click();await expect(page.locator('#result')).toHaveValue('भारत');await page.locator('#source').fill('fd');await expect(page.locator('#result')).toHaveValue('');});
test('typing caret, delete, replacement, paste and composition',async({page})=>{await page.goto('/typing');const source=page.locator('#source');await source.fill('Hkkjr');await source.press('Home');await source.press('ArrowRight');await source.press('Delete');await expect(source).toHaveValue('Hkjr');await source.fill('fd');await source.press('ControlOrMeta+A');await source.pressSequentially('Hkkjr');await expect(page.locator('#result')).toHaveValue('भारत');await source.evaluate((el:HTMLTextAreaElement)=>{el.dispatchEvent(new CompositionEvent('compositionstart',{bubbles:true}));});await source.fill('नमस्ते');await source.evaluate((el:HTMLTextAreaElement)=>{el.dispatchEvent(new CompositionEvent('compositionend',{bubbles:true,data:'नमस्ते'}));});await expect(page.locator('#result')).toHaveValue('नमस्ते');});
test('share URL encoding and actual Word ZIP',async({page})=>{await page.goto('/');await page.locator('#source').fill('[[भारत & + ?\nनेपाल]]');await expect(page.locator('#result')).toHaveValue('भारत & + ?\nनेपाल');const opened:string[]=[];await page.exposeFunction('recordOpen',(url:string)=>opened.push(url));await page.evaluate(()=>{window.open=((url:unknown)=>{(window as unknown as {recordOpen:(s:string)=>void}).recordOpen(String(url));return null;}) as typeof window.open;});await page.getByRole('button',{name:'Share on WhatsApp'}).click();await page.getByRole('button',{name:'Compose in Gmail'}).click();expect(new URL(opened[0]).searchParams.get('text')).toBe('भारत & + ?\nनेपाल');expect(new URL(opened[1]).searchParams.get('body')).toBe('भारत & + ?\nनेपाल');const download=page.waitForEvent('download');await page.getByRole('button',{name:'Download Word File'}).click();expect((await download).suggestedFilename()).toBe('akshar-unicode.docx');});
test('phone has no horizontal overflow and keyboard navigation',async({page})=>{await page.setViewportSize({width:390,height:844});await page.goto('/');expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await page.keyboard.press('Tab');await expect(page.getByRole('link',{name:'Skip to content'})).toBeFocused();});
import {routes} from '../lib/routes';
import {convert} from '../lib/conversion/engine';
for(const route of routes)test('direction switch '+route.slug,async({page})=>{
 await page.goto('/'+route.slug);
 const input=convert('भारत\nनेपाल','unicode',route.from),forward=convert(input,route.from,route.to);
 await page.locator('#source').fill(input);
 await expect(page.locator('#result')).toHaveValue(forward);
 const button=page.getByRole('button',{name:/Switch direction to/});
 await button.press('Enter');
 await expect(page).toHaveURL(new RegExp('/'+route.to+'-to-'+route.from+'$'));
 await expect(page.locator('#source')).toHaveValue(forward);
 const backward=convert(forward,route.to,route.from);
 await expect(page.locator('#result')).toHaveValue(backward);
 await expect(button).toBeFocused();
 await button.press('Space');
 await expect(page.locator('#source')).toHaveValue(backward);
 await expect(page.locator('#result')).toHaveValue(convert(backward,route.from,route.to));
});
test('switch preserves drafts and converts edited results in manual mode',async({page})=>{
 await page.goto('/unicode-to-krutidev');
 await page.getByRole('switch').uncheck();
 const source=page.locator('#source'),result=page.locator('#result'),button=page.getByRole('button',{name:/Switch direction to/});
 await source.fill('भारत');await button.click();
 await expect(source).toHaveValue('');await expect(result).toHaveValue('');
 await button.click();await expect(source).toHaveValue('भारत');await expect(result).toHaveValue('');
 await page.getByRole('button',{name:'Convert to Kruti Dev',exact:true}).click();
 await expect(result).toHaveValue('Hkkjr');await result.fill('usiky\nHkkjr');await button.click();
 await expect(source).toHaveValue('usiky\nHkkjr');await expect(result).toHaveValue('नेपाल\nभारत');
 await result.fill('');await button.click();await expect(source).toHaveValue('');await expect(result).toHaveValue('');
});
test('switch is between editors at desktop and mobile widths',async({page})=>{
 for(const width of [1280,390]){
  await page.setViewportSize({width,height:900});await page.goto('/unicode-to-preeti');
  const source=await page.locator('#source').boundingBox(),button=await page.getByRole('button',{name:/Switch direction to/}).boundingBox(),result=await page.locator('#result').boundingBox();
  expect(source&&button&&result).toBeTruthy();
  if(width===390){expect(button!.y).toBeGreaterThan(source!.y+source!.height);expect(result!.y).toBeGreaterThan(button!.y+button!.height);}
  else{expect(button!.x).toBeGreaterThan(source!.x+source!.width);expect(result!.x).toBeGreaterThan(button!.x+button!.width);}
 }
});
