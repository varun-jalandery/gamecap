const Config = require('config');

class App {
    static isProduction() {
        if (Config.getNodeEnvironment() === 'production') {
            return true;
        }
        return false;
    }
}

module.exports = App;
