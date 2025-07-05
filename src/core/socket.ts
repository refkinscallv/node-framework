'use strict';

/**
 * @module socket
 * @description Socket.IO integration for node-framework
 * @version 3.1.0
 * @date 2025
 */

import { Server as SocketServer } from 'socket.io';
import Server from '@core/server';
import SocketConfig from '@app/config/socket';

class Socket {
    public static readonly io: SocketServer = new SocketServer(
        Server.getHttpServer(),
        {
            cors: SocketConfig.cors,
        },
    );

    public static init(): void {
        this.io.on('connection', (socket) => {
            console.log(`[SOCKET] Client connected: ${socket.id}`);
            // Add your handlers here if needed
        });

        this.io.on('error', (err) => {
            console.error('[SOCKET] Socket.IO Error:', err);
        });
    }
}

export default Socket;
