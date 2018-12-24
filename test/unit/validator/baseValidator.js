const { expect, } = require('chai');
const BaseValidator = require('src/validator/baseValidator');


describe('src/validator/baseValidator', () => {
    const baseValidator = new BaseValidator();
    it('isNotEmpty() : should be ok for not empty key', () => {
        baseValidator.setData({ id: 123, })
            .check('id')
            .isNotEmpty();
        expect(baseValidator.isOk())
            .to
            .equal(true);
    });

    it('isNotEmpty() : should not be ok for empty key', () => {
        baseValidator.setData({ id: null, })
            .check('id')
            .isNotEmpty();
        expect(baseValidator.isNotOk())
            .to
            .equal(true);
    });

    it('isEmail() : should be ok for valid email', () => {
        baseValidator.setData({ email: 'varun.j@circles.asia', })
            .check('email')
            .isEmail();
        expect(baseValidator.isOk())
            .to
            .equal(true);
    });

    it('isEmail() : should not be ok for invalid email', () => {
        baseValidator.setData({ email: 'varun.j_circles.asia', })
            .check('email')
            .isEmail();
        expect(baseValidator.isNotOk())
            .to
            .equal(true);
    });

    it('isInt() : should be ok for valid int', () => {
        baseValidator.setData({ myInt: 123, })
            .check('myInt')
            .isInt();
        expect(baseValidator.isOk())
            .to
            .equal(true);
    });

    it('isInt() : should not be ok for invalid int', () => {
        baseValidator.setData({ myInvalidInt: 123.456, })
            .check('myInvalidInt')
            .isInt();
        expect(baseValidator.isNotOk())
            .to
            .equal(true);
    });

    it('isIn() : should be ok if value lies in array', () => {
        baseValidator.setData({ fruit: 'apple', })
            .check('fruit')
            .isIn(['apple', 'banana']);
        expect(baseValidator.isOk())
            .to
            .equal(true);
    });

    it('isIn() : should not be ok if value does not lies in array', () => {
        baseValidator.setData({ fruit: 'pear', })
            .check('fruit')
            .isIn(['apple', 'banana']);
        expect(baseValidator.isNotOk())
            .to
            .equal(true);
    });

    it('equals() : should be ok if value is equal to given value', () => {
        baseValidator.setData({ fruit: 'pear', })
            .check('fruit')
            .equals('pear');
        expect(baseValidator.isOk())
            .to
            .equal(true);
    });

    it('equals() : should not be ok if value is not equal to given value', () => {
        baseValidator.setData({ fruit: 'pear', })
            .check('fruit')
            .equals('orange');
        expect(baseValidator.isNotOk())
            .to
            .equal(true);
    });

    it('contains() : should be ok if value is contained in given value', () => {
        baseValidator.setData({ fruit: 'orange', })
            .check('fruit')
            .contains('ran');
        expect(baseValidator.isOk())
            .to
            .equal(true);
    });

    it('contains() : should not be ok if value is not contained in given value', () => {
        baseValidator.setData({ fruit: 'orange', })
            .check('fruit')
            .contains('rain');
        expect(baseValidator.isNotOk())
            .to
            .equal(true);
    });

    it('isJson() : should be ok if string is valid json', () => {
        baseValidator.setData({ row: '{"id" : 123}', })
            .check('row')
            .isJson();
        expect(baseValidator.isOk())
            .to
            .equal(true);
    });

    it('isJson() : should not be ok if string is invalid json', () => {
        baseValidator.setData({ row: '{"id" : 123', })
            .check('row')
            .isJson();
        expect(baseValidator.isNotOk())
            .to
            .equal(true);
    });

    it('isBoolean() : should be ok if value is boolean(true)', () => {
        baseValidator.setData({ isValid: true, })
            .check('isValid')
            .isBoolean();
        expect(baseValidator.isOk())
            .to
            .equal(true);
    });

    it('isBoolean() : should be ok if value is boolean(false)', () => {
        baseValidator.setData({ isValid: false, })
            .check('isValid')
            .isBoolean();
        expect(baseValidator.isOk())
            .to
            .equal(true);
    });

    it('isBoolean() : should not be ok if value is not boolean', () => {
        baseValidator.setData({ isValid: 'notABoolean', })
            .check('isValid')
            .isBoolean();
        expect(baseValidator.isNotOk())
            .to
            .equal(true);
    });

    it('isLength() : should be ok if length is valid', () => {
        baseValidator.setData({ code: 'CIRCLES', })
            .check('code')
            .isLength(3, 32);
        expect(baseValidator.isOk())
            .to
            .equal(true);
    });

    it('isLength() : should not be ok if length is invalid', () => {
        baseValidator.setData({ code: 'CL', })
            .check('code')
            .isLength(3, 32);
        expect(baseValidator.isNotOk())
            .to
            .equal(true);
    });

    it('isTimeStamp() : should be ok if timestamp is valid', () => {
        baseValidator.setData({ ts: 1542784820932, })
            .check('ts')
            .isTimeStamp();
        expect(baseValidator.isOk())
            .to
            .equal(true);
    });

    it('isTimeStamp() : should not be ok if timestamp is invalid', () => {
        baseValidator.setData({ ts: 'not a timestamp', })
            .check('ts')
            .isTimeStamp();
        expect(baseValidator.isNotOk())
            .to
            .equal(true);
    });

    it('isTimestampInFuture() : should be ok if timestamp is in n future mins', () => {
        baseValidator.setData({ ts: new Date().getTime() + (10 * 60 * 1000), })
            .check('ts')
            .isTimestampInFuture(5);
        expect(baseValidator.isOk())
            .to
            .equal(true);
    });

    it('isTimestampInFuture() : should not be ok if timestamp is in future but less than n mins',
        () => {
            baseValidator.setData({ ts: new Date().getTime() + (2 * 60 * 1000), })
                .check('ts')
                .isTimestampInFuture(5);
            expect(baseValidator.isNotOk())
                .to
                .equal(true);
        });
});
