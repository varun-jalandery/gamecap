class BaseController {
    static getSuccessResponseBody(data) {
        return { data, };
    }

    static getErrorResponseBody(errors) {
        return { errors, };
    }
}

module.exports = BaseController;
