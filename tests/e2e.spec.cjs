const { test, expect } = require('@playwright/test');

test.describe('Réflexe IEG - navigation intuitive', () => {
  test('accueil court + barre latérale en 6 familles repliées', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: /Pose une question simple/i })).toBeVisible();
    await expect(page.locator('details.home-drawer')).toHaveCount(6);

    const groups=page.locator('.dossier-sidebar .dossier-side-group-title');
    await expect(groups).toHaveCount(6);
    await expect(page.locator('.dossier-sidebar .dossier-side-links a')).toHaveCount(0);

    await groups.nth(0).click();
    await expect(page.locator('.dossier-sidebar .dossier-side-links a')).toHaveCount(4);
    await groups.nth(0).click();
    await expect(page.locator('.dossier-sidebar .dossier-side-links a')).toHaveCount(0);

    const hierarchy=page.locator('details.hierarchy-mini');
    await expect(hierarchy).toHaveCount(4);
    for(let i=0;i<4;i++){
      const card=hierarchy.nth(i);
      await card.locator('summary').click();
      await expect(card).toHaveAttribute('open','');
      await card.locator('summary').click();
    }
  });

  test('accueil -> domaine -> page dossier Repas avec repères de navigation', async ({ page }) => {
    await page.goto('/');
    const pay=page.locator('details.home-drawer').filter({hasText:'Rémunération & frais'});
    await pay.locator('summary').click();
    const repas=pay.locator('a[href="/dossiers/repas"]');
    await expect(repas).toBeVisible();
    await repas.click();

    await expect(page).toHaveURL(/\/dossiers\/repas$/);
    await expect(page.locator('.dossier-page-hero')).toBeVisible();
    await expect(page.getByRole('heading',{name:'Repas',exact:true})).toBeVisible();
    await expect(page.locator('.dossier-sidebar a.active')).toContainText('Repas');
    await expect(page.locator('.dossier-breadcrumb')).toContainText('Rémunération & frais');
    await expect(page.locator('.dossier-breadcrumb')).toContainText('Repas');
  });

  test('page Repas garde PERS 375, 583 et 793 dans les textes essentiels', async ({ page }) => {
    await page.goto('/dossiers/repas');
    const first=page.locator('.dossier-first');
    await expect(first.getByText('PERS375',{exact:true})).toBeVisible();
    await expect(first.getByText('PERS583',{exact:true})).toBeVisible();
    await expect(first.getByText('PERS793',{exact:true})).toBeVisible();

    const essential=page.locator('.dossier-first .dossier-doc-card');
    expect(await essential.count()).toBeLessThanOrEqual(6);

    const more=page.locator('details.dossier-more').first();
    if(await more.count()) await expect(more).not.toHaveAttribute('open','');

    const pers375=page.locator('.dossier-doc-card').filter({hasText:'PERS375'}).first();
    await pers375.click();
    await expect(page).toHaveURL(/\/textes\//);
    await expect(page.getByText(/PERS375/i).first()).toBeVisible();
  });

  test('question depuis un dossier conserve le contexte du dossier', async ({ page }) => {
    await page.goto('/dossiers/repas');
    await page.getByLabel('Question dans ce dossier').fill('Et si je ne me déplace pas ?');
    await page.getByRole('button',{name:/Expliquer/i}).click();
    await expect(page).toHaveURL(/\/recherche\?.*dossier=repas/);
    await expect(page.locator('.simple-result-card')).toBeVisible();

    const primary=page.locator('details.progress-details').first();
    await primary.locator('summary').click();
    await expect(primary.getByText('PERS375',{exact:true})).toBeVisible();
    await expect(primary.getByText('PERS793',{exact:true})).toBeVisible();
  });

  test('mobile: bouton Dossiers ouvre 6 familles puis accès direct à Astreinte', async ({ page }) => {
    await page.setViewportSize({width:390,height:844});
    await page.goto('/');

    const widths=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,inner:window.innerWidth}));
    expect(widths.scroll).toBeLessThanOrEqual(widths.inner+1);

    await page.locator('.dossier-mobile-button').click();
    const panel=page.locator('#dossier-mobile-panel');
    await expect(panel).toBeVisible();
    await expect(panel.locator('.dossier-side-group-title')).toHaveCount(6);
    await expect(panel.locator('.dossier-side-links a')).toHaveCount(0);

    await panel.locator('.dossier-side-group-title').filter({hasText:'Temps & organisation'}).click();
    await expect(panel.locator('a[href="/dossiers/astreinte"]')).toBeVisible();
    await panel.locator('a[href="/dossiers/astreinte"]').click();

    await expect(page).toHaveURL(/\/dossiers\/astreinte$/);
    await expect(page.locator('.dossier-page-hero')).toBeVisible();

    const widths2=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,inner:window.innerWidth}));
    expect(widths2.scroll).toBeLessThanOrEqual(widths2.inner+1);
  });

  test('les 24 dossiers restent tous accessibles sans être affichés ensemble', async ({ page }) => {
    test.setTimeout(120000);
    await page.goto('/');
    const groupButtons=page.locator('.dossier-sidebar .dossier-side-group-title');
    const hrefs=[];

    for(let i=0;i<await groupButtons.count();i++){
      await groupButtons.nth(i).click();
      const links=page.locator('.dossier-sidebar .dossier-side-links a');
      for(let j=0;j<await links.count();j++) hrefs.push(await links.nth(j).getAttribute('href'));
      await groupButtons.nth(i).click();
    }

    expect(hrefs.length).toBe(24);
    expect(new Set(hrefs).size).toBe(24);

    for(const href of hrefs){
      await page.goto(href);
      await expect(page.locator('.dossier-page-hero')).toBeVisible();
      await expect(page.locator('.dossier-first')).toBeVisible();
    }
  });
});
