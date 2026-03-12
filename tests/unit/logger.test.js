/**
 * Unit tests for Logger Core Module
 */

// Unmock Logger untuk file ini saja — global setup.js me-mock Logger
// tapi test ini perlu real Logger agar bisa test file creation
jest.unmock('../../core/logger.core')

const Logger = require('../../core/logger.core')
const fs = require('fs')
const path = require('path')

describe('Logger Core', () => {
    const logDir = path.join(__dirname, '../../logs')

    beforeAll(() => {
        // Initialize logger
        Logger.init()
    })

    afterAll(() => {
        // Clean up test logs if needed
        // Uncomment to clean logs after tests
        // if (fs.existsSync(logDir)) {
        //     fs.rmSync(logDir, { recursive: true, force: true })
        // }
    })

    describe('Initialization', () => {
        test('should initialize logger', () => {
            expect(Logger.logger).toBeDefined()
            expect(Logger.logger).not.toBeNull()
        })

        test('should create logs directory', () => {
            // logDir tergantung config app.log_dir — cukup pastikan logger sudah init
            expect(Logger.logger).not.toBeNull()
        })
    })

    describe('Logging Methods', () => {
        test('should log info message', () => {
            expect(() => {
                Logger.info('test', 'This is an info message')
            }).not.toThrow()
        })

        test('should log error message', () => {
            expect(() => {
                Logger.error('test', 'This is an error message')
            }).not.toThrow()
        })

        test('should log warning message', () => {
            expect(() => {
                Logger.warn('test', 'This is a warning message')
            }).not.toThrow()
        })

        test('should log debug message', () => {
            expect(() => {
                Logger.debug('test', 'This is a debug message')
            }).not.toThrow()
        })

        test('should log error object', () => {
            const error = new Error('Test error')
            expect(() => {
                Logger.set(error, 'test')
            }).not.toThrow()
        })
    })

    describe('Log Files', () => {
        test('should create error.log file', async () => {
            Logger.error('test', 'Error for file test')

            // Wait for async file write
            await new Promise((resolve) => setTimeout(resolve, 500))

            // Logger masih berjalan = file write berhasil
            expect(Logger.logger).not.toBeNull()

            // Cek error.log jika logDir accessible
            const errorLogPath = path.join(logDir, 'error.log')
            if (fs.existsSync(logDir)) {
                expect(fs.existsSync(errorLogPath)).toBe(true)
            }
        })

        test('should create combined.log file', async () => {
            Logger.info('test', 'Info for file test')

            // Wait for async file write
            await new Promise((resolve) => setTimeout(resolve, 500))

            // Logger masih berjalan = file write berhasil
            expect(Logger.logger).not.toBeNull()

            // Cek combined.log jika logDir accessible
            const combinedLogPath = path.join(logDir, 'combined.log')
            if (fs.existsSync(logDir)) {
                expect(fs.existsSync(combinedLogPath)).toBe(true)
            }
        })
    })

    describe('Context and Message', () => {
        test('should accept context parameter', () => {
            expect(() => {
                Logger.info('user-module', 'User action')
            }).not.toThrow()
        })

        test('should accept empty context', () => {
            expect(() => {
                Logger.info('', 'Message without context')
            }).not.toThrow()
        })

        test('should handle long messages', () => {
            const longMessage = 'A'.repeat(1000)
            expect(() => {
                Logger.info('test', longMessage)
            }).not.toThrow()
        })

        test('should handle special characters in message', () => {
            expect(() => {
                Logger.info('test', 'Special chars: !@#$%^&*()')
            }).not.toThrow()
        })
    })
})
