require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const Config = require('config');
const App = require('src/lib/app');
const { Logger, ReqLogger, } = require('src/lib/logger');
const Mongo = require('src/lib/mongo');
const RabbitMq = require('src/lib/rabbitmq/rabbitmq');
const ApiEventRouter = require('src/router/api/event');
const ErrorHandler = require('src/middleware/errorHandler');
const Publisher = require('src/lib/rabbitmq/publisher');

const app = express();

class Server {
    constructor() {
        this.app = app;
        this.server = null;
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
            Logger.info('Error handler setting');
            this.setErrorHandler();
            Logger.info('Error handler set successfully');
            Logger.info('Not found(404) response setting');
            this.setNotFoundResponse();
            Logger.info('Not found(404) response set successfully');
            Logger.info(`Server starting listening at port ${Config.getApiHttpPort()}`);
            await this.startListening();
            Logger.info('SIGINT handler setting');
            this.setSIGINTHandler();
            Logger.info('SIGINT handler set successfully');
            this.test();
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
        this.app.use(bodyParser.json());
        if (!App.isProduction()) {
            this.app.use(ReqLogger);
        }
    }

    setRoutes() {
        this.app.use('/scheduler/v1/event', ApiEventRouter);
    }

    async startListening() {
        return new Promise((resolve, reject) => {
            this.server = this.app.listen(Config.getApiHttpPort(), (err) => {
                if (err) {
                    return reject(err);
                }
                return resolve();
            });
        });
    }

    setSIGINTHandler() {
        process.once('SIGINT', () => {
            this.cleanResources();
            this.close();
            process.exit(1);
        });
    }

    close() {
        if (this.server) {
            this.server.close();
            Logger.info('Server closed');
        }
    }

    cleanResources() {
        Logger.info('RabbitMq connections closing');
        RabbitMq.closeAllConnections();
        Logger.info('RabbitMq connections closed');
        this.server.close();
    }

    setErrorHandler() {
        this.app.use(ErrorHandler.handle);
    }

    setNotFoundResponse() {
        this.app.all('*', (req, res) => {
            res.status(404).send('Not Found');
        });
    }

    test() {
        let counter = 0;
        setInterval(async () => {
            for (let i = 0; i < 1; i += 1) {
                counter += 1;
                try {
                    await Publisher.publish(`${counter}`, 'test249');
                } catch (err) {
                    console.error(err.stack);
                }
            }
        }, 1000);
    }
}

new Server().start();
