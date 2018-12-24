require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const Config = require('config');
const App = require('src/lib/app');
const { Logger, ReqLogger, } = require('src/lib/logger');
const Mongo = require('src/lib/mongo');
const RabbitMq = require('src/lib/rabbitmq');
const ApiEventRouter = require('src/router/api/event');
const ErrorHandler = require('src/middleware/errorHandler');


const server = express();

class Server {
    constructor() {
        this.server = server;
    }

    async start() {
        try {
            Logger.info('Services starting');
            await this.startServices();
            Logger.info('Services started successfully');
            Logger.info('Middleware setting');
            this.setMiddlewares();
            Logger.info('Middleware set successfully');
            Logger.info('Routes starting');
            this.setRoutes();
            Logger.info('Routes started successfully');
            Logger.info('Error Handler setting');
            this.setErrorHandler();
            Logger.info('Error Handler set successfully');
            Logger.info('Not found(404) response setting');
            this.setNotFoundResponse();
            Logger.info('Not found(404) response set successfully');
            Logger.info(`Server starting listening at port ${Config.getApiHttpPort()}`);
            await this.startListening();
        } catch (err) {
            Logger.error(err.stack);
            process.exit(1);
        }
        Logger.info(`Server stared successfully, listening at port ${Config.getApiHttpPort()}`);
    }

    async startServices() {
        const serviceStartPromises = [
            Mongo.connect(),
            RabbitMq.connect(),
        ];
        return Promise.all(serviceStartPromises);
    }

    setMiddlewares() {
        this.server.use(bodyParser.json());
        if (!App.isProduction()) {
            this.server.use(ReqLogger);
        }
    }

    setRoutes() {
        this.server.use('/scheduler/v1/event', ApiEventRouter);
    }

    async startListening() {
        return new Promise((resolve, reject) => {
            this.server.listen(Config.getApiHttpPort(), (err) => {
                if (err) {
                    return reject(err);
                }
                return resolve();
            });
        });
    }

    setErrorHandler() {
        this.server.use(ErrorHandler.handle);
    }

    setNotFoundResponse() {
        this.server.all('*', (req, res) => {
            res.status(404).send('Not Found');
        });
    }
}

new Server().start();
