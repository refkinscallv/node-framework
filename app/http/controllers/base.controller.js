'use strict'

module.exports = class BaseController {
    /**
     * Universal JSON response builder
     * Bisa menerima output langsung dari BaseService.json() atau parameter manual
     * @param {Object} res - Express response object
     * @param {boolean|Object} statusOrOutput - true/false atau object dari Service
     * @param {number} code - HTTP status code
     * @param {string} message - Response message
     * @param {*} data - Response data
     * @param {Object} custom - Extra fields untuk di-merge ke response
     */
    static json(res, statusOrOutput, code = 200, message = '', data = {}, custom = {}) {
        let response = {}

        if (typeof statusOrOutput === 'object' && statusOrOutput !== null) {
            const serviceOutput = statusOrOutput

            response = {
                status: serviceOutput.status ?? true,
                code: serviceOutput.code ?? 200,
                message: serviceOutput.message ?? '',
                data: serviceOutput.data ?? {},
                ...serviceOutput.custom,
            }

            return res.status(serviceOutput.code ?? 200).json(response)
        }

        response = {
            status: statusOrOutput ?? true,
            code: code ?? 200,
            message: message ?? '',
            data: data ?? {},
            ...custom,
        }

        return res.status(code ?? 200).json(response)
    }

    static success(res, message = 'Success', data = {}, code = 200) {
        return this.json(res, true, code, message, data)
    }

    static error(res, message = 'Error', code = 400, data = {}) {
        return this.json(res, false, code, message, data)
    }

    static validationError(res, validation) {
        return this.json(res, false, 422, validation.error, {}, {
            errors: validation.errors,
        })
    }

    static notFound(res, message = 'Resource not found') {
        return this.json(res, false, 404, message)
    }

    static unauthorized(res, message = 'Unauthorized') {
        return this.json(res, false, 401, message)
    }

    static forbidden(res, message = 'Forbidden') {
        return this.json(res, false, 403, message)
    }

    static serverError(res, message = 'Internal server error') {
        return this.json(res, false, 500, message)
    }

    static created(res, message = 'Created successfully', data = {}) {
        return this.json(res, true, 201, message, data)
    }

    static noContent(res) {
        return res.status(204).send()
    }

    /**
     * Async error wrapper untuk controller methods
     * Menghilangkan kebutuhan try/catch berulang di setiap method
     *
     * @param {Function} fn - Async controller function
     * @returns {Function} Express middleware function
     *
     * @example
     * // Sebelum (harus tulis try/catch):
     * static async getAll(req, res) {
     *     try { ... } catch(e) { return this.serverError(res, e.message) }
     * }
     *
     * // Sesudah (lebih simple):
     * static getAll = BaseController.handle(async (req, res) => {
     *     const result = await UserService.getAll()
     *     return BaseController.json(res, result)
     * })
     */
    static handle(fn) {
        return async (req, res, next) => {
            try {
                await fn(req, res, next)
            } catch (err) {
                next(err)
            }
        }
    }

    /**
     * Paginated response helper
     * @param {Object} res - Express response object
     * @param {Array} items - Data items
     * @param {Object} meta - Pagination metadata (total, page, limit, etc.)
     * @param {string} message - Response message
     */
    static paginated(res, items, meta = {}, message = 'Success') {
        return this.json(res, true, 200, message, items, { meta })
    }
}
