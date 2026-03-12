# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).


## [2.0.0] - 2026-03-11

### Added

- **`BaseController.handle(fn)`** — Async error wrapper untuk controller methods. Eliminates repetitive try/catch blocks.
- **`BaseController.paginated(res, items, meta, message)`** — Helper for paginated API responses.
- **`BaseService.success(message, data)`** — Shortcut for 200 success response.
- **`BaseService.created(message, data)`** — Shortcut for 201 created response.
- **`BaseService.fail(message, code, data)`** — Generic error response shortcut.
- **`BaseService.notFound(message)`** — Shortcut for 404 response.
- **`BaseService.unauthorized(message)`** — Shortcut for 401 response.
- **`BaseService.forbidden(message)`** — Shortcut for 403 response.
- **`BaseService.conflict(message)`** — Shortcut for 409 response (duplicate data).
- **`BaseService.validationFail(message, errors)`** — Shortcut for 422 response.
- **`BaseService.serverError(message)`** — Shortcut for 500 response.
- **`Env.getJson(key, defaultValue)`** — Parse JSON from environment variables.
- **`Hash.hmac(value, secret, algorithm)`** — Create HMAC signature.
- **`Str.isEmpty(str)`** — Check if string is empty or whitespace.
- **`Str.padLeft(str, length, char)`** — Left-pad a string.
- **`Str.padRight(str, length, char)`** — Right-pad a string.
- **`Arr.compact(arr)`** — Remove falsy values from array.
- **`Arr.sum(arr, key)`** — Sum values in array or by object key.
- **`Mailer.sendRaw(to, subject, html)`** — Send raw HTML email without template file.
- **`Socket.close()`** — Graceful Socket.IO shutdown method.
- **`Server.applyOptions(server)`** — Apply `keepAliveTimeout`, `requestTimeout`, `headersTimeout` to server instance.
- **`Server.listen(server, port, host)`** — Added optional `host` parameter (default: `0.0.0.0`).

### Fixed

- **`Env.get(key, defaultValue)`** — Bug: empty string values (`''`) were incorrectly replaced by defaultValue due to `||` operator. Now uses explicit `!== undefined` check.
- **`Env.getInt(key, defaultValue)`** — Added `isNaN` guard to prevent returning `NaN` when env var is non-numeric.
- **`Env.getFloat(key, defaultValue)`** — Added `isNaN` guard.
- **`Env.getArray(key, defaultValue)`** — Added `filter(Boolean)` to remove empty strings from split result.
- **`Env.has(key)`** — Fixed to use `Object.prototype.hasOwnProperty.call()` instead of `hasOwnProperty()` directly (ESLint-safe).
- **`Str.camelCase(str)`** — Bug: `_` and `-` separators were not converted. `helloWorld` is now `helloWorld`, `hello_world` → `helloWorld`, `hello-world` → `helloWorld`.
- **`Str.truncate(str)`** — Replaced deprecated `substr()` with `substring()`.
- **`Arr.first(arr)`** — Bug: returned `undefined` silently on empty arrays. Now accepts `defaultValue` parameter.
- **`Arr.last(arr)`** — Same fix as `first()`.
- **`Arr.isEmpty(arr)`** — Bug: did not validate if input is actually an array. Non-array inputs now return `true`.
- **`Arr.sortBy(arr, key, order)`** — Bug: equal values returned `-1` instead of `0`, causing unstable sort.
- **`Arr.random(arr)`** — Now returns `null` on empty arrays instead of `undefined`.
- **`Arr.wrap(value)`** — Now returns `[]` for `null` and `undefined` instead of `[null]` or `[undefined]`.
- **`Hash.uuid()`** — Bug: `require('uuid')` was called inside the method on every invocation. Moved to top-level import.
- **`Hash.uniqueId()`** — Same fix as `Hash.uuid()`: moved `require('uniqid')` to top-level.
- **`database.core.js`** — Bug: `model.associate()` failure was silent. Each association is now individually wrapped in try/catch.
- **`boot.core.js`** — Bug: `Database.close()` was called during shutdown even when `DB_ENABLED=false`. Now checks `config.database.status` before closing.
- **`express.core.js`** — Bug: errors in `#middlewares()` setup were silently swallowed. Now re-throws properly so boot fails clearly.
- **`mailer.core.js`** — Bug: no parameter validation in `send()`. Added validation for `to`, `subject`, `template`, and template file existence check.
- **`server.core.js`** — Bug: invalid options (`poweredBy`, `maxHeaderSize`) were passed to `http.createServer()` — not valid Node.js HTTP server options. Removed entirely.
- **`BaseController.validationError()`** — Changed status code from 400 to 422 (correct HTTP status for validation errors).
- **`tests/unit/logger.test.js`** — Fixed: test was using global mocked Logger instead of real implementation. Added `jest.unmock()` and fixed async `done` callbacks to use `async/await`.

### Changed

- **`Str.snakeCase(str)`** — Improved regex to properly handle hyphen and camelCase inputs.
- **`Str.kebabCase(str)`** — Improved regex to properly handle underscore and camelCase inputs.
- **`Str.capitalize(str)`** — Added null/empty guard.

---

## [1.0.5] - 2026-02-03

### Fixed

- **Critical**: Fixed race condition in graceful shutdown - properly await async operations
- **Critical**: Fixed database connection not closing properly - made `Database.close()` async
- **Error**: Fixed model loading to support subdirectories recursively
- **Bug**: Fixed 404 handler middleware order - now registered before error handler
- **Warning**: Improved error handling in hooks - critical errors now propagate properly
- **Warning**: Routes loading errors now throw instead of silent failure
- **Warning**: Enhanced socket loading error messages for better debugging
- **Warning**: Added null checks to `Database.getModel()` and `Database.getInstance()`
- **Warning**: Fixed server listen error handling using proper event listeners

### Security

- Added prominent security warning for JWT secret configuration
- Recommended using environment variables for sensitive data

### Documentation

- Updated API documentation for `Database.close()` async behavior
- Added breaking changes notice for async database methods

## [1.0.0] - 2026-01-04

### Added

- Initial release of Node.js MVC Framework
- Express.js integration with middleware support
- Socket.IO for real-time communication
- Sequelize ORM for database management
- JWT authentication utilities
- Email sending with template support (Mailer)
- File upload support with express-fileupload
- Winston logger with daily file rotation
- Application lifecycle hooks (before, after, shutdown)
- Graceful shutdown handling
- CORS configuration
- Cookie parser integration
- Error handler with API and web response modes
- Static file serving
- EJS view engine support
- Comprehensive test suite with Jest
- Code quality tools (ESLint, Prettier, Husky)
- Complete documentation (README.md, API.md)
- Example routes and configuration

---

## Version History

- **2.0.0** (2026-03-11) - Major bug fixes, scalability & DX improvements, new helper methods
- **1.0.5** (2026-02-03) - Bug fixes and stability improvements
- **1.0.0** (2026-01-04) - Initial release
