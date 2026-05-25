'use strict'

const Logger = require('@core/logger.core')

/**
 * Environment Validator
 * Validates required environment variables at application startup
 * Fails fast with a clear error message instead of cryptic runtime errors
 */
module.exports = class EnvValidator {
    /**
     * Validate that all required environment variables are set
     * Throws an error listing all missing keys if any are absent
     * @param {string[]} requiredKeys - Array of required env var names
     * @throws {Error} If one or more required vars are missing
     * @static
     */
    static validate(requiredKeys = []) {
        if (!Array.isArray(requiredKeys) || requiredKeys.length === 0) return

        const missing = requiredKeys.filter((key) => {
            const val = process.env[key]
            return val === undefined || val === ''
        })

        if (missing.length > 0) {
            const msg = `Missing required environment variables: ${missing.join(', ')}`
            Logger.error('env', msg)
            throw new Error(msg)
        }

        Logger.info('env', `Environment validated (${requiredKeys.length} variables OK)`)
    }

    /**
     * Validate using rules defined in app config
     * Reads config.app.requiredEnv if present
     * @static
     */
    static validateFromConfig() {
        try {
            const config = require('@app/config')
            const required = config.app?.requiredEnv || []
            this.validate(required)
        } catch (err) {
            if (err.code !== 'MODULE_NOT_FOUND') throw err
        }
    }
}
