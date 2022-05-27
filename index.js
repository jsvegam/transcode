const AWS = require('aws-sdk');
const url = require('url');

exports.handler = async (event) => {
    // TODO implemet change
    let varEvent = event.queryStringParameters.code
    const response = {
        statusCode: 200,
        body: JSON.stringify('Hello from lambda'),
    };
    return response;
};

