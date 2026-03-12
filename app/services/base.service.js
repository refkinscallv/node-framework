'use strict'

module.exports = class BaseService {
    /**
     * Universal response builder (kompatibel dengan BaseController.json())
     * @param {boolean} status - Success/fail status
     * @param {number} code - HTTP status code
     * @param {string} message - Response message
     * @param {*} data - Response data
     * @param {Object} custom - Extra fields
     * @returns {Object}
     */
    static json(status = true, code = 200, message = '', data = {}, custom = {}) {
        return { status, code, message, data, custom }
    }

    /**
     * Success response (200)
     * @param {string} message
     * @param {*} data
     * @param {Object} custom
     * @returns {Object}
     */
    static success(message = 'Success', data = {}, custom = {}) {
        return this.json(true, 200, message, data, custom)
    }

    /**
     * Created response (201)
     * @param {string} message
     * @param {*} data
     * @returns {Object}
     */
    static created(message = 'Created successfully', data = {}) {
        return this.json(true, 201, message, data)
    }

    /**
     * Fail response (generic, default 400)
     * @param {string} message
     * @param {number} code
     * @param {*} data
     * @param {Object} custom
     * @returns {Object}
     */
    static fail(message = 'Error', code = 400, data = {}, custom = {}) {
        return this.json(false, code, message, data, custom)
    }

    /**
     * Not Found response (404)
     * @param {string} message
     * @returns {Object}
     */
    static notFound(message = 'Resource not found') {
        return this.json(false, 404, message)
    }

    /**
     * Unauthorized response (401)
     * @param {string} message
     * @returns {Object}
     */
    static unauthorized(message = 'Unauthorized') {
        return this.json(false, 401, message)
    }

    /**
     * Forbidden response (403)
     * @param {string} message
     * @returns {Object}
     */
    static forbidden(message = 'Forbidden') {
        return this.json(false, 403, message)
    }

    /**
     * Conflict response (409) — untuk duplikat data
     * @param {string} message
     * @returns {Object}
     */
    static conflict(message = 'Conflict') {
        return this.json(false, 409, message)
    }

    /**
     * Validation error response (422)
     * @param {string} message
     * @param {Array} errors - Array of validation error objects
     * @returns {Object}
     */
    static validationFail(message = 'Validation error', errors = []) {
        return this.json(false, 422, message, {}, { errors })
    }

    /**
     * Server error response (500)
     * @param {string} message
     * @returns {Object}
     */
    static serverError(message = 'Internal server error') {
        return this.json(false, 500, message)
    }
}
