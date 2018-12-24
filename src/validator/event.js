const BaseValidator = require('src/validator/baseValidator');

class Event extends BaseValidator {
    validate(data) {
        this.setData(data)
            .check('eventName')
            .isNotEmpty()
            .isLength(3, 128)
            .check('startTs')
            .isNotEmpty()
            .isInt()
            .sanitizeInt()
            .isTimeStamp()
            .isTimestampInFuture(15)
            .check('serviceCode')
            .isNotEmpty()
            .isLength(3, 32)
            .check('payload')
            .isNotEmpty();
    }
}

module.exports = Event;
