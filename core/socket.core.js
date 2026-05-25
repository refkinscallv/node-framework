'use strict'

/**
 * Socket Core Module
 * Manages Socket.IO server initialization and configuration
 * Handles real-time WebSocket connections
 */

const { Server } = require('socket.io')
const config = require('@app/config')
const Logger = require('@core/logger.core')

module.exports = class Socket {
    /**
     * Socket.IO server instance
     * @static
     */
    static io = null

    /**
     * Initialize Socket.IO server
     * Attaches Socket.IO to the HTTP/HTTPS server
     * @param {Object} server - HTTP/HTTPS server instance
     * @static
     */
    static init(server) {
        try {
            Logger.info('socket', 'Initializing Socket.IO...')

            // Create Socket.IO server with configuration
            this.io = new Server(server, config.socket.options)

            // Setup JWT authentication middleware if enabled
            if (config.socket.auth && config.socket.auth.enabled) {
                this.#setupAuth()
            }

            // Load socket event handlers
            this.#loadSockets()

            Logger.info('socket', 'Socket.IO initialized successfully')
        } catch (err) {
            Logger.set(err, 'socket')
            throw err
        }
    }

    /**
     * Setup JWT authentication middleware for Socket.IO
     * Validates token from handshake auth or Authorization header
     * Sets socket.user = decoded payload on success
     * @private
     * @static
     */
    static #setupAuth() {
        const JWT = require('@core/jwt.core')
        const authConfig = config.socket.auth

        this.io.use((socket, next) => {
            const token =
                socket.handshake.auth?.token ||
                socket.handshake.headers?.authorization?.replace(/^Bearer\s+/i, '')

            if (!token) {
                return next(new Error(authConfig.errorMessage || 'Authentication required'))
            }

            const decoded = JWT.verify(token)
            if (!decoded) {
                return next(new Error('Invalid or expired token'))
            }

            socket.user = decoded
            next()
        })

        Logger.info('socket', 'Socket.IO JWT authentication middleware registered')
    }

    /**
     * Load socket event handlers from application
     * @private
     * @static
     */
    static #loadSockets() {
        try {
            // Load socket handlers from app/sockets/register.socket.js
            const socketRegister = require('@app/sockets/register.socket')
            if (socketRegister && typeof socketRegister.register === 'function') {
                socketRegister.register(this.io)
                Logger.info('socket', 'Socket handlers registered successfully')
            } else {
                Logger.warn('socket', 'Socket register file found but no register function exported')
            }
        } catch (err) {
            if (err.code === 'MODULE_NOT_FOUND') {
                Logger.warn('socket', 'No socket handlers file found (app/sockets/register.socket.js)')
            } else {
                Logger.error('socket', `Failed to load socket handlers: ${err.message}`)
                Logger.set(err, 'socket')
            }
        }
    }

    /**
     * Get Socket.IO server instance
     * @returns {Object} Socket.IO server instance
     * @static
     */
    static getInstance() {
        return this.io
    }

    /**
     * Close Socket.IO server gracefully
     * Should be called during application shutdown
     * @returns {Promise<void>}
     * @static
     */
    static async close() {
        if (this.io) {
            return new Promise((resolve) => {
                this.io.close(() => {
                    Logger.info('socket', 'Socket.IO server closed')
                    this.io = null
                    resolve()
                })
            })
        }
    }
}
