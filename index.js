const AWS = require('aws-sdk');
const url = require('url');

exports.handler = async (event, context) => {
    // TODO implemet change
    let body;
    console.log(event);
    console.log(event["code"]);
    try{
        body = event["body"];
        console.log(body)
;
    } catch(e){
        body = null;
    }

    const response = {
        statusCode: 200,
        body: JSON.stringify(body),
    };
    return response;
};

