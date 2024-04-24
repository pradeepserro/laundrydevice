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
        apiUrl: 'http://laundry.sunshinelaundry.ca:4000/api/v1',
        proxyUrl: 'http://laundry.sunshinelaundry.ca:4000',
        reactUrl: 'http://laundry.sunshinelaundry.ca',
        region: 'ca-central-1',
        dynamoDBEndpoint: 'dynamodb.ca-central-1.amazonaws.com',

    },
};
const environment = "production";
const currentConfig = config[environment];
module.exports = currentConfig;


