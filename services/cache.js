const mongoose = require('mongoose');
const redis = require('redis');
const util = require('util');
const redisUrl = 'redis://127.0.0.1:6379';
const client = redis.createClient(redisUrl);

client.hget = util.promisify(client.hget);

const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.cache = function(options = {}) {
    this.useCache = true;
    this.hashkey = JSON.stringify(options.key || "");
    return this;
};

mongoose.Query.prototype.exec = async function() {
    if(!this.useCache) {
        return exec.apply(this, arguments);
    }
    const key = JSON.stringify(Object.assign({}, this.getQuery(), {
        collection: this.mongooseCollection.name
    }));

    const cacheValue = await client.hget(this.hashkey, key);

    if (cacheValue) {
        const document =JSON.parse(cacheValue); // this is to return with model document insert of returning plain json
        return Array.isArray(document) ? document.map(d => new this.model(d)) : new this.model(document);
    }
    const result = await exec.apply(this, arguments);

    client.hset(this.hashkey, key, JSON.stringify(result));
    return result;
};

module.exports = {
    clearHash(hashkey) {
        client.del(JSON.stringify(hashkey));
    }
};
