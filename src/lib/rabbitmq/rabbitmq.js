const amqp = require('amqplib');
const Config = require('config');
const { Logger, } = require('src/lib/logger');

const connMap = {};
const chanMap = {};

class RabbitMq {
    connect(connId = 'default') {
        if (connMap[connId]) {
            Logger.debug(`Reusing connection ${connId}`);
            return Promise.resolve(connMap[connId]);
        }
        return new Promise((resolve, reject) => {
            Logger.debug(`New connection created ${connId}`);
            amqp.connect(Config.getRabbitMqConnectionUrl())
                .then((conn) => {
                    connMap[connId] = conn;
                    return resolve(conn);
                })
                .catch(err => reject(err));
        });
    }

    getChannel(chanId = 'default', connId = 'default') {
        return new Promise((resolve, reject) => {
            this.connect(connId)
                .then((conn) => {
                    if (chanMap[`${connId}_${chanId}`]) {
                        Logger.debug(`Reusing channel ${connId}_${chanId}`);
                        return resolve(chanMap[`${connId}_${chanId}`]);
                    }
                    Logger.debug(`New channel created ${connId}_${chanId}`);
                    return conn.createChannel();
                })
                .then((ch) => {
                    this.setChannelEventHandler(ch, chanId, connId);
                    chanMap[`${connId}_${chanId}`] = ch;
                    return resolve(ch);
                })
                .catch(err => reject(err));
        });
    }

    setChannelEventHandler(ch, chanId, connId) {
        ch.on('close', () => {
            Logger.info(`Channel ${connId}_${chanId} is closed.`);
            this.getChannel(chanId, connId);
        });

        ch.on('error', () => {
            this.getChannel(chanId, connId);
            Logger.info(`Channel ${connId}_${chanId} is errored.`);
        });

        ch.on('return', () => {
            this.getChannel(chanId, connId);
            Logger.info(`Channel ${connId}_${chanId} is returned.`);
        });
    }

    createExchange(topic, connId = 'default', options = {}) {
        return this.getChannel(connId)
            .then(ch => ch.assertExchange(
                topic,
                options.type || 'direct',
                { durable: options.durable ? !!options.durable : false, }
            ));
    }

    closeAllConnections() {
        Object.keys(connMap)
            .forEach(connId => connMap[connId].close());
    }
}

module.exports = new RabbitMq();
