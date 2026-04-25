'use strict'

const jwt = require('jsonwebtoken')
const config = require('@app/config')
const Logger = require('@core/logger.core')

module.exports = class JWT {
    static sign(payload, expiresIn = config.jwt.expiresIn, isRefresh = false) {
        try {
            const secret = isRefresh ? config.jwt.refreshSecret : config.jwt.secret;
            const options = { 
                expiresIn,
                issuer: config.jwt.issuer,
                audience: config.jwt.audience
            };
            return jwt.sign(payload, secret, options);
        } catch (err) {
            Logger.set(err, 'jwt');
            throw err;
        }
    }

    static signRefresh(payload, expiresIn = config.jwt.refreshExpiresIn) {
        return this.sign(payload, expiresIn, true);
    }

    static verify(token, isRefresh = false) {
        try {
            const secret = isRefresh ? config.jwt.refreshSecret : config.jwt.secret;
            const options = {
                issuer: config.jwt.issuer,
                audience: config.jwt.audience
            };
            return jwt.verify(token, secret, options);
        } catch (err) {
            Logger.set(err, 'jwt');
            return null;
        }
    }

    static verifyRefresh(token) {
        return this.verify(token, true);
    }

    static decode(token) {
        try {
            return jwt.decode(token);
        } catch (err) {
            Logger.set(err, 'jwt');
            return null;
        }
    }
}
