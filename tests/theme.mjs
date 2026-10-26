// Idempotent semantic theme selection, including captures behind a modal dialog.
export async function setTheme(page,theme){
  // Clear incidental hover from the previous action before comparing settled surfaces.
  await page.mouse.move(0,0);
  if(await page.locator('html').getAttribute('data-theme')===theme)return;
  const button=page.getByRole('button',{name:`Switch to ${theme} mode`,exact:true});
  await button.evaluate(el=>el.click());
  if(await page.locator('html').getAttribute('data-theme')!==theme)throw Error('Theme toggle did not change the theme');
}
