class Config {
    getRabbitMqConnectionUrl() {
        return this.getEnvVariable('RABBITMQ_URL');
    }

    getMongoDbConnectionUrl() {
        return this.getEnvVariable('MONGODB_URL');
    }

    getMongoDbName() {
        return this.getEnvVariable('MONGODB_NAME');
    }

    getApiHttpPort() {
        return this.getEnvVariable('API_PORT');
    }

    getServiceCodeHeaderName() {
        return this.getEnvVariable('SERVICE_CODE_HEADER');
    }

    getSMTPConfig() {
        return {
            host: this.getEnvVariable('SMTP_HOST'),
            port: this.getEnvVariable('SMTP_PORT'),
        };
    }

    getEnvVariable(envVar) {
        if (!process.env[envVar]) {
            throw new Error(`Define ${envVar} environment variable`);
        }
        return process.env[envVar];
    }

    getNodeEnvironment() {
        return process.env.NODE_ENV;
    }
}

module.exports = new Config();
