'use strict';

/**
 * @module node-framework
 * @description A lightweight, opinionated, and modular TypeScript-based backend framework built on top of Express.js, TypeORM, Socket.IO
 * @author Refkinscallv
 * @repository https://github.com/refkinscallv/node-framework
 * @version 3.1.0
 * @date 2025
 */

import nodemailer, { Transporter } from 'nodemailer';
import Common from '@core/common';

class Mailer {
    private static transport: Transporter | null = null;

    private static getTransport(): Transporter {
        if (this.transport) return this.transport;

        const service = Common.env<string>('MAIL_DRIVER');
        const user = Common.env<string>('MAIL_USER');
        const pass = Common.env<string>('MAIL_PASS');

        if (!service || !user || !pass) {
            throw new Error('[MAILER] Missing required mail configuration');
        }

        this.transport = nodemailer.createTransport({
            service,
            auth: { user, pass },
        });

        return this.transport;
    }

    static async send({
        to,
        subject,
        html,
    }: {
        to: string | string[];
        subject: string;
        html: string;
    }) {
        const fromName = Common.env('MAIL_FROM_NAME', 'noreply');
        const fromEmail = Common.env('MAIL_FROM_EMAIL', 'noreply@example.com');
        const from = `${fromName} <${fromEmail}>`;

        return Common.handler(
            async () =>
                this.getTransport().sendMail({ from, to, subject, html }),
            () => null,
        );
    }
}

export default Mailer;
