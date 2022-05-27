const AWS = require('aws-sdk');
const url = require('url');

exports.handler = async (event, context) => {
    // TODO implemet change
    let body;
    console.log(event);
    console.log(context);

    console.log(event["code"]);
    console.log(event.headers);
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

