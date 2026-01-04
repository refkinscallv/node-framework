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

            // Load socket event handlers
            this.#loadSockets()

            Logger.info('socket', 'Socket.IO initialized successfully')
        } catch (err) {
            Logger.set(err, 'socket')
            throw err
        }
    }

    /**
     * Load socket event handlers from application
     * @private
     * @static
     */
    static #loadSockets() {
        try {
            // Load socket handlers from app/sockets/register.socket.js
            require('@app/sockets/register.socket').register(this.io)
        } catch (err) {
            Logger.warn('socket', 'No socket handlers registered or failed to load')
            Logger.set(err, 'socket')
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
}
