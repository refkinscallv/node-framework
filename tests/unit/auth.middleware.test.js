'use strict'

const JWT = require('../../core/jwt.core')

jest.mock('../../core/logger.core')

// Load auth middleware — uses @app and @core aliases resolved via moduleNameMapper
const AuthMiddleware = require('../../app/http/middlewares/auth.middleware')

function makeResMock() {
    const res = {}
    res.status = jest.fn().mockReturnValue(res)
    res.json = jest.fn().mockReturnValue(res)
    return res
}

describe('Auth Middleware', () => {
    const payload = { userId: 1, email: 'test@example.com', role: 'admin', permissions: ['post:delete'] }
    let validToken

    beforeAll(() => {
        validToken = JWT.sign(payload, '1h')
    })

    // ── authenticate ─────────────────────────────────────────────────────
    describe('authenticate', () => {
        test('should call next() and attach user when token is valid', () => {
            const req = { headers: { authorization: `Bearer ${validToken}` } }
            const res = makeResMock()
            const next = jest.fn()

            AuthMiddleware.authenticate(req, res, next)

            expect(next).toHaveBeenCalledTimes(1)
            expect(req.user).toBeDefined()
            expect(req.user.userId).toBe(payload.userId)
        })

        test('should return 401 when Authorization header is missing', () => {
            const req = { headers: {} }
            const res = makeResMock()
            const next = jest.fn()

            AuthMiddleware.authenticate(req, res, next)

            expect(next).not.toHaveBeenCalled()
            expect(res.status).toHaveBeenCalledWith(401)
        })

        test('should return 401 when token is invalid', () => {
            const req = { headers: { authorization: 'Bearer bad.token.here' } }
            const res = makeResMock()
            const next = jest.fn()

            AuthMiddleware.authenticate(req, res, next)

            expect(next).not.toHaveBeenCalled()
            expect(res.status).toHaveBeenCalledWith(401)
        })

        test('should return 401 when header does not start with Bearer', () => {
            const req = { headers: { authorization: `Token ${validToken}` } }
            const res = makeResMock()
            const next = jest.fn()

            AuthMiddleware.authenticate(req, res, next)

            expect(next).not.toHaveBeenCalled()
            expect(res.status).toHaveBeenCalledWith(401)
        })
    })

    // ── optional ─────────────────────────────────────────────────────────
    describe('optional', () => {
        test('should set req.user and call next() when token is valid', () => {
            const req = { headers: { authorization: `Bearer ${validToken}` } }
            const res = makeResMock()
            const next = jest.fn()

            AuthMiddleware.optional(req, res, next)

            expect(next).toHaveBeenCalledTimes(1)
            expect(req.user).toBeDefined()
            expect(req.user.userId).toBe(payload.userId)
        })

        test('should set req.user = null and call next() when no header', () => {
            const req = { headers: {} }
            const res = makeResMock()
            const next = jest.fn()

            AuthMiddleware.optional(req, res, next)

            expect(next).toHaveBeenCalledTimes(1)
            expect(req.user).toBeNull()
        })

        test('should set req.user = null when token is invalid', () => {
            const req = { headers: { authorization: 'Bearer invalid.token' } }
            const res = makeResMock()
            const next = jest.fn()

            AuthMiddleware.optional(req, res, next)

            expect(next).toHaveBeenCalledTimes(1)
            expect(req.user).toBeNull()
        })
    })

    // ── role ─────────────────────────────────────────────────────────────
    describe('role', () => {
        test('should call next() when user has required role', () => {
            const req = { user: { ...payload } }
            const res = makeResMock()
            const next = jest.fn()

            AuthMiddleware.role('admin')(req, res, next)

            expect(next).toHaveBeenCalledTimes(1)
        })

        test('should return 403 when user role does not match', () => {
            const req = { user: { ...payload, role: 'viewer' } }
            const res = makeResMock()
            const next = jest.fn()

            AuthMiddleware.role('admin', 'editor')(req, res, next)

            expect(next).not.toHaveBeenCalled()
            expect(res.status).toHaveBeenCalledWith(403)
        })

        test('should return 401 when req.user is not set', () => {
            const req = {}
            const res = makeResMock()
            const next = jest.fn()

            AuthMiddleware.role('admin')(req, res, next)

            expect(next).not.toHaveBeenCalled()
            expect(res.status).toHaveBeenCalledWith(401)
        })

        test('should accept multiple allowed roles', () => {
            const req = { user: { ...payload, role: 'editor' } }
            const res = makeResMock()
            const next = jest.fn()

            AuthMiddleware.role('admin', 'editor')(req, res, next)

            expect(next).toHaveBeenCalledTimes(1)
        })
    })

    // ── can ───────────────────────────────────────────────────────────────
    describe('can', () => {
        test('should call next() when user has required permission', () => {
            const req = { user: { ...payload } }
            const res = makeResMock()
            const next = jest.fn()

            AuthMiddleware.can('post:delete')(req, res, next)

            expect(next).toHaveBeenCalledTimes(1)
        })

        test('should return 403 when user lacks permission', () => {
            const req = { user: { ...payload, permissions: ['post:read'] } }
            const res = makeResMock()
            const next = jest.fn()

            AuthMiddleware.can('post:delete')(req, res, next)

            expect(next).not.toHaveBeenCalled()
            expect(res.status).toHaveBeenCalledWith(403)
        })

        test('should return 401 when req.user is not set', () => {
            const req = {}
            const res = makeResMock()
            const next = jest.fn()

            AuthMiddleware.can('post:delete')(req, res, next)

            expect(next).not.toHaveBeenCalled()
            expect(res.status).toHaveBeenCalledWith(401)
        })

        test('should handle user with no permissions array', () => {
            const req = { user: { userId: 1, role: 'viewer' } }
            const res = makeResMock()
            const next = jest.fn()

            AuthMiddleware.can('post:delete')(req, res, next)

            expect(next).not.toHaveBeenCalled()
            expect(res.status).toHaveBeenCalledWith(403)
        })
    })
})
