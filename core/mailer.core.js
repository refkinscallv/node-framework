'use strict'

/**
 * Mailer Core Module
 * Handles email sending functionality using nodemailer
 */

const nodemailer = require('nodemailer')
const ejs = require('ejs')
const path = require('path')
const fs = require('fs')
const config = require('@app/config')
const Logger = require('@core/logger.core')

module.exports = class Mailer {
    static transporter = null

    /**
     * Initialize mailer transporter
     */
    static init() {
        try {
            this.transporter = nodemailer.createTransport({
                host: config.mailer.host,
                port: config.mailer.port,
                secure: config.mailer.secure,
                auth: {
                    user: config.mailer.auth.user,
                    pass: config.mailer.auth.pass,
                },
            })
            Logger.info('mailer', 'Mailer initialized successfully')
        } catch (err) {
            Logger.set(err, 'mailer')
            throw err
        }
    }

    /**
     * Send email using template
     * FIX: Tambahkan validasi parameter sebelum proses
     * @param {string} to - Recipient email address
     * @param {string} subject - Email subject
     * @param {string} template - Template file name (without extension)
     * @param {Object} data - Data to pass to template
     * @returns {Promise<Object>} Email info
     */
    static async send(to, subject, template, data = {}) {
        // FIX: Validasi parameter — sebelumnya tidak ada validasi sama sekali
        if (!to || typeof to !== 'string' || !to.trim()) {
            throw new Error('Mailer: recipient email (to) is required')
        }
        if (!subject || typeof subject !== 'string' || !subject.trim()) {
            throw new Error('Mailer: email subject is required')
        }
        if (!template || typeof template !== 'string' || !template.trim()) {
            throw new Error('Mailer: template name is required')
        }

        try {
            if (!this.transporter) this.init()

            // Build template path
            const templatePath = path.join(__dirname, '../public/views/templates/email', `${template}.email.ejs`)

            // FIX: Cek apakah template file ada sebelum render
            if (!fs.existsSync(templatePath)) {
                throw new Error(`Email template not found: ${template}.email.ejs`)
            }

            // Render email template
            const html = await ejs.renderFile(templatePath, {
                ...data,
                appName: config.app.name,
                appUrl: config.app.url,
            })

            // Send email
            const info = await this.transporter.sendMail({
                from: `"${config.mailer.from.name}" <${config.mailer.from.email}>`,
                to: to.trim(),
                subject: subject.trim(),
                html,
            })

            Logger.info('mailer', `Email sent to ${to}: ${info.messageId}`)
            return info
        } catch (err) {
            Logger.set(err, 'mailer')
            throw err
        }
    }

    /**
     * Send raw HTML email (without template file)
     * @param {string} to - Recipient email address
     * @param {string} subject - Email subject
     * @param {string} html - Raw HTML content
     * @returns {Promise<Object>} Email info
     */
    static async sendRaw(to, subject, html) {
        if (!to || !subject || !html) {
            throw new Error('Mailer: to, subject, and html are required for sendRaw()')
        }

        try {
            if (!this.transporter) this.init()

            const info = await this.transporter.sendMail({
                from: `"${config.mailer.from.name}" <${config.mailer.from.email}>`,
                to: to.trim(),
                subject: subject.trim(),
                html,
            })

            Logger.info('mailer', `Raw email sent to ${to}: ${info.messageId}`)
            return info
        } catch (err) {
            Logger.set(err, 'mailer')
            throw err
        }
    }

    /**
     * Verify mailer connection
     * @returns {Promise<boolean>} Connection status
     */
    static async verify() {
        try {
            if (!this.transporter) this.init()
            await this.transporter.verify()
            Logger.info('mailer', 'Mailer connection verified')
            return true
        } catch (err) {
            Logger.set(err, 'mailer')
            return false
        }
    }
}
