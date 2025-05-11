import FWExpress from '@core/express';
import FWServer from '@core/server';
import Database from '@core/typeorm';
import FWHooks from '@core/hooks';

class FWBoot {
    public static run() {
        (async () => {
            console.log(`[BOOT] Boot the application`);
            await FWHooks.init('system', 'before');
            Database.init()
                .then(() => {        
                    FWExpress.init();
                    FWServer.init();
                    console.log(`[BOOT] Successfully boot the application`);
                })
                .catch((error: any) => {
                    console.error(`[BOOT] Failed to booting application: ${error}`);
                    process.exit(1);
                });
        })()
    }
}

export default FWBoot;
