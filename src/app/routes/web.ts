import Routes from '@core/routes';
import FWExpress from '@core/express';
import { HttpContext } from '@type/core';

Routes.get('/', ({ res }: HttpContext) => {
    FWExpress.json(res, {
        status: true,
        code: 200,
        message: 'Success Static',
        result: {}
    })
})
