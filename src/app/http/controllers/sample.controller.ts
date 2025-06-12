// import { HttpContext } from '@type/core';
// import Express from '@core/express';
// import SampleService from '@app/services/sample.service';
// import SampleValidator from '@app/http/validators/sample.validator';

// export default class SampleController {
//     public static async pagination({ req, res }: HttpContext) {
//         const data = req.query as Record<string, any>;
//         return Express.json(res, await SampleService.pagination(data));
//     }

//     public static async all({ res }: HttpContext) {
//         return Express.json(res, await SampleService.all());
//     }

//     public static async findById({ req, res }: HttpContext) {
//         const id = parseInt(req.params.id, 10);
//         return Express.json(res, await SampleService.findById(id));
//     }

//     public static async findBy({ req, res }: HttpContext) {
//         const data = req.query as Record<string, any>;
//         return Express.json(res, await SampleService.findBy(data));
//     }

//     public static async store({ req, res }: HttpContext) {
//         const data = req.body as Record<string, any>;
//         const validate = await SampleValidator.store(data);
//         if (!validate.valid) {
//             return Express.json(
//                 res,
//                 false,
//                 422,
//                 'Validation failed',
//                 validate.errors,
//             );
//         }
//         return Express.json(res, await SampleService.store(data));
//     }

//     public static async update({ req, res }: HttpContext) {
//         const id = parseInt(req.params.id, 10);
//         const data = req.body as Record<string, any>;
//         const validate = await SampleValidator.update(data);
//         if (!validate.valid) {
//             return Express.json(
//                 res,
//                 false,
//                 422,
//                 'Validation failed',
//                 validate.errors,
//             );
//         }
//         return Express.json(res, await SampleService.update(id, data));
//     }

//     public static async delete({ req, res }: HttpContext) {
//         const id = parseInt(req.params.id, 10);
//         return Express.json(res, await SampleService.delete(id));
//     }
// }
