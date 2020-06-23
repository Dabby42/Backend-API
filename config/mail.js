const secrets = require('./secrets');

let mailConfig = {
    mailSetup:{
        host: secrets.mailHost,
        port: secrets.mailPort,
        secure: false, // true for 465, false for other ports
        auth: {
            user: secrets.mailUsername,
            pass: secrets.mailPassword
        }
    },
    config:{
        from: `"Cointena" <${secrets.mailAddressFrom}>`
    }
    
};

module.exports = mailConfig;
