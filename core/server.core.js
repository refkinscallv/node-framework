'use strict'

const http = require('http')
const https = require('https')
const net = require('net')
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
     * Find the next available port starting from `port`.
     * Probes each port with a temporary net.Server; increments on EADDRINUSE.
     * @param {number} port - Starting port
     * @param {string} host - Host to probe
     * @param {number} maxAttempts - How many ports to try before giving up
     * @returns {Promise<number>} Available port
     */
    static findAvailablePort(port, host = '0.0.0.0', maxAttempts = 20) {
        return new Promise((resolve, reject) => {
            if (maxAttempts <= 0) {
                return reject(new Error(`No available port found after exhausting ${20} attempts starting from ${port - 20}`))
            }

            const probe = net.createServer()

            probe.once('error', (err) => {
                probe.close()
                if (err.code === 'EADDRINUSE') {
                    resolve(this.findAvailablePort(port + 1, host, maxAttempts - 1))
                } else {
                    reject(err)
                }
            })

            probe.once('listening', () => {
                probe.close(() => resolve(port))
            })

            probe.listen(port, host)
        })
    }

    /**
     * Start server listening on specified port.
     * Auto-increments to the next free port if the configured port is in use.
     * @param {Object} server - HTTP/HTTPS server instance
     * @param {number} port - Preferred port number
     * @param {string} host - Host to bind (default: all interfaces)
     * @returns {Promise<number>} Actual port the server is listening on
     */
    static async listen(server, port, host = '0.0.0.0') {
        const availablePort = await this.findAvailablePort(port, host)

        if (availablePort !== port) {
            Logger.warn('server', `Port ${port} is in use — using port ${availablePort} instead`)
        }

        return new Promise((resolve, reject) => {
            server.once('error', (err) => {
                Logger.set(err, 'server')
                reject(err)
            })

            server.listen(availablePort, host, () => {
                Logger.info('server', `Server listening on ${host}:${availablePort}`)
                resolve(availablePort)
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
