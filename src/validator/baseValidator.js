const util = require('util');
const validator = require('validator');

class BaseValidator {
    constructor() {
        this.data = {};
        this.errors = {};
        this.key = null;
        this.validData = {};
    }

    check(key) {
        this.key = key;
        return this;
    }

    isNotEmpty(msg = '%s should not be empty.') {
        if (this.isEmpty(this.data[this.key])) {
            this.pushError(msg);
        } else {
            this.addKeyToValidData();
        }
        return this;
    }

    isEmpty(value) {
        if (typeof value === 'undefined'
            || value === ''
            || value === null

        ) {
            return true;
        }
        return false;
    }

    isEmail(msg = '%s should be valid email.') {
        return this.callValidatorLib(msg, 'isEmail');
    }

    isInt(msg = '%s should be integer.', options = {}) {
        return this.callValidatorLib(msg, 'isInt', options);
    }

    isIn(values, msg = '%s should be in') {
        return this.callValidatorLib(msg, 'isIn', values);
    }

    equals(value, msg = '%s should be equal to ') {
        return this.callValidatorLib(msg, 'equals', value);
    }

    contains(value, msg = '%s does not contains') {
        return this.callValidatorLib(msg, 'contains', value);
    }

    isJson(value, msg = '%s is not valid json') {
        return this.callValidatorLib(msg, 'isJSON', value);
    }

    isBoolean(value, msg = '%s is not boolean') {
        return this.callValidatorLib(msg, 'isBoolean', value);
    }

    isLength(min = 0, max = 65536, msg = 'length should be between %s and %s') {
        return this.callValidatorLib(util.format(msg, min, max), 'isLength', { min, max, });
    }

    isTimeStamp(msg = 'should be a valid timestamp') {
        const ts = new Date(Number.parseInt(this.getValue(), 10)).getTime();
        if (Number.isNaN(ts) || ts < 0) {
            this.pushError(msg);
        } else {
            this.addKeyToValidData();
        }
        return this;
    }

    isTimestampInFuture(mins = 15, msg = 'should be atleast %s mins in future or more') {
        const futureTs = new Date().getTime() + (mins * 60 * 1000);
        if (Number.parseInt(this.getValue(), 10) < futureTs) {
            this.pushError(util.format(msg, mins));
        } else {
            this.addKeyToValidData();
        }
        return this;
    }

    sanitizeInt() {
        if (this.isKeyErrorFree()) {
            this.addKeyToValidData(validator.toInt(this.getValue()));
        }
        return this;
    }

    isOk() {
        return Object.keys(this.errors).length === 0;
    }

    isNotOk() {
        return Object.keys(this.errors).length > 0;
    }

    getErrors() {
        return this.errors;
    }

    callValidatorLib(msg, method, options = {}) {
        if (typeof this.data[this.key] === 'undefined') {
            this.pushError(msg, options);
            return this;
        }
        const val = this.getValue();
        if (val && validator[method](val, options)) {
            this.addKeyToValidData();
            return this;
        }
        this.pushError(msg, options);
        return this;
    }

    pushError(msg, options = null) {
        if (typeof this.errors[this.key] === 'undefined') {
            this.errors[this.key] = [];
        }
        let formattedMsg = msg;
        formattedMsg += this.getMessageFromOptions(options);
        if (!formattedMsg.includes('%s')) {
            formattedMsg = `%s ${formattedMsg}`;
        }
        this.errors[this.key].push({
            message: util.format(formattedMsg, this.key).trim(),
        });
    }

    isKeyErrorFree() {
        if (typeof this.errors[this.key] === 'undefined') {
            return true;
        }
        return false;
    }

    getMessageFromOptions(options) {
        if (!options) {
            return '';
        }
        if (Array.isArray(options)) {
            return ` [ ${options.join(', ')} ]`;
        }

        if (typeof options === 'string') {
            return ` ${options}`;
        }
        return '';
    }

    getValue() {
        if (typeof this.data[this.key] === 'undefined') {
            return undefined;
        }
        return `${this.data[this.key]}`;
    }

    setData(data) {
        this.reset();
        this.data = Object.assign({}, data);
        return this;
    }

    addKeyToValidData() {
        this.validData[this.key] = this.data[this.key];
    }

    getData() {
        return this.data;
    }

    getValidData() {
        return this.validData;
    }

    reset() {
        this.errors = {};
        this.key = null;
    }
}

module.exports = BaseValidator;
