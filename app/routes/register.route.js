'use strict'

const Logger = require('@core/logger.core')

try {
    Logger.info('routes', 'loading routes...')

    require('@app/routes/web.route')
    require('@app/routes/api.route')

    Logger.info('routes', 'routes loaded successfully')
} catch (err) {
    Logger.set(err, 'routes')
    throw err
}
