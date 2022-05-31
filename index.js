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

const endpoint = "https://apipp.bancoripley.cl/banco-ripley/pre-produccion/oidc-clu-password/oauth2/token";

exports.handler = async (event, context) => {
    // TODO implemet change xxxxx
    let body;
    let clientID;

    try{


        body = event;

        //Obtiene secretos desde AWS crednciales para poder consumir como canal API/BUS
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

        const { API_Client_Id, API_Client_Secret } = JSON.parse(usuario);    

        const data = {
            'client_id'     : API_Client_Id,
            'client_secret' : API_Client_Secret,
            'grant_type'    : "password",
            'scope'         : "scope",
            'username'      : event["ClientID"],
            'password'      : event["ClientSecret"],
        }  

        // Realiza llamada a Clave unica
        const promise = new Promise(function(resolve, reject) {
            request.post({url:endpoint, form: data}, async function(err,httpResponse,body){
                if(err)
                {
                    reject(err);
                }
                else
                {
                    let parsedBody = JSON.parse(body);
                    resolve(parsedBody);
                }
            });
        });
    
    // recepcion de la respuesta del servicio de clave unica, esto se debe tratara para retornar los mensajes 
    // de error 401 en 200
    body = await promise;

    } catch(e){
        body = e.message;
    }

    // Respuesta de la funcion
    const response = {
        statusCode: 200,
        body: JSON.stringify(body),
    };
    return response;
};

