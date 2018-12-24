const { Etcd3, } = require('etcd3');

let client = null;
const watchers = {};

class Etcd {
    constructor() {
        client = new Etcd3({
            hosts: 'etcd3:2379',
            // hosts: this.getHostsConfig(),
        });
    }

    getWatcher(key) {
        if (watchers[key]) {
            return Promise.resolve(watchers[key]);
        }
        return new Promise((resolve, reject) => {
            client.watch()
                .key(key)
                .create()
                .then((watcher) => {
                    watchers[key] = watcher;
                    return resolve(watcher);
                })
                .catch(err => reject(err));
        });
    }

    getClientLease(ttlSecs = 10) {
        return client.lease(ttlSecs);
    }

    put(key, value) {
        return client.put(key).value(value);
    }

    get(key) {
        return client.get(key).string();
    }

    getKeys(prefix = null) {
        const keysPromise = client.getAll();
        if (prefix) {
            keysPromise.prefix(prefix);
        }
        return keysPromise.strings();
    }

    deleteAllKeys() {
        return client.delete().all();
    }

    delete(key) {
        return client.delete(key);
    }

    deleteWatcher(key) {
        delete watchers[key];
    }

    addEventHandler(event, watcher, handler) {
        if (this.getValidEvents().indexOf(event) === -1) {
            throw new Error(`Unknown etcd watcher event [${event}]`);
        }
        watcher.on(event, handler);
    }

    deleteEventHandler(event, watcher) {
        if (this.getValidEvents().indexOf(event) === -1) {
            throw new Error(`Unknown etcd watcher event [${event}]`);
        }
        watcher.removeEventListener(event);
    }

    getValidEvents() {
        return [
            'connecting',
            'connected',
            'data',
            'put',
            'delete',
            'end',
            'disconnected',
            'error',
        ];
    }

    getHostsConfig() {
        const HOSTS_KEY = process.env.ETCD3_HOSTS;
        if (typeof HOSTS_KEY !== 'string') {
            throw new Error(`HOSTS_KEY type should be string, ${typeof HOSTS_KEY} given`);
        }
        const hosts = HOSTS_KEY.includes(',') ? HOSTS_KEY.split(',') : [HOSTS_KEY];
        return hosts;
    }
}

module.exports = new Etcd();
