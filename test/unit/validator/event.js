const { expect, } = require('chai');
const EventValidator = require('src/validator/event');


describe('src/validator/event', () => {
    const eventValidator = new EventValidator();
    it('validate() : correct data should be ok', () => {
        const data = {
            eventName: 'notification_birthday',
            serviceCode: 'telco',
            startTs: new Date().getTime() + (16 * 60 * 1000),
            payload: {
                data1: 'abc',
                data2: 'def',
            },
        };
        eventValidator.validate(data);
        expect(eventValidator.isOk())
            .to
            .equal(true);
    });

    it('validate() : missing eventName in event should fail', () => {
        const data = {
            serviceCode: 'telco',
            startTs: new Date().getTime() + (16 * 60 * 1000),
            payload: {
                data1: 'abc',
                data2: 'def',
            },
        };
        eventValidator.validate(data);
        expect(eventValidator.isNotOk())
            .to
            .equal(true);
    });

    it('validate() : missing serviceCode in event should fail', () => {
        const data = {
            eventName: 'notification_birthday',
            startTs: new Date().getTime() + (16 * 60 * 1000),
            payload: {
                data1: 'abc',
                data2: 'def',
            },
        };
        eventValidator.validate(data);
        expect(eventValidator.isNotOk())
            .to
            .equal(true);
    });

    it('validate() : missing startTs in event should fail', () => {
        const data = {
            serviceCode: 'telco',
            eventName: 'notification_birthday',
            payload: {
                data1: 'abc',
                data2: 'def',
            },
        };
        eventValidator.validate(data);
        expect(eventValidator.isNotOk())
            .to
            .equal(true);
    });

    it('validate() : invalid startTs in event should fail', () => {
        const data = {
            serviceCode: 'telco',
            eventName: 'notification_birthday',
            startTs: 'unix_time_stamp',
            payload: {
                data1: 'abc',
                data2: 'def',
            },
        };
        eventValidator.validate(data);
        expect(eventValidator.isNotOk())
            .to
            .equal(true);
    });

    it('validate() : past startTs in event should fail', () => {
        const data = {
            serviceCode: 'telco',
            eventName: 'notification_birthday',
            startTs: new Date().getTime() - (10 * 60 * 1000),
            payload: {
                data1: 'abc',
                data2: 'def',
            },
        };
        eventValidator.validate(data);
        expect(eventValidator.isNotOk())
            .to
            .equal(true);
    });

    it('validate() : startTs less than 15 mins into future in event should fail', () => {
        const data = {
            serviceCode: 'telco',
            eventName: 'notification_birthday',
            startTs: new Date().getTime() + (10 * 60 * 1000),
            payload: {
                data1: 'abc',
                data2: 'def',
            },
        };
        eventValidator.validate(data);
        expect(eventValidator.isNotOk())
            .to
            .equal(true);
    });

    it('validate() : missing payload in event should fail', () => {
        const data = {
            serviceCode: 'telco',
            eventName: 'notification_birthday',
            startTs: new Date().getTime() + (10 * 60 * 1000),
        };
        eventValidator.validate(data);
        expect(eventValidator.isNotOk())
            .to
            .equal(true);
    });
});
