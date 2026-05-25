<div align="center">

# Node Framework

**A batteries-included MVC framework for Node.js**

Build production-ready REST APIs and real-time apps — without reinventing the wheel.

[![Version](https://img.shields.io/badge/version-3.0.2-6366f1.svg?style=for-the-badge)](https://github.com/refkinscallv/node-framework/releases)
[![License](https://img.shields.io/badge/license-MIT-22c55e.svg?style=for-the-badge)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D24.0.0-339933.svg?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/express-5.x-000000.svg?style=for-the-badge&logo=express)](https://expressjs.com/)
[![Socket.IO](https://img.shields.io/badge/socket.io-4.x-010101.svg?style=for-the-badge&logo=socket.io)](https://socket.io/)

[![CI](https://github.com/refkinscallv/node-framework/actions/workflows/ci.yml/badge.svg)](https://github.com/refkinscallv/node-framework/actions/workflows/ci.yml)
[![Tests](https://img.shields.io/badge/tests-220%20passing-22c55e.svg?style=flat-square)](tests/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-6366f1.svg?style=flat-square)](CONTRIBUTING.md)
[![Maintained](https://img.shields.io/badge/maintained-yes-22c55e.svg?style=flat-square)](https://github.com/refkinscallv/node-framework/commits)
[![npm create](https://img.shields.io/badge/npm%20create-%40refkinscallv%2Fnode--framework-cb3837.svg?style=flat-square&logo=npm)](https://www.npmjs.com/package/@refkinscallv/create-node-framework)

<br/>

[**Quick Start**](#-quick-start) · [**Features**](#-features) · [**Documentation**](API.md) · [**Changelog**](CHANGELOG.md) · [**Contributing**](CONTRIBUTING.md)

</div>

---

## Why Node Framework?

Most Node.js projects start the same way: wire up Express, configure CORS, add JWT, set up a logger, connect a database, add validation... **before writing a single line of business logic.**

Node Framework handles all of that — opinionated where it matters, extensible where it counts.

```bash
npm create @refkinscallv/node-framework my-app
cd my-app && npm run dev
```

Your app is running. Routes, auth, database, sockets, logging — already wired.

---

## ✨ Features

### Core

| | Feature | Description |
|--|---------|-------------|
| 🚀 | **Express 5.x** | Latest Express with async error propagation |
| ⚡ | **Socket.IO 4.x** | Real-time events with optional JWT auth per connection |
| 🗄️ | **Sequelize ORM** | Auto-loads models, associations, migrations, seeds |
| 🔄 | **Transactions** | `Database.transaction()` — auto commit/rollback |
| 🔒 | **JWT Auth** | Access + refresh tokens with issuer/audience validation |
| 🛡️ | **Auth Middleware** | `authenticate`, `role()`, `can()`, `optional` — ready to use |
| 🗃️ | **Cache** | In-memory TTL cache: `remember`, `pull`, `increment` |
| 🚦 | **Rate Limiting** | Global auto-wired + `RateLimit.strict()` per route |
| 🩺 | **Health Check** | `GET /health` — uptime, memory, env — auto-registered |
| ✅ | **Env Validation** | Fail-fast on missing required env vars at startup |

### Developer Experience

| | Feature | Description |
|--|---------|-------------|
| 📦 | **BaseController** | `handle()` wraps async — zero boilerplate try/catch |
| 🏗️ | **BaseService** | Structured responses: `success()`, `fail()`, `conflict()` |
| 📨 | **Mailer** | EJS templates + raw HTML, SMTP via Nodemailer |
| 📝 | **Logger** | Winston — console in dev, rotating files in prod |
| 🔗 | **Hooks** | Lifecycle events: `before`, `after`, `shutdown` |
| 🛠️ | **Helpers** | `Env`, `Str`, `Arr`, `Hash`, `Url`, `RateLimit` utilities |
| 🔍 | **Zod Validation** | Schema-based request validation |
| 🐳 | **Docker** | Multi-stage Dockerfile + docker-compose with MySQL |
| 🧪 | **205+ Tests** | Jest unit + Supertest integration — coverage enforced |
| 🎨 | **Code Quality** | ESLint + Prettier + Husky pre-commit hooks |

---

## 🚀 Quick Start

### Option 1 — `npm create` (Recommended)

```bash
# npm
npm create @refkinscallv/node-framework my-app

# pnpm
pnpm create @refkinscallv/node-framework my-app

# yarn
yarn create @refkinscallv/node-framework my-app
```

The CLI scaffolds the project, installs dependencies, and generates `.env` with secure JWT keys.

### Option 2 — Clone

```bash
git clone https://github.com/refkinscallv/node-framework.git my-app
cd my-app
npm run setup      # copies .env.example → .env + generates JWT secrets
npm run dev
```

### Option 3 — Docker

```bash
git clone https://github.com/refkinscallv/node-framework.git my-app
cd my-app && cp .env.example .env
# Edit .env with your settings
docker compose up -d
```

### Available Scripts

```bash
npm run dev          # Start with nodemon (auto-reload)
npm run dev:debug    # Start with Node.js inspector
npm start            # Production
npm test             # Jest with coverage
npm run lint         # ESLint --fix
npm run format       # Prettier
npm run db:migrate   # Run migrations
npm run db:seed      # Run seeders
npm run db:reset     # Drop + recreate tables
npm run logs:clear   # Clear log files
```

---

## 📁 Project Structure

```
my-app/
├── app/                              # Your application code
│   ├── config.js                    # Centralized configuration
│   ├── hooks/register.hook.js       # Lifecycle hooks (before/after/shutdown)
│   ├── http/
│   │   ├── controllers/
│   │   │   └── base.controller.js   # Response helpers + handle()
│   │   ├── middlewares/
│   │   │   ├── auth.middleware.js   # JWT auth + role() + can() + optional
│   │   │   └── register.middleware.js
│   │   └── validators/              # Zod schema validators
│   ├── models/                      # Sequelize models (*.model.js)
│   ├── routes/
│   │   ├── register.route.js        # Imports all route files
│   │   ├── web.route.js
│   │   └── api.route.js
│   ├── services/
│   │   └── base.service.js          # Structured response builders
│   └── sockets/register.socket.js   # Socket.IO event handlers
│
├── core/                             # Framework internals
│   ├── boot.core.js                 # Boot sequence
│   ├── cache.core.js                # In-memory cache
│   ├── database.core.js             # Sequelize + transaction()
│   ├── env.validator.js             # Startup env validation
│   ├── express.core.js              # Express + /health + rate limiter
│   ├── jwt.core.js                  # JWT sign/verify/refresh
│   ├── logger.core.js               # Winston logger
│   ├── mailer.core.js               # Nodemailer
│   ├── socket.core.js               # Socket.IO + JWT auth
│   └── helpers/
│       ├── env.helper.js            # Env var access with type casting
│       ├── arr.helper.js            # Array utilities
│       ├── hash.helper.js           # bcrypt, sha256, uuid, hmac
│       ├── rateLimit.helper.js      # Per-route rate limiter factory
│       ├── str.helper.js            # String utilities
│       └── url.helper.js            # URL generation
│
├── Dockerfile                        # Multi-stage (dev + production)
├── docker-compose.yml                # App + MySQL
├── .env.example                      # Environment variable template
└── package.json
```

---

## 📖 Usage Examples

### Controllers & Services

```javascript
// app/services/user.service.js
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

```javascript
// app/http/controllers/user.controller.js
const BaseController = require('@app/http/controllers/base.controller')
const UserService = require('@app/services/user.service')

module.exports = class UserController extends BaseController {
    // handle() = zero boilerplate try/catch — errors auto-forwarded to Express
    static getAll = BaseController.handle(async ({ req, res }) => {
        return BaseController.json(res, await UserService.getAll())
    })

    static store = BaseController.handle(async ({ req, res }) => {
        return BaseController.json(res, await UserService.store(req.body))
    })
}
```

### Routing with Auth & Rate Limiting

```javascript
// app/routes/api.route.js
const Routes = require('@refkinscallv/express-routing')
const AuthMiddleware = require('@app/http/middlewares/auth.middleware')
const RateLimit = require('@core/helpers/rateLimit.helper')
const AuthController = require('@app/http/controllers/auth.controller')
const UserController = require('@app/http/controllers/user.controller')

Routes.group('api', () => {

    // Public — rate-limited
    Routes.post('auth/login', [AuthController, 'login'], [RateLimit.strict()])
    Routes.post('auth/register', [AuthController, 'register'], [RateLimit.strict()])

    // Authenticated — scoped middleware block
    Routes.middleware([AuthMiddleware.authenticate], () => {
        Routes.get('profile', [UserController, 'profile'])
        Routes.put('profile', [UserController, 'update'])

        // Admin only
        Routes.group('admin', () => {
            Routes.controller('users', UserController)
        }, [AuthMiddleware.role('admin')])
    })
})
```

### Cache

```javascript
const Cache = require('@core/cache.core')

// Cache database results for 5 minutes
const users = await Cache.rememberAsync('users:all', 300, async () => {
    return await User.findAll()
})

// One-time token (pull = get + delete)
Cache.set('reset:token:abc', userId, 900)
const id = Cache.pull('reset:token:abc')

// Rate counter
if (Cache.increment(`login:fails:${ip}`) >= 5) {
    return BaseController.unauthorized(res, 'Too many failed attempts')
}
```

### Database Transactions

```javascript
const Database = require('@core/database.core')

await Database.transaction(async (t) => {
    const user = await User.create({ name: 'Alice', email: 'alice@example.com' }, { transaction: t })
    await Profile.create({ userId: user.id, bio: '...' }, { transaction: t })
    await Wallet.create({ userId: user.id, balance: 0 }, { transaction: t })
    // All created atomically — rolls back if any step fails
})
```

### Socket.IO with JWT Auth

```javascript
// .env
SOCKET_AUTH_ENABLED=true

// app/sockets/register.socket.js
module.exports = {
    register(io) {
        io.on('connection', (socket) => {
            // socket.user = decoded JWT payload (when SOCKET_AUTH_ENABLED=true)
            console.log(`${socket.user.email} connected`)

            socket.on('message', (data) => {
                io.to(socket.user.roomId).emit('message', {
                    from: socket.user.email,
                    ...data
                })
            })
        })
    }
}

// Client-side
const socket = io('http://localhost:3030', {
    auth: { token: 'your-jwt-token' }
})
```

### Environment Validation

```javascript
// .env
REQUIRED_ENV=JWT_SECRET,DB_HOST,MAIL_USER

// The app throws a clear error on startup if any are missing:
// Error: Missing required environment variables: JWT_SECRET, DB_HOST
```

### Health Check (automatic)

```
GET /health
```
```json
{
  "status": true,
  "code": 200,
  "message": "OK",
  "data": {
    "app": "My App",
    "env": "production",
    "uptime": 3600,
    "timestamp": "2026-05-25T10:00:00.000Z",
    "memory": { "rss": "85 MB", "heapUsed": "42 MB", "heapTotal": "56 MB" }
  }
}
```

---

## ⚙️ Environment Variables

Copy `.env.example` to `.env` and configure:

```env
# App
APP_NAME=My App
APP_PORT=3030
APP_URL=http://localhost:3030
APP_TIMEZONE=Asia/Jakarta
NODE_ENV=development

# Required env validation (comma-separated)
REQUIRED_ENV=JWT_SECRET,DB_HOST

# JWT (auto-generated by npm run setup)
JWT_SECRET=
JWT_REFRESH_SECRET=
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d

# Database
DB_ENABLED=false
DB_DIALECT=mysql
DB_HOST=localhost
DB_PORT=3306
DB_NAME=database
DB_USERNAME=root
DB_PASSWORD=

# Socket
SOCKET_AUTH_ENABLED=false

# Rate Limiting
RATE_LIMIT_ENABLED=true
RATE_LIMIT_MAX=200
RATE_LIMIT_WINDOW_MS=900000

# Mail
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=
MAIL_PASSWORD=

# Server
SERVER_HTTPS=false
```

---

## 🧪 Testing

```bash
npm test                  # All tests with coverage
npm run test:unit         # Unit tests only
npm run test:watch        # Watch mode
```

**Coverage thresholds** (enforced): branches 52% · functions 65% · lines/statements 55%

Tests are located in `tests/unit/` and `tests/integration/`.

---

## 🐳 Docker

**Development:**
```bash
docker compose up
```

**Production build:**
```bash
docker build --target production -t my-app .
docker run -p 3030:3030 --env-file .env my-app
```

---

## 🔐 Security Checklist

- [ ] Change `JWT_SECRET` and `JWT_REFRESH_SECRET` (use `npm run setup`)
- [ ] Set `NODE_ENV=production` in production
- [ ] Enable HTTPS (`SERVER_HTTPS=true`) with valid SSL certificates
- [ ] Configure CORS origin in `app/config.js` (not `*`)
- [ ] Set `RATE_LIMIT_ENABLED=true` and tune limits
- [ ] Use strong database passwords
- [ ] Never commit `.env` to version control

---

## 📦 Tech Stack

| Layer | Technology |
|-------|------------|
| Web | Express.js 5.x |
| Real-time | Socket.IO 4.x |
| Database | MySQL + Sequelize 6.x |
| Auth | JSON Web Tokens (jsonwebtoken) |
| Validation | Zod 4.x |
| Hashing | bcrypt + Node.js crypto |
| Email | Nodemailer |
| Logging | Winston + daily-rotate-file |
| Security | Helmet + CORS + express-rate-limit |
| Templating | EJS |
| Testing | Jest 30 + Supertest |
| Quality | ESLint 10 + Prettier + Husky |

---

## 🗺️ Roadmap

- [ ] Redis cache adapter
- [ ] Queue / background jobs (BullMQ)
- [ ] PostgreSQL + SQLite dialect examples
- [ ] OpenAPI / Swagger auto-generation
- [ ] CLI scaffold for controllers, services, models

Have an idea? [Open a feature request](https://github.com/refkinscallv/node-framework/issues/new?template=feature_request.md)

---

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) first.

```bash
git clone https://github.com/refkinscallv/node-framework.git
cd node-framework && npm run setup
npm run dev
```

1. Fork → branch (`feat/my-feature`) → commit → PR
2. All PRs require passing tests: `npm test`
3. Follow the existing code style (ESLint + Prettier)

---

## 📄 License

MIT © [Refkinscallv](https://github.com/refkinscallv)

---

## 📬 Author

**Refkinscallv**

- GitHub: [@refkinscallv](https://github.com/refkinscallv)
- Email: refkinscallv@gmail.com

---

## 📋 Changelog

See [CHANGELOG.md](CHANGELOG.md) for full version history.

| Version | Date | Highlights |
|---------|------|-----------|
| **3.0.2** | 2026-05-25 | Auth Middleware, Cache, Rate Limiting, Health Check, Socket JWT Auth, DB Transactions, Env Validation, Docker, create-cli v3 |
| **2.1.0** | 2026-04-25 | JWT refresh tokens, Setup script, Logger optimizations |
| **2.0.0** | 2026-03-11 | BaseController.handle(), BaseService shortcuts, major bug fixes |
| **1.0.0** | 2026-01-04 | Initial release |

---

<div align="center">

If this project helps you, please consider giving it a ⭐ on GitHub — it helps others discover it!

**[Star on GitHub](https://github.com/refkinscallv/node-framework)**

</div>
