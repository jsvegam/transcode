const url = require('url');
const axios = require('axios');
const request = require("request");
var AWS = require('aws-sdk');

// Create a Secrets Manager client
const Name = "test/clave-unica";
var sm = new AWS.SecretsManager({region: "us-east-1"});




exports.handler = async (event, context) => {

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

    async function getString(Name) {
        const secrets = await getSecret(Name)
        return secrets.SecretString;
    }

    const usuario = await getString(Name)
    console.log(usuario);


    // TODO implemet change
    let body;

    try{
        body = event;
        console.log(body);

        //consume AWS Secret



        // //consume CU br

        // const { API_Client_Id, API_Client_Secret } = JSON.parse(usuario);    

        // const data = {
        //     'client_id'     : "c527b0bb20feee7f52d16cfc5c7e2486",
        //     'client_secret' : "dcfca4a67aa8529dee458e57228c9cbe",
        //     'grant_type'    : "password",
        //     'scope'         : "scope",
        //     'username'      : "10002652K",
        //     'password'      : "1234",
        // }  

        // axios({
        //     method : 'post',
        //     url    : "https://apipp.bancoripley.cl/banco-ripley/pre-produccion/oidc-clu-password/oauth2/token", 
        //     headers: headers,
        //     data   : qs.stringify(data)
        // })
        // .then(function (response) {
        //     console.log("axios if");
        //     if (response.status  == '200')
        //     console.log("axios if 200")
        //         console.log("Response axios 200: ", response.data);
        // })
        // .catch(function (error) {
        //     console.log("axios error");
        //     console.log("Error Code    : ", );
        //     console.log("Error axios Message : ", error.message);
        // })





    } catch(e){
        body = e.message;
    }

    const response = {
        statusCode: 200,
        body: JSON.stringify(body),
    };
    return response;
};

