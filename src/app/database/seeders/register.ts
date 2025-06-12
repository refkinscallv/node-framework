import Common from '@core/common';

// define seeders here
// import SampleSeeder from '@app/database/seeders/sample.seeder';

export default async function runSeeders() {
    if (Common.env<string>('DB_SEED', 'off') === 'on') {
        // register here
        // await SampleSeeder();
    }
}
