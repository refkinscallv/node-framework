const express = require('express')
const request = require('supertest')
const ErrorHandler = require('../../core/errorHandler.core')

describe('ErrorHandler Core', () => {
    let app

    beforeEach(() => {
        app = express()
        
        // Mock a route that throws an error
        app.get('/api/error', (req, res, next) => {
            const err = new Error('Test API Error')
            err.status = 400
            next(err)
        })

        app.get('/web/error', (req, res, next) => {
            const err = new Error('Test Web Error')
            next(err)
        })

        // Mock render function on prototype
        express.response.render = jest.fn(function(view, data) {
            this.send('RENDERED')
        })

        // Initialize error handler
        ErrorHandler.init(app)
    })

    test('should return 404 for unknown API route', async () => {
        const response = await request(app).get('/api/unknown')
        expect(response.status).toBe(404)
        expect(response.body).toHaveProperty('success', false)
        expect(response.body).toHaveProperty('message', 'Page Not Found')
    })

    test('should return 404 view for unknown web route', async () => {
        const response = await request(app).get('/unknown-page')
        expect(response.status).toBe(404)
        expect(response.text).toBe('RENDERED')
    })

    test('should handle API errors globally', async () => {
        const response = await request(app).get('/api/error')
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('success', false)
        expect(response.body).toHaveProperty('message', 'Test API Error')
    })

    test('should handle Web errors globally', async () => {
        const response = await request(app).get('/web/error')
        expect(response.status).toBe(500)
        expect(response.text).toBe('RENDERED')
    })
})
