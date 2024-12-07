const { getDataConnect, validateArgs } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'default',
  service: 'zing-website01',
  location: 'us-central1'
};
exports.connectorConfig = connectorConfig;

