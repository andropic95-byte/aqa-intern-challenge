import { test, expect } from '@playwright/test';
import { WidgetPage } from './widget.page';

test.describe('Uchi.ru widget', () => {
  let widgetPage: WidgetPage;

  test.beforeEach(async ({ page }) => {
    widgetPage = new WidgetPage(page);
    await page.goto('/');

    // The cookie widget also contains a hidden copy of the banner.
    const cookieBanner = page.locator('._UCHI_COOKIE__wrap.show');
    await cookieBanner.locator('._UCHI_COOKIE__button').click();
    await expect(cookieBanner).toBeHidden();
  });

  test('opens', async () => {
    await widgetPage.openWidget();

    await expect(widgetPage.getWidgetBody()).toBeVisible();
    await expect(widgetPage.getTitle()).toHaveText('База знаний Учи.ру');
  });

  test('has correct title', async () => {
    await widgetPage.openWidget();
    await widgetPage.getPopularArticles().first().click();
    await widgetPage.clickWriteToUs();

    await expect(widgetPage.getTitle()).toHaveText('Связь с поддержкой');
  });

  test('closes and opens again', async () => {
    await widgetPage.openWidget();
    await expect(widgetPage.getWidgetBody()).toBeVisible();

    await widgetPage.closeWidget();
    await expect(widgetPage.getWidgetBody()).toBeHidden();

    await widgetPage.openWidget();
    await expect(widgetPage.getWidgetBody()).toBeVisible();
    await expect(widgetPage.getTitle()).toHaveText('База знаний Учи.ру');
  });
});
