'use strict'

/**
 * Boot Core Module
 * Responsible for initializing and starting the application
 * Manages the boot sequence and graceful shutdown
 */

const Runtime = require('@core/runtime.core')
const Logger = require('@core/logger.core')
const Database = require('@core/database.core')
const Express = require('@core/express.core')
const Server = require('@core/server.core')
const Socket = require('@core/socket.core')
const Hooks = require('@core/hooks.core')
const ErrorHandler = require('@core/errorHandler.core')
const config = require('@app/config')

module.exports = class Boot {
    /**
     * Start the application
     * Initializes all core modules in the correct order
     */
    static async start() {
        try {
            Logger.info('boot', 'Starting application...')

            // Set runtime environment
            Runtime.init()

            // Run before hooks
            await Hooks.run('before')

            // Initialize database if enabled
            if (config.database.status) {
                await Database.init()
            }

            // Initialize express application
            Express.init()

            // Initialize error handler
            ErrorHandler.init(Express.app)

            // Create HTTP/HTTPS server
            const server = Server.create(Express.app)

            // Initialize Socket.IO
            Socket.init(server)

            // Start listening for requests
            await Server.listen(server, config.app.port)

            // Run after hooks
            await Hooks.run('after')

            Logger.info('boot', `Application started successfully on ${config.app.url}`)

            // Setup graceful shutdown handlers
            this.#handleShutdown(server)
        } catch (err) {
            Logger.error('boot', `Failed to start application: ${err.message}`)
            process.exit(1)
        }
    }

    /**
     * Handle graceful shutdown
     * Closes all connections and cleans up resources
     * @param {Object} server - HTTP/HTTPS server instance
     * @private
     */
    static #handleShutdown(server) {
        const gracefulShutdown = async (signal) => {
            Logger.info('boot', `${signal} received, shutting down gracefully...`)

            // Run shutdown hooks
            await Hooks.run('shutdown')

            // Close server
            server.close(() => {
                Logger.info('boot', 'Server closed')
                Database.close()
                process.exit(0)
            })

            // Force shutdown after timeout
            setTimeout(() => {
                Logger.error('boot', 'Forced shutdown after timeout')
                process.exit(1)
            }, 10000)
        }

        // Listen for termination signals
        process.on('SIGTERM', () => gracefulShutdown('SIGTERM'))
        process.on('SIGINT', () => gracefulShutdown('SIGINT'))
    }
}
