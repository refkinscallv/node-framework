'use strict';

/**
 * @module node-framework
 * @description A lightweight, opinionated, and modular TypeScript-based backend framework built on top of Express.js, TypeORM, Socket.IO 
 * @author Refkinscallv
 * @repository https://github.com/refkinscallv/node-framework
 * @version 2.9.0
 * @date 2025
 */

import Express from '@core/express';
import Server from '@core/server';
import Database from '@core/typeorm';
import Hooks from '@core/hooks';

class Boot {
    public static run() {
        (async () => {
            console.log(`[BOOT] Boot the application`);
            await Hooks.init('system', 'before');
            Database.init()
                .then(() => {
                    Express.init();
                    Server.init();
                    console.log(`[BOOT] Successfully boot the application`);
                })
                .catch((error: any) => {
                    console.error(
                        `[BOOT] Failed to booting application: ${error}`,
                    );
                    process.exit(1);
                });
        })();
    }
}

export default Boot;
