'use strict';

/**
 * @module node-framework
 * @description A lightweight, opinionated, and modular TypeScript-based backend framework built on top of Express.js, TypeORM, Socket.IO
 * @author Refkinscallv
 * @repository https://github.com/refkinscallv/node-framework
 * @version 3.0.0
 * @date 2025
 */

import Express from '@core/express';
import Server from '@core/server';
import Database from '@core/typeorm';
import Hooks from '@core/hooks';

class Boot {
    public static async run() {
        console.log(`[BOOT] Boot the application`);

        try {
            await Hooks.init('system', 'before');
            await Database.init();

            Express.init();
            Server.init();

            console.log(`[BOOT] Successfully booted the application`);
        } catch (error) {
            console.error(`[BOOT] Failed to boot application:`, error);
            process.exit(1);
        }
    }
}

export default Boot;
