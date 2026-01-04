'use strict'

const Logger = require('@core/logger.core')

try {
    Logger.info('routes', 'loading routes...')

    require('./web.route')

    Logger.info('routes', 'routes loaded successfully')
} catch (err) {
    Logger.set(err, 'routes')
    throw err
}
