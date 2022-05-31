const url = require('url');
const axios = require('axios');
const request = require("request");
const qs    = require('qs');
var AWS = require('aws-sdk');

// Create a Secrets Manager client
const Name = "test/clave-unica";
var sm = new AWS.SecretsManager({region: "us-east-1"});

const headers =  {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Accept'      : 'application/json'
}

exports.handler = async (event, context) => {
    // TODO implemet change xxxxx
    let body;
    let clientID;

    try{
        body = event;
        //clientID = event["clientID"] 
        console.log(body);


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
        //consume AWS Secret



        // //consume CU br

        const { API_Client_Id, API_Client_Secret } = JSON.parse(usuario);    

        const data = {
            'client_id'     : API_Client_Id,
            'client_secret' : API_Client_Secret,
            'grant_type'    : "password",
            'scope'         : "scope",
            'username'      : event["ClientID"],
            'password'      : event["ClientSecret"],
        }  

        body = data;

        axios({
            method : 'post',
            url    : "https://apipp.bancoripley.cl/banco-ripley/pre-produccion/oidc-clu-password/oauth2/token", 
            headers: headers,
            data   : qs.stringify(data)
        })
        .then(function (response) {
            console.log("axios if");
            if (response.status  == '200')
            console.log("axios if 200")
                console.log("Response axios 200: ", response.data);
        })
        .catch(function (error) {
            console.log("axios error");
            console.log("Error Code    : ", );
            console.log("Error axios Message : ", error.message);
        })





    } catch(e){
        body = e.message;
    }

    const response = {
        statusCode: 200,
        body: JSON.stringify(body),
    };
    return response;
};

