import FWHooks from '@core/hooks';
import FWContainer from '@core/di/container';
import path from 'path';

FWHooks.register('system', 'before', async () => {
    console.log('[HOOK] before system');

    // Load Providers File
    FWContainer.registerProviders(path.join(__dirname, '../providers'));
});

FWHooks.register('system', 'after', async () => {
    console.log('[HOOK] after system');
    // todo
});


FWHooks.register('system', 'shutdown', async () => {
    console.log('[HOOK] shutdown system');
    // todo
});
