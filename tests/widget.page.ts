import { Locator, Page } from '@playwright/test';

export class WidgetPage {
  constructor(private readonly page: Page) {}

  wrapper(): Locator {
    return this.page.locator('[class^="widget__"]').filter({
      has: this.page.locator('[data-test="openWidget"]'),
    });
  }

  async openWidget(): Promise<void> {
    const openButton = this.wrapper().locator('[data-test="openWidget"]');

    try {
      await openButton.waitFor({ state: 'visible', timeout: 15_000 });
    } catch {
      // The external support widget is occasionally not injected on the first load.
      await this.page.reload({ waitUntil: 'domcontentloaded' });
      await openButton.waitFor({ state: 'visible', timeout: 15_000 });
    }

    await openButton.click();
  }

  getPopularArticles(): Locator {
    return this.getWidgetBody()
      .locator('[class^="popularTitle__"] + ul')
      .getByTestId('article-list-item');
  }

  async clickWriteToUs(): Promise<void> {
    await this.getWidgetBody().locator('[data-test="button_feedback_form"]').click();
  }

  getTitle(): Locator {
    return this.getWidgetBody().locator('header').getByRole('heading');
  }

  getWidgetBody(): Locator {
    return this.wrapper().locator('[class^="widgetWrapper"] > [class^="widget__"]');
  }

  async closeWidget(): Promise<void> {
    await this.wrapper().locator('button[class^="closeBtn__"]').click();
  }
}

