# Lifecycle Hooks Flow

Diagram of the framework’s lifecycle execution:

```text
Boot -> Lifecycle Hook (beforeSystem) 
     -> Providers 
     -> Database 
     -> Express 
     -> HTTP Server 
     -> Lifecycle Hook (afterSystem)
     -> Triggering shutdown
     -> Lifecycle Hook (shutdownSystem on exit/SIGINT)
```

## 📂 Hook Registration (`src/app/hooks/register.ts`)

This is the file where all lifecycle hooks should be registered. Use it to execute logic such as initializing external services, logging, or gracefully shutting down connections.

```ts
import FWHooks from '@core/hooks';

FWHooks.register('system', 'before', async () => {
    console.log('[HOOK] before system');
    // Example: Initialize logger, load config, check initial dependencies
    // await Logger.init();
    // await ConfigService.load();
});

FWHooks.register('system', 'after', async () => {
    console.log('[HOOK] after system');
    // Example: Send notifications, record boot time, run health checks
    // await Notifier.send('System booted successfully');
});

FWHooks.register('system', 'shutdown', async () => {
    console.log('[HOOK] shutdown system');
    // Example: Close database connections, flush logs, empty queues
    // await Database.disconnect();
    // await Logger.flush();
});
```

## 🖥️ Terminal Output on Application Start & Shutdown

```bash
[BOOT] Boot the application
[HOOK] before system
[PROVIDERS] Auto-register providers
[DATABASE] Database connected successfully
[DATABASE] Database type is: mysql
[BOOT] Successfully boot the application
[SERVER] Server is running at: http://localhost:3456
[HOOK] after system
[HOOK] shutdown system
[SCOPE] Process terminated (SIGINT)
[SCOPE] Process exited with code: 0
```