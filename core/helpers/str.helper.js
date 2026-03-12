'use strict'

/**
 * String Helper
 * Provides string manipulation utilities
 */

module.exports = class Str {
    /**
     * Convert string to camelCase
     * FIX: Handle _, -, dan space sebagai separator (sebelumnya hanya space)
     * @param {string} str - Input string
     * @returns {string}
     */
    static camelCase(str) {
        return str
            .replace(/[-_\s]+(.)/g, (_, char) => char.toUpperCase())
            .replace(/^(.)/, (char) => char.toLowerCase())
    }

    /**
     * Convert string to snake_case
     * @param {string} str - Input string
     * @returns {string}
     */
    static snakeCase(str) {
        return str
            .replace(/[-\s]+/g, '_')
            .replace(/([a-z])([A-Z])/g, '$1_$2')
            .toLowerCase()
    }

    /**
     * Convert string to kebab-case
     * @param {string} str - Input string
     * @returns {string}
     */
    static kebabCase(str) {
        return str
            .replace(/[_\s]+/g, '-')
            .replace(/([a-z])([A-Z])/g, '$1-$2')
            .toLowerCase()
    }

    /**
     * Convert string to Title Case
     * @param {string} str - Input string
     * @returns {string}
     */
    static titleCase(str) {
        return str.replace(/\w\S*/g, (txt) => {
            return txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase()
        })
    }

    /**
     * Truncate string to specified length
     * @param {string} str - Input string
     * @param {number} length - Max length
     * @param {string} end - End string (default: '...')
     * @returns {string}
     */
    static truncate(str, length = 100, end = '...') {
        if (!str || str.length <= length) return str
        // FIX: gunakan substring() — substr() sudah deprecated
        return str.substring(0, length - end.length) + end
    }

    /**
     * Generate random string
     * @param {number} length - Length of string
     * @returns {string}
     */
    static random(length = 16) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
        let result = ''
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length))
        }
        return result
    }

    /**
     * Slugify string
     * @param {string} str - Input string
     * @returns {string}
     */
    static slug(str) {
        return str
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '')
    }

    /**
     * Check if string contains substring
     * @param {string} str - Input string
     * @param {string} search - Search string
     * @returns {boolean}
     */
    static contains(str, search) {
        return str.includes(search)
    }

    /**
     * Check if string starts with substring
     * @param {string} str - Input string
     * @param {string} search - Search string
     * @returns {boolean}
     */
    static startsWith(str, search) {
        return str.startsWith(search)
    }

    /**
     * Check if string ends with substring
     * @param {string} str - Input string
     * @param {string} search - Search string
     * @returns {boolean}
     */
    static endsWith(str, search) {
        return str.endsWith(search)
    }

    /**
     * Capitalize first letter
     * @param {string} str - Input string
     * @returns {string}
     */
    static capitalize(str) {
        if (!str) return str
        return str.charAt(0).toUpperCase() + str.slice(1)
    }

    /**
     * Reverse string
     * @param {string} str - Input string
     * @returns {string}
     */
    static reverse(str) {
        return str.split('').reverse().join('')
    }

    /**
     * Repeat string n times
     * @param {string} str - Input string
     * @param {number} times - Number of times to repeat
     * @returns {string}
     */
    static repeat(str, times) {
        return str.repeat(times)
    }

    /**
     * Check if string is empty or only whitespace
     * @param {string} str - Input string
     * @returns {boolean}
     */
    static isEmpty(str) {
        return !str || str.trim().length === 0
    }

    /**
     * Pad string on the left
     * @param {string} str - Input string
     * @param {number} length - Target length
     * @param {string} char - Padding character
     * @returns {string}
     */
    static padLeft(str, length, char = ' ') {
        return String(str).padStart(length, char)
    }

    /**
     * Pad string on the right
     * @param {string} str - Input string
     * @param {number} length - Target length
     * @param {string} char - Padding character
     * @returns {string}
     */
    static padRight(str, length, char = ' ') {
        return String(str).padEnd(length, char)
    }
}
