# Security Policy

## Supported Versions

| Version | Supported |
|---------|-----------|
| 3.x     | ✅ Active  |
| 2.x     | ⚠️ Security fixes only |
| 1.x     | ❌ No longer supported |

## Reporting a Vulnerability

**Please do not report security vulnerabilities through public GitHub issues.**

If you discover a security vulnerability, please send an email to **refkinscallv@gmail.com** with:

1. **Subject:** `[SECURITY] Brief description`
2. **Description:** What is the vulnerability and where is it located?
3. **Impact:** What could an attacker do with this vulnerability?
4. **Steps to reproduce:** Minimal steps to trigger the issue
5. **Suggested fix:** If you have a proposed solution

You can expect:
- **Acknowledgement** within 48 hours
- **Status update** within 7 days
- **Fix or mitigation** within 30 days for critical issues

We appreciate responsible disclosure and will credit you in the release notes if you wish.

## Security Best Practices

When deploying Node Framework in production:

- Set `NODE_ENV=production`
- Use strong, unique values for `JWT_SECRET` and `JWT_REFRESH_SECRET` (run `npm run setup`)
- Enable HTTPS: `SERVER_HTTPS=true`
- Restrict CORS origin in `app/config.js` — never use `*` in production
- Enable rate limiting: `RATE_LIMIT_ENABLED=true`
- Never commit `.env` files to version control
- Use strong database passwords
- Keep dependencies up to date (`npm audit`)
