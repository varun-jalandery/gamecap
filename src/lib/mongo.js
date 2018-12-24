const { MongoClient, } = require('mongodb');
const uuidv1 = require('uuid/v1');
const Config = require('config');

// eslint-disable-next-line
let connection = null;
let db = null;

class Mongo {
    async connect() {
        return new Promise((resolve, reject) => {
            MongoClient.connect(
                Config.getMongoDbConnectionUrl(),
                {
                    useNewUrlParser: true,
                    reconnectTries: 60,
                    reconnectInterval: 1000,
                },
                (err, conn) => {
                    if (err) {
                        return reject(err);
                    }
                    // eslint-disable-next-line
                    connection = conn;
                    // eslint-disable-next-line
                    db = connection.db(Config.getMongoDbName());
                    return resolve();
                }
            );
        });
    }

    async insertOne(doc, collectioName, writeOptions = {}) {
        const wOpts = Object.assign(this.getDefaultWriteOptions(), writeOptions);
        this.setDefaultKeys(doc);
        return new Promise((resolve, reject) => {
            db.collection(collectioName).insertOne(
                doc,
                wOpts,
                (err, result) => {
                    if (err) {
                        return reject(err);
                    }
                    return resolve({ writeResult: result, doc, });
                }
            );
        });
    }

    setDefaultKeys(doc) {
        if (!doc.uuid) {
            doc.uuid = uuidv1();
        }
        const gmtTs = new Date().getTime();
        if (!doc.created_ts) {
            doc.created_ts = gmtTs;
        }
        doc.updated_ts = gmtTs;
    }

    getDefaultWriteOptions() {
        return {
            w: 'majority',
            wtimeout: 10000,
            serializeFunctions: true,
        };
    }
}

module.exports = new Mongo();
