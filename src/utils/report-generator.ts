import { execSync } from 'child_process';

import { logger } from './logger';

export class ReportGenerator {
    static mergeReports(reportDir: string = './blob-reports') {
        try {
            logger.info('Merging reports...');
            execSync(`npx playwright merge-reports --reporter html ${reportDir}`, {
                stdio: 'inherit',
            });
            logger.info('Reports merged successfully.');
        } catch (error) {
            logger.error(`Failed to merge reports: ${error}`);
        }
    }

    static generateSummary() {
        // Placeholder for custom summary generation if needed
        logger.info('Generating custom summary...');
    }
}
