const RabbitMq = require('src/lib/rabbitmq/rabbitmq');
const { Logger, } = require('src/lib/logger');

class Publisher {
    static publish(message, exName, type = 'direct') {
        return new Promise((resolve, reject) => {
            let channel = null;
            RabbitMq.getChannel('default', 'default', message)
                .then((ch) => {
                    channel = ch;
                    return channel.assertExchange(
                        exName,
                        type,
                        { durable: false, }
                    );
                })
                .then(() => {
                    channel.publish(exName, type, Buffer.from(message));
                    Logger.debug(`Message ${JSON.stringify(message)} published to exchange exName = ${exName} and type = ${type}`);
                    return resolve();
                })
                .catch(err => reject(err));
        });
    }
}

module.exports = Publisher;
