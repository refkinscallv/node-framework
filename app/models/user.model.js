// MODEL SAMPLE
// 'use strict'

// module.exports = (sequelize, DataTypes) => {
//     const User = sequelize.define('User', {
//         token: {
//             type: DataTypes.STRING(32),
//             allowNull: false,
//             unique: true
//         },

//         status: {
//             type: DataTypes.ENUM('active', 'inactive'),
//             allowNull: false,
//             defaultValue: 'active'
//         },

//         is_admin: {
//             type: DataTypes.BOOLEAN,
//             allowNull: false,
//             defaultValue: false
//         },

//         avatar: {
//             type: DataTypes.STRING,
//             allowNull: true
//         },

//         bio: {
//             type: DataTypes.TEXT,
//             allowNull: true
//         },

//         name: {
//             type: DataTypes.STRING,
//             allowNull: false
//         },

//         gender: {
//             type: DataTypes.ENUM('male', 'female'),
//             allowNull: true
//         },

//         username: {
//             type: DataTypes.STRING,
//             allowNull: false,
//             unique: true
//         },

//         password: {
//             type: DataTypes.STRING,
//             allowNull: false
//         }

//     }, {
//         tableName: 'users',

//         indexes: [
//             {
//                 unique: true,
//                 fields: ['token']
//             },
//             {
//                 unique: true,
//                 fields: ['username']
//             },
//             {
//                 fields: ['status']
//             },
//             {
//                 fields: ['is_admin']
//             },
//             {
//                 fields: ['gender']
//             }
//         ]
//     })

//     return User
// }
