import path from 'path';
import multer from 'multer';
import { CorsOptions } from 'cors';

const ExpressConfig = {
    cors: <CorsOptions>{
        origin: (origin, callback) => callback(null, true),
        methods: [
            'GET',
            'POST',
            'PUT',
            'DELETE',
            'PATCH',
            'OPTIONS',
            'HEAD',
            'CONNECT',
            'TRACE',
        ],
        allowedHeaders: [
            'X-Requested-With',
            'X-Custom-Header',
            'Content-Type',
            'Authorization',
            'Accept',
            'Origin',
            'Access-Control-Allow-Origin',
            'Access-Control-Allow-Headers',
            'Access-Control-Request-Method',
            'Access-Control-Request-Headers',
        ],
        exposedHeaders: ['Content-Range', 'X-Content-Range', 'X-Custom-Header'],
        credentials: true,
        maxAge: 86400,
        preflightContinue: false,
        optionsSuccessStatus: 200,
    },
    view: {
        engine: 'ejs',
        path: path.join(__dirname, '../../../public/views'),
    },
    static: {
        route: '/static',
        path: path.join(__dirname, '../../../public/static'),
    },
    multer: {
        storage: multer.diskStorage({
            destination: path.join(__dirname, '../../../public/static/file'),
        }),
        limits: {
            fileSize: 5 * 1024 * 1024,
        },
        fileFilter: (
            req: Express.Request,
            file: Express.Multer.File,
            cb: multer.FileFilterCallback,
        ) => {
            if (!file.mimetype.startsWith('image/')) {
                cb(new Error(`Only image formats are allowed`));
            } else {
                cb(null, true);
            }
        },
    },
};

export default ExpressConfig;
