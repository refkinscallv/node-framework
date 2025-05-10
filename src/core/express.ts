import express, { Express, Router, Response } from 'express';
import cookieParser from 'cookie-parser';
import ExpressConfig from '@app/config/express';
import multer from 'multer';
import FWCookie from '@core/cookie';
import ejs from 'ejs';
import cors from 'cors';
import RegisterMiddlewares from '@app/http/middlewares/register';
import Routes from '@core/routes';
import FWCommon from '@core/common';
import FWHooks from '@core/hooks';

class FWExpress {
    public static express: Express = express();
    private static router: Router = express.Router();

    public static async init() {
        this.middlewares();
        this.routes();
    }

    private static async middlewares() {
        this.express.use(express.json());
        this.express.use(express.urlencoded({ extended: true }));
        this.express.use(cookieParser());
        this.express.use(cors(ExpressConfig.cors));
        this.express.use((req, res, next) => {
            FWCookie.init(req, res);
            next();
        });
        this.express.use(
            ExpressConfig.static.route,
            express.static(ExpressConfig.static.path),
        );
        ejs.delimiter = '?';
        this.express.set('view engine', ExpressConfig.view.engine);
        this.express.set('views', ExpressConfig.view.path);
        this.express.use((req, res, next) => {
            req.upload = multer({
                storage: ExpressConfig.multer.storage,
                limits: ExpressConfig.multer.limits,
                fileFilter: ExpressConfig.multer.fileFilter,
            });
            next();
        });
        RegisterMiddlewares.set(this.express);
    }

    private static async routes() {
        await import('@app/routes/register');
        Routes.apply(this.router);
        this.express.use(this.router);
    }

    public static json(
        res: Response,
        arg1:
            | boolean
            | {
                  status: boolean;
                  code: number;
                  message: string;
                  result: object | null;
                  custom?: object;
              }
            | any,
        arg2?: number,
        arg3?: string,
        arg4?: object | any[] | null,
        arg5?: Partial<Record<string, any>>,
    ): Response {
        const response =
            typeof arg1 === 'object'
                ? { ...arg1, ...arg1.custom }
                : {
                      status: arg1,
                      code: arg2!,
                      message: arg3!,
                      result: arg4!,
                      ...arg5,
                  };

        return res.status(response.code).json(response);
    }

    public static view(
        res: Response,
        viewName: string,
        locals: object = {},
        status: number = 200,
    ): Response {
        const data = {
            ...locals,
            FWCommon,
        };

        return res.status(status).render(viewName, data) as unknown as Response;
    }

    public static redirect(
        res: Response,
        url: string,
        statusCode: number = 302,
    ): Response {
        return res.redirect(statusCode, url) as unknown as Response;
    }
}

export default FWExpress;
