/**
 * packages
 */
import FWCommon from '@core/common';

/**
 * seeder
 */

export default async function runSeeders() {
    if (FWCommon.env<string>('DB_SEED', 'off') === 'on') {
        // await userSeeder();
    }
}
