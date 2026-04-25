const express = require('express')
const Server = require('../../core/server.core')
const config = require('../../app/config')

jest.mock('../../core/logger.core')

describe('Server Core', () => {
    let app
    let server

    beforeEach(() => {
        app = express()
    })

    afterEach(() => {
        if (server && server.listening) {
            server.close()
        }
    })

    test('should create HTTP server', () => {
        config.server.https = false
        server = Server.create(app)
        expect(server).toBeDefined()
        expect(server.constructor.name).toBe('Server')
    })

    test('should apply server options', () => {
        server = Server.create(app)
        config.server.options = { keepAliveTimeout: 9999 }
        Server.applyOptions(server)
        expect(server.keepAliveTimeout).toBe(9999)
    })
})
