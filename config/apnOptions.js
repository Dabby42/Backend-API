import secrets from './secrets';

const apnOptions = {
    token: {
      key: secrets.apnKeyP8,
      keyId: secrets.apnKeyId,
      teamId: secrets.apnTeamId
    },
    production: true
};

module.export = apnOptions;