// config.js
const config = {
    development: {
        apiUrl: 'http://laundry.sunshinelaundry.ca:4000/api/v1',
        proxyUrl: 'http://laundry.sunshinelaundry.ca:4000',
        reactUrl: 'http://laundry.sunshinelaundry.ca:80',
        REACT_APP_AWS_REGION: 'ca-central-1',
        REACT_APP_AWS_IOT_ENDPOINT: 'a3kj3d3pov9p8x-ats.iot.ca-central-1.amazonaws.com',
        REACT_APP_AWS_COGNITO_IDENTITY_POOL_ID: 'ca-central-1:5e324ab8-980b-421a-a387-0bbfc809736c',
    },
    production: {
        apiUrl: 'http://laundry.sunshinelaundry.ca:4000/api/v1',
        proxyUrl: 'http://laundry.sunshinelaundry.ca:4000',
        reactUrl: 'http://laundry.sunshinelaundry.ca',
        REACT_APP_AWS_REGION: 'ca-central-1',
        REACT_APP_AWS_IOT_ENDPOINT: 'a3kj3d3pov9p8x-ats.iot.ca-central-1.amazonaws.com',
        REACT_APP_AWS_COGNITO_IDENTITY_POOL_ID: 'ca-central-1:5e324ab8-980b-421a-a387-0bbfc809736c',
    },
};
const environment = "production";
const currentConfig = config[environment];
export default currentConfig;
