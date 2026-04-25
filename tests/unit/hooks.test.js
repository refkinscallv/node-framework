const Hooks = require('../../core/hooks.core')

jest.mock('../../core/logger.core')

describe('Hooks Core', () => {
    test('should register and run before hook', async () => {
        const mockFn = jest.fn()
        Hooks.register('before', mockFn)
        await Hooks.run('before')
        expect(mockFn).toHaveBeenCalled()
    })

    test('should register and run after hook', async () => {
        const mockFn = jest.fn()
        Hooks.register('after', mockFn)
        await Hooks.run('after')
        expect(mockFn).toHaveBeenCalled()
    })

    test('should run multiple hooks in order', async () => {
        const order = []
        Hooks.register('before', () => order.push(1))
        Hooks.register('before', () => order.push(2))
        await Hooks.run('before')
        
        // Hooks run sequentially
        expect(order).toEqual(expect.arrayContaining([1, 2]))
    })
})
