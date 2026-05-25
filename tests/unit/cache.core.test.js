'use strict'

const Cache = require('../../core/cache.core')

describe('Cache Core', () => {
    beforeEach(() => {
        Cache.flush()
    })

    afterEach(() => {
        Cache.flush()
    })

    // ── set / get ─────────────────────────────────────────────────────────
    describe('set and get', () => {
        test('should store and retrieve a value', () => {
            Cache.set('key', 'value')
            expect(Cache.get('key')).toBe('value')
        })

        test('should store objects', () => {
            const obj = { a: 1, b: [2, 3] }
            Cache.set('obj', obj)
            expect(Cache.get('obj')).toEqual(obj)
        })

        test('should return defaultValue when key not found', () => {
            expect(Cache.get('missing', 'default')).toBe('default')
        })

        test('should return null by default when key not found', () => {
            expect(Cache.get('missing')).toBeNull()
        })

        test('should overwrite existing key', () => {
            Cache.set('k', 1)
            Cache.set('k', 2)
            expect(Cache.get('k')).toBe(2)
        })
    })

    // ── TTL ───────────────────────────────────────────────────────────────
    describe('TTL expiration', () => {
        test('should expire entry after TTL', async () => {
            Cache.set('ttl-key', 'temp', 1)
            expect(Cache.get('ttl-key')).toBe('temp')
            await new Promise((r) => setTimeout(r, 1100))
            expect(Cache.get('ttl-key')).toBeNull()
        })

        test('should not expire when TTL is 0 (no expiry)', async () => {
            Cache.set('persist', 'stays', 0)
            await new Promise((r) => setTimeout(r, 100))
            expect(Cache.get('persist')).toBe('stays')
        })
    })

    // ── has / delete ─────────────────────────────────────────────────────
    describe('has and delete', () => {
        test('should return true when key exists', () => {
            Cache.set('exists', true)
            expect(Cache.has('exists')).toBe(true)
        })

        test('should return false when key does not exist', () => {
            expect(Cache.has('nope')).toBe(false)
        })

        test('should delete a key', () => {
            Cache.set('del', 'x')
            Cache.delete('del')
            expect(Cache.has('del')).toBe(false)
        })

        test('should return false when deleting non-existent key', () => {
            expect(Cache.delete('ghost')).toBe(false)
        })
    })

    // ── flush / size / keys ───────────────────────────────────────────────
    describe('flush, size, keys', () => {
        test('should flush all entries', () => {
            Cache.set('a', 1)
            Cache.set('b', 2)
            Cache.flush()
            expect(Cache.size()).toBe(0)
        })

        test('should report correct size', () => {
            Cache.set('x', 1)
            Cache.set('y', 2)
            expect(Cache.size()).toBe(2)
        })

        test('should return all keys', () => {
            Cache.set('alpha', 1)
            Cache.set('beta', 2)
            const keys = Cache.keys()
            expect(keys).toContain('alpha')
            expect(keys).toContain('beta')
        })
    })

    // ── remember ─────────────────────────────────────────────────────────
    describe('remember', () => {
        test('should call callback on cache miss and store result', () => {
            const cb = jest.fn().mockReturnValue(42)
            const val = Cache.remember('comp', 60, cb)
            expect(val).toBe(42)
            expect(cb).toHaveBeenCalledTimes(1)
        })

        test('should not call callback on cache hit', () => {
            Cache.set('hit', 99, 60)
            const cb = jest.fn()
            const val = Cache.remember('hit', 60, cb)
            expect(val).toBe(99)
            expect(cb).not.toHaveBeenCalled()
        })
    })

    // ── rememberAsync ─────────────────────────────────────────────────────
    describe('rememberAsync', () => {
        test('should call async callback on miss and cache result', async () => {
            const cb = jest.fn().mockResolvedValue('async-val')
            const val = await Cache.rememberAsync('async-key', 60, cb)
            expect(val).toBe('async-val')
            expect(cb).toHaveBeenCalledTimes(1)
            expect(Cache.get('async-key')).toBe('async-val')
        })

        test('should not call callback on hit', async () => {
            Cache.set('async-hit', 'cached', 60)
            const cb = jest.fn()
            const val = await Cache.rememberAsync('async-hit', 60, cb)
            expect(val).toBe('cached')
            expect(cb).not.toHaveBeenCalled()
        })
    })

    // ── add / pull / increment / decrement ────────────────────────────────
    describe('add, pull, increment, decrement', () => {
        test('should add only if key does not exist', () => {
            expect(Cache.add('new-key', 'first')).toBe(true)
            expect(Cache.add('new-key', 'second')).toBe(false)
            expect(Cache.get('new-key')).toBe('first')
        })

        test('should pull value and remove key', () => {
            Cache.set('pull-key', 'pull-val')
            const val = Cache.pull('pull-key')
            expect(val).toBe('pull-val')
            expect(Cache.has('pull-key')).toBe(false)
        })

        test('should pull defaultValue when key missing', () => {
            expect(Cache.pull('no-key', 'fallback')).toBe('fallback')
        })

        test('should increment a counter', () => {
            Cache.set('counter', 5)
            expect(Cache.increment('counter')).toBe(6)
            expect(Cache.increment('counter', 4)).toBe(10)
        })

        test('should decrement a counter', () => {
            Cache.set('counter', 10)
            expect(Cache.decrement('counter')).toBe(9)
            expect(Cache.decrement('counter', 4)).toBe(5)
        })

        test('should start counter from 0 on first increment', () => {
            expect(Cache.increment('fresh-counter')).toBe(1)
        })
    })
})
