# Helper Classes Documentation

> **v2.0.0**: Several bug fixes applied + new methods added. See [CHANGELOG.md](CHANGELOG.md) for details.

## Available Helpers

The framework provides several helper classes to simplify common tasks:

- **Env** - Environment variable management
- **Url** - URL generation and manipulation
- **Hash** - Hashing and encryption utilities
- **Str** - String manipulation
- **Arr** - Array manipulation

## Usage

```javascript
const { Env, Url, Hash, Str, Arr } = require('@core/helpers')
```

---

## Env Helper

Manage environment variables with type conversion and defaults.

### Methods

#### `Env.get(key, defaultValue)`
Get environment variable as string.

> **v2.0.0 Fix**: Empty string (`''`) values are now returned as-is. Previously, `''` was incorrectly treated as falsy and replaced by `defaultValue`.

```javascript
const appName = Env.get('APP_NAME', 'My App')
const emptyVal = Env.get('EMPTY_VAR', 'default') // Returns '' if EMPTY_VAR=''
```

#### `Env.getInt(key, defaultValue)`
Get environment variable as integer. Returns `defaultValue` if value is empty or `NaN`.

```javascript
const port = Env.getInt('APP_PORT', 3000)
```

#### `Env.getFloat(key, defaultValue)`
Get environment variable as float. Returns `defaultValue` if value is empty or `NaN`.

```javascript
const rate = Env.getFloat('TAX_RATE', 0.1)
```

#### `Env.getBool(key, defaultValue)`
Get environment variable as boolean. Accepts `'true'`, `'1'` as `true`.

```javascript
const isProduction = Env.getBool('PRODUCTION', false)
```

#### `Env.getArray(key, defaultValue)`
Get environment variable as array (comma-separated). Empty entries are filtered out.

```javascript
const allowedHosts = Env.getArray('ALLOWED_HOSTS', [])
// ALLOWED_HOSTS=localhost,127.0.0.1 → ['localhost', '127.0.0.1']
```

#### `Env.getJson(key, defaultValue)` ✨ New in v2.0.0
Parse JSON from environment variable.

```javascript
// .env: APP_CONFIG={"timeout":30,"retry":3}
const config = Env.getJson('APP_CONFIG', {})
// config.timeout → 30
```

#### `Env.has(key)`
Check if environment variable exists.

```javascript
if (Env.has('REDIS_URL')) {
    // Connect to Redis
}
```

#### `Env.isProduction()`, `Env.isDevelopment()`, `Env.isTest()`
Check current environment.

```javascript
if (Env.isProduction()) {
    // Production-specific code
}
```

---

## Url Helper

Generate and manipulate URLs.

### Methods

#### `Url.to(path)`
Generate full URL from path.

```javascript
Url.to('users/profile') // http://localhost:3030/users/profile
```

#### `Url.asset(path)`
Generate static asset URL.

```javascript
Url.asset('images/logo.png') // http://localhost:3030/static/images/logo.png
```

#### `Url.api(path)`
Generate API URL.

```javascript
Url.api('users') // http://localhost:3030/api/users
```

#### `Url.withQuery(path, params)`
Build URL with query parameters.

```javascript
Url.withQuery('search', { q: 'nodejs', page: 1 })
// http://localhost:3030/search?q=nodejs&page=1
```

#### `Url.parse(url)`
Parse URL into components.

```javascript
const parts = Url.parse('https://example.com:8080/path?q=1')
// { protocol, host, hostname, port, pathname, search, hash, query }
```

#### `Url.isValid(url)`
Check if URL is valid.

```javascript
Url.isValid('https://example.com') // true
Url.isValid('not-a-url')           // false
```

---

## Hash Helper

Hashing and encryption utilities.

### Methods

#### `Hash.make(value, rounds)`
Hash value using bcrypt.

```javascript
const hashed = await Hash.make('password123')
const hashed = await Hash.make('password123', 12) // Custom rounds
```

#### `Hash.check(value, hash)`
Verify value against bcrypt hash.

```javascript
const isValid = await Hash.check('password123', hashedPassword)
```

#### `Hash.md5(value)`, `Hash.sha256(value)`, `Hash.sha512(value)`
Generate hash using different algorithms.

```javascript
const h = Hash.md5('hello')
const h = Hash.sha256('hello')
const h = Hash.sha512('hello')
```

#### `Hash.random(length)`
Generate cryptographically secure random hex string.

```javascript
const token = Hash.random(32) // 64-char hex string (32 bytes)
```

#### `Hash.uuid()`
Generate UUID v4.

> **v2.0.0 Fix**: `require('uuid')` is now at module top-level instead of inside the method.

```javascript
const id = Hash.uuid() // 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
```

#### `Hash.uniqueId(prefix)`
Generate unique ID with optional prefix.

```javascript
const id = Hash.uniqueId('user_') // 'user_abc123...'
```

#### `Hash.hmac(value, secret, algorithm)` ✨ New in v2.0.0
Create HMAC signature (default: SHA256).

```javascript
const sig = Hash.hmac('payload', 'my-secret')
const sig = Hash.hmac('payload', 'my-secret', 'sha512')
```

---

## Str Helper

String manipulation utilities.

### Methods

#### Case Conversion

> **v2.0.0 Fix**: `camelCase()` now correctly handles `_` and `-` as separators.

```javascript
Str.camelCase('hello world')     // helloWorld
Str.camelCase('hello_world')     // helloWorld  ← Fixed in v2.0.0
Str.camelCase('hello-world')     // helloWorld  ← Fixed in v2.0.0
Str.snakeCase('helloWorld')      // hello_world
Str.kebabCase('helloWorld')      // hello-world
Str.titleCase('hello world')     // Hello World
```

#### String Operations

```javascript
Str.truncate('Long text...', 10)        // 'Long te...'
Str.slug('Hello World!')                // 'hello-world'
Str.capitalize('hello')                 // 'Hello'
Str.reverse('hello')                    // 'olleh'
Str.random(16)                          // Random alphanumeric string
Str.repeat('ab', 3)                     // 'ababab'
Str.contains('hello world', 'world')    // true
Str.startsWith('hello', 'hel')          // true
Str.endsWith('hello', 'llo')            // true
```

#### New in v2.0.0

```javascript
Str.isEmpty('')           // true
Str.isEmpty('  ')         // true (trims whitespace)
Str.isEmpty('hello')      // false

Str.padLeft('42', 5, '0')    // '00042'
Str.padRight('hi', 5, '.')   // 'hi...'
```

---

## Arr Helper

Array manipulation utilities.

### Methods

#### Array Operations

> **v2.0.0 Fix**: `first()` and `last()` now accept a `defaultValue` for empty arrays.

```javascript
Arr.first([1, 2, 3])                    // 1
Arr.first([], 'none')                   // 'none'  ← Fixed in v2.0.0
Arr.last([1, 2, 3])                     // 3
Arr.last([], null)                      // null    ← Fixed in v2.0.0
Arr.unique([1, 2, 2, 3])                // [1, 2, 3]
Arr.flatten([[1, 2], [3, 4]])           // [1, 2, 3, 4]
Arr.chunk([1, 2, 3, 4], 2)              // [[1, 2], [3, 4]]
Arr.shuffle([1, 2, 3, 4])               // Random order
Arr.random([1, 2, 3, 4])                // Random element
Arr.isEmpty([])                          // true
Arr.isEmpty('not-array')                 // true  ← Fixed in v2.0.0
Arr.wrap('hello')                        // ['hello']
Arr.wrap(null)                           // []    ← Fixed in v2.0.0
Arr.diff([1, 2, 3], [2, 3])             // [1]
Arr.intersect([1, 2, 3], [2, 3, 4])    // [2, 3]
```

#### New in v2.0.0

```javascript
Arr.compact([0, 1, null, 2, false, ''])  // [1, 2]
Arr.sum([10, 20, 30])                    // 60
Arr.sum([{price: 10}, {price: 20}], 'price')  // 30
```

#### Array of Objects

```javascript
const users = [
    { name: 'John', age: 30 },
    { name: 'Jane', age: 25 }
]

Arr.pluck(users, 'name')                // ['John', 'Jane']
Arr.groupBy(users, 'age')               // { 30: [...], 25: [...] }
Arr.sortBy(users, 'age', 'desc')        // Sorted by age descending
```

---

## Complete Example

```javascript
const { Env, Url, Hash, Str, Arr } = require('@core/helpers')

// Environment
const port = Env.getInt('APP_PORT', 3000)
const isDev = Env.isDevelopment()
const config = Env.getJson('FEATURE_FLAGS', {})    // NEW

// URL Generation
const profileUrl = Url.to('users/profile')
const logoUrl = Url.asset('images/logo.png')

// Hashing
const password = await Hash.make('secret123')
const isValid = await Hash.check('secret123', password)
const signature = Hash.hmac('data', 'secret-key')  // NEW

// String Manipulation
const slug = Str.slug('My Blog Post Title')
const truncated = Str.truncate('Long description...', 50)
const camel = Str.camelCase('hello_world')         // 'helloWorld' (fixed)
const empty = Str.isEmpty('')                       // true (NEW)

// Array Operations
const users = [{ name: 'John', price: 10 }, { name: 'Jane', price: 20 }]
const names = Arr.pluck(users, 'name')
const unique = Arr.unique([1, 2, 2, 3, 3])
const total = Arr.sum(users, 'price')              // 30 (NEW)
const clean = Arr.compact([1, null, 2, false])     // [1, 2] (NEW)
```
