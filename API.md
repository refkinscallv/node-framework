# Framework API Documentation v2.1.0

Complete API reference for the Node.js MVC Framework.

## Table of Contents

- [Core Modules](#core-modules)
    - [Boot](#boot)
    - [Database](#database)
    - [Express](#express)
    - [Logger](#logger)
    - [JWT](#jwt)
    - [Mailer](#mailer)
    - [Hooks](#hooks)
    - [Socket](#socket)
    - [Server](#server)
    - [Runtime](#runtime)
    - [ErrorHandler](#errorhandler)
- [App Layer](#app-layer)
    - [BaseController](#basecontroller)
    - [BaseService](#baseservice)

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

#### Properties

##### `Database.models`

Object containing all loaded models.

```javascript
const models = Database.models
console.log(Object.keys(models)) // ['User', 'Post', ...]
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
static async getAll(req, res) {
    try {
        const result = await UserService.getAll()
        return BaseController.json(res, result)
    } catch (err) {
        return BaseController.serverError(res, err.message)
    }
}

// After: use handle()
static getAll = BaseController.handle(async (req, res) => {
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

Using `@refkinscallv/express-routing` package.

### Basic Routes

```javascript
const Routes = require('@refkinscallv/express-routing')

// GET route
Routes.get('/users', ({ req, res }) => {
    res.json({ users: [] })
})

// POST route
Routes.post('/users', ({ req, res }) => {
    res.json({ message: 'User created' })
})

// PUT route
Routes.put('/users/:id', ({ req, res }) => {
    res.json({ id: req.params.id })
})

// DELETE route
Routes.delete('/users/:id', ({ req, res }) => {
    res.json({ deleted: true })
})

// PATCH route
Routes.patch('/users/:id', ({ req, res }) => {
    res.json({ updated: true })
})
```

### Route Parameters

```javascript
Routes.get('/users/:id', ({ req, res }) => {
    const userId = req.params.id
    res.json({ userId })
})

Routes.get('/posts/:postId/comments/:commentId', ({ req, res }) => {
    const { postId, commentId } = req.params
    res.json({ postId, commentId })
})
```

### Query Parameters

```javascript
Routes.get('/search', ({ req, res }) => {
    const { q, page, limit } = req.query
    res.json({ query: q, page, limit })
})
// GET /search?q=nodejs&page=1&limit=10
```

### Middleware

```javascript
const authMiddleware = (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(401).json({ error: 'Unauthorized' })
    }
    next()
}

Routes.get('/protected', authMiddleware, ({ req, res }) => {
    res.json({ message: 'Protected data' })
})
```

### Route Groups

```javascript
// API routes with prefix
Routes.group({ prefix: '/api/v1' }, () => {
    Routes.get('/users', userController.index)
    Routes.post('/users', userController.store)
})
// Results in: /api/v1/users
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

**Framework Version**: 2.0.0  
**Last Updated**: 2026-03-11

For more examples and detailed guides, see the [README.md](README.md).
