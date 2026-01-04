'use strict'

const Logger = require('@core/logger.core')

module.exports = {
    register(io) {
        Logger.info('socket', 'registering socket handlers...')

        Logger.info('socket', 'socket handlers registered')
    },
}
