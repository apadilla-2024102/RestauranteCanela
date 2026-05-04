'use strict'

import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import { dbConnection } from './db.js';
import { corsOptions } from './cors.configuration.js';
import { helmetOptions } from './helmet.configuration.js';
import { requestLimit } from './rateLimit.configuration.js';
// application-level helpers from src/middlewares
import { requestLogger, notFound, errorHandler } from '../src/middlewares/index.js';
import { createSwaggerDocument } from './swagger.js';

const BASE_PATH = '/api/v1';

// route modules
import restaurantsRouter from '../src/restaurants/restaurant.routes.js';

const middlewares = (app) => {
    app.use(express.urlencoded({extended: false, limit: '10mb'}));
    app.use(express.json({limit: '10mb'}));
    app.use(cors(corsOptions));
    app.use(morgan('dev'));
    app.use(helmet(helmetOptions));
    app.use(requestLimit);
    // log every request when not in production
    app.use(requestLogger);
};

const setupSwagger = (app, port) => {
    const swaggerDocument = createSwaggerDocument(port);
    app.use(`${BASE_PATH}/docs`, swaggerUi.serve, swaggerUi.setup(swaggerDocument, { explorer: true }));
};

const routes = (app) => {
    app.get(`${BASE_PATH}/health`, (req, res) =>{
        res.status(200).json({
            status: 'healthy',
            service: 'Restaurant Service'
        })
    })

    // core routes
    app.use(`${BASE_PATH}/restaurants`, restaurantsRouter);

    // catch-all for undefined routes
    app.use(notFound);
}

export const initServer = async() => {
    const app = express();
    const PORT = process.env.PORT || 3001;
    app.set('trust proxy', 1);

    try{
        await dbConnection();
        middlewares(app);
        setupSwagger(app, PORT);
        routes(app);
        // global error handler (must come after routes)
        app.use(errorHandler);
        app.listen(PORT, () => {
            console.log(`Restaurant Service API is running successfully`);
            console.log(`Health check: http://localhost:${PORT}${BASE_PATH}/health`);
        });
    }catch(err){
        console.error(`Error al iniciar el servidor: ${err.message}`)
        process.exit(1);
    }
};