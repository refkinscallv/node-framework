import { Express } from 'express';

// define a global middleware here

export default class RegisterMiddlewares {
    public static set(express: Express) {
        express.set('trust proxy', true);
        express.use((req, res, next) => {
            res.setHeader(
                'Cache-Control',
                'no-store, no-cache, must-revalidate, proxy-revalidate',
            );
            res.setHeader('Pragma', 'no-cache');
            res.setHeader('Expires', '0');
            res.setHeader('Surrogate-Control', 'no-store');
            next();
        });
    }
}
