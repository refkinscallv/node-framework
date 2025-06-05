import Routes from '@core/routes';
import Express from '@core/express';
import { HttpContext } from '@type/core';

Routes.get('/', async ({ res }: HttpContext) => {
    Express.json(res, {
        status: true,
        code: 200,
        message: 'Success Static',
        result: {},
    });
});
