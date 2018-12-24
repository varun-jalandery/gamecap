const amqp = require('amqplib');
const Config = require('config');

// eslint-disable-next-line
let connection = null;

class RabbitMq {
    async connect() {
        return new Promise((resolve, reject) => {
            amqp.connect(Config.getRabbitMqConnectionUrl())
                .then((conn) => {
                    // eslint-disable-next-line
                    connection = conn;
                    return resolve();
                })
                .catch(err => reject(err));
        });
    }
}

module.exports = new RabbitMq();
