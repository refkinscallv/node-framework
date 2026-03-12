'use strict'

/**
 * Server Core Module
 * Manages HTTP/HTTPS server creation and lifecycle
 * Handles server listening and port binding
 */

const http = require('http')
const https = require('https')
const fs = require('fs')
const config = require('@app/config')
const Logger = require('@core/logger.core')

module.exports = class Server {
    /**
     * Create HTTP or HTTPS server
     * Based on configuration, creates either HTTP or HTTPS server
     * FIX: Hilangkan passing config.server.options ke http.createServer()
     * karena field-nya (poweredBy, maxHeaderSize, dll) bukan valid HTTP server options
     * @param {Object} app - Express application instance
     * @returns {Object} HTTP/HTTPS server instance
     * @static
     */
    static create(app) {
        try {
            Logger.info('server', 'Creating server...')

            // Create HTTPS server if enabled in config
            if (config.server.https) {
                const options = {
                    cert: fs.readFileSync(config.server.ssl.cert),
                    key: fs.readFileSync(config.server.ssl.key),
                }
                Logger.info('server', 'HTTPS server created')
                return https.createServer(options, app)
            }

            // FIX: http.createServer() tidak menerima options seperti poweredBy, maxHeaderSize.
            // Tidak ada opsi yang perlu di-pass; biarkan http.createServer() dengan default-nya.
            Logger.info('server', 'HTTP server created')
            return http.createServer(app)
        } catch (err) {
            Logger.set(err, 'server')
            throw err
        }
    }

    /**
     * Start server listening on specified port
     * Binds server to port and starts accepting connections
     * @param {Object} server - HTTP/HTTPS server instance
     * @param {number} port - Port number to listen on
     * @param {string} host - Host to bind (default: all interfaces)
     * @returns {Promise<void>}
     * @static
     */
    static listen(server, port, host = '0.0.0.0') {
        return new Promise((resolve, reject) => {
            // Handle server errors
            server.once('error', (err) => {
                Logger.set(err, 'server')
                reject(err)
            })

            // Start listening
            server.listen(port, host, () => {
                Logger.info('server', `Server listening on ${host}:${port}`)
                resolve()
            })
        })
    }

    /**
     * Apply server-level settings after creation
     * (keepAliveTimeout, requestTimeout, headersTimeout)
     * @param {Object} server - HTTP/HTTPS server instance
     * @static
     */
    static applyOptions(server) {
        const opts = config.server.options || {}
        if (opts.keepAliveTimeout !== undefined) {
            server.keepAliveTimeout = opts.keepAliveTimeout
        }
        if (opts.requestTimeout !== undefined) {
            server.requestTimeout = opts.requestTimeout
        }
        if (opts.headersTimeout !== undefined) {
            server.headersTimeout = opts.headersTimeout
        }
    }
}
