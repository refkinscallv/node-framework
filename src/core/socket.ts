import { Server } from 'socket.io';
import FWServer from '@core/server';
import SocketConfig from '@app/config/socket';

class FWSocket {
    public static io: Server = new Server(FWServer.server, {
        cors: SocketConfig.cors,
    });
}

export default FWSocket;
