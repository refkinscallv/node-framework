import Hooks from '@core/hooks';

// define hooks here
// import SampleHook from '@app/hooks/sample.hook';

Hooks.register('system', 'before', async () => {
    console.log('[HOOK] before system');
});

Hooks.register('system', 'after', async () => {
    console.log('[HOOK] after system');

    // execute sample hook
    // SampleHook();
});

Hooks.register('system', 'shutdown', async () => {
    console.log('[HOOK] shutdown system');
});
