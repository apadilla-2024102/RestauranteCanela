'use strict';

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import { corsOptions } from './cors.configuration.js';
import { helmetOptions } from './helmet.configuration.js';
import { dbConnection } from './db.configuration.js';
import { requestLimit } from './rateLimit.configuration.js';
import { errorHandler } from '../src/middlewares/handle-errors.js';
import reportRoutes from '../src/reports/report.routes.js';
import { createSwaggerDocument } from './swagger.js';

const BASE_PATH = '/api/v1';

const routes = (app) => {
    app.use(`${BASE_PATH}/reports`, reportRoutes);
    app.get(`${BASE_PATH}/health`, (req, res) =>{
        res.status(200).json({
            status: 'Healthy',
            timeStamp: new Date().toISOString(),
            service: 'Report Service'
        })
    })

    app.use((req, res) =>{
        res.status(404).json({
            success: false,
            message: 'Endpoint no encontrado'
        })
    })
}

const middlewares = (app) => {
    app.use(express.json({limit: '10mb'}));
    app.use(express.urlencoded({extended: false, limit: '10mb'}));
    app.use(cors(corsOptions));
    app.use(helmet(helmetOptions));
    app.use(morgan('dev'));
    app.use(requestLimit);
}

const setupSwagger = (app, port) => {
    const swaggerDocument = createSwaggerDocument(port);
    app.use(`${BASE_PATH}/docs`, swaggerUi.serve, swaggerUi.setup(swaggerDocument, { explorer: true }));
}

export const initServer = async () => {
    const app = express();
    const PORT = process.env.PORT || 5400;

    try {
        await dbConnection();
        middlewares(app);
        setupSwagger(app, PORT);
        routes(app);
        app.use(errorHandler);

        app.listen(PORT, () => {
            console.log(`Report Service corriendo en http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Error al iniciar el servidor:', error);
        process.exit(1);
    }
}