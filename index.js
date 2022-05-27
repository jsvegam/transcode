const AWS = require('aws-sdk');
const url = require('url');

exports.handler = async (event) => {
    // TODO implemet change
    let body;
    try{
        accessCode = event["body"];

    } catch(e){
        body = null;
    }

    const response = {
        statusCode: 200,
        body: JSON.stringify('Hello from lambda', body),
    };
    return response;
};

