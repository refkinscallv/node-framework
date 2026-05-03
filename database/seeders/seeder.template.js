'use strict'

/**
 * Seeder Template
 * Copy this file and rename it to NNN_YourSeeder.js
 *
 * Naming convention:
 *   NNN_<Name>Seeder.js
 *   ^^^
 *   Numeric prefix controls execution order (001, 002, 010, ...)
 *
 * Examples:
 *   001_UsersSeeder.js
 *   002_RolesSeeder.js
 *   010_CategoriesSeeder.js
 */

module.exports = {
    /**
     * Seeder entry point
     * Called automatically by core/database/seed.js
     *
     * @param {Object} models    - All loaded Sequelize model instances
     *                            e.g. models.User, models.Product
     * @param {Object} sequelize - Active Sequelize instance
     *                            Use for transactions or raw queries
     */
    async run(models, sequelize) {
        // const { YourModel } = models

        // Example: insert with bulkCreate
        // await YourModel.bulkCreate([
        //     { field: 'value' },
        // ], {
        //     ignoreDuplicates: true,  // skip duplicates — safe to re-run
        // })

        // Example: insert with transaction
        // const t = await sequelize.transaction()
        // try {
        //     await YourModel.create({ ... }, { transaction: t })
        //     await t.commit()
        // } catch (err) {
        //     await t.rollback()
        //     throw err
        // }

        // Example: raw query
        // await sequelize.query('UPDATE users SET status = "active"')

        throw new Error('Seeder not implemented — replace this with your logic')
    },
}