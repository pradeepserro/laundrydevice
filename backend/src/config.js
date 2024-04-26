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
        apiUrl: 'http://prod.sunshinelaundry.ca:4000/api/v1',
        proxyUrl: 'http://prod.sunshinelaundry.ca:4000',
        reactUrl: 'http://prod.sunshinelaundry.ca',
        region: 'ca-central-1',
        dynamoDBEndpoint: 'dynamodb.ca-central-1.amazonaws.com',

    },
};
const environment = "production";
const currentConfig = config[environment];
module.exports = currentConfig;


