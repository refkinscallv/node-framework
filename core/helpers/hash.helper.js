'use strict'

/**
 * Hash Helper
 * Provides hashing and encryption utilities
 */

const bcrypt = require('bcrypt')
const crypto = require('crypto')
const md5 = require('md5')
// FIX: Pindahkan require ke top-level — sebelumnya di-require di dalam method,
// artinya module resolution terjadi setiap kali method dipanggil (performance issue)
const { v4: uuidv4 } = require('uuid')
const uniqid = require('uniqid')

module.exports = class Hash {
    /**
     * Hash a value using bcrypt
     * @param {string} value - Value to hash
     * @param {number} rounds - Salt rounds (default: 10)
     * @returns {Promise<string>}
     */
    static async make(value, rounds = 10) {
        return await bcrypt.hash(String(value), rounds)
    }

    /**
     * Check if value matches hash
     * @param {string} value - Plain value
     * @param {string} hash - Hashed value
     * @returns {Promise<boolean>}
     */
    static async check(value, hash) {
        return await bcrypt.compare(String(value), hash)
    }

    /**
     * Generate MD5 hash
     * @param {string} value - Value to hash
     * @returns {string}
     */
    static md5(value) {
        return md5(String(value))
    }

    /**
     * Generate SHA256 hash
     * @param {string} value - Value to hash
     * @returns {string}
     */
    static sha256(value) {
        return crypto.createHash('sha256').update(String(value)).digest('hex')
    }

    /**
     * Generate SHA512 hash
     * @param {string} value - Value to hash
     * @returns {string}
     */
    static sha512(value) {
        return crypto.createHash('sha512').update(String(value)).digest('hex')
    }

    /**
     * Generate cryptographically secure random hex string
     * @param {number} length - Number of bytes (output is 2x as hex)
     * @returns {string}
     */
    static random(length = 32) {
        return crypto.randomBytes(length).toString('hex')
    }

    /**
     * Generate UUID v4
     * @returns {string}
     */
    static uuid() {
        return uuidv4()
    }

    /**
     * Generate unique ID
     * @param {string} prefix - Optional prefix
     * @returns {string}
     */
    static uniqueId(prefix = '') {
        return uniqid(prefix)
    }

    /**
     * Create HMAC signature
     * @param {string} value - Value to sign
     * @param {string} secret - Secret key
     * @param {string} algorithm - Hash algorithm (default: sha256)
     * @returns {string}
     */
    static hmac(value, secret, algorithm = 'sha256') {
        return crypto.createHmac(algorithm, secret).update(String(value)).digest('hex')
    }
}
