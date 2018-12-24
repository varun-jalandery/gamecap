const BaseModel = require('src/model/baseModel');

class Event extends BaseModel {
    constructor() {
        super('events');
    }
}
module.exports = Event;
