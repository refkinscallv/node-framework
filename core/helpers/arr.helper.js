'use strict'

/**
 * Array Helper
 * Provides array manipulation utilities
 */

module.exports = class Arr {
    /**
     * Get first element of array
     * FIX: Tambahkan default value jika array kosong (sebelumnya return undefined diam-diam)
     * @param {Array} arr - Input array
     * @param {*} defaultValue - Default if array is empty
     * @returns {*}
     */
    static first(arr, defaultValue = null) {
        if (!Array.isArray(arr) || arr.length === 0) return defaultValue
        return arr[0]
    }

    /**
     * Get last element of array
     * FIX: Tambahkan default value jika array kosong (sebelumnya return undefined diam-diam)
     * @param {Array} arr - Input array
     * @param {*} defaultValue - Default if array is empty
     * @returns {*}
     */
    static last(arr, defaultValue = null) {
        if (!Array.isArray(arr) || arr.length === 0) return defaultValue
        return arr[arr.length - 1]
    }

    /**
     * Flatten array
     * @param {Array} arr - Input array
     * @param {number} depth - Depth to flatten (default: Infinity)
     * @returns {Array}
     */
    static flatten(arr, depth = Infinity) {
        return arr.flat(depth)
    }

    /**
     * Remove duplicates from array
     * @param {Array} arr - Input array
     * @returns {Array}
     */
    static unique(arr) {
        return [...new Set(arr)]
    }

    /**
     * Chunk array into smaller arrays
     * @param {Array} arr - Input array
     * @param {number} size - Chunk size
     * @returns {Array}
     */
    static chunk(arr, size) {
        if (!size || size <= 0) return [arr]
        const chunks = []
        for (let i = 0; i < arr.length; i += size) {
            chunks.push(arr.slice(i, i + size))
        }
        return chunks
    }

    /**
     * Shuffle array (Fisher-Yates)
     * @param {Array} arr - Input array
     * @returns {Array}
     */
    static shuffle(arr) {
        const shuffled = [...arr]
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1))
                ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
        }
        return shuffled
    }

    /**
     * Get random element from array
     * @param {Array} arr - Input array
     * @returns {*}
     */
    static random(arr) {
        if (!Array.isArray(arr) || arr.length === 0) return null
        return arr[Math.floor(Math.random() * arr.length)]
    }

    /**
     * Pluck values from array of objects
     * @param {Array} arr - Array of objects
     * @param {string} key - Key to pluck
     * @returns {Array}
     */
    static pluck(arr, key) {
        return arr.map((item) => item[key])
    }

    /**
     * Group array by key
     * @param {Array} arr - Array of objects
     * @param {string} key - Key to group by
     * @returns {Object}
     */
    static groupBy(arr, key) {
        return arr.reduce((result, item) => {
            const group = item[key]
            result[group] = result[group] || []
            result[group].push(item)
            return result
        }, {})
    }

    /**
     * Sort array by key
     * FIX: Handle equal values (return 0 instead of -1 when equal)
     * @param {Array} arr - Array of objects
     * @param {string} key - Key to sort by
     * @param {string} order - 'asc' or 'desc'
     * @returns {Array}
     */
    static sortBy(arr, key, order = 'asc') {
        return [...arr].sort((a, b) => {
            if (a[key] === b[key]) return 0
            if (order === 'asc') {
                return a[key] > b[key] ? 1 : -1
            }
            return a[key] < b[key] ? 1 : -1
        })
    }

    /**
     * Check if array is empty
     * FIX: Validasi input — jika bukan array, kembalikan true
     * @param {*} arr - Input value
     * @returns {boolean}
     */
    static isEmpty(arr) {
        return !Array.isArray(arr) || arr.length === 0
    }

    /**
     * Wrap value in array if not already an array
     * @param {*} value - Value to wrap
     * @returns {Array}
     */
    static wrap(value) {
        if (value === null || value === undefined) return []
        return Array.isArray(value) ? value : [value]
    }

    /**
     * Difference between two arrays (items in arr1 not in arr2)
     * @param {Array} arr1 - First array
     * @param {Array} arr2 - Second array
     * @returns {Array}
     */
    static diff(arr1, arr2) {
        return arr1.filter((item) => !arr2.includes(item))
    }

    /**
     * Intersection of two arrays
     * @param {Array} arr1 - First array
     * @param {Array} arr2 - Second array
     * @returns {Array}
     */
    static intersect(arr1, arr2) {
        return arr1.filter((item) => arr2.includes(item))
    }

    /**
     * Compact array — remove falsy values
     * @param {Array} arr - Input array
     * @returns {Array}
     */
    static compact(arr) {
        return arr.filter(Boolean)
    }

    /**
     * Sum values in array (or by key for object arrays)
     * @param {Array} arr - Input array
     * @param {string|null} key - Key for object arrays
     * @returns {number}
     */
    static sum(arr, key = null) {
        return arr.reduce((total, item) => {
            return total + (key !== null ? (item[key] ?? 0) : item)
        }, 0)
    }
}
