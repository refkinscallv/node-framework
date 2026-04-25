const http = require('http')
const express = require('express')
const Socket = require('../../core/socket.core')

jest.mock('../../core/logger.core')
jest.mock('../../app/sockets/register.socket', () => {
    return {
        register: jest.fn()
    }
}, { virtual: true })

describe('Socket Core', () => {
    let server

    beforeEach(() => {
        server = http.createServer(express())
    })

    afterEach(async () => {
        await Socket.close()
    })

    test('should initialize Socket.io', () => {
        Socket.init(server)
        const io = Socket.getInstance()
        expect(io).toBeDefined()
        expect(io.constructor.name).toBe('Server')
    })
})
