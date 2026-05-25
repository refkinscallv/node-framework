'use strict'

const rateLimit = require('express-rate-limit')

/**
 * Rate Limit Helper
 * Factory functions for creating express-rate-limit instances
 */
module.exports = class RateLimit {
    /**
     * Create a rate limiter middleware
     * @param {number} windowMs - Time window in milliseconds (default: 15 minutes)
     * @param {number} max - Max requests per window (default: 100)
     * @param {string} message - Error message sent to client
     * @returns {Function} Express middleware
     *
     * @example
     * const limiter = RateLimit.create(15 * 60 * 1000, 100)
     * Routes.get('/api/data', [limiter], DataController.index)
     */
    static create(windowMs = 15 * 60 * 1000, max = 100, message = 'Too many requests, please try again later') {
        return rateLimit({
            windowMs,
            max,
            standardHeaders: true,
            legacyHeaders: false,
            message: {
                status: false,
                code: 429,
                message,
            },
        })
    }

    /**
     * Strict rate limiter — tighter limits for sensitive endpoints
     * Default: 10 requests per 15 minutes
     * @param {number} max
     * @param {number} windowMs
     * @returns {Function}
     */
    static strict(max = 10, windowMs = 15 * 60 * 1000) {
        return this.create(windowMs, max, 'Too many attempts. Please try again later.')
    }

    /**
     * Generous rate limiter — looser limits for public endpoints
     * Default: 300 requests per 15 minutes
     * @param {number} max
     * @param {number} windowMs
     * @returns {Function}
     */
    static generous(max = 300, windowMs = 15 * 60 * 1000) {
        return this.create(windowMs, max)
    }

    /**
     * Global rate limiter with standard defaults
     * Suitable for applying to entire API
     * @returns {Function}
     */
    static global() {
        return this.create(15 * 60 * 1000, 200)
    }
}
