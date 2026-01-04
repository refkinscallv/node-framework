'use strict'

const Logger = require('@core/logger.core')

module.exports = {
    register(Hooks) {
        Logger.info('hooks', 'registering application hooks...')

        // Before hooks
        Hooks.register('before', async () => {
            Logger.info('hooks', 'executing before hooks...')
            // Add your before initialization logic here
        })

        // After hooks
        Hooks.register('after', async () => {
            Logger.info('hooks', 'executing after hooks...')
            // Add your after initialization logic here
        })

        // Shutdown hooks
        Hooks.register('shutdown', async () => {
            Logger.info('hooks', 'executing shutdown hooks...')
            // Add your cleanup logic here
        })

        Logger.info('hooks', 'application hooks registered')
    },
}
