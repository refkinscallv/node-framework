# Framework by Refkinscallv

## 🌟 Overview

**Node Framework** is a modular, opinionated, and lightweight backend framework for [**Node.js**](https://nodejs.org/en), built with [**TypeScript**](https://www.typescriptlang.org/), powered by [**Express.js**](https://expressjs.com/), [**TypeORM**](https://typeorm.io/), and [**Socket.IO**](https://socket.io/).  
It aims to help developers build scalable applications faster with clear structure, out-of-the-box features, and familiar syntax.

---

## 📚 Orther Documentation

- Core API : [`docs/api`](./docs/apis.md)
- Lifecycle Hooks : [`docs/hooks`](./docs/hooks.md)

---

## 🚀 Features

- 🔧 Modular folder structure
- 🧠 Lifecycle hooks on : (`Before System`, `After System`, `Shutdown System`)
- 📦 DTO-based validation using [`class-validator`](https://github.com/typestack/class-validator)
- 🔄 Dynamic middleware and route registration (routes with [Laravel](https://laravel.com/) styles routing : grouping routes, grouping routes with middleware, set route with standard method)
- 💽 [TypeORM](https://typeorm.io/)-based entity-repository pattern
- 📬 Built-in mailer using [`nodemailer`](https://nodemailer.com/)
- 🍪 Cookie helper integrated with [Express.js](https://expressjs.com/)
- 🔐 JWT helper for token handling with [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken)
- 🧾 Pagination helper for repositories
- 🔌 Real-time support with [Socket.IO](https://socket.io/)
- 📁 Static files & [EJS](https://ejs.co/) view support

---

## 📁 Project Structure

```

root/
│
├── public/
│   ├── static/           # Serve static files at /static/\*
│   │   └── file/         # Uploads (e.g., multer)
│   └── views/            # EJS templates
│
├── src/
│   ├── main.ts           # Application entry point
│   ├── types/            # Custom typings
│   │   ├── core.ts
│   │   └── express/
│   │       └── index.d.ts   # e.g., Request.upload from multer
│   │
│   ├── app/
│   │   ├── config/       # Configuration files (db, express, socket)
│   │   ├── database/
│   │   │   ├── entities/
│   │   │   ├── repositories/
│   │   │   └── seeders/
│   │   │       └── register.ts
│   │   ├── hooks/        # App-defined lifecycle hooks
│   │   ├── http/
│   │   │   ├── controllers/
│   │   │   ├── middlewares/
│   │   │   └── validators/
│   │   │       └── dto/
│   │   └── routes/
│   │       └── register.ts
│   │
│   └── core/
│       ├── boot.ts       # Bootstrap logic (called by main.ts)
│       ├── common.ts     # Shared helper functions
│       ├── cookie.ts     # Cookie utilities based on express
│       ├── express.ts    # Express app builder
│       ├── hooks.ts      # Lifecycle hook runner
│       ├── jwt.ts        # JWT encode/decode/sign/verify
│       ├── mailer.ts     # Nodemailer helper
│       ├── paginate.ts   # Pagination helper
│       ├── repository.ts # Base repository
│       ├── scope.ts      # Global process scope setup
│       ├── server.ts     # HTTP server runner
│       ├── socket.ts     # Socket.io integration
│       └── typeorm.ts    # DB setup & seeder runner
│
└── .env

````

---

## 🔌 Module Aliases

| Alias   | Path           |
| ------- | -------------- |
| `@core` | `./dist/core`  |
| `@app`  | `./dist/app`   |
| `@type` | `./dist/types` |

Configured via [`module-alias`](https://www.npmjs.com/package/module-alias).

---

## ⚙️ Flow Overview

1. `main.ts` calls `core/boot.ts`  
2. `boot.ts` initializes the database via `core/typeorm.ts`  
3. On success, it bootstraps:
   - Express (with cookie, middleware, route register)
   - Seeder (optional based on `.env`)
   - Socket.IO (optional)
4. HTTP server runs via `core/server.ts`

---

## 📦 Scripts

| Script         | Description                        |
|----------------|------------------------------------|
| `npm run dev`  | Start in dev mode (ts-node + nodemon) |
| `npm run build`| Compile TypeScript to JS           |
| `npm start`    | Run the built app                  |
| `npm run lint` | Lint check with ESLint             |
| `npm run lint-fix` | Auto-fix lint issues          |
| `npm run format` | Format code with Prettier        |

---

## ✅ Dependencies

- **Core:** `express`, `typeorm`, `socket.io`, `class-validator`, `jsonwebtoken`, `bcrypt`, `nodemailer`
- **Dev:** `typescript`, `ts-node`, `eslint`, `prettier`, `nodemon`, `@types/*`

---

## 🐞 Issues

Have a bug or feature request? [Create an issue](https://github.com/refkinscallv/node-framework/issues)

---

## 📘 License

This project is licensed under the [MIT License](LICENSE).

---

## 💬 Contribute

Feel free to fork, improve, or contribute ideas. PRs are welcome!

---

## 🌐 Links

* 📖 [Homepage](https://github.com/refkinscallv/node-framework#readme)
* 🐛 [Issues](https://github.com/refkinscallv/node-framework/issues)
