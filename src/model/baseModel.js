const Mongo = require('src/lib/mongo');


class BaseModel {
    constructor(collectionName) {
        this.collectionName = collectionName;
    }

    async insertOne(doc) {
        return Mongo.insertOne(doc, this.collectionName);
    }

    // async delete(id) {
    //     return new Promise((resolve, reject) => {
    //
    //     });
    // }
}
module.exports = BaseModel;
