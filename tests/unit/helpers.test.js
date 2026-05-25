'use strict'

const Arr = require('../../core/helpers/arr.helper')
const Str = require('../../core/helpers/str.helper')
const Hash = require('../../core/helpers/hash.helper')
const BaseService = require('../../app/services/base.service')
const BaseController = require('../../app/http/controllers/base.controller')

// ── Arr Helper ────────────────────────────────────────────────────────────────
describe('Arr Helper', () => {
    describe('first / last', () => {
        test('first returns first element', () => expect(Arr.first([1, 2, 3])).toBe(1))
        test('first returns defaultValue on empty array', () => expect(Arr.first([], 'x')).toBe('x'))
        test('first returns null by default on empty array', () => expect(Arr.first([])).toBeNull())
        test('last returns last element', () => expect(Arr.last([1, 2, 3])).toBe(3))
        test('last returns defaultValue on empty array', () => expect(Arr.last([], 99)).toBe(99))
    })

    describe('flatten / unique', () => {
        test('flatten flattens nested arrays', () => expect(Arr.flatten([1, [2, [3]]])).toEqual([1, 2, 3]))
        test('flatten with depth 1', () => expect(Arr.flatten([1, [2, [3]]], 1)).toEqual([1, 2, [3]]))
        test('unique removes duplicates', () => expect(Arr.unique([1, 2, 2, 3])).toEqual([1, 2, 3]))
    })

    describe('chunk', () => {
        test('chunks array into given size', () => expect(Arr.chunk([1, 2, 3, 4], 2)).toEqual([[1, 2], [3, 4]]))
        test('handles uneven chunk', () => expect(Arr.chunk([1, 2, 3], 2)).toEqual([[1, 2], [3]]))
        test('size 0 returns original array wrapped', () => expect(Arr.chunk([1, 2], 0)).toEqual([[1, 2]]))
    })

    describe('shuffle / random', () => {
        test('shuffle returns array with same length', () => {
            const arr = [1, 2, 3, 4, 5]
            expect(Arr.shuffle(arr)).toHaveLength(arr.length)
        })
        test('random returns element from array', () => {
            const arr = [10, 20, 30]
            expect(arr).toContain(Arr.random(arr))
        })
        test('random returns null on empty array', () => expect(Arr.random([])).toBeNull())
    })

    describe('pluck / groupBy / sortBy', () => {
        const data = [{ name: 'Alice', age: 30 }, { name: 'Bob', age: 25 }, { name: 'Charlie', age: 30 }]

        test('pluck extracts key from each object', () => {
            expect(Arr.pluck(data, 'name')).toEqual(['Alice', 'Bob', 'Charlie'])
        })

        test('groupBy groups by key value', () => {
            const grouped = Arr.groupBy(data, 'age')
            expect(grouped[30]).toHaveLength(2)
            expect(grouped[25]).toHaveLength(1)
        })

        test('sortBy ascending', () => {
            const sorted = Arr.sortBy(data, 'age', 'asc')
            expect(sorted[0].age).toBe(25)
        })

        test('sortBy descending', () => {
            const sorted = Arr.sortBy(data, 'age', 'desc')
            expect(sorted[0].age).toBe(30)
        })
    })

    describe('isEmpty / wrap / diff / intersect / compact / sum', () => {
        test('isEmpty on empty array', () => expect(Arr.isEmpty([])).toBe(true))
        test('isEmpty on non-empty array', () => expect(Arr.isEmpty([1])).toBe(false))
        test('isEmpty on non-array', () => expect(Arr.isEmpty('x')).toBe(true))

        test('wrap wraps scalar in array', () => expect(Arr.wrap(1)).toEqual([1]))
        test('wrap keeps array as-is', () => expect(Arr.wrap([1, 2])).toEqual([1, 2]))
        test('wrap returns [] for null', () => expect(Arr.wrap(null)).toEqual([]))
        test('wrap returns [] for undefined', () => expect(Arr.wrap(undefined)).toEqual([]))

        test('diff returns items in arr1 not in arr2', () => {
            expect(Arr.diff([1, 2, 3], [2, 3, 4])).toEqual([1])
        })

        test('intersect returns common items', () => {
            expect(Arr.intersect([1, 2, 3], [2, 3, 4])).toEqual([2, 3])
        })

        test('compact removes falsy values', () => {
            expect(Arr.compact([0, 1, false, 2, null, 3, ''])).toEqual([1, 2, 3])
        })

        test('sum of plain numbers', () => expect(Arr.sum([1, 2, 3])).toBe(6))
        test('sum by key', () => {
            expect(Arr.sum([{ price: 10 }, { price: 20 }], 'price')).toBe(30)
        })
    })
})

// ── Str Helper ────────────────────────────────────────────────────────────────
describe('Str Helper', () => {
    describe('case conversions', () => {
        test('camelCase from snake_case', () => expect(Str.camelCase('hello_world')).toBe('helloWorld'))
        test('camelCase from kebab-case', () => expect(Str.camelCase('hello-world')).toBe('helloWorld'))
        test('camelCase from space separated', () => expect(Str.camelCase('hello world')).toBe('helloWorld'))

        test('snakeCase from camelCase', () => expect(Str.snakeCase('helloWorld')).toBe('hello_world'))
        test('snakeCase from space', () => expect(Str.snakeCase('hello world')).toBe('hello_world'))

        test('kebabCase from camelCase', () => expect(Str.kebabCase('helloWorld')).toBe('hello-world'))
        test('kebabCase from snake_case', () => expect(Str.kebabCase('hello_world')).toBe('hello-world'))

        test('titleCase', () => expect(Str.titleCase('hello world')).toBe('Hello World'))

        test('capitalize', () => expect(Str.capitalize('hello')).toBe('Hello'))
        test('capitalize empty returns empty', () => expect(Str.capitalize('')).toBeFalsy())
    })

    describe('truncate', () => {
        test('truncates long string', () => {
            const result = Str.truncate('Hello World and more text', 15)
            expect(result.length).toBeLessThanOrEqual(15)
            expect(result.endsWith('...')).toBe(true)
        })
        test('does not truncate short string', () => {
            expect(Str.truncate('Hi', 10)).toBe('Hi')
        })
    })

    describe('slug / random / reverse / repeat', () => {
        test('slug generates url-safe string', () => {
            expect(Str.slug('Hello World!')).toBe('hello-world')
        })
        test('random generates string of given length', () => {
            expect(Str.random(12)).toHaveLength(12)
        })
        test('reverse reverses string', () => expect(Str.reverse('abc')).toBe('cba'))
        test('repeat repeats string', () => expect(Str.repeat('ab', 3)).toBe('ababab'))
    })

    describe('contains / startsWith / endsWith / isEmpty', () => {
        test('contains returns true when found', () => expect(Str.contains('hello', 'ell')).toBe(true))
        test('contains returns false when not found', () => expect(Str.contains('hello', 'xyz')).toBe(false))
        test('startsWith', () => expect(Str.startsWith('hello', 'hel')).toBe(true))
        test('endsWith', () => expect(Str.endsWith('hello', 'llo')).toBe(true))
        test('isEmpty on empty string', () => expect(Str.isEmpty('')).toBe(true))
        test('isEmpty on whitespace', () => expect(Str.isEmpty('   ')).toBe(true))
        test('isEmpty on non-empty', () => expect(Str.isEmpty('x')).toBe(false))
        test('isEmpty on null', () => expect(Str.isEmpty(null)).toBe(true))
    })

    describe('padLeft / padRight', () => {
        test('padLeft pads to length', () => expect(Str.padLeft('5', 3, '0')).toBe('005'))
        test('padRight pads to length', () => expect(Str.padRight('5', 3, '0')).toBe('500'))
    })
})

// ── BaseService ────────────────────────────────────────────────────────────────
describe('BaseService', () => {
    test('success returns 200 with status true', () => {
        const r = BaseService.success('OK', { id: 1 })
        expect(r.status).toBe(true)
        expect(r.code).toBe(200)
        expect(r.data).toEqual({ id: 1 })
    })

    test('created returns 201', () => {
        const r = BaseService.created('Done', { id: 2 })
        expect(r.code).toBe(201)
        expect(r.status).toBe(true)
    })

    test('fail returns 400 by default', () => {
        const r = BaseService.fail('Bad input')
        expect(r.status).toBe(false)
        expect(r.code).toBe(400)
    })

    test('notFound returns 404', () => {
        const r = BaseService.notFound()
        expect(r.code).toBe(404)
        expect(r.status).toBe(false)
    })

    test('unauthorized returns 401', () => {
        expect(BaseService.unauthorized().code).toBe(401)
    })

    test('forbidden returns 403', () => {
        expect(BaseService.forbidden().code).toBe(403)
    })

    test('conflict returns 409', () => {
        expect(BaseService.conflict().code).toBe(409)
    })

    test('validationFail returns 422', () => {
        const r = BaseService.validationFail('Invalid', ['error1'])
        expect(r.code).toBe(422)
        expect(r.custom.errors).toEqual(['error1'])
    })

    test('serverError returns 500', () => {
        expect(BaseService.serverError().code).toBe(500)
    })
})

// ── Hash Helper ───────────────────────────────────────────────────────────────
describe('Hash Helper', () => {
    describe('bcrypt', () => {
        test('make returns a hashed string', async () => {
            const hash = await Hash.make('password')
            expect(typeof hash).toBe('string')
            expect(hash).not.toBe('password')
        })

        test('check returns true for correct password', async () => {
            const hash = await Hash.make('secret')
            expect(await Hash.check('secret', hash)).toBe(true)
        })

        test('check returns false for wrong password', async () => {
            const hash = await Hash.make('secret')
            expect(await Hash.check('wrong', hash)).toBe(false)
        })
    })

    describe('md5 / sha256 / sha512', () => {
        test('md5 returns 32-char hex string', () => {
            expect(Hash.md5('hello')).toHaveLength(32)
        })

        test('sha256 returns 64-char hex string', () => {
            expect(Hash.sha256('hello')).toHaveLength(64)
        })

        test('sha512 returns 128-char hex string', () => {
            expect(Hash.sha512('hello')).toHaveLength(128)
        })

        test('same input always produces same hash', () => {
            expect(Hash.sha256('test')).toBe(Hash.sha256('test'))
        })
    })

    describe('random / uuid / uniqueId / hmac', () => {
        test('random returns hex string of double the byte length', () => {
            expect(Hash.random(16)).toHaveLength(32)
        })

        test('uuid returns valid v4 UUID format', () => {
            const uuid = Hash.uuid()
            expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/)
        })

        test('uniqueId returns a non-empty string', () => {
            expect(Hash.uniqueId()).toBeTruthy()
        })

        test('uniqueId with prefix includes prefix', () => {
            expect(Hash.uniqueId('user_')).toMatch(/^user_/)
        })

        test('hmac returns consistent signature', () => {
            const sig = Hash.hmac('data', 'secret')
            expect(sig).toBe(Hash.hmac('data', 'secret'))
        })

        test('hmac with different secrets produces different results', () => {
            expect(Hash.hmac('data', 'secret1')).not.toBe(Hash.hmac('data', 'secret2'))
        })
    })
})

// ── BaseController (static methods) ───────────────────────────────────────────
describe('BaseController', () => {
    function makeRes() {
        const res = {}
        res.status = jest.fn().mockReturnValue(res)
        res.json = jest.fn().mockReturnValue(res)
        res.send = jest.fn().mockReturnValue(res)
        return res
    }

    test('success sends 200', () => {
        const res = makeRes()
        BaseController.success(res, 'OK', { x: 1 })
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ status: true, code: 200 }))
    })

    test('created sends 201', () => {
        const res = makeRes()
        BaseController.created(res, 'Created', { id: 5 })
        expect(res.status).toHaveBeenCalledWith(201)
    })

    test('error sends 400', () => {
        const res = makeRes()
        BaseController.error(res, 'Bad', 400)
        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ status: false }))
    })

    test('notFound sends 404', () => {
        const res = makeRes()
        BaseController.notFound(res)
        expect(res.status).toHaveBeenCalledWith(404)
    })

    test('unauthorized sends 401', () => {
        const res = makeRes()
        BaseController.unauthorized(res)
        expect(res.status).toHaveBeenCalledWith(401)
    })

    test('forbidden sends 403', () => {
        const res = makeRes()
        BaseController.forbidden(res)
        expect(res.status).toHaveBeenCalledWith(403)
    })

    test('serverError sends 500', () => {
        const res = makeRes()
        BaseController.serverError(res)
        expect(res.status).toHaveBeenCalledWith(500)
    })

    test('noContent sends 204', () => {
        const res = makeRes()
        BaseController.noContent(res)
        expect(res.status).toHaveBeenCalledWith(204)
    })

    test('json with service output object', () => {
        const res = makeRes()
        const serviceOutput = BaseService.success('Done', { id: 1 })
        BaseController.json(res, serviceOutput)
        expect(res.status).toHaveBeenCalledWith(200)
    })

    test('paginated sends 200 with meta', () => {
        const res = makeRes()
        BaseController.paginated(res, [1, 2], { total: 2, page: 1 })
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ meta: { total: 2, page: 1 } }))
    })

    test('handle wraps async fn and calls next on error', async () => {
        const err = new Error('test error')
        const fn = jest.fn().mockRejectedValue(err)
        const next = jest.fn()
        const wrapped = BaseController.handle(fn)
        await wrapped({ req: {}, res: {}, next })
        expect(next).toHaveBeenCalledWith(err)
    })
})
