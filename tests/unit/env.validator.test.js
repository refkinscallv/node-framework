'use strict'

jest.mock('../../core/logger.core')

const EnvValidator = require('../../core/env.validator')

describe('EnvValidator', () => {
    const ORIGINAL_ENV = { ...process.env }

    afterEach(() => {
        // Restore env after each test
        Object.keys(process.env).forEach((key) => delete process.env[key])
        Object.assign(process.env, ORIGINAL_ENV)
    })

    describe('validate', () => {
        test('should not throw when all required vars are set', () => {
            process.env.MY_VAR = 'value'
            expect(() => EnvValidator.validate(['MY_VAR'])).not.toThrow()
        })

        test('should throw with missing var names in message', () => {
            delete process.env.MISSING_VAR
            expect(() => EnvValidator.validate(['MISSING_VAR'])).toThrow('MISSING_VAR')
        })

        test('should throw listing all missing vars', () => {
            delete process.env.VAR_A
            delete process.env.VAR_B
            expect(() => EnvValidator.validate(['VAR_A', 'VAR_B'])).toThrow(/VAR_A.*VAR_B|VAR_B.*VAR_A/)
        })

        test('should not throw for empty array', () => {
            expect(() => EnvValidator.validate([])).not.toThrow()
        })

        test('should not throw when called with no args', () => {
            expect(() => EnvValidator.validate()).not.toThrow()
        })

        test('should treat empty string value as missing', () => {
            process.env.EMPTY_VAR = ''
            expect(() => EnvValidator.validate(['EMPTY_VAR'])).toThrow('EMPTY_VAR')
        })

        test('should pass partial list when some vars are set', () => {
            process.env.SET_VAR = 'yes'
            delete process.env.UNSET_VAR
            expect(() => EnvValidator.validate(['SET_VAR', 'UNSET_VAR'])).toThrow('UNSET_VAR')
        })
    })

    describe('validateFromConfig', () => {
        test('should not throw when config has no requiredEnv', () => {
            expect(() => EnvValidator.validateFromConfig()).not.toThrow()
        })
    })
})
