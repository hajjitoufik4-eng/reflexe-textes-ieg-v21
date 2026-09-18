const { test, expect } = require('@playwright/test');

test.describe('Réflexe IEG - parcours intuitif', () => {
  test('accueil progressif: hiérarchie puis domaine puis dossier', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: /Pose une question simple/i })).toBeVisible();

    const hierarchy = page.locator('details.hierarchy-mini');
    await expect(hierarchy).toHaveCount(4);
    await expect(page.locator('details.home-drawer')).toHaveCount(9);
    const payClosed = page.locator('details.home-drawer').filter({ hasText: 'Rémunération & frais' });
    await expect(payClosed).not.toHaveAttribute('open', '');

    const law = page.locator('details.hierarchy-mini').filter({ hasText: 'Droit commun & Europe' });
    await law.locator('summary').click();
    await expect(law).toHaveAttribute('open', '');
    await expect(law.getByText(/On commence ici/i)).toBeVisible();

    const pay = page.locator('details.home-drawer').filter({ hasText: 'Rémunération & frais' });
    await pay.locator('summary').click();
    await expect(pay.getByRole('link', { name: /Repas/i })).toBeVisible();

    await pay.getByRole('link', { name: /Repas/i }).click();
    await expect(page).toHaveURL(/\/recherche\?q=repas/);
    await expect(page.getByRole('heading', { name: /Qu’est-ce que tu veux comprendre/i })).toBeVisible();
  });

  test('dossier Repas: PERS 375, 583 et 793 restent ensemble', async ({ page }) => {
    await page.goto('/recherche?q=repas');
    await expect(page.getByText(/Je retiens/i)).toBeVisible();

    const primary = page.locator('details.progress-details').first();
    await primary.locator('summary').click();
    await expect(primary).toHaveAttribute('open', '');

    await expect(primary.getByText('PERS375', { exact: true })).toBeVisible();
    await expect(primary.getByText('PERS583', { exact: true })).toBeVisible();
    await expect(primary.getByText('PERS793', { exact: true })).toBeVisible();

    const primaryCards = primary.locator('.correlation-doc');
    expect(await primaryCards.count()).toBeLessThanOrEqual(6);

    const complements = page.locator('details.progress-details').filter({ hasText: 'Textes liés, extensions et compléments' });
    await expect(complements).toHaveCount(1);
    await expect(complements).not.toHaveAttribute('open', '');
  });

  test('question libre: réponse d’abord, sources fermées par défaut', async ({ page }) => {
    await page.goto('/');
    await page.getByLabel('Décris ta question').fill("Ai-je droit à une indemnité de repas ?");
    await page.getByRole('button', { name: /Explique-moi/i }).click();

    await expect(page).toHaveURL(/\/recherche\?q=/);
    await expect(page.locator('.simple-result-card')).toBeVisible();
    await expect(page.locator('details.progress-details').first()).not.toHaveAttribute('open', '');
  });

  test('mobile: pas de débordement et parcours Repas utilisable', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');

    const widths = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, inner: window.innerWidth }));
    expect(widths.scroll).toBeLessThanOrEqual(widths.inner + 1);

    const pay = page.locator('details.home-drawer').filter({ hasText: 'Rémunération & frais' });
    await pay.locator('summary').click();
    await pay.getByRole('link', { name: /Repas/i }).click();
    await expect(page).toHaveURL(/\/recherche\?q=repas/);

    const primary = page.locator('details.progress-details').first();
    await primary.locator('summary').click();
    await expect(primary.getByText('PERS375', { exact: true })).toBeVisible();

    const widths2 = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, inner: window.innerWidth }));
    expect(widths2.scroll).toBeLessThanOrEqual(widths2.inner + 1);
  });

  test('chaque dossier visible de l’accueil mène à une page de réponse', async ({ page }) => {
    await page.goto('/');
    const drawers = page.locator('details.home-drawer');
    const total = await drawers.count();

    for (let i = 0; i < total; i++) {
      const drawer = drawers.nth(i);
      if (!(await drawer.isVisible())) continue;
      await drawer.locator('summary').click();
      const links = drawer.locator('.drawer-items a');
      const count = await links.count();
      for (let j = 0; j < count; j++) {
        const href = await links.nth(j).getAttribute('href');
        expect(href).toMatch(/^\/recherche\?q=/);
      }
      await drawer.locator('summary').click();
    }
  });
});
