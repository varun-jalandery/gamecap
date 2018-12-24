const nodemailer = require('nodemailer');
const Config = require('config');

let transporter = null;

class Email {
    getTransporter() {
        if (transporter !== null) {
            return transporter;
        }
        const smtpConfig = Config.getSMTPConfig();
        transporter = nodemailer.createTransport({
            host: smtpConfig.host,
            port: smtpConfig.port,
            secure: false,
        });
        return transporter;
    }

    send(emailOptions) {
        return new Promise((resolve, reject) => {
            this.getTransporter()
                .sendMail(emailOptions, (err, data) => {
                    if (err) {
                        return reject(err);
                    }
                    return resolve(data);
                });
        });
    }
}

module.exports = new Email();
