'use strict';

/**
 * @module server
 * @description HTTP server core for node-framework
 * @version 3.1.0
 * @date 2025
 */

import http from 'http';
import Common from '@core/common';
import Express from '@core/express';
import Hooks from '@core/hooks';

class Server {
    private static readonly port = Number(Common.env<number>('APP_PORT', 3000));
    private static readonly url = Common.env<string>(
        'APP_URL',
        `http://localhost:${Server.port}`,
    );
    private static readonly server = http.createServer(Express.express);

    /** Public accessor if other modules need HTTP server instance (e.g. Socket.IO) */
    public static getHttpServer(): http.Server {
        return this.server;
    }

    public static async init(): Promise<void> {
        this.server.listen(this.port, async () => {
            console.log(`[SERVER] Running at: ${this.url}`);
            try {
                await Hooks.init('system', 'after');
            } catch (err) {
                console.error('[SERVER] Hook init failed:', err);
            }
        });

        this.server.on('error', (err) => {
            console.error('[SERVER] Server error:', err);
            process.exit(1);
        });
    }
}

export default Server;
