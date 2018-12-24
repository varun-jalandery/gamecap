const { Logger, } = require('src/lib/logger');

class ErrorHandler {
    static handle(err, req, res, next) {
        if (err) {
            Logger.error(err.stack);
        }
        if (!res.headersSent) {
            res.status(err.HTTP_CODE ? err.HTTP_CODE : 500);
            res.json({ error: err.stack, });
        }
        return next();
    }
}
module.exports = ErrorHandler;
