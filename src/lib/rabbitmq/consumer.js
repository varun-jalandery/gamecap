const amqp = require('amqplib');
const Config = require('config');
const RabbitMq = require('src/lib/rabbitmq/rabbitmq');

// eslint-disable-next-line
let connection = null;

class Consumer {
    connect() {
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

    getConnection() {
        return connection;
    }

    startQueueConsumer(topic, queueName) {
        let channel = null;
        RabbitMq.getChannel('consumer', 'consumer')
            .then((ch) => {
                channel = ch;
                return RabbitMq.getQueue(
                    topic,
                    queueName,
                    'consumer',
                    'consumer'
                );
            })
            .then(q => channel.consume(
                q.queue,
                msg => console.log(" [consumed] '%s'", msg.content.toString()),
                { noAck: true, }
            ))
            .catch(err => console.error(err.stack));
    }
}

module.exports = Consumer;
