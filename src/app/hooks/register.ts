import FWHooks from '@core/hooks';

FWHooks.register('system', 'before', async () => {
    console.log('[HOOK] before system');
});

FWHooks.register('system', 'after', async () => {
    console.log('[HOOK] after system');
});

FWHooks.register('system', 'shutdown', async () => {
    console.log('[HOOK] shutdown system');
});
