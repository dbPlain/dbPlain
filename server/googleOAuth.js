var express = require('express');
var request = require('request');
require('dotenv').config(); // https://reddit.fun/168127/loading-environment-variables-dotenv-still-returns-undefined

var app = express();
app.use(express.urlencoded({ extended: false }));
const compression = require('compression');
app.use(compression());

var jwksClient = require('jwks-rsa');
var jwt = require('jsonwebtoken');

const crypto = require('crypto');
const cookieParser = require('cookie-parser');
app.use(cookieParser());

var client_id = process.env.GOOGLE_CLIENT_ID;
var client_secret = process.env.GOOGLE_CLIENT_SECRET;

var authorizeURL_Login = 'https://accounts.google.com/o/oauth2/v2/auth';
var tokenURL_Login = 'https://www.googleapis.com/oauth2/v4/token';
var scope_login = 'openid profile email'; //or "https://www.googleapis.com/auth/userinfo.profile";

var red_uri = 'http://localhost:8080/users/auth/google_oauth2/callback'; // http://0598a596738b99.lhrtunnel.link/users/auth/google_oauth2/callback

async function Google_RequestCode(req, res, next) {
	let _nonce = crypto.randomBytes(127).toString('base64url'); // https://stackoverflow.com/questions/53548858/is-there-a-difference-in-security-between-a-random-string-encoded-as-base64-vs-h
	var nonce_hash = await saveCookie(res, _nonce);

	var getCode = authorizeURL_Login.concat(
		'?client_id=' + client_id,
		'&scope=' + scope_login,
		'&redirect_uri=' + red_uri,
		'&nonce=' + nonce_hash,
		'&approval_prompt=force&response_type=code'
	);

	if (req.cookies.googleLogin === undefined || req.cookies.googleLogin.expire_time < Date.now()) {
		res.redirect(getCode);
	}
	// ha già effettuato con successo il OAuth.
	// next() manda alla funzione di callback successiva a chi ha chiamato questa funzione (/users/auth/google_oauth2)
	else next();
}

async function Google_GetToken(req, res, next) {
	var getToken = {
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		url: tokenURL_Login,
		form: {
			code: req.query.code,
			client_id: client_id,
			client_secret: client_secret,
			redirect_uri: red_uri,
			grant_type: 'authorization_code',
		},
	};

	request.post(getToken, async function (err, httpRes, body) {
		if (err) {
			console.error('Login failed: ', err);
			return console.log(err);
		}

		console.log('Successful Login!\nServer responded with:', body);
		var info = JSON.parse(body);

		// ignoro info.token_access perché sto facendo il login. altrimenti, per usare api, mi sarebbe servito solo l'access token.
		var full_decoded = jwt.decode(info.id_token, { complete: true });
		var decoded = full_decoded.payload;
		req.decoded_body = decoded;

		/*** inizio controlli validità della risposta ***/
		// (integrità->nonce, autenticità->signature)

		var hash_nonce_client = crypto.createHash('sha256').update(req.cookies.nonce).digest('base64url');
		if (decoded.aud !== client_id || decoded.iss !== 'https://accounts.google.com') {
			console.error(
				'Id token is not valid. Maybe:\nAUD (audience) is not correct: ' +
					decoded.aud +
					'\nISS (Issuer Identifier) is not correct: ' +
					decoded.iss
			);
			return next(err);
		}
		if (decoded.nonce !== hash_nonce_client) {
			console.error(
				'***ERRORE***\nI nonce posseduti e ricevuti non combaciano...\nDa Server: ' +
					decoded.nonce +
					' \nPosseduto: ' +
					hash_nonce_client +
					'\n********'
			);
			return next(err);
		}
		if (decoded.exp > Date.now()) {
			console.error('ERROR!!!\nId token already expired!');
			return next(err);
		}

		/* validating id token signature */

		// contiene algoritmo, keyID
		const header = full_decoded.header;

		// Cerco la Public key usata da Google per la signature del file JTW ricevuto
		var my_key, google_keys;
		try {
			google_keys = await get_array_of_google_keys();
			my_key = await find_my_keyID(google_keys, header.kid);
		} catch (error) {
			console.error('ERRORE nella ricerca della chiave pubblica di Google: \n' + error);
			next(err);
		}

		// Trasformo la chiave trovata in una PEM key ('jwks-rsa' library. forse evitabile..)
		const client = jwksClient({
			jwksUri: google_keys,
		});
		const kid = my_key.kid;
		const key = await client.getSigningKey(kid);
		const signingKey = key.getPublicKey();

		// verify token signature: ('jsonwebtoken' library. in alternativa: crypto.createSign e crypto.sign module built-in in Node)
		// - take the header and the payload, and hash everything with SHA-256
		// - decrypt the signature using the public key, and obtain the signature hash
		// - compares the signature hash (received) with the hash that he calculated himself (based on the Header and the Payload)
		// (Anyone could have calculated that hash, but only the Authentication server could have encrypted it with the matching RSA private key)
		jwt.verify(info.id_token, signingKey, { algorithms: ['RS256'] }, (err, payload) => {
			if (err) {
				console.error(err);
				return next(err);
			} //può essere sia un errore di programmazione, sia un rifiuto della signature...

			res.clearCookie('nonce');
			return next();
			// res.send("guarda un pò le richieste http") // per misurare le performance del server... 550ms
		});

		// https://developers.google.com/identity/protocols/oauth2/openid-connect#validatinganidtoken
		// https://blog.angular-university.io/angular-jwt/

		/* spostato in app.js ... */
		//res.send("prima: "+ info.id_token + "<br><br><br>Dopo: "+ JSON.stringify(decoded))
		// var info_utente = {
		//     'unique_id' : decoded.sub,
		//     'email' : decoded.email,
		//     'name' : decoded.name,
		//     'propic' : decoded.picture,
		//     'expire_time' : Date.now() + decoded.exp * 1000
		// }
		// res.cookie("googleLogin", info_utente);
		// res.redirect('/orario2')
	});
}

function saveCookie(res, nonce) {
	return new Promise((resolve, reject) => {
		// al Client: nonce generato
		// al Server Google: hash del nonce
		// Alla risposta di Google, confronta il suo nonce all'hash del nonce posseduto dal client (quest ultimo calcolato al momento della risposta del server)
		res.cookie('nonce', nonce, { expires: new Date(Date.now() + 1000000), httpOnly: true }); // samesite:true , secure:true
		var nonce_hash = crypto.createHash('sha256').update(nonce).digest('base64url');
		resolve(nonce_hash);
	});
}

function get_array_of_google_keys() {
	return new Promise((resolve, reject) => {
		request(
			{
				headers: { 'cache-control': 'public, max-age = 604800' }, // cache for 1 week
				url: 'https://accounts.google.com/.well-known/openid-configuration',
				json: true,
			},
			function (err, httpRes, body) {
				resolve(body.jwks_uri);
			}
		);
	});
}

function find_my_keyID(link_to_certs, my_header_kid) {
	return new Promise((resolve, reject) => {
		request(
			{ headers: { 'cache-control': 'public, max-age = 604800' }, url: link_to_certs, json: true },
			function (err, httpRes, body) {
				for (let i = 0; i < Object.keys(body.keys).length; i++) {
					if (body.keys[i].kid == my_header_kid) resolve(body.keys[i]);
				}
			}
		);
	});
}

module.exports = { Google_RequestCode, Google_GetToken };
