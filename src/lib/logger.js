const { createLogger, format, transports, } = require('winston');
const expressWinston = require('express-winston');

const App = require('src/lib/app');

class Logger {
    constructor() {
        this.logger = this.getAppLogger();
        this.reqLogger = this.getReqLogger();
    }

    getAppLogger() {
        return createLogger({
            level: App.isProduction() ? 'info' : 'debug',
            format: format.combine(
                format.timestamp({
                    format: 'YYYY-MM-DD HH:mm:ss',
                }),
                format.json()
            ),
            transports: [
                new transports.Console({
                    level: App.isProduction() ? 'info' : 'debug',
                    format: format.combine(
                        format.printf(
                            log => `${log.timestamp} ${log.level}: ${log.message}`
                        ),
                        format.json()
                    ),
                }),
            ],
        });
    }

    getReqLogger() {
        return expressWinston.logger({
            transports: [
                new transports.Console(),
            ],
            format: format.json(),

        });
    }
}
const loggerObj = new Logger();
module.exports = {
    Logger: loggerObj.logger,
    ReqLogger: loggerObj.reqLogger,
};
