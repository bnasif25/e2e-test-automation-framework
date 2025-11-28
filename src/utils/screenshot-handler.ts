import { Page } from '@playwright/test';
import path from 'path';
import { logger } from './logger';

export class ScreenshotHandler {
    static async takeScreenshot(page: Page, name: string) {
        try {
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const screenshotPath = path.join(
                process.cwd(),
                'test-results',
                'screenshots',
                `${name}-${timestamp}.png`
            );

            await page.screenshot({ path: screenshotPath, fullPage: true });
            logger.info(`Screenshot saved: ${screenshotPath}`);
        } catch (error) {
            logger.error(`Failed to take screenshot: ${error}`);
        }
    }
}
