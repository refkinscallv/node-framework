'use strict'

const JWT = require('@core/jwt.core')
const BaseController = require('@app/http/controllers/base.controller')

/**
 * Auth Middleware
 * JWT-based authentication and role-based access control (RBAC)
 */
module.exports = {
    /**
     * Require valid JWT token from Authorization header
     * Attaches decoded payload to req.user
     */
    authenticate(req, res, next) {
        const authHeader = req.headers['authorization']
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return BaseController.unauthorized(res, 'No token provided')
        }

        const token = authHeader.split(' ')[1]
        if (!token) {
            return BaseController.unauthorized(res, 'Malformed authorization header')
        }

        const decoded = JWT.verify(token)
        if (!decoded) {
            return BaseController.unauthorized(res, 'Invalid or expired token')
        }

        req.user = decoded
        next()
    },

    /**
     * Optional JWT authentication — does not block if token is absent
     * If token present and valid: attaches decoded payload to req.user
     * If token absent or invalid: sets req.user = null and continues
     */
    optional(req, res, next) {
        const authHeader = req.headers['authorization']
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            req.user = null
            return next()
        }

        const token = authHeader.split(' ')[1]
        req.user = (token && JWT.verify(token)) || null
        next()
    },

    /**
     * Role-based access control gate
     * Must be used AFTER authenticate middleware
     * @param {...string} roles - Allowed roles (e.g. 'admin', 'editor')
     * @returns {Function} Express middleware
     *
     * @example
     * Routes.get('/admin', [AuthMiddleware.authenticate, AuthMiddleware.role('admin')], AdminController.index)
     */
    role(...roles) {
        return (req, res, next) => {
            if (!req.user) {
                return BaseController.unauthorized(res, 'Authentication required')
            }

            const userRole = req.user.role
            if (!roles.includes(userRole)) {
                return BaseController.forbidden(res, `Access denied. Required role: ${roles.join(' or ')}`)
            }

            next()
        }
    },

    /**
     * Permission-based access control gate
     * Must be used AFTER authenticate middleware
     * Checks req.user.permissions array
     * @param {...string} permissions - Required permissions
     * @returns {Function} Express middleware
     *
     * @example
     * Routes.delete('/posts/:id', [AuthMiddleware.authenticate, AuthMiddleware.can('post:delete')], PostController.destroy)
     */
    can(...permissions) {
        return (req, res, next) => {
            if (!req.user) {
                return BaseController.unauthorized(res, 'Authentication required')
            }

            const userPermissions = req.user.permissions || []
            const hasAll = permissions.every((p) => userPermissions.includes(p))

            if (!hasAll) {
                return BaseController.forbidden(res, `Missing required permission(s): ${permissions.join(', ')}`)
            }

            next()
        }
    },
}
