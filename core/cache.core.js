'use strict'

/**
 * Cache Core Module
 * Simple in-memory key-value store with optional TTL (time-to-live)
 * Useful for caching database results, API responses, computed values, etc.
 */

module.exports = class Cache {
    static #store = new Map()
    static #timers = new Map()

    /**
     * Store a value with optional TTL
     * @param {string} key - Cache key
     * @param {*} value - Value to cache
     * @param {number} ttl - Time to live in seconds (0 = no expiry)
     */
    static set(key, value, ttl = 0) {
        this.#clearTimer(key)
        this.#store.set(key, value)

        if (ttl > 0) {
            const timer = setTimeout(() => this.delete(key), ttl * 1000)
            this.#timers.set(key, timer)
        }
    }

    /**
     * Retrieve a cached value
     * @param {string} key - Cache key
     * @param {*} defaultValue - Returned if key not found
     * @returns {*}
     */
    static get(key, defaultValue = null) {
        return this.#store.has(key) ? this.#store.get(key) : defaultValue
    }

    /**
     * Check if a key exists in cache
     * @param {string} key
     * @returns {boolean}
     */
    static has(key) {
        return this.#store.has(key)
    }

    /**
     * Delete a cached entry
     * @param {string} key
     * @returns {boolean}
     */
    static delete(key) {
        this.#clearTimer(key)
        return this.#store.delete(key)
    }

    /**
     * Clear all cached entries and cancel all timers
     */
    static flush() {
        this.#timers.forEach((timer) => clearTimeout(timer))
        this.#timers.clear()
        this.#store.clear()
    }

    /**
     * Number of cached entries
     * @returns {number}
     */
    static size() {
        return this.#store.size
    }

    /**
     * All cached keys
     * @returns {string[]}
     */
    static keys() {
        return [...this.#store.keys()]
    }

    /**
     * Get or compute and cache a value (sync)
     * Returns cached value if key exists, otherwise calls callback, caches and returns result
     * @param {string} key
     * @param {number} ttl - TTL in seconds
     * @param {Function} callback - Produces the value if cache miss
     * @returns {*}
     */
    static remember(key, ttl, callback) {
        if (this.has(key)) return this.get(key)
        const value = callback()
        this.set(key, value, ttl)
        return value
    }

    /**
     * Get or compute and cache a value (async)
     * @param {string} key
     * @param {number} ttl - TTL in seconds
     * @param {Function} callback - Async function that produces the value
     * @returns {Promise<*>}
     */
    static async rememberAsync(key, ttl, callback) {
        if (this.has(key)) return this.get(key)
        const value = await callback()
        this.set(key, value, ttl)
        return value
    }

    /**
     * Store a value only if the key does not already exist
     * @param {string} key
     * @param {*} value
     * @param {number} ttl
     * @returns {boolean} true if stored, false if key already existed
     */
    static add(key, value, ttl = 0) {
        if (this.has(key)) return false
        this.set(key, value, ttl)
        return true
    }

    /**
     * Retrieve and immediately delete a cached value
     * @param {string} key
     * @param {*} defaultValue
     * @returns {*}
     */
    static pull(key, defaultValue = null) {
        const value = this.get(key, defaultValue)
        this.delete(key)
        return value
    }

    /**
     * Increment a numeric cached value
     * @param {string} key
     * @param {number} amount
     * @returns {number} new value
     */
    static increment(key, amount = 1) {
        const current = this.get(key, 0)
        const next = Number(current) + amount
        this.set(key, next)
        return next
    }

    /**
     * Decrement a numeric cached value
     * @param {string} key
     * @param {number} amount
     * @returns {number} new value
     */
    static decrement(key, amount = 1) {
        return this.increment(key, -amount)
    }

    /** @private */
    static #clearTimer(key) {
        if (this.#timers.has(key)) {
            clearTimeout(this.#timers.get(key))
            this.#timers.delete(key)
        }
    }
}
