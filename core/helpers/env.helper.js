'use strict'

/**
 * Environment Helper
 * Provides easy access to environment variables with type conversion and defaults
 */

require('dotenv').config()

module.exports = class Env {
    /**
     * Get environment variable as string
     * @param {string} key - Environment variable key
     * @param {string} defaultValue - Default value if not set
     * @returns {string}
     *
     * FIX: Gunakan `?? defaultValue` agar nilai '' (empty string) tetap dikembalikan
     * dan tidak di-override oleh defaultValue (bug lama: `||` menyebabkan '' → default)
     */
    static get(key, defaultValue = '') {
        return process.env[key] !== undefined ? process.env[key] : defaultValue
    }

    /**
     * Get environment variable as integer
     * @param {string} key - Environment variable key
     * @param {number} defaultValue - Default value if not found
     * @returns {number}
     */
    static getInt(key, defaultValue = 0) {
        const value = process.env[key]
        if (value === undefined || value === '') return defaultValue
        const parsed = parseInt(value, 10)
        return isNaN(parsed) ? defaultValue : parsed
    }

    /**
     * Get environment variable as float
     * @param {string} key - Environment variable key
     * @param {number} defaultValue - Default value if not found
     * @returns {number}
     */
    static getFloat(key, defaultValue = 0.0) {
        const value = process.env[key]
        if (value === undefined || value === '') return defaultValue
        const parsed = parseFloat(value)
        return isNaN(parsed) ? defaultValue : parsed
    }

    /**
     * Get environment variable as boolean
     * @param {string} key - Environment variable key
     * @param {boolean} defaultValue - Default value if not found
     * @returns {boolean}
     */
    static getBool(key, defaultValue = false) {
        const value = process.env[key]
        if (value === undefined || value === '') return defaultValue
        return value.toLowerCase() === 'true' || value === '1'
    }

    /**
     * Get environment variable as array (comma-separated)
     * @param {string} key - Environment variable key
     * @param {Array} defaultValue - Default value if not found
     * @returns {Array}
     */
    static getArray(key, defaultValue = []) {
        const value = process.env[key]
        if (value === undefined || value === '') return defaultValue
        return value.split(',').map((item) => item.trim()).filter(Boolean)
    }

    /**
     * Get environment variable as parsed JSON
     * @param {string} key - Environment variable key
     * @param {*} defaultValue - Default value if not found or parse fails
     * @returns {*}
     */
    static getJson(key, defaultValue = null) {
        const value = process.env[key]
        if (value === undefined || value === '') return defaultValue
        try {
            return JSON.parse(value)
        } catch {
            return defaultValue
        }
    }

    /**
     * Check if environment variable exists (and is not empty)
     * @param {string} key - Environment variable key
     * @returns {boolean}
     */
    static has(key) {
        return Object.prototype.hasOwnProperty.call(process.env, key)
    }

    /**
     * Check if running in production
     * @returns {boolean}
     */
    static isProduction() {
        return process.env.NODE_ENV === 'production'
    }

    /**
     * Check if running in development
     * @returns {boolean}
     */
    static isDevelopment() {
        return process.env.NODE_ENV === 'development' || !process.env.NODE_ENV
    }

    /**
     * Check if running in test
     * @returns {boolean}
     */
    static isTest() {
        return process.env.NODE_ENV === 'test'
    }

    /**
     * Get all environment variables
     * @returns {Object}
     */
    static all() {
        return process.env
    }
}
