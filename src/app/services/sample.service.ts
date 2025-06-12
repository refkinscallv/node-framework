// import Common from '@core/common';
// import SampleRepository from '@app/database/repositories/sample.repository';

// export default class SampleService {
//     public static pagination(data: Record<string, any>) {
//         return Common.handler(
//             async () => {
//                 const table = await SampleRepository.pagination(data);
//                 return Common.json(
//                     true,
//                     200,
//                     'User list retrieved successfully',
//                     table,
//                 );
//             },
//             () => {
//                 return Common.json(false, 500, 'Failed to retrieve user list');
//             },
//         );
//     }

//     public static all() {
//         return Common.handler(
//             async () => {
//                 const table = await SampleRepository.all();
//                 return Common.json(
//                     true,
//                     200,
//                     'User list retrieved successfully',
//                     table,
//                 );
//             },
//             () => {
//                 return Common.json(false, 500, 'Failed to retrieve user list');
//             },
//         );
//     }

//     public static findById(id: number) {
//         return Common.handler(
//             async () => {
//                 // const user = await SampleRepository.findOne({ id });
//                 const user = await SampleRepository.entity.findBy({ id });
//                 if (!user) {
//                     return Common.json(false, 404, 'User not found');
//                 }
//                 return Common.json(
//                     true,
//                     200,
//                     'User retrieved successfully',
//                     user,
//                 );
//             },
//             () => {
//                 return Common.json(false, 500, 'Failed to retrieve user');
//             },
//         );
//     }

//     public static findBy(data: Record<string, any>) {
//         return Common.handler(
//             async () => {
//                 const user = await SampleRepository.by(data);
//                 if (!user || user.length === 0) {
//                     return Common.json(false, 404, 'User not found');
//                 }
//                 return Common.json(
//                     true,
//                     200,
//                     'User retrieved successfully',
//                     user,
//                 );
//             },
//             () => {
//                 return Common.json(false, 500, 'Failed to retrieve user');
//             },
//         );
//     }

//     public static store(data: Record<string, any>) {
//         return Common.handler(
//             async () => {
//                 const user = await SampleRepository.store(data);
//                 return Common.json(
//                     true,
//                     201,
//                     'User created successfully',
//                     user,
//                 );
//             },
//             () => {
//                 return Common.json(false, 500, 'Failed to create user');
//             },
//         );
//     }

//     public static update(id: number, data: Record<string, any>) {
//         return Common.handler(
//             async () => {
//                 const user = await SampleRepository.update(data, id);
//                 if (!user) {
//                     return Common.json(false, 404, 'User not found');
//                 }
//                 return Common.json(
//                     true,
//                     200,
//                     'User updated successfully',
//                     user,
//                 );
//             },
//             () => {
//                 return Common.json(false, 500, 'Failed to update user');
//             },
//         );
//     }

//     public static delete(id: number) {
//         return Common.handler(
//             async () => {
//                 const deleted = await SampleRepository.delete(id);
//                 if (!deleted) {
//                     return Common.json(false, 404, 'User not found');
//                 }
//                 return Common.json(true, 200, 'User deleted successfully');
//             },
//             () => {
//                 return Common.json(false, 500, 'Failed to delete user');
//             },
//         );
//     }
// }
