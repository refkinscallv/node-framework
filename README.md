# Node.js MVC Framework

A modern and comprehensive Node.js MVC framework with Express, Socket.IO, Sequelize ORM, and real-time capabilities for building scalable web applications.

## Features

- **Express.js** - Fast, unopinionated web framework
- **Socket.IO** - Real-time bidirectional communication
- **Sequelize ORM** - Promise-based ORM for SQL databases
- **JWT Authentication** - Secure token-based authentication
- **Email Support** - Built-in mailer with template support
- **File Upload** - Express-fileupload integration
- **EJS Templates** - Embedded JavaScript templating
- **Logging** - Winston logger with daily rotation
- **Security** - CORS, Helmet, Rate limiting
- **Testing** - Jest testing framework
- **Code Quality** - ESLint, Prettier, Husky

## Requirements

- Node.js >= 20.0.0
- npm >= 11.0.0
- MySQL (if using database)

## Installation

```bash
# Clone the repository
git clone https://github.com/refkinscallv/node-framework.git

# Navigate to directory
cd node-framework

# Install dependencies
npm install

# Copy environment file (if exists)
cp .env.example .env

# Configure your settings in app/config.js
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

Your application will be running at `http://localhost:3025`

## Project Structure

```
node-framework/
├── app/                        # Application code
│   ├── config.js              # Configuration file
│   ├── hooks/                 # Application lifecycle hooks
│   ├── http/                  # HTTP layer
│   │   ├── controllers/       # Request handlers
│   │   ├── middlewares/       # Custom middlewares
│   │   └── validators/        # Input validation
│   ├── models/                # Database models
│   ├── routes/                # Application routes
│   ├── services/              # Business logic
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
│   └── socket.core.js        # Socket.IO configuration
├── public/                    # Public assets
│   ├── static/               # Static files (CSS, JS, images)
│   └── views/                # EJS templates
│       ├── pages/            # Page templates
│       └── templates/        # Reusable templates
├── tests/                     # Test files
│   ├── unit/                 # Unit tests
│   └── integration/          # Integration tests
├── logs/                      # Application logs
├── tmp/                       # Temporary files (uploads)
├── index.js                   # Application entry point
├── package.json              # Dependencies and scripts
└── README.md                 # This file
```

## Configuration

All configuration is centralized in `app/config.js`:

### Application Settings

```javascript
app: {
    production: false,           // Production mode
    port: 3025,                 // Server port
    url: 'http://localhost:3025', // Base URL
    name: 'Chat Application',   // App name
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
    // ... more options
}
```

### File Upload Configuration

```javascript
fileupload: {
    useTempFiles: true,
    tempFileDir: path.join(__dirname, '../tmp/'),
    limits: {
        fileSize: 50 * 1024 * 1024, // 50MB max
    },
    // ... more options
}
```

## Routing

Define routes in `app/routes/`:

```javascript
// app/routes/web.route.js
const Routes = require('@refkinscallv/express-routing')

Routes.get('/', ({ res }) => {
    res.send('Hello World')
})

Routes.get('/users/:id', ({ req, res }) => {
    res.json({ userId: req.params.id })
})
```

## Controllers

Create controllers in `app/http/controllers/`:

```javascript
// app/http/controllers/user/user.controller.js
module.exports = class UserController {
    static async index(req, res) {
        // Handle request
    }

    static async store(req, res) {
        // Handle request
    }
}
```

## Models

Define models in `app/models/`:

```javascript
// app/models/user/user.model.js
module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
        },
    })

    return User
}
```

## Socket.IO

Register socket handlers in `app/sockets/register.socket.js`:

```javascript
module.exports = {
    register(io) {
        io.on('connection', (socket) => {
            console.log('Client connected')

            socket.on('message', (data) => {
                io.emit('message', data)
            })
        })
    },
}
```

## File Upload

Handle file uploads in your routes/controllers:

```javascript
Routes.post('/upload', ({ req, res }) => {
    if (!req.files || !req.files.file) {
        return res.status(400).json({ error: 'No file uploaded' })
    }

    const file = req.files.file
    const uploadPath = __dirname + '/uploads/' + file.name

    file.mv(uploadPath, (err) => {
        if (err) return res.status(500).json({ error: err })
        res.json({ message: 'File uploaded!' })
    })
})
```

## Middleware

Register custom middlewares in `app/http/middlewares/register.middleware.js`:

```javascript
module.exports = {
    register(app) {
        app.use((req, res, next) => {
            // Your middleware logic
            next()
        })
    },
}
```

## Hooks

Use hooks for lifecycle events in `app/hooks/register.hook.js`:

```javascript
module.exports = {
    register(Hooks) {
        // Before initialization
        Hooks.register('before', async () => {
            console.log('Before initialization')
        })

        // After initialization
        Hooks.register('after', async () => {
            console.log('After initialization')
        })

        // On shutdown
        Hooks.register('shutdown', async () => {
            console.log('Cleaning up...')
        })
    },
}
```

## Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run unit tests only
npm run test:unit

# Run integration tests only
npm run test:integration
```

## Scripts

```bash
# Development
npm run dev              # Start with nodemon
npm run dev:debug        # Start with debugger

# Production
npm start               # Start application

# Code Quality
npm run lint            # Run ESLint
npm run format          # Format code with Prettier
npm run format:check    # Check code formatting

# Database
npm run db:migrate      # Run migrations
npm run db:seed         # Run seeders
npm run db:reset        # Reset database

# Utilities
npm run logs:clear      # Clear log files
```

## Environment Variables

Although the framework uses `app/config.js` for configuration, you can also use `.env` file with the `dotenv` package for sensitive data:

```env
NODE_ENV=development
PORT=3025
DB_HOST=localhost
DB_PORT=3306
DB_NAME=database
DB_USER=root
DB_PASS=
JWT_SECRET=your-secret-key
```

## Security

- Use strong JWT secrets in production
- Enable HTTPS in production
- Configure CORS appropriately
- Use environment variables for sensitive data
- Keep dependencies updated
- Enable rate limiting for APIs
- Validate and sanitize user inputs

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

## Support

For issues and questions:

- GitHub Issues: [Issues](https://github.com/refkinscallv/node-framework/issues)
- Email: refkinscallv@gmail.com

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for details.

---

Made with ❤️ by Refkinscallv
