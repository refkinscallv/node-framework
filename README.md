# Node Framework - Node.js MVC Framework

[![Version](https://img.shields.io/badge/version-2.1.0-blue.svg)](https://github.com/refkinscallv/node-framework)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D24.0.0-brightgreen.svg)](https://nodejs.org/)
[![npm](https://img.shields.io/badge/npm-%3E%3D11.0.0-red.svg)](https://www.npmjs.com/)
[![Express](https://img.shields.io/badge/express-5.x-lightgrey.svg)](https://expressjs.com/)
[![Socket.IO](https://img.shields.io/badge/socket.io-4.x-black.svg)](https://socket.io/)
[![Sequelize](https://img.shields.io/badge/sequelize-6.x-52B0E7.svg)](https://sequelizejs.com/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/refkinscallv/node-framework/graphs/commit-activity)

> **v2.1.0**: Advanced JWT security (Refresh tokens, Issuer/Audience), CLI setup script (`npm run setup`), Logger optimizations for Dev/Prod, and core stability updates.

A modern and comprehensive Node.js MVC framework with Express, Socket.IO, Sequelize ORM, and real-time capabilities for building scalable web applications.

## Features

- **Express.js** - Fast, unopinionated web framework (v5.x)
- **Socket.IO** - Real-time bidirectional communication
- **Sequelize ORM** - Promise-based ORM for SQL databases
- **JWT Authentication** - Secure token-based authentication with refresh tokens
- **Email Support** - Built-in mailer with template and raw HTML support
- **File Upload** - Express-fileupload integration
- **EJS Templates** - Embedded JavaScript templating
- **Logging** - Winston logger with file rotation
- **Security** - CORS, Helmet, Rate limiting
- **Testing** - Jest testing framework
- **Code Quality** - ESLint, Prettier, Husky
- **Helper Classes** - Env, Url, Hash, Str, Arr utilities
- **Environment Config** - .env support with type conversion + `getJson()`
- **BaseController.handle()** - Async error wrapper, zero boilerplate try/catch
- **BaseService shortcuts** - `success()`, `fail()`, `notFound()`, `conflict()` and more

## Requirements

- Node.js >= 24.0.0
- npm >= 11.0.0
- MySQL (if using database)

## Installation

```bash
# Clone the repository
git clone https://github.com/refkinscallv/node-framework.git

# Navigate to directory
cd node-framework

# Install dependencies and setup environment
npm run setup

# The setup script automatically:
# 1. Installs dependencies
# 2. Copies .env.example to .env
# 3. Generates strong, random JWT secrets for your environment
```

## Quick Start

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start

# Debug mode
npm run dev:debug
```

## Project Structure

```
node-framework/
├── app/                        # Application code
│   ├── config.js              # Configuration file
│   ├── hooks/                 # Application lifecycle hooks
│   ├── http/                  # HTTP layer
│   │   ├── controllers/       # Request handlers (extends BaseController)
│   │   ├── middlewares/       # Custom middlewares
│   │   └── validators/        # Input validation (Zod)
│   ├── models/                # Sequelize models (.model.js)
│   ├── routes/                # Application routes
│   ├── services/              # Business logic (extends BaseService)
│   └── sockets/               # Socket.IO handlers
├── core/                      # Framework core
│   ├── boot.core.js          # Application bootstrapper
│   ├── database.core.js      # Database manager
│   ├── express.core.js       # Express configuration
│   ├── errorHandler.core.js  # Error handler
│   ├── hooks.core.js         # Hooks manager
│   ├── jwt.core.js           # JWT utilities
│   ├── logger.core.js        # Logger configuration
│   ├── mailer.core.js        # Email sender
│   ├── runtime.core.js       # Runtime configuration
│   ├── server.core.js        # HTTP/HTTPS server
│   ├── socket.core.js        # Socket.IO configuration
│   └── helpers/              # Utility helper classes
│       ├── env.helper.js
│       ├── str.helper.js
│       ├── setup.helper.js
│       ├── arr.helper.js
│       ├── hash.helper.js
│       └── url.helper.js
├── public/                    # Public assets
│   ├── static/               # Static files (CSS, JS, images)
│   └── views/                # EJS templates
├── tests/                     # Test files
│   ├── unit/                 # Unit tests
│   └── integration/          # Integration tests
├── logs/                      # Application logs
├── tmp/                       # Temporary files (uploads)
├── index.js                   # Application entry point
├── package.json
└── README.md
```

## Configuration

All configuration is centralized in `app/config.js`:

### Application Settings

```javascript
app: {
    production: false,           // Production mode
    port: 3025,                 // Server port
    url: 'http://localhost:3025', // Base URL
    name: 'My App',             // App name
    timezone: 'Asia/Jakarta',   // Timezone
    log_dir: 'logs',           // Logs directory
}
```

### Database Configuration

```javascript
database: {
    status: false,              // Enable/disable database
    dialect: 'mysql',          // Database type
    host: 'localhost',
    port: 3306,
    database: 'database',
    username: 'root',
    password: '',
    sync: true,                 // Auto-sync models
    alter: false,               // Alter existing tables
    // ... more options
}
```

## Controllers

Create controllers extending `BaseController` in `app/http/controllers/`:

```javascript
const BaseController = require('@app/http/controllers/base.controller')
const UserService = require('@app/services/user.service')

module.exports = class UserController extends BaseController {

    // v2.0.0: handle() wraps async — no more manual try/catch!
    static getAll = BaseController.handle(async (req, res) => {
        const result = await UserService.getAll()
        return BaseController.json(res, result)
    })

    static store = BaseController.handle(async (req, res) => {
        const result = await UserService.store(req.body)
        return BaseController.json(res, result)
    })
}
```

**Available BaseController methods:**

| Method | Status | Description |
|--------|--------|-------------|
| `handle(fn)` | ✨ New | Async wrapper, errors auto-forwarded to Express error handler |
| `json(res, output)` | - | Universal JSON response (pass BaseService output directly) |
| `success(res, msg, data)` | - | 200 response |
| `created(res, msg, data)` | - | 201 response |
| `error(res, msg, code)` | - | Error response |
| `validationError(res, v)` | - | 422 validation error |
| `notFound(res, msg)` | - | 404 response |
| `unauthorized(res, msg)` | - | 401 response |
| `forbidden(res, msg)` | - | 403 response |
| `serverError(res, msg)` | - | 500 response |
| `paginated(res, items, meta)` | ✨ New | Paginated response with meta |
| `noContent(res)` | - | 204 response |

## Services

Create services extending `BaseService` in `app/services/`:

```javascript
const BaseService = require('@app/services/base.service')
const Database = require('@core/database.core')

module.exports = class UserService extends BaseService {
    static async getAll() {
        const User = Database.getModel('User')
        const users = await User.findAll()
        return this.success('Users retrieved', users)
    }

    static async store(body) {
        const User = Database.getModel('User')
        const existing = await User.findOne({ where: { email: body.email } })
        if (existing) return this.conflict('Email already registered')

        const user = await User.create(body)
        return this.created('User created', user)
    }
}
```

**Available BaseService methods (v2.0.0):**

| Method | Code | Description |
|--------|------|-------------|
| `json(status, code, msg, data, custom)` | - | Universal builder |
| `success(msg, data)` | ✨ 200 | Success |
| `created(msg, data)` | ✨ 201 | Created |
| `fail(msg, code, data)` | ✨ 400 | Generic error |
| `notFound(msg)` | ✨ 404 | Not found |
| `unauthorized(msg)` | ✨ 401 | Unauthorized |
| `forbidden(msg)` | ✨ 403 | Forbidden |
| `conflict(msg)` | ✨ 409 | Conflict / duplicate |
| `validationFail(msg, errors)` | ✨ 422 | Validation error |
| `serverError(msg)` | ✨ 500 | Server error |

## Models

Define models in `app/models/` (file must end with `.model.js`):

```javascript
// app/models/user.model.js
module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
        },
    }, {
        tableName: 'users'
    })

    return User
}
```

## Routing

Define routes in `app/routes/`:

```javascript
// app/routes/api.route.js
const Routes = require('@refkinscallv/express-routing')
const UserController = require('@app/http/controllers/user.controller')

Routes.group('api', () => {
    Routes.group('users', () => {
        Routes.get('/', [UserController, 'getAll'])
        Routes.post('/', [UserController, 'store'])
    })
})
```

## Socket.IO

Register socket handlers in `app/sockets/register.socket.js`:

```javascript
module.exports = {
    register(io) {
        io.on('connection', (socket) => {
            socket.on('message', (data) => {
                io.emit('message', data)
            })
        })
    },
}
```

## Helper Classes

```javascript
const { Env, Url, Hash, Str, Arr } = require('@core/helpers')

// Environment variables (v2.0.0: fixed empty-string bug)
const port = Env.getInt('APP_PORT', 3000)
const config = Env.getJson('APP_CONFIG', {})   // NEW: parse JSON env var
const isDev = Env.isDevelopment()

// URL generation
const profileUrl = Url.to('users/profile')
const apiUrl = Url.api('users')

// Hashing
const hashed = await Hash.make('password')
const token = Hash.random(32)
const id = Hash.uuid()
const sig = Hash.hmac(data, secret)     // NEW: HMAC signature

// String manipulation (v2.0.0: fixed camelCase, +isEmpty/padLeft/padRight)
const slug = Str.slug('My Blog Post')
const camel = Str.camelCase('hello_world')  // FIX: now handles _ and -
const empty = Str.isEmpty('  ')             // NEW: true
const padded = Str.padLeft('42', 5, '0')    // NEW: '00042'

// Array operations (v2.0.0: fixed first/last empty array, +compact/sum)
const first = Arr.first([], 'default')      // FIX: returns 'default' not undefined
const last = Arr.last([1,2,3])
const clean = Arr.compact([0, 1, null, 2])  // NEW: [1, 2]
const total = Arr.sum([{price: 10}, {price: 20}], 'price') // NEW: 30
```

See [HELPERS.md](HELPERS.md) for complete documentation.

## Hooks

Use hooks for lifecycle events in `app/hooks/register.hook.js`:

```javascript
module.exports = {
    register(Hooks) {
        Hooks.register('before', async () => {
            // Before initialization
        })
        Hooks.register('after', async () => {
            // After initialization
        })
        Hooks.register('shutdown', async () => {
            // Cleanup on shutdown
        })
    },
}
```

## Testing

```bash
# Run all tests
npm test

# Run unit tests only
npm run test:unit

# Run in watch mode
npm run test:watch
```

## Scripts

```bash
npm run dev              # Start with nodemon
npm run dev:debug        # Start with debugger
npm start                # Production start
npm run lint             # Run ESLint
npm run format           # Format with Prettier
npm run logs:clear       # Clear log files
```

## Security

- Use strong JWT secrets in production
- Enable HTTPS in production (`SERVER_HTTPS=true`)
- Configure CORS appropriately
- Use environment variables for sensitive data
- Enable rate limiting for APIs

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Author

**Refkinscallv**

- Email: refkinscallv@gmail.com
- GitHub: [@refkinscallv](https://github.com/refkinscallv)

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for details.

## Version History

- **2.1.0** (2026-04-25) - JWT refresh tokens, Setup script, Core tests, Logger optimizations
- **2.0.0** (2026-03-11) - Major bug fixes, scalability & DX improvements, new helper methods
- **1.0.5** (2026-02-03) - Bug fixes and stability improvements
- **1.0.0** (2026-01-04) - Initial release

---

Made with ❤️ by Refkinscallv
