const BaseController = require('src/controller/baseController');
const EventModel = require('src/model/event');
const EventValidator = require('src/validator/event');

class Event extends BaseController {
    static async create(req, res, next) {
        const eventValidator = new EventValidator();
        const data = Object.assign(
            {},
            req.body,
            {
                eventName: req.params.eventName,
                serviceCode: res.locals.serviceCode,
            }
        );
        eventValidator.validate(data);
        if (eventValidator.isNotOk()) {
            return res.status(400).send(Event.getErrorResponseBody(eventValidator.getErrors()));
        }
        try {
            const writeResult = await new EventModel().insertOne(eventValidator.getValidData());
            return res.send(Event.getSuccessResponseBody({ uuid: writeResult.doc.uuid, }));
        } catch (err) {
            return next(err);
        }
    }

    static getMany(req, res, next) {
        res.send('getMany');
        next();
    }

    static getOne(req, res, next) {
        res.send('getOne');
        next();
    }

    static delete(req, res, next) {
        res.send('delete');
        next();
    }
}

module.exports = Event;
