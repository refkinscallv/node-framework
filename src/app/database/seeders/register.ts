import Common from '@core/common';

export default async function runSeeders() {
    if (Common.env<string>('DB_SEED', 'off') === 'on') {
        // register here
    }
}
