'use strict';

/**
 * @module node-framework
 * @description A lightweight, opinionated, and modular TypeScript-based backend framework built on top of Express.js, TypeORM, Socket.IO 
 * @author Refkinscallv
 * @repository https://github.com/refkinscallv/node-framework
 * @version 2.9.0
 * @date 2025
 */

import nodemailer, { Transporter } from 'nodemailer';
import Common from '@core/common';

class Mailer {
    private static transport: Transporter | null = null;

    private static init() {
        if (!this.transport) {
            const driver = Common.env<string>('MAIL_DRIVER');
            const user = Common.env<string>('MAIL_USER');
            const pass = Common.env<string>('MAIL_PASS');

            this.transport = nodemailer.createTransport({
                service: driver,
                auth: { user, pass },
            });
        }
    }

    static async send(options: {
        to: string | string[];
        subject: string;
        html: string;
    }) {
        this.init();

        const from = `${Common.env('MAIL_FROM_NAME')} <${Common.env('MAIL_FROM_EMAIL')}>`;

        return Common.handler(
            async () => {
                return this.transport!.sendMail({
                    from,
                    to: options.to,
                    subject: options.subject,
                    html: options.html,
                });
            },
            () => null,
        );
    }
}

export default Mailer;
