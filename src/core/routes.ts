'use strict';

/**
 * @module node-framework
 * @description A lightweight, opinionated, and modular TypeScript-based backend framework built on top of Express.js, TypeORM, Socket.IO 
 * @author Refkinscallv
 * @repository https://github.com/refkinscallv/node-framework
 * @version 2.9.0
 * @date 2025
 */

import { Router, Request, Response, NextFunction } from 'express';
import {
    HttpContext,
    RouteMethod,
    RouteHandler,
    RouteDefinition,
    RouteMiddleware,
} from '@type/core';

class Routes {
    private static routes: RouteDefinition[] = [];
    private static prefix = '';
    private static groupMiddlewares: RouteMiddleware[] = [];
    private static globalMiddlewares: RouteMiddleware[] = [];

    /**
     * Normalizations path
     */
    private static normalizePath(path: string): string {
        const normalized = '/' + path.replace(/^\/+|\/+$/g, '');
        return normalized === '/' ? '/' : normalized.replace(/\/+$/, '');
    }

    /**
     * Adds a route with specified methods, path, handler, and middlewares.
     */
    static add(
        methods: RouteMethod | RouteMethod[],
        path: string,
        handler: RouteHandler,
        middlewares: RouteMiddleware[] = [],
    ) {
        const methodArray = Array.isArray(methods) ? methods : [methods];
        const fullPath = this.normalizePath(`${this.prefix}/${path}`);

        this.routes.push({
            methods: methodArray,
            path: fullPath,
            handler,
            middlewares: [
                ...this.globalMiddlewares,
                ...this.groupMiddlewares,
                ...middlewares,
            ],
        });
    }

    static get(
        path: string,
        handler: RouteHandler,
        middlewares: RouteMiddleware[] = [],
    ) {
        this.add('get', path, handler, middlewares);
    }

    static post(
        path: string,
        handler: RouteHandler,
        middlewares: RouteMiddleware[] = [],
    ) {
        this.add('post', path, handler, middlewares);
    }

    static put(
        path: string,
        handler: RouteHandler,
        middlewares: RouteMiddleware[] = [],
    ) {
        this.add('put', path, handler, middlewares);
    }

    static delete(
        path: string,
        handler: RouteHandler,
        middlewares: RouteMiddleware[] = [],
    ) {
        this.add('delete', path, handler, middlewares);
    }

    static patch(
        path: string,
        handler: RouteHandler,
        middlewares: RouteMiddleware[] = [],
    ) {
        this.add('patch', path, handler, middlewares);
    }

    static options(
        path: string,
        handler: RouteHandler,
        middlewares: RouteMiddleware[] = [],
    ) {
        this.add('options', path, handler, middlewares);
    }

    static head(
        path: string,
        handler: RouteHandler,
        middlewares: RouteMiddleware[] = [],
    ) {
        this.add('head', path, handler, middlewares);
    }

    /**
     * Groups routes with a common prefix and middlewares.
     */
    static group(
        prefix: string,
        callback: () => void,
        middlewares: RouteMiddleware[] = [],
    ) {
        const previousPrefix = this.prefix;
        const previousMiddlewares = this.groupMiddlewares;

        this.prefix = `${previousPrefix}${prefix}`.replace(/\/+/g, '/');
        this.groupMiddlewares = [...previousMiddlewares, ...middlewares];

        callback();

        this.prefix = previousPrefix;
        this.groupMiddlewares = previousMiddlewares;
    }

    /**
     * Applies global middlewares for the duration of the callback.
     */
    static middleware(middlewares: RouteMiddleware[], callback: () => void) {
        const previousMiddlewares = this.globalMiddlewares;

        this.globalMiddlewares = [...previousMiddlewares, ...middlewares];

        callback();

        this.globalMiddlewares = previousMiddlewares;
    }

    /**
     * Applies all registered routes to the provided Express Router instance.
     * Handles controller-method binding and middleware application.
     */
    static async apply(router: Router) {
        for (const route of this.routes) {
            let handlerFunction: RouteHandler | undefined;

            if (typeof route.handler === 'function') {
                handlerFunction = route.handler;
            } else if (
                Array.isArray(route.handler) &&
                route.handler.length === 2
            ) {
                const [Controller, method] = route.handler;

                if (
                    typeof Controller === 'function' &&
                    typeof Controller[method] === 'function'
                ) {
                    handlerFunction = Controller[method].bind(Controller);
                } else if (typeof Controller === 'function') {
                    const instance = new Controller();
                    if (typeof instance[method] === 'function') {
                        handlerFunction = instance[method].bind(instance);
                    } else {
                        console.error(
                            `[ROUTES] Method ${method} not found in controller instance ${Controller.name || 'Anonymous'}`,
                        );
                        continue;
                    }
                } else {
                    console.error(
                        `[ROUTES] Invalid controller type for route: ${route.path}`,
                    );
                    continue;
                }
            } else {
                console.error(
                    `[ROUTES] Invalid handler format for route: ${route.path}`,
                );
            }

            if (handlerFunction) {
                for (const method of route.methods) {
                    if (
                        ![
                            'get',
                            'post',
                            'put',
                            'delete',
                            'patch',
                            'options',
                            'head',
                        ].includes(method)
                    ) {
                        console.error(
                            `[ROUTES] Invalid HTTP method: ${method} for route: ${route.path}`,
                        );
                        continue;
                    }

                    router[method](
                        route.path,
                        ...(route.middlewares || []),
                        async (
                            req: Request,
                            res: Response,
                            next: NextFunction,
                        ) => {
                            try {
                                const routeHttpHandler: HttpContext = {
                                    req,
                                    res,
                                    next,
                                };

                                if (typeof handlerFunction === 'function') {
                                    const result =
                                        handlerFunction(routeHttpHandler);
                                    if (result instanceof Promise) {
                                        await result;
                                    }
                                }
                            } catch (error: any) {
                                console.error(
                                    `[ROUTES] Error in route ${method.toUpperCase()} ${route.path}: ${error.message}`,
                                );
                                next(error);
                            }
                        },
                    );
                }
            }
        }
    }
}

export default Routes;
