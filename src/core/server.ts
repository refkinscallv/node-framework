'use strict';

/**
 * @module node-framework
 * @description A lightweight, opinionated, and modular TypeScript-based backend framework built on top of Express.js, TypeORM, Socket.IO 
 * @author Refkinscallv
 * @repository https://github.com/refkinscallv/node-framework
 * @version 2.9.0
 * @date 2025
 */

import http from 'http';
import Common from '@core/common';
import Express from '@core/express';
import Hooks from '@core/hooks';

class Server {
    public static server: http.Server = http.createServer(Express.express);
    private static serverPort: number = Number(
        Common.env<number>('APP_PORT', 3000),
    );
    private static serverUrl: string = Common.env<string>(
        'APP_URL',
        'http://localhost:3000',
    );

    public static async init() {
        this.server.listen(this.serverPort, async () => {
            console.log(`[SERVER] Server is running at: ${this.serverUrl}`);
            await Hooks.init('system', 'after');
        });
    }
}

export default Server;
