const url = require('url');
const axios = require('axios');
const Name = "test_desa_secrets";
const request = require("request");
var AWS = require('aws-sdk'),
    region = "us-east-1",
    secretName = "test/clave-unica",
    secret,
    decodedBinarySecret;

// Create a Secrets Manager client
var client = new AWS.SecretsManager({
    region: region
});

client.getSecretValue({SecretId: secretName}, function(err, data) {
    if (err) {
        if (err.code === 'DecryptionFailureException')
            // Secrets Manager can't decrypt the protected secret text using the provided KMS key.
            // Deal with the exception here, and/or rethrow at your discretion.
            throw err;
        else if (err.code === 'InternalServiceErrorException')
            // An error occurred on the server side.
            // Deal with the exception here, and/or rethrow at your discretion.
            throw err;
        else if (err.code === 'InvalidParameterException')
            // You provided an invalid value for a parameter.
            // Deal with the exception here, and/or rethrow at your discretion.
            throw err;
        else if (err.code === 'InvalidRequestException')
            // You provided a parameter value that is not valid for the current state of the resource.
            // Deal with the exception here, and/or rethrow at your discretion.
            throw err;
        else if (err.code === 'ResourceNotFoundException')
            // We can't find the resource that you asked for.
            // Deal with the exception here, and/or rethrow at your discretion.
            throw err;
    }
    else {
        // Decrypts secret using the associated KMS key.
        // Depending on whether the secret is a string or binary, one of these fields will be populated.
        if ('SecretString' in data) {
            secret = data.SecretString;
        } else {
            let buff = new Buffer(data.SecretBinary, 'base64');
            decodedBinarySecret = buff.toString('ascii');
        }
    }
    
    // Your code goes here. 
});



exports.handler = async (event, context) => {
    // TODO implemet change
    let body;
    console.log(event);
    try{
        body = event;
        console.log(body);

        //consume AWS Secret
        async function getSecret (secretName) {        
            const params = {SecretId: secretName}
            return await new Promise((resolve, reject) => {
                sm.getSecretValue(params, (err, data) => {
                    if(err)
                        reject(err)
                    else
                        resolve(data)
                })
            })
        }

        async function getString(secretName) {
            const secrets = await getSecret(secretName)
            return secrets.SecretString;
        }


    //consume CU br
    const usuario = await getString(Name)
    const { API_Client_Id, API_Client_Secret } = JSON.parse(usuario);    

    const data = {
        'client_id'     : "c527b0bb20feee7f52d16cfc5c7e2486",
        'client_secret' : "dcfca4a67aa8529dee458e57228c9cbe",
        'grant_type'    : "password",
        'scope'         : "scope",
        'username'      : "10002652K",
        'password'      : "1234",
    }  

    axios({
        method : 'post',
        url    : "https://apipp.bancoripley.cl/banco-ripley/pre-produccion/oidc-clu-password/oauth2/token", 
        headers: headers,
        data   : qs.stringify(data)
    })
    .then(function (response) {
        if (response.status  == '200')
            console.log("Response axios 200: ", response.data);
    })
    .catch(function (error) {
        console.log("Error Code    : ", );
        console.log("Error axios Message : ", error.message);
    })





    } catch(e){
        body = null;
    }

    const response = {
        statusCode: 200,
        body: JSON.stringify(body),
    };
    return response;
};

