const express = require('express');
const ApiVerify = require('src/middleware/ApiVerify');
const EventController = require('src/controller/api/event');

const router = express.Router();

class Event {
    constructor() {
        this.router = router;
        this.setRoutes();
    }

    setRoutes() {
        this.router.all('/*', ApiVerify.verify);
        this.router.get('/:eventName/:startTs/:endTs', EventController.getMany);
        this.router.get('/:eventId', EventController.getOne);
        this.router.post('/:eventName', EventController.create);
    }
}

module.exports = new Event().router;
