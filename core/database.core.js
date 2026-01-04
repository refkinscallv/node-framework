'use strict'

/**
 * Database Core Module
 * Manages Sequelize ORM connection, model loading, and synchronization
 * Provides centralized database management for the application
 */

const { Sequelize } = require('sequelize')
const fs = require('fs')
const path = require('path')
const config = require('@app/config')
const Logger = require('@core/logger.core')

module.exports = class Database {
    /**
     * Sequelize instance
     * Main database connection object
     * @static
     */
    static sequelize = null

    /**
     * Loaded models storage
     * Object containing all loaded Sequelize models
     * @static
     */
    static models = {}

    /**
     * Initialize database connection
     * Sets up Sequelize, authenticates connection, loads and syncs models
     * @returns {Promise<void>}
     * @throws {Error} If connection or initialization fails
     * @static
     */
    static async init() {
        try {
            Logger.info('database', 'Initializing database connection...')

            // Create Sequelize instance with configuration
            this.sequelize = new Sequelize(
                config.database.database,
                config.database.username,
                config.database.password,
                {
                    host: config.database.host,
                    port: config.database.port,
                    dialect: config.database.dialect,
                    // Enable/disable query logging
                    logging: config.database.logging ? (msg) => Logger.debug('database', msg) : false,
                    timezone: config.database.timezone,
                    pool: config.database.pool,
                    define: config.database.define,
                }
            )

            // Test the connection
            await this.sequelize.authenticate()
            Logger.info('database', 'Database connection established')

            // Load all models from models directory
            await this.#loadModels()

            // Synchronize models with database
            await this.#syncModels()

            Logger.info('database', 'Database initialized successfully')
        } catch (err) {
            Logger.set(err, 'database')
            throw err
        }
    }

    /**
     * Load all model files from models directory
     * Scans the models directory and loads each model file
     * Associates models after all are loaded
     * @private
     * @static
     */
    static async #loadModels() {
        const modelsPath = path.join(__dirname, '../app/models')

        // Check if models directory exists
        if (!fs.existsSync(modelsPath)) {
            Logger.warn('database', 'Models directory not found')
            return
        }

        // Get all model files (*.model.js)
        const files = fs.readdirSync(modelsPath).filter((file) => file.endsWith('.model.js'))

        // Load each model file
        for (const file of files) {
            try {
                // Require the model file
                const model = require(path.join(modelsPath, file))

                // Initialize the model with Sequelize instance
                const modelInstance = model(this.sequelize, Sequelize.DataTypes)

                // Store the model in models object
                this.models[modelInstance.name] = modelInstance

                Logger.info('database', `Model loaded: ${modelInstance.name}`)
            } catch (err) {
                Logger.error('database', `Failed to load model ${file}: ${err.message}`)
            }
        }

        // Associate models (handle relationships)
        Object.values(this.models).forEach((model) => {
            if (model.associate) {
                model.associate(this.models)
            }
        })

        Logger.info('database', `Total ${Object.keys(this.models).length} models loaded`)
    }

    /**
     * Synchronize models with database
     * Creates or updates database tables based on model definitions
     * @private
     * @static
     */
    static async #syncModels() {
        if (config.database.sync) {
            await this.sequelize.sync({
                force: config.database.force, // Drop tables if exist
                alter: config.database.alter, // Alter tables to match models
            })
            Logger.info('database', 'Models synchronized')
        }
    }

    /**
     * Get a specific model by name
     * Retrieves a loaded Sequelize model
     * @param {string} name - Model name
     * @returns {Object|undefined} Sequelize model or undefined if not found
     * @static
     *
     * @example
     * const User = Database.getModel('User')
     * const users = await User.findAll()
     */
    static getModel(name) {
        return this.models[name]
    }

    /**
     * Get Sequelize instance
     * Returns the main Sequelize connection instance
     * @returns {Object} Sequelize instance
     * @static
     *
     * @example
     * const sequelize = Database.getInstance()
     * await sequelize.query('SELECT * FROM users')
     */
    static getInstance() {
        return this.sequelize
    }

    /**
     * Close database connection
     * Closes the Sequelize connection pool
     * Should be called during application shutdown
     * @static
     */
    static close() {
        if (this.sequelize) {
            this.sequelize.close()
            Logger.info('database', 'Database connection closed')
        }
    }
}
