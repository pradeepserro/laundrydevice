// config.js
const config = {
    development: {
        apiUrl: 'http://3.99.31.18:4000/api/v1',
        proxyUrl: 'http://3.99.31.18:4000',
        reactUrl: 'http://3.99.31.18',
        REACT_APP_AWS_REGION: 'ca-central-1',
        REACT_APP_AWS_IOT_ENDPOINT: 'a2m5ep85nd5s4s-ats.iot.ca-central-1.amazonaws.com',
        REACT_APP_AWS_COGNITO_IDENTITY_POOL_ID: 'ca-central-1:343aba64-1cb1-4384-99c0-55041f2cacbc',
    },
    production: {
        apiUrl: 'http://3.99.31.18:4000/api/v1',
        proxyUrl: 'http://3.99.31.18:4000',
        reactUrl: 'http://3.99.31.18',
        REACT_APP_AWS_REGION: 'ca-central-1',
        REACT_APP_AWS_IOT_ENDPOINT: 'a2m5ep85nd5s4s-ats.iot.ca-central-1.amazonaws.com',
        REACT_APP_AWS_COGNITO_IDENTITY_POOL_ID: 'ca-central-1:343aba64-1cb1-4384-99c0-55041f2cacbc',
    },
};
const environment = "production";
const currentConfig = config[environment];
export default currentConfig;
