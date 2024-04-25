// config.js
const config = {
    development: {
        apiUrl: 'http://localhost:4000/api/v1',
        proxyUrl: 'http://localhost:4000',
        reactUrl: 'http://localhost:80',
        region: 'ca-central-1',
        dynamoDBEndpoint: 'http://localhost:8000'
    },
    production: {
        apiUrl: 'http://3.96.56.165:4000/api/v1',
        proxyUrl: 'http://3.96.56.165:4000',
        reactUrl: 'http://3.96.56.165ß',
        region: 'ca-central-1',
        dynamoDBEndpoint: 'dynamodb.ca-central-1.amazonaws.com',

    },
};
const environment = "production";
const currentConfig = config[environment];
module.exports = currentConfig;


