# Framework API Documentation v3.0.2

Complete API reference for the Node.js MVC Framework.

## Table of Contents

- [Core Modules](#core-modules)
    - [Boot](#boot)
    - [Database](#database)
    - [Cache](#cache)
    - [Express](#express)
    - [Logger](#logger)
    - [JWT](#jwt)
    - [Mailer](#mailer)
    - [Hooks](#hooks)
    - [Socket](#socket)
    - [Server](#server)
    - [Runtime](#runtime)
    - [ErrorHandler](#errorhandler)
    - [EnvValidator](#envvalidator)
- [App Layer](#app-layer)
    - [BaseController](#basecontroller)
    - [BaseService](#baseservice)
    - [AuthMiddleware](#authmiddleware)
    - [Health Check](#health-check)
    - [EnvValidator](#envvalidator-1)
- [Helpers](#helpers)
    - [RateLimit](#ratelimit)
- [Routing API](#routing-api)
    - [Handler Formats](#handler-formats)
    - [HTTP Methods](#http-methods)
    - [Route Parameters](#route-parameters--query-strings)
    - [Per-Route Middlewares](#per-route-middlewares)
    - [Route Groups](#route-groups)
    - [Scoped Middlewares](#scoped-middlewares--routesmiddleware)
    - [Controller Auto-Registration](#controller-auto-registration--routescontroller)
    - [Custom Error Handler](#custom-error-handler--routeserrorhandler)
    - [Maintenance Mode](#maintenance-mode--routesmaintenance)
- [File Upload API](#file-upload-api)
- [Configuration API](#configuration-api)
- [Best Practices](#best-practices)

---

## Core Modules

### Boot

The Boot module is responsible for starting the application and managing its lifecycle.

#### Methods

##### `Boot.start()`

Starts the application by initializing all core modules in sequence.

```javascript
const Boot = require('@core/boot.core')
await Boot.start()
```

**Returns:** `Promise<void>`

**Throws:** Error if application fails to start

---

### Database

Manages database connections and Sequelize models.

#### Methods

##### `Database.init()`

Initializes database connection and loads models.

```javascript
const Database = require('@core/database.core')
await Database.init()
```

**Returns:** `Promise<void>`

##### `Database.getModel(name)`

Retrieves a loaded Sequelize model by name.

```javascript
const User = Database.getModel('User')
const users = await User.findAll()
```

**Parameters:**

- `name` (string): Model name

**Returns:** Sequelize Model instance

##### `Database.getInstance()`

Gets the Sequelize instance.

```javascript
const sequelize = Database.getInstance()
await sequelize.query('SELECT * FROM users')
```

**Returns:** Sequelize instance

##### `Database.close()`

Closes the database connection.

```javascript
await Database.close()
```

**Returns:** `Promise<void>`

> **Note**: Since v2.0.0, `Database.close()` is only called during shutdown if `config.database.status` is `true`.

##### `Database.transaction(callback)` ✨ v3.0.0

Executes a function inside a managed Sequelize transaction. Auto-commits on success, auto-rollbacks on error.

```javascript
await Database.transaction(async (t) => {
    const user = await User.create({ name: 'Alice' }, { transaction: t })
    await Profile.create({ userId: user.id }, { transaction: t })
})
```

**Parameters:**
- `callback` (Function): Async function that receives the transaction object `t`

**Returns:** `Promise<*>` — result of the callback

**Throws:** Error if database not initialized or transaction fails

#### Properties

##### `Database.models`

Object containing all loaded models.

```javascript
const models = Database.models
console.log(Object.keys(models)) // ['User', 'Post', ...]
```

---

### Cache

In-memory key-value store with optional TTL. Ideal for caching expensive queries, session data, or rate-limit counters.

```javascript
const Cache = require('@core/cache.core')
```

#### Methods

| Method | Description |
|--------|-------------|
| `set(key, value, ttl = 0)` | Store a value. `ttl` in seconds, `0` = no expiry |
| `get(key, default = null)` | Retrieve a value or default |
| `has(key)` | Check if key exists |
| `delete(key)` | Remove a key |
| `flush()` | Clear all entries |
| `size()` | Number of cached entries |
| `keys()` | Array of all keys |
| `remember(key, ttl, fn)` | Return cached value or call `fn()`, cache and return result |
| `rememberAsync(key, ttl, fn)` | Async version of `remember` |
| `add(key, value, ttl)` | Store only if key does not exist; returns `boolean` |
| `pull(key, default)` | Get and immediately delete |
| `increment(key, amount = 1)` | Increment numeric value |
| `decrement(key, amount = 1)` | Decrement numeric value |

**Examples:**

```javascript
// Basic store and retrieve
Cache.set('config', { theme: 'dark' }, 3600) // 1-hour TTL
const config = Cache.get('config', {})

// Get-or-set (async)
const users = await Cache.rememberAsync('users:all', 300, async () => {
    return await User.findAll()
})

// One-time use token
Cache.set('reset:abc', userId, 900) // 15-min TTL
const id = Cache.pull('reset:abc')   // Get and remove

// Counter
Cache.increment('login:fails:user1')
if (Cache.get('login:fails:user1') >= 5) blockUser()
```

---

### Express

Manages Express application and middleware configuration.

#### Methods

##### `Express.init()`

Initializes Express app with middlewares and routes.

```javascript
const Express = require('@core/express.core')
Express.init()
```

**Returns:** `void`

##### `Express.instance()`

Gets the Express application instance.

```javascript
const app = Express.instance()
app.get('/custom', (req, res) => {
    res.send('Custom route')
})
```

**Returns:** Express application

#### Properties

##### `Express.app`

The Express application instance.

```javascript
const app = Express.app
```

##### `Express.router`

The Express Router instance.

```javascript
const router = Express.router
```

---

### Logger

Winston-based logging system with file rotation.

#### Methods

##### `Logger.info(context, message)`

Logs informational messages.

```javascript
const Logger = require('@core/logger.core')
Logger.info('user', 'User logged in successfully')
```

**Parameters:**

- `context` (string): Log context/layer
- `message` (string): Log message

##### `Logger.error(context, message)`

Logs error messages.

```javascript
Logger.error('database', 'Connection failed')
```

**Parameters:**

- `context` (string): Error context
- `message` (string): Error message

##### `Logger.warn(context, message)`

Logs warning messages.

```javascript
Logger.warn('auth', 'Invalid token attempt')
```

**Parameters:**

- `context` (string): Warning context
- `message` (string): Warning message

##### `Logger.debug(context, message)`

Logs debug messages (only in development).

```javascript
Logger.debug('query', 'SELECT * FROM users')
```

**Parameters:**

- `context` (string): Debug context
- `message` (string): Debug message

##### `Logger.set(error, context)`

Logs error objects with stack traces.

```javascript
try {
    // some code
} catch (err) {
    Logger.set(err, 'controller')
}
```

**Parameters:**

- `error` (Error): Error object
- `context` (string): Error context

---

### JWT

JSON Web Token utilities for authentication.

#### Methods

##### `JWT.sign(payload, expiresIn)`

Creates a JWT token.

```javascript
const JWT = require('@core/jwt.core')

const token = JWT.sign({ userId: 123, role: 'admin' }, '7d')
```

**Parameters:**

- `payload` (Object): Token payload data
- `expiresIn` (string, optional): Expiration time (default from config)
- `isRefresh` (boolean, optional): Whether to use refresh token secret (default: false)

**Returns:** `string` - JWT token

##### `JWT.signRefresh(payload, expiresIn)` ✨ New in v2.1.0

Creates a JWT refresh token using `JWT_REFRESH_SECRET`.

```javascript
const refreshToken = JWT.signRefresh({ userId: 123 }, '7d')
```

**Parameters:**

- `payload` (Object): Token payload data
- `expiresIn` (string, optional): Expiration time (default from config refreshExpiresIn)

**Returns:** `string` - JWT refresh token

##### `JWT.verify(token, isRefresh)`

Verifies and decodes a JWT token.

```javascript
const decoded = JWT.verify(token)
if (decoded) {
    console.log(decoded.userId) // 123
}
```

**Parameters:**

- `token` (string): JWT token to verify
- `isRefresh` (boolean, optional): Whether to verify using refresh token secret (default: false)

**Returns:** `Object|null` - Decoded payload or null if invalid

##### `JWT.verifyRefresh(token)` ✨ New in v2.1.0

Verifies and decodes a JWT refresh token.

```javascript
const decoded = JWT.verifyRefresh(refreshToken)
```

**Parameters:**

- `token` (string): JWT refresh token to verify

**Returns:** `Object|null` - Decoded payload or null if invalid

##### `JWT.decode(token)`

Decodes a JWT token without verification.

```javascript
const decoded = JWT.decode(token)
console.log(decoded)
```

**Parameters:**

- `token` (string): JWT token

**Returns:** `Object|null` - Decoded payload or null

---

### Mailer

Email sending functionality with template support.

#### Methods

##### `Mailer.init()`

Initializes the mailer transport.

```javascript
const Mailer = require('@core/mailer.core')
Mailer.init()
```

**Returns:** `void`

##### `Mailer.send(to, subject, template, data)`

Sends an email using an EJS template.

> **v2.0.0**: Validates `to`, `subject`, `template` before processing. Throws descriptive errors instead of propagating nodemailer errors.

```javascript
await Mailer.send('user@example.com', 'Welcome!', 'welcome', { username: 'John' })
```

**Parameters:**

- `to` (string): Recipient email — **required**, throws if empty
- `subject` (string): Email subject — **required**, throws if empty
- `template` (string): Template name (without `.email.ejs`) — **required**, throws if file not found
- `data` (Object): Data to pass to template

**Returns:** `Promise<Object>` - Email info

**Template Location:** `public/views/templates/email/{template}.email.ejs`

##### `Mailer.sendRaw(to, subject, html)` ✨ New in v2.0.0

Sends raw HTML email without requiring a template file.

```javascript
await Mailer.sendRaw('user@example.com', 'Hello!', '<h1>Hello World</h1>')
```

**Parameters:**

- `to` (string): Recipient email
- `subject` (string): Email subject
- `html` (string): Raw HTML content

**Returns:** `Promise<Object>` - Email info

##### `Mailer.verify()`

Verifies mailer connection.

```javascript
const isValid = await Mailer.verify()
console.log(isValid) // true or false
```

**Returns:** `Promise<boolean>` - Connection status

---

### Hooks

Lifecycle hooks system for running code at specific points.

#### Methods

##### `Hooks.register(lifecycle, callback)`

Registers a hook callback.

```javascript
const Hooks = require('@core/hooks.core')

Hooks.register('before', async () => {
    console.log('Before app starts')
})
```

**Parameters:**

- `lifecycle` (string): Hook lifecycle ('before', 'after', 'shutdown')
- `callback` (Function): Async function to execute

**Lifecycles:**

- `before`: Before application initialization
- `after`: After application starts
- `shutdown`: During graceful shutdown

##### `Hooks.run(lifecycle)`

Executes all hooks for a specific lifecycle.

```javascript
await Hooks.run('after')
```

**Parameters:**

- `lifecycle` (string): Hook lifecycle to run

**Returns:** `Promise<void>`

---

### Socket

Socket.IO configuration and management.

#### Methods

##### `Socket.init(server)`

Initializes Socket.IO with the HTTP server.

```javascript
const Socket = require('@core/socket.core')
const server = require('http').createServer(app)
Socket.init(server)
```

**Parameters:**

- `server` (Object): HTTP/HTTPS server instance

**Returns:** `void`

##### `Socket.getInstance()`

Gets the Socket.IO instance.

```javascript
const io = Socket.getInstance()
io.emit('broadcast', { message: 'Hello everyone' })
```

**Returns:** Socket.IO Server instance

##### `Socket.close()` ✨ New in v2.0.0

Gracefully closes the Socket.IO server. Should be called during application shutdown.

```javascript
await Socket.close()
```

**Returns:** `Promise<void>`

#### Properties

##### `Socket.io`

The Socket.IO server instance.

```javascript
const io = Socket.io
```

---

### Server

HTTP/HTTPS server creation and management.

#### Methods

##### `Server.create(app)`

Creates an HTTP or HTTPS server.

> **v2.0.0 Fix**: No longer passes invalid options to `http.createServer()`. Options like `poweredBy` are not valid Node.js HTTP server options.

```javascript
const Server = require('@core/server.core')
const server = Server.create(expressApp)
```

**Parameters:**

- `app` (Object): Express application instance

**Returns:** HTTP/HTTPS Server instance

##### `Server.listen(server, port, host)`

Starts the server listening on specified port.

```javascript
await Server.listen(server, 3025)
await Server.listen(server, 3025, '127.0.0.1') // Bind to specific host
```

**Parameters:**

- `server` (Object): Server instance
- `port` (number): Port number
- `host` (string, optional): Host to bind (default: `0.0.0.0`)

**Returns:** `Promise<void>`

##### `Server.applyOptions(server)` ✨ New in v2.0.0

Applies server-level timeout settings from `config.server.options`.

```javascript
const server = Server.create(app)
Server.applyOptions(server) // Sets keepAliveTimeout, requestTimeout, headersTimeout
```

**Reads from config:**
- `config.server.options.keepAliveTimeout`
- `config.server.options.requestTimeout`
- `config.server.options.headersTimeout`

---

### Runtime

Runtime environment configuration.

#### Methods

##### `Runtime.init()`

Configures runtime environment (timezone, NODE_ENV).

```javascript
const Runtime = require('@core/runtime.core')
Runtime.init()
```

**Returns:** `void`

---

### ErrorHandler

Global error handling for Express.

#### Methods

##### `ErrorHandler.init(app)`

Initializes global error handler middleware.

```javascript
const ErrorHandler = require('@core/errorHandler.core')
ErrorHandler.init(app)
```

**Parameters:**

- `app` (Object): Express application instance

**Returns:** `void`

---

## App Layer

### BaseController

Base class for all controllers. Provides standardized JSON response methods.

#### Methods

##### `BaseController.handle(fn)` ✨ New in v2.0.0

Async error wrapper. Eliminates repetitive try/catch in controller methods.

```javascript
const BaseController = require('@app/http/controllers/base.controller')

// Before: manual try/catch
static async getAll({ req, res }) {
    try {
        const result = await UserService.getAll()
        return BaseController.json(res, result)
    } catch (err) {
        return BaseController.serverError(res, err.message)
    }
}

// After: use handle()
static getAll = BaseController.handle(async ({ req, res }) => {
    const result = await UserService.getAll()
    return BaseController.json(res, result)
})
```

Errors are automatically forwarded to Express error handler via `next(err)`.

##### `BaseController.json(res, output)`

Universal JSON response builder. Can accept a `BaseService.json()` output object directly.

```javascript
const result = await UserService.getAll()
return BaseController.json(res, result) // Reads status/code/message/data from result
```

##### `BaseController.success(res, message, data, code)`

200 success response.

##### `BaseController.created(res, message, data)`

201 created response.

##### `BaseController.error(res, message, code, data)`

Error response.

##### `BaseController.validationError(res, validation)`

422 validation error response.

##### `BaseController.notFound(res, message)`

404 response.

##### `BaseController.unauthorized(res, message)`

401 response.

##### `BaseController.forbidden(res, message)`

403 response.

##### `BaseController.serverError(res, message)`

500 response.

##### `BaseController.paginated(res, items, meta, message)` ✨ New in v2.0.0

Paginated response with meta information.

```javascript
return BaseController.paginated(res, users, {
    total: 100,
    page: 1,
    limit: 10,
    totalPages: 10
})
```

##### `BaseController.noContent(res)`

204 no content response.

---

### BaseService

Base class for all services. Provides standardized response object builders.

#### Methods

##### `BaseService.json(status, code, message, data, custom)`

Universal response builder. Returns an object compatible with `BaseController.json()`.

```javascript
return this.json(true, 200, 'Success', data)
```

##### `BaseService.success(message, data)` ✨ New in v2.0.0

Shortcut for 200 success.

```javascript
return this.success('Users retrieved', users)
```

##### `BaseService.created(message, data)` ✨ New in v2.0.0

Shortcut for 201 created.

```javascript
return this.created('User created', newUser)
```

##### `BaseService.fail(message, code, data)` ✨ New in v2.0.0

Generic error shortcut (default 400).

```javascript
return this.fail('Bad request')
return this.fail('Payment required', 402)
```

##### `BaseService.notFound(message)` ✨ New in v2.0.0

Shortcut for 404.

```javascript
return this.notFound('User not found')
```

##### `BaseService.unauthorized(message)` ✨ New in v2.0.0

Shortcut for 401.

```javascript
return this.unauthorized('Invalid token')
```

##### `BaseService.forbidden(message)` ✨ New in v2.0.0

Shortcut for 403.

```javascript
return this.forbidden('Access denied')
```

##### `BaseService.conflict(message)` ✨ New in v2.0.0

Shortcut for 409 (duplicate data).

```javascript
return this.conflict('Email already registered')
```

##### `BaseService.validationFail(message, errors)` ✨ New in v2.0.0

Shortcut for 422 with errors array.

```javascript
return this.validationFail('Validation error', [{ field: 'email', message: 'Invalid' }])
```

##### `BaseService.serverError(message)` ✨ New in v2.0.0

Shortcut for 500.

```javascript
return this.serverError('Database error')
```

---

### AuthMiddleware ✨ v3.0.0

JWT authentication and RBAC middleware. Import from `@app/http/middlewares/auth.middleware`.

```javascript
const AuthMiddleware = require('@app/http/middlewares/auth.middleware')
```

#### Methods

##### `AuthMiddleware.authenticate`

Express middleware. Reads the `Authorization: Bearer <token>` header, verifies the JWT, and attaches the decoded payload to `req.user`. Returns `401` if the token is absent or invalid.

```javascript
Routes.get('profile', [AuthMiddleware.authenticate, UserController, 'profile'])
```

##### `AuthMiddleware.optional`

Same as `authenticate` but never blocks. Sets `req.user = null` if token is absent or invalid, then calls `next()`.

```javascript
Routes.get('feed', [AuthMiddleware.optional, FeedController, 'index'])
```

##### `AuthMiddleware.role(...roles)`

Returns an Express middleware that checks `req.user.role` against the allowed roles list. Must be used **after** `authenticate`. Returns `401` if `req.user` is not set, `403` if role doesn't match.

```javascript
Routes.get('admin', [AuthMiddleware.authenticate, AuthMiddleware.role('admin'), AdminController, 'index'])
Routes.get('manage', [AuthMiddleware.authenticate, AuthMiddleware.role('admin', 'editor'), ManageController, 'index'])
```

**Parameters:**
- `...roles` (string): One or more allowed role strings

##### `AuthMiddleware.can(...permissions)`

Returns an Express middleware that checks all listed permissions against `req.user.permissions[]`. Returns `401` if not authenticated, `403` if any permission is missing.

```javascript
Routes.delete('posts/:id', [AuthMiddleware.authenticate, AuthMiddleware.can('post:delete'), PostController, 'destroy'])
```

**Parameters:**
- `...permissions` (string): One or more required permission strings

---

### EnvValidator ✨ v3.0.0

Validates required environment variables at application startup. Called automatically by `Boot.start()` via `validateFromConfig()`.

```javascript
const EnvValidator = require('@core/env.validator')
```

#### Methods

##### `EnvValidator.validate(requiredKeys)`

Validates that all keys in the array are set and non-empty. Throws with a descriptive error listing all missing keys.

```javascript
EnvValidator.validate(['JWT_SECRET', 'DB_HOST', 'APP_URL'])
```

**Parameters:**
- `requiredKeys` (string[]): Array of required env var names

**Throws:** `Error` listing all missing variable names

##### `EnvValidator.validateFromConfig()`

Reads `config.app.requiredEnv` and validates those keys. Called automatically during boot.

To use, add the `REQUIRED_ENV` var to `.env` (comma-separated) or set `app.requiredEnv` directly in `app/config.js`:

```env
REQUIRED_ENV=JWT_SECRET,DB_HOST,MAIL_USER
```

---

### Health Check ✨ v3.0.0

`GET /health` is automatically registered by `express.core.js`. No configuration required.

**Response:**

```json
{
  "status": true,
  "code": 200,
  "message": "OK",
  "data": {
    "app": "Node Framework",
    "env": "production",
    "uptime": 3600,
    "timestamp": "2026-05-25T10:00:00.000Z",
    "memory": {
      "rss": "85 MB",
      "heapUsed": "42 MB",
      "heapTotal": "56 MB"
    }
  }
}
```

---

## Helpers

### RateLimit ✨ v3.0.0

Factory for `express-rate-limit` middleware instances. A **global** rate limiter is auto-applied by `express.core.js`. Use `RateLimit` for per-route limits.

```javascript
const RateLimit = require('@core/helpers/rateLimit.helper')
```

#### Methods

##### `RateLimit.create(windowMs, max, message)`

Creates a custom rate limiter.

```javascript
const limiter = RateLimit.create(60 * 1000, 30) // 30 req/min
Routes.get('search', [limiter, SearchController, 'index'])
```

**Parameters:**
- `windowMs` (number): Time window in ms (default: 15 min)
- `max` (number): Max requests per window (default: 100)
- `message` (string): Error message (default: generic 429 message)

##### `RateLimit.strict(max, windowMs)`

Tight limits for sensitive endpoints (default: 10 req/15min).

```javascript
Routes.post('login', [RateLimit.strict(), AuthController, 'login'])
Routes.post('otp/send', [RateLimit.strict(5), OtpController, 'send'])
```

##### `RateLimit.generous(max, windowMs)`

Loose limits for public endpoints (default: 300 req/15min).

```javascript
Routes.get('posts', [RateLimit.generous(), PostController, 'index'])
```

##### `RateLimit.global()`

Standard global-level limit (200 req/15min). Used internally by `express.core.js`.

**Global rate limit config via `.env`:**

```env
RATE_LIMIT_ENABLED=true
RATE_LIMIT_MAX=200
RATE_LIMIT_WINDOW_MS=900000
```

---

## File Upload API

Using express-fileupload, files are available in `req.files`.

### Example Usage

```javascript
Routes.post('/upload', ({ req, res }) => {
    // Check if files exist
    if (!req.files || !req.files.file) {
        return res.status(400).json({
            success: false,
            message: 'No file uploaded',
        })
    }

    const file = req.files.file

    // File properties
    console.log(file.name) // Original filename
    console.log(file.mimetype) // MIME type
    console.log(file.size) // File size in bytes
    console.log(file.tempFilePath) // Temp file path

    // Move file to destination
    const uploadPath = __dirname + '/uploads/' + file.name

    file.mv(uploadPath, (err) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: 'File upload failed',
                error: err,
            })
        }

        res.json({
            success: true,
            message: 'File uploaded successfully',
            filename: file.name,
        })
    })
})
```

### Multiple Files

```javascript
Routes.post('/upload-multiple', ({ req, res }) => {
    if (!req.files || !req.files.files) {
        return res.status(400).json({ error: 'No files uploaded' })
    }

    const files = Array.isArray(req.files.files) ? req.files.files : [req.files.files]

    files.forEach((file) => {
        const uploadPath = __dirname + '/uploads/' + file.name
        file.mv(uploadPath)
    })

    res.json({ message: `${files.length} files uploaded` })
})
```

### File Validation

```javascript
Routes.post('/upload', ({ req, res }) => {
    if (!req.files || !req.files.file) {
        return res.status(400).json({ error: 'No file' })
    }

    const file = req.files.file

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
        return res.status(400).json({ error: 'File too large' })
    }

    // Validate MIME type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif']
    if (!allowedTypes.includes(file.mimetype)) {
        return res.status(400).json({ error: 'Invalid file type' })
    }

    // Process file...
})
```

---

## Routing API

Routing is handled by the [`@refkinscallv/express-routing`](https://www.npmjs.com/package/@refkinscallv/express-routing) package. All route files live in `app/routes/` and are loaded via `app/routes/register.route.js`.

```javascript
const Routes = require('@refkinscallv/express-routing')
```

---

### Handler Formats

Every route handler receives a single context object `{ req, res, next, error }` — all standard Express objects. There are two ways to register a handler:

**1. Inline destructured function (recommended for simple routes)**

```javascript
Routes.get('users', ({ req, res }) => {
    res.json({ users: [] })
})

// Access all context properties as needed
Routes.get('users/:id', ({ req, res, next }) => {
    const { id } = req.params
    res.json({ id })
})
```

> **Important:** Handler functions always receive `{ req, res, next, error }` as a single object — never as positional arguments. Always use destructuring `({ req, res })`, not `(req, res)`.

**2. Controller array `[Class, 'method']` (recommended for controller-based routes)**

```javascript
const UserController = require('@app/http/controllers/user.controller')

Routes.get('users', [UserController, 'index'])
Routes.post('users', [UserController, 'store'])
Routes.put('users/:id', [UserController, 'update'])
Routes.delete('users/:id', [UserController, 'destroy'])
```

Resolves both static and instance methods. Works with classes that extend `BaseController`.

Controller methods must also use the destructured signature:

```javascript
module.exports = class UserController extends BaseController {
    // With BaseController.handle() — recommended (auto error forwarding)
    static index = BaseController.handle(async ({ req, res }) => {
        return BaseController.json(res, await UserService.getAll())
    })

    // Without handle() — manual (must use { req, res })
    static async show({ req, res }) {
        const user = await UserService.findById(req.params.id)
        return BaseController.json(res, user)
    }
}
```

---

### HTTP Methods

```javascript
Routes.get('path', handler)
Routes.post('path', handler)
Routes.put('path', handler)
Routes.delete('path', handler)
Routes.patch('path', handler)
Routes.options('path', handler)
Routes.head('path', handler)
```

**Multi-method route** — `Routes.add(methods, path, handler, middlewares)`:

```javascript
// Accept both GET and POST on the same path
Routes.add(['get', 'post'], 'search', [SearchController, 'handle'])
```

---

### Route Parameters & Query Strings

```javascript
// URL parameter — req.params.id
Routes.get('users/:id', ({ req, res }) => {
    const { id } = req.params
    res.json({ id })
})

// Multiple params
Routes.get('posts/:postId/comments/:commentId', ({ req, res }) => {
    const { postId, commentId } = req.params
    res.json({ postId, commentId })
})

// Query string — req.query
// GET /search?q=node&page=2&limit=10
Routes.get('search', ({ req, res }) => {
    const { q, page = 1, limit = 10 } = req.query
    res.json({ q, page, limit })
})
```

---

### Per-Route Middlewares

Pass middlewares as the **third argument** (array of plain Express functions):

```javascript
const AuthMiddleware = require('@app/http/middlewares/auth.middleware')
const RateLimit = require('@core/helpers/rateLimit.helper')

// Single middleware
Routes.get('profile', [UserController, 'profile'], [AuthMiddleware.authenticate])

// Multiple middlewares — executed left to right
Routes.post('posts', [PostController, 'store'], [
    RateLimit.strict(),
    AuthMiddleware.authenticate,
    AuthMiddleware.role('editor', 'admin'),
])

// Role gate chained after authenticate
Routes.delete('users/:id', [UserController, 'destroy'], [
    AuthMiddleware.authenticate,
    AuthMiddleware.role('admin'),
])

// Permission gate
Routes.patch('posts/:id', [PostController, 'update'], [
    AuthMiddleware.authenticate,
    AuthMiddleware.can('post:edit'),
])

// Optional auth — req.user set if token present, null otherwise
Routes.get('feed', [FeedController, 'index'], [AuthMiddleware.optional])
```

---

### Route Groups

Group routes under a shared path prefix:

```javascript
// Simple prefix group
Routes.group('api', () => {
    Routes.get('users', [UserController, 'index'])    // → GET /api/users
    Routes.post('users', [UserController, 'store'])   // → POST /api/users
})

// Nested groups
Routes.group('api', () => {
    Routes.group('v1', () => {
        Routes.get('users', [UserController, 'index'])  // → GET /api/v1/users
    })
    Routes.group('v2', () => {
        Routes.get('users', [UserController, 'indexV2']) // → GET /api/v2/users
    })
})

// Group with shared middlewares (plain functions allowed here)
Routes.group('admin', () => {
    Routes.get('users', [UserController, 'index'])
    Routes.get('settings', [SettingsController, 'index'])
}, [AuthMiddleware.authenticate, AuthMiddleware.role('admin')])
```

---

### Scoped Middlewares — `Routes.middleware()`

Apply middlewares to a block of routes without repeating them per-route.

**Scoped mode** (callback — accepts plain functions):

```javascript
Routes.middleware([AuthMiddleware.authenticate], () => {
    // All routes inside here require authentication
    Routes.get('profile', [UserController, 'profile'])
    Routes.put('profile', [UserController, 'updateProfile'])

    Routes.middleware([AuthMiddleware.role('admin')], () => {
        // Nested — requires auth + admin role
        Routes.get('admin/users', [AdminController, 'users'])
        Routes.delete('admin/users/:id', [AdminController, 'deleteUser'])
    })
})
```

**Chaining mode** (no callback — handler class must implement `handle()`):

```javascript
// Note: chaining mode requires middlewares to have a handle() method
Routes.middleware([AuthMiddlewareClass])
    .get('dashboard', [DashboardController, 'index'])
```

> For most cases, the **scoped mode with callback** is recommended as it works with all standard Express middleware functions.

---

### Controller Auto-Registration — `Routes.controller()`

Auto-registers all methods of a controller class based on naming conventions:

```javascript
Routes.controller('users', UserController)
```

**Naming convention:**

| Method Name | HTTP Method | Path |
|-------------|-------------|------|
| `index` | GET | `/users` |
| `store` | GET | `/users/store` |
| `post_store` | POST | `/users` *(prefix stripped)* |
| `put_update` | PUT | `/users` |
| `delete_destroy` | DELETE | `/users` |
| `getUserById` | GET | `/users/get-user-by-id` |

Methods prefixed with `post_`, `put_`, `delete_`, `patch_`, `options_`, `head_` use that HTTP method. All others default to GET.

**With per-method middlewares (3rd argument):**

```javascript
Routes.controller('users', UserController, {
    post_store: [AuthMiddleware.authenticate, AuthMiddleware.role('admin')],
    delete_destroy: [AuthMiddleware.authenticate, AuthMiddleware.role('admin')],
})
```

---

### Custom Error Handler — `Routes.errorHandler()`

Register a custom error handler applied after all routes:

```javascript
Routes.errorHandler(({ req, res, next, error }) => {
    res.status(error.status || 500).json({
        status: false,
        code: error.status || 500,
        message: error.message || 'Internal Server Error',
    })
})

// Or with [Controller, 'method'] format
Routes.errorHandler([ErrorController, 'handle'])
```

---

### Maintenance Mode — `Routes.maintenance()`

Intercept all requests and return a 503 response:

```javascript
// Enable maintenance — all routes return 503
Routes.maintenance(true)

// Enable with custom handler
Routes.maintenance(true, ({ res }) => {
    res.status(503).json({ message: 'Down for maintenance. Back soon!' })
})

// Disable maintenance
Routes.maintenance(false)

// With environment flag
Routes.maintenance(process.env.MAINTENANCE_MODE === 'true')
```

---

### Complete Route File Example

```javascript
// app/routes/api.route.js
'use strict'

const Routes = require('@refkinscallv/express-routing')
const AuthMiddleware = require('@app/http/middlewares/auth.middleware')
const RateLimit = require('@core/helpers/rateLimit.helper')
const AuthController = require('@app/http/controllers/auth.controller')
const UserController = require('@app/http/controllers/user.controller')
const PostController = require('@app/http/controllers/post.controller')

Routes.group('api', () => {

    // ── Auth (public, rate-limited) ─────────────────────────────
    Routes.post('auth/login', [AuthController, 'login'], [RateLimit.strict()])
    Routes.post('auth/register', [AuthController, 'register'], [RateLimit.strict()])
    Routes.post('auth/refresh', [AuthController, 'refresh'], [RateLimit.strict(10)])

    // ── Public routes ───────────────────────────────────────────
    Routes.get('posts', [PostController, 'index'])
    Routes.get('posts/:id', [PostController, 'show'])

    // ── Authenticated routes (scoped) ───────────────────────────
    Routes.middleware([AuthMiddleware.authenticate], () => {

        Routes.get('profile', [UserController, 'profile'])
        Routes.put('profile', [UserController, 'updateProfile'])
        Routes.post('auth/logout', [AuthController, 'logout'])

        Routes.post('posts', [PostController, 'store'], [AuthMiddleware.can('post:create')])
        Routes.put('posts/:id', [PostController, 'update'], [AuthMiddleware.can('post:edit')])
        Routes.delete('posts/:id', [PostController, 'destroy'], [AuthMiddleware.can('post:delete')])

        // ── Admin only ──────────────────────────────────────────
        Routes.group('admin', () => {
            Routes.controller('users', UserController)
        }, [AuthMiddleware.role('admin')])
    })
})
```

---

### Route Registration Flow

Routes are loaded by the framework in this order:

1. `app/routes/register.route.js` — imports all route files (you add new files here)
2. `Routes.apply(router)` — called by `express.core.js`, registers all routes on the Express router
3. `ErrorHandler` — registered after routes by `errorHandler.core.js`

```javascript
// app/routes/register.route.js
'use strict'

require('@app/routes/web.route')
require('@app/routes/api.route')
// require('@app/routes/admin.route')  ← add new route files here
```

---

## Configuration API

All configuration in `app/config.js`.

### Structure

```javascript
module.exports = {
    app: {
        /* app settings */
    },
    server: {
        /* server settings */
    },
    express: {
        cors: {
            /* CORS options */
        },
        static: {
            /* static files */
        },
        view: {
            /* view engine */
        },
        fileupload: {
            /* file upload options */
        },
    },
    socket: {
        /* Socket.IO options */
    },
    database: {
        /* database settings */
    },
    jwt: {
        /* JWT settings */
    },
    mailer: {
        /* email settings */
    },
}
```

### Accessing Config

```javascript
const config = require('@app/config')

console.log(config.app.port) // 3025
console.log(config.database.host) // localhost
console.log(config.jwt.expiresIn) // 7d
```

---

## Best Practices

1. **Error Handling**: Always use try-catch blocks and log errors
2. **Validation**: Validate user inputs before processing
3. **Security**: Use JWT for authentication, validate file uploads
4. **Logging**: Use appropriate log levels (info, warn, error, debug)
5. **Database**: Use transactions for complex operations
6. **File Uploads**: Validate file types and sizes
7. **Environment**: Use different configs for development/production

---

## Example Application

### User Registration with Email

```javascript
// app/routes/auth.route.js
const Routes = require('@refkinscallv/express-routing')
const Database = require('@core/database.core')
const JWT = require('@core/jwt.core')
const Mailer = require('@core/mailer.core')
const bcrypt = require('bcrypt')

Routes.post('/register', async ({ req, res }) => {
    try {
        const { email, password, name } = req.body

        // Validate input
        if (!email || !password || !name) {
            return res.status(400).json({
                success: false,
                message: 'All fields required',
            })
        }

        // Get User model
        const User = Database.getModel('User')

        // Check if user exists
        const existing = await User.findOne({ where: { email } })
        if (existing) {
            return res.status(400).json({
                success: false,
                message: 'Email already registered',
            })
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10)

        // Create user
        const user = await User.create({
            email,
            password: hashedPassword,
            name,
        })

        // Generate JWT
        const token = JWT.sign({ userId: user.id })

        // Send welcome email
        await Mailer.send(email, 'Welcome!', 'welcome', { name })

        res.json({
            success: true,
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
        })
    } catch (err) {
        Logger.set(err, 'auth')
        res.status(500).json({
            success: false,
            message: 'Registration failed',
        })
    }
})
```

---

## Breaking Changes

### Version 2.0.0

#### `server.core.js` — HTTP options no longer passed to createServer()

Previously, `config.server.options` was passed directly to `http.createServer()`. These options (`poweredBy`, `maxHeaderSize`, etc.) are NOT valid Node.js HTTP server options. They are now discarded. Server-level timeouts (`keepAliveTimeout`, `requestTimeout`, `headersTimeout`) must be applied via `Server.applyOptions(server)` (called automatically by Boot).

#### `BaseController.validationError()` — Status changed to 422

```javascript
// Before (v1.0.5): returned 400
// After (v2.0.0): returns 422 (correct HTTP status for validation errors)
BaseController.validationError(res, validation) // → 422 Unprocessable Entity
```

---

### Version 1.0.5

#### Database.close() is now async

The `Database.close()` method is asynchronous and returns a Promise:

```javascript
// Before (v1.0.0)
Database.close()

// After (v1.0.5+)
await Database.close()
```

---

**Framework Version**: 3.0.2  
**Last Updated**: 2026-05-25

For more examples and detailed guides, see the [README.md](README.md).
