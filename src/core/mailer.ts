import nodemailer, { Transporter } from 'nodemailer';
import FWCommon from '@core/common';

class FWMailer {
    private static transport: Transporter | null = null;

    private static init() {
        if (!this.transport) {
            const driver = FWCommon.env<string>('MAIL_DRIVER');
            const user = FWCommon.env<string>('MAIL_USER');
            const pass = FWCommon.env<string>('MAIL_PASS');

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

        const from = `${FWCommon.env('MAIL_FROM_NAME')} <${FWCommon.env('MAIL_FROM_EMAIL')}>`;

        return FWCommon.handler(
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

export default FWMailer;
