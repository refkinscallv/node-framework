import http from 'http';
import FWCommon from '@core/common';
import FWExpress from '@core/express';
import FWHooks from '@core/hooks';

class FWServer {
    public static server: http.Server = http.createServer(FWExpress.express);
    private static serverPort: number = Number(
        FWCommon.env<number>('APP_PORT', 3000),
    );
    private static serverUrl: string = FWCommon.env<string>(
        'APP_URL',
        'http://localhost:3000',
    );

    public static async init() {
        this.server.listen(this.serverPort, async () => {
            console.log(`[SERVER] Server is running at: ${this.serverUrl}`);
            await FWHooks.init('system', 'after');
        });
    }
}

export default FWServer;
