'use strict';

/**
 * @module node-framework
 * @description A lightweight, opinionated, and modular TypeScript-based backend framework built on top of Express.js, TypeORM, Socket.IO
 * @author Refkinscallv
 * @repository https://github.com/refkinscallv/node-framework
 * @version 2.9.0
 * @date 2025
 */

import { Server as SocketServer } from 'socket.io';
import Server from '@core/server';
import SocketConfig from '@app/config/socket';

class Socket {
    public static io: SocketServer = new SocketServer(Server.server, {
        cors: SocketConfig.cors,
    });
}

export default Socket;
