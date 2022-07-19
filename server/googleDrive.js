var express = require('express');
var request = require('request');
require('dotenv').config();

var app = express();
app.use(express.urlencoded({ extended: false }));
const compression = require('compression');
app.use(compression());

const cookieParser = require('cookie-parser');
app.use(cookieParser());

const fs = require('fs');
let nome_tabella = ""

let client_id = process.env.GOOGLE_CLIENT_ID
let client_secret = process.env.GOOGLE_CLIENT_SECRET

let authorizeURL = "https://accounts.google.com/o/oauth2/v2/auth"
let scope = "https://www.googleapis.com/auth/drive.file"
let red_uri = "http://localhost:8080/drive/file/callback"
let tokenURL = "https://www.googleapis.com/oauth2/v4/token"


/**
 * Request Code to Google (con autenticazione dell'utente)
 */
async function Google_Drive_RequestCode(req,res){
	nome_tabella = req.query.tabella;

    let getCode = authorizeURL.concat(
		'?client_id=' + client_id,
		'&scope=' + scope,
		'&redirect_uri=' + red_uri,
		'&approval_prompt=force&response_type=code'
	);
	res.redirect(getCode)
}


/**
 * Si dimostra a Google che abbiamo il permesso dell'utente,
 * quindi chiediamo il token
 */
async function Google_Drive_GetToken(req,res){
	let getToken = {
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		url: tokenURL,
		form: {
			code: req.query.code,
			client_id: client_id,
			client_secret: client_secret,
			redirect_uri: red_uri,
			grant_type: 'authorization_code',
		},
	};

	request.post(getToken, async function (err, httpRes, body) {
		let token = JSON.parse(body).access_token
		res.redirect('/uso_token/salvataggio/gdrive?token='+token)
	})
}


/**
 * Salviamo il file creato dalla tabella su Google Drive
 */
async function Salva_su_Google_Drive(req,res,next){
	
	let file
	let path = __dirname + '/'+nome_tabella+'.xlsx'
	try {
		console.log('Accessing ' + path)
		file = fs.readFileSync(path, {encoding: 'base64'});
	} catch (err) {
		console.error(err);
	}

	let metadata = {
        'name': nome_tabella+'.xlsx', 
        'mimeType': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    };
    let form = {
        metadata: {
            type: 'application/json; charset=UTF-8',
            value: JSON.stringify(metadata)
        },
        file: {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            value: file
        }
    };
    let boundary = "nVenJ7H4puv";
    let body = contentDisposition(boundary, form);
    url = `https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart`;


	request.post({
		headers: {
			'Authorization': 'Bearer '+req.query.token,
            "Content-Type": "multipart/related; boundary=" + boundary
        },
		url: url,
        body: body
	}, async function(error, response, body){
		console.log('finito di inviare il file')

        let resultID = JSON.parse(body).id
        // salvo in una variabile accessibile solo a questa chiamata request (quindi anche al 'next') l'URL del file salvato in Cloud
        res.locals.red_uri = 'https://drive.google.com/open?id='+resultID;

		res.locals.nome_tabella = nome_tabella
        return next();
	})
}

/**
 * FORMAT the body according to the multipart/related content type [RFC 2387]
 * @param {string} boundary i divisori delle due sezioni (metadati e media)
 * @param {JSON} data metadati e media da inserire
 */
function contentDisposition(boundary, data) {
    let body = "";
    for (let key in data) {
        body += "--" + boundary
             + "\r\nContent-Disposition: form-data; name=" + key
             + "\r\nContent-type: " + data[key].type
             + (key == "file" ? "\r\nContent-Transfer-Encoding: base64" : "")
             + "\r\n\r\n" + data[key].value + "\r\n";
    }
    body += "--" + boundary + "--\r\n";
    return body;
}


module.exports = { Google_Drive_RequestCode, Google_Drive_GetToken, Salva_su_Google_Drive };