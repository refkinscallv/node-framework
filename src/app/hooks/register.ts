import Hooks from '@core/hooks';

Hooks.register('system', 'before', async () => {
    console.log('[HOOK] before system');
});

Hooks.register('system', 'after', async () => {
    console.log('[HOOK] after system');
});

Hooks.register('system', 'shutdown', async () => {
    console.log('[HOOK] shutdown system');
});
