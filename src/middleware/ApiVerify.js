const Config = require('config');

class ApiVerify {
    static verify(req, res, next) {
        const serviceCodeHeaderName = Config.getServiceCodeHeaderName();
        if (!req.get(serviceCodeHeaderName)) {
            const err = new Error(`${serviceCodeHeaderName} header is missing`);
            err.HTTP_CODE = 400;
            return next(err);
        }
        res.locals.serviceCode = req.get(serviceCodeHeaderName);
        return next();
    }
}

module.exports = ApiVerify;
