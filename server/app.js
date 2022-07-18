var request = require('request');
var express = require('express');
const app = express();
const { Pool } = require('pg');

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const fs = require('fs');
var XLSX = require("xlsx");
var path = require('path');

let googleOAuth = require('./googleOAuth');
let googleDrive = require('./googleDrive')
const compression = require('compression');
const cookieParser = require('cookie-parser');
app.use(cookieParser());
app.use(compression());

const couchdb = require('nano')('http://admin:admin@' + process.env.COUCHDB_URL + '');
const utente = couchdb.db.use('utente');

const http = require ('http')
var server = http.createServer(app);
const io = require('socket.io')(server);

// Serving static files from "public" folder (documentazione api interne, '/apidoc')
app.use(express.static(path.join(__dirname, 'public/')));




/********************************************/
/*				  WEB SOCKET	 		    */
/********************************************/

io.on("connection",async(socketEnt) => {
   
  socketEnt.on("disconnect", (arg) =>{
	console.log("disconnesso")
  })

  socketEnt.on("select-dati", (arg) =>{
	console.log(arg)
	var datiDB = JSON.parse(arg);
	const pool = new Pool({
		user: datiDB.USER,
		host: datiDB.HOST,
		database: datiDB.DB,
		password: datiDB.PASS,
		port: datiDB.PORT,
	});
	
	pool.query('select * from  ' + datiDB.tabella + ' limit 100', function (err, res2) {
		if(err) socketEnt.emit(err)
		socketEnt.emit("select-dati-response",res2)
	});
	pool.end(function (err) {
		console.log(err);
	});
	
  })
  console.log("connesso")
  socketEnt.emit("connesso", "true")
  await socketEnt.on("sendinsert",async(valore) => {
	
	var datiDBP = JSON.parse(valore);
	console.log({
		user: datiDBP.USER,
		host: datiDBP.HOST,
		database: datiDBP.DB,
		password: datiDBP.PASS,
		port: datiDBP.PORT,
	})
	const pool = new Pool({
		user: datiDBP.USER,
		host: datiDBP.HOST,
		database: datiDBP.DB,
		password: datiDBP.PASS,
		port: datiDBP.PORT,
	});
	var campi = '';
	var valori = '';
	var pass = 0;
	var out = '';
	
	for (var key in datiDBP) {
		//var key2 = toString(key)

		if (key != 'HOST' && key != 'DB' && key != 'PORT' && key != 'PASS' && key != 'USER') {
			if (pass < 2) {
				if (pass == 1) {
					campi = campi + key;
					valori = valori + "'" + datiDBP[key] + "'";
				}
				pass++;
			} else {
				campi = campi + ', ' + key;
				valori = valori + ", '" + datiDBP[key] + "'";
			}
		}
	}
	console.log(query)
	var query = 'INSERT INTO ' + datiDBP.tabella + '(' + campi + ')' + 'VALUES' + '(' + valori + ');' + out;
	//res.send(query)
	pool.query(query, async (error) => {
		if (error) {
			socketEnt.emit("send-insert-response",error)
			console.log(error)
			pool.end(function (err) {
				console.log(err);
			});
			return;
		} else {
			socketEnt.emit("send-insert-response","ok")
			pool.end(function (err) {
				console.log(err);
			});
			return;
		}
	});
	
  })
})



/********************************************/
/*		API esterna: Google Drive	 	    */
/********************************************/

app.get('/salva/tabella', function(req,res){

	let listDBUtente = req.cookies.datiUtente.docs[0].listaDB
	let tabella = req.query.tabella // tabella da salvare
	let DB_di_tabella = req.query.db // che appartiene a questo database

	let host_corrente=''
	let user_corrente=''
	let pass_corrente=''
	let port_corrente=''
	listDBUtente.forEach(DBs => {
		if (DBs.DB == DB_di_tabella){
			host_corrente = DBs.HOST
			user_corrente = DBs.USER
			pass_corrente = DBs.PASS
			port_corrente = DBs.PORT
		}
	})

	// creo il file excel relativo alla tabella, chiedendo le info sulla tabella al db
	const pool = new Pool({
		user: user_corrente,
		host: host_corrente,
		database: DB_di_tabella,
		password: pass_corrente,
		port: port_corrente,
	});
	pool.query('select * from  ' + tabella + ' limit 100', function (err, res2) {
		
		const worksheet = XLSX.utils.json_to_sheet(res2.rows);
		const workbook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workbook, worksheet, tabella);
		XLSX.writeFile(workbook, __dirname + "/"+tabella+".xlsx");

		res.redirect('/salva/tabella/google_drive/?tabella='+tabella)
	});
	pool.end(function (err) {
		console.log(err);
	});

})

app.get('/salva/tabella/google_drive/', async function(req,res){
	googleDrive.Google_Drive_RequestCode(req,res);
})

app.get('/drive/file/callback', async function(req,res){
	googleDrive.Google_Drive_GetToken(req,res);
})

app.get('/uso_token/salvataggio/gdrive', googleDrive.Salva_su_Google_Drive, async function(req,res){
	
	// eliminare il file excel creato all'inizio
	let path_file = __dirname + '/'+res.locals.nome_tabella+'.xlsx'
	fs.unlink(path_file, (err) => {
		if (err) {
		  console.error(err)
		  return
		}
	})

	res.redirect('/static/home/') // si bagga spesso la scritta dropdown 'tabelle'
	// URL verso il nuovo file salvato su Google Drive Cloud:
	// res.redirect( res.locals.red_uri )
});







/********************************************/
/*				  API INTERNE	 		    */
/********************************************/

// https://apidocjs.com/#example-full
// https://apidocjs.com/example/


/**
 * @api {post} /update/dati/tabella Bho
 * @apiName Bho
 * @apiGroup Tabelle
 * 
 * @apiBody {String} USER 
 * @apiBody {String} HOST 
 * @apiBody {String} DB DB a cui l'utente può accedere.
 * @apiBody {String} PASS Password per accedere al database.
 * @apiBody {String} PORT Porta a cui è accessibile il database.
 * @apiBody {String} TABELLA
 * @apiBody {String[]} LISTACAMPI
 * @apiBody {String[]} LISTAVALORI
 * @apiBody {String[]} LISTACAMPIINSERT Campi da modificare nella Tabella
 * @apiBody {String[]} LISTAVALORIINSERT Nuovi Valori da modificare nei Campi indicati
 * 
 * @apiParamExample {json} Request-Example:
 *     {
 *       "USER": "postgres",
 *       "HOST": "postgres",
 *       "DB": "presentazione",
 *       "PASS": "adminpass",
 *       "PORT": "5432",
 *       "TABELLA": "studente",
 *       "LISTACAMPI": ["nome"],
 *       "LISTAVALORI": ["lollo"],
 *       "LISTACAMPIINSERT": ["nome"],
 *       "LISTAVALORIINSERT": ["lorenzo"],     
 *     }
 */
 app.post("/update/dati/tabella", async(req,res)=> {
	var dati = JSON.stringify(req.body);
	var datiDB = JSON.parse(dati);
	const pool = new Pool({
		user: datiDB.USER,
		host: datiDB.HOST,
		database: datiDB.DB,
		password: datiDB.PASS,
		port: datiDB.PORT,

	});
    
	var listaCampi= datiDB.LISTACAMPI
	var listaValori= datiDB.LISTAVALORI
	var listaCampiInsert= datiDB.LISTACAMPIINSERT
	var listaValoriInsert= datiDB.LISTAVALORIINSERT
     



	if( listaValoriInsert== undefined || listaValoriInsert == null || listaValoriInsert.length==0 ){
		pool.end(function (err) {
			console.log(err);
		});
		
		res.send("errore")
	    return 
} 


	var t = 0
	var setString = ""
	listaCampiInsert.forEach(element => {
		setString =  setString + element + " = '" + listaValoriInsert[t] + "'    ,"
		t++
	
	})
	t=0
	setString = setString.substring(0,setString.length-4)
	var query = "update " +  datiDB.TABELLA + " set " + setString+ " where "
	
	
	if( listaValori== undefined || listaValori == null || listaValori.length==0 ){
		pool.end(function (err) {
			console.log(err);
		});
		
		res.send("errore")
	    return 
} 
	else
	{listaCampi.forEach(element => {
		query = query + element + " = '" + listaValori[t] + "' and "
		t++
	
	})};

	query = query.substring(0,query.length-4)
	
	
	pool.query(query, (error, results, fields) => {
		if (error) {
			res.send(error);
			pool.end(function (err) {
				console.log(err);
				return;
			});
		} else {
			res.send('ok');
			pool.end(function (err) {
				console.log(err);
				return;
			});
		}
	});

})


/**
 * @api {post} /seleziona/dati/tabella/filtri Seleziona Tabella con Filtro
 * @apiName Restituisce tutte le righe di una Tabella che rispettano una certa condizione
 * @apiGroup Seleziona
 * 
 * @apiBody {String} USER 
 * @apiBody {String} HOST 
 * @apiBody {String} DB DB a cui l'utente può accedere.
 * @apiBody {String} PASS Password per accedere al database.
 * @apiBody {String} PORT Porta a cui è accessibile il database.
 * @apiBody {String} tabella Tabella che appartiene al Database.
 * @apiBody {String} where Condizione da imporre nel filtro delle tuple restituite
 * 
 * @apiParamExample {json} Request-Example:
 *     {
 *       "USER": "postgres",
 *       "HOST": "postgres",
 *       "DB": "presentazione",
 *       "PASS": "adminpass",
 *       "PORT": "5432",
 *       "tabella": "studente",  
 *       "where": "matricola = '90909900'",
 *     }
 */
app.post('/seleziona/dati/tabella/filtri', async (req, res) => {
	var dati = JSON.stringify(req.body);
	var datiDB = JSON.parse(dati);
	const pool = new Pool({
		user: datiDB.USER,
		host: datiDB.HOST,
		database: datiDB.DB,
		password: datiDB.PASS,
		port: datiDB.PORT,

	});
where = datiDB.where
	
    
	pool.query('select * from  ' + datiDB.tabella + ' where'+ where, function (err, res2) {
		if (err) res.send(err)
		res.send(res2);

	});
	pool.end(function (err) {
		console.log(err);
	});
});


/**
 * @api {post} /seleziona/dati/tabella Seleziona Tabella
 * @apiName Restituisce tutte le righe di una Tabella
 * @apiGroup Seleziona
 * 
 * @apiBody {String} USER 
 * @apiBody {String} HOST 
 * @apiBody {String} DB DB a cui l'utente può accedere.
 * @apiBody {String} PASS Password per accedere al database.
 * @apiBody {String} PORT Porta a cui è accessibile il database.
 * @apiBody {String} tabella Tabella che appartiene al Database.
 * 
 * @apiParamExample {json} Request-Example:
 *     {
 *       "USER": "postgres",
 *       "HOST": "postgres",
 *       "DB": "presentazione",
 *       "PASS": "adminpass",
 *       "PORT": "5432",
 *       "tabella": "studente",    
 *     }
 */

// ..........qui potremmo inserire anche un SuccessExample e un ErrrorExample.......

app.post('/seleziona/dati/tabella', async (req, res) => {
	var dati = JSON.stringify(req.body);
	var datiDB = JSON.parse(dati);
	const pool = new Pool({
		user: datiDB.USER,
		host: datiDB.HOST,
		database: datiDB.DB,
		password: datiDB.PASS,
		port: datiDB.PORT
	});
    
	pool.query('select * from  ' + datiDB.tabella, function (err, res2) {
		if (err) 
		{
			res.send(err)
			return
		}
		else{
		res.send(res2);
		}
	});
	pool.end(function (err) {
		console.log(err);
	});
});


/**
 * @api {post} /delete/dati/tabella Elimina righe
 * @apiName Elimina una o più righe di una Tabella
 * @apiGroup Gestisci
 * 
 * @apiBody {String} USER 
 * @apiBody {String} HOST 
 * @apiBody {String} DB DB a cui l'utente può accedere.
 * @apiBody {String} PASS Password per accedere al database.
 * @apiBody {String} PORT Porta a cui è accessibile il database.
 * @apiBody {String} TABELLA
 * @apiBody {String[]} LISTACAMPI
 * @apiBody {String[]} LISTAVALORI
 * 
 * @apiParamExample {json} Request-Example:
 *     {
 *       "USER": "postgres",
 *       "HOST": "postgres",
 *       "DB": "presentazione",
 *       "PASS": "adminpass",
 *       "PORT": "5432",
 *       "TABELLA": "studente",
 *       "LISTACAMPI": ["nome"],
 *       "LISTAVALORI": ["lollo"],     
 *     }
 */
app.post("/delete/dati/tabella", async(req,res)=> {
	var dati = JSON.stringify(req.body);
	var datiDB = JSON.parse(dati);
	const pool = new Pool({
		user: datiDB.USER,
		host: datiDB.HOST,
		database: datiDB.DB,
		password: datiDB.PASS,
		port: datiDB.PORT,

	});

	var listaCampi= datiDB.LISTACAMPI
	var listaValori= datiDB.LISTAVALORI
	var query = "delete from " +  datiDB.TABELLA + " where "
	var t = 0
	if( listaValori== undefined || listaValori == null || listaValori.length==0 ){
		pool.end(function (err) {
			console.log(err);
		});
		
		res.send("errore")
	    return 
}
	else
	{listaCampi.forEach(element => {
		query = query + element + " = '" + listaValori[t] + "' and "
		t++
	
	})};

	query = query.substring(0,query.length-4)
	
	pool.query(query, (error, results, fields) => {
		if (error) {
			res.send(error);
			pool.end(function (err) {
				console.log(err);
				return;
			});
		} else {
			res.send('ok');
			pool.end(function (err) {
				console.log(err);
				return;
			});
		}
	});

})


/**
 * @api {post} /insert/dati/tabella Inserisce riga
 * @apiName Inserisci una singola riga di dati nella tabella indicata
 * @apiGroup Gestisci
 * 
 * @apiBody {String} USER 
 * @apiBody {String} HOST 
 * @apiBody {String} DB DB a cui l'utente può accedere.
 * @apiBody {String} PASS Password per accedere al database.
 * @apiBody {String} PORT Porta a cui è accessibile il database.
 * @apiBody {String} tabella Tabella in cui si vuole inserire i dati. Deve appartenere al Database.
 * @apiBody {String} colonna1 Dati da mettere nella riga da inserire nella tabella.
 * 
 * @apiParamExample {json} Request-Example:
 *     {
 *       "USER": "postgres",
 *       "HOST": "postgres",
 *       "DB": "presentazione",
 *       "PASS": "adminpass",
 *       "PORT": "5432",
 *       "tabella": "studente",
 * 		  "matricola": "1234",
 * 		  "nome": "lollo",
 * 		  "cognome": "ciao",
 * 		  "età": "34",
 *     }
 */
app.post('/insert/dati/tabella', async (req, res) => {
	var dati = JSON.stringify(req.body);
	var datiDB = JSON.parse(dati);
	const pool = new Pool({
		user: datiDB.USER,
		host: datiDB.HOST,
		database: datiDB.DB,
		password: datiDB.PASS,
		port: datiDB.PORT,
	});
	var campi = '';
	var valori = '';
	var pass = 0;
	var out = '';
	for (var key in datiDB) {
		//var key2 = toString(key)

		if (key != 'HOST' && key != 'DB' && key != 'PORT' && key != 'PASS' && key != 'USER') {
			if (pass < 2) {
				if (pass == 1) {
					campi = campi + key;
					valori = valori + "'" + datiDB[key] + "'";
				}
				pass++;
			} else {
				campi = campi + ', ' + key;
				valori = valori + ", '" + datiDB[key] + "'";
			}
		}
	}
	if (campi == '')  res.send("nessun campo inserito")
	var query = 'INSERT INTO ' + datiDB.tabella + '(' + campi + ')' + 'VALUES' + '(' + valori + ');' + out;
	
	pool.query(query, async (error) => {
		// res.status(200).send('ok')
		if (error) {
			res.status(400).send(error + datiDB.DB);
			pool.end(function (err) {
				console.log(err);
			});
			return;
		} else {
			res.status(400).send('ok');
			pool.end(function (err) {
				console.log(err);
			});
			return;
		}
		res.status(200).send('ok')
	});
	res.status(200).send('ok')
});


/**
 * @api {get} /user/:id Get User information
 * @apiName Temp
 * @apiGroup Temp
 *
 * @apiParam {Number} id Users unique ID.
 *
 * @apiSuccess {String} firstname Firstname of the User.
 * @apiSuccess {String} lastname  Lastname of the User.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "firstname": "John",
 *       "lastname": "Doe"
 *     }
 *
 * @apiError UserNotFound The <code>id</code> of the User was not found.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "UserNotFound"
 *     }
 * 
 * 
 * 
 * 
 * @apiSuccess {Object[]} tasks Task's list
 * @apiSuccess {Number} tasks.id Task id
 * @apiSuccess {Boolean} tasks.done Task is done?
 * @apiSuccess {Date} tasks.created_at Register's date
 * @apiSuccess {String} firstname Firstname of the User.
 * 
 * @apiError UserNotFound The <code>id</code> of the User was not found.
 * 
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *    [{
 *      "id": 1,
 *      "title": "Study",
 *      "done": false
 *      "updated_at": "2016-02-10T15:46:51.778Z",
 *      "created_at": "2016-02-10T15:46:51.778Z"
 *    }]
 * @apiErrorExample {json} List error
 *    HTTP/1.1 500 Internal Server Error
 * 
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "firstname": "John",
 *       "lastname": "Doe"
 *     }
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "UserNotFound"
 *     }
 */
app.post("/analisi/filtri/tabella", function(req,res){
	let info = req.body
	if (info) res.status(200).send('ok')
	else res.status(200).send('oh no')
})

// per aggiornare la documentazione: ' apidoc -i server/ -e server/public/ -o server/public/apidoc/ '





/********************************************/
/*				  	LOGIN		 		    */
/********************************************/

//const utentelist =  utente.list()
app.post('/registrazione', async (req, res) => {
	var bodyrequest = JSON.stringify(req.body);
	var datirequest = JSON.parse(bodyrequest);
	let corpo = await couchdb.db.use('utente').list();
	let corpoString = JSON.stringify(corpo);
	let dati = JSON.parse(corpoString);
	var t = corpo.total_rows;
	//var c = corpoString.total_rows
	var l = dati.total_rows;
	t = l + 1;
	if (datirequest.password != datirequest.confermapassword || datirequest.password.length < 5) {
		res.status(404).send(JSON.stringify({ errore: 'password diverse' }));
		return;
	}
	await utente.insert({
		_id: t + '',
		username: datirequest.username,
		password: datirequest.password,
		email: datirequest.email,
	});

	var query = { selector: { username: datirequest.username, password: datirequest.password } };
	utente.find(query, function (error, body, headers) {
		// prova = JSON.stringify(error);
		//let prova2 = JSON.parse(prova)
		if (error) {
			res.send(prova + 'errore');
		} else {
			let response_ajax = {};
			if (body.bookmark == 'nil') {
				// res.cookie('datiUtente', { errore: true });
				// response_ajax = { errore: 'utente non trovato..' };
				// res.status(404).send(JSON.stringify(response_ajax));
			} else {
				res.cookie('datiUtente', body);

				response_ajax = { redirect: '/static/home/' };
				res.status(200).send(JSON.stringify(response_ajax));
				return;
			}
		}
	});
	// res.redirect('/static/home/');
	return;
});


/*** GOOGLE LOGIN ***/

app.get( '/users/auth/google_oauth2',
	googleOAuth.Google_RequestCode, //middleware function, allora ha come parametri "(req,res,next)"
	function already_Authenticated(req, res) {
		res.redirect('/static/home/');
	}
);

app.get('/users/auth/google_oauth2/callback', googleOAuth.Google_GetToken, async function Google_Token_Response(req, res) {
	var data_from_google = req.decoded_body;
	var info_utente = {
		// unique_id: data_from_google.sub,
		email: data_from_google.email,
		name: data_from_google.name,
		// propic: data_from_google.picture,
		expire_time: Date.now() + data_from_google.exp * 1000,
	};

	let corpo = await couchdb.db.use('utente').list();
	let corpoString = JSON.stringify(corpo);
	let dati = JSON.parse(corpoString);
	var t = corpo.total_rows;
	t += 1;
	// res.send(t + ' ' + info_utente.email + ' ' + info_utente.name)
	var query = { selector: { username: info_utente.name, email: info_utente.email } };
	utente.find(query, async function (error, body, headers) {
		// prova = JSON.stringify(error);
		//let prova2 = JSON.parse(prova)
		if (error) {
			res.send(prova + 'errore');
		} else {
			if (body.bookmark == 'nil') {

				await utente.insert({
					_id: t + '',
					username: info_utente.name,
					email: info_utente.email,
					password:''
				});
				res.redirect('/static/home/');

			} else {
				res.cookie('datiUtente', body);
				res.redirect('/static/home/');
				return;
			}
		}
	});

	return;

	// res.cookie('googleLogin', info_utente, { httpOnly: true }); // set cookie
	// res.redirect('/static/home/');
});


/*
da: per esempio dall'index.html tramite una form) href (nè get nè post.. in teoria get, al massimo..)
.. incoming call per /users/auth/google_oauth2 ---reindirizza---> google_requestCode: richiede a google l'auth code dell'utente
google_requestCode:ricevuto ---reindirizza---> /users/auth/google_oauth2/callback ---reindirizza---> Google_GetToken: richiede a google l'access token (per lo "scope" originario)
Google_GetToken:ricevuto ---reindirizza---> /orario2

SCHEMA: https://developers.google.com/identity/protocols/oauth2

--> /users/auth/google_oauth2 --> Google_RequestCode --> google
/users/auth/google_oauth2/callback <-- Google_RequestCode <-- google (autentifica l'utente e manda l'auth code alla web app richiedente)
/users/auth/google_oauth2/callback --> Google_GetToken --> google 
/orario2 <-- Google_GetToken <-- google (concede un access token al richiedente)
ora da app.js posso usaree il token per il mio obiettivo
*/

/*** fine GOOGLE LOGIN ***/





// app.post('/updatecookie', async (req, res) => {
// 	res.cookie('datiUtente', { errore: false });
// 	res.redirect('/static/login/');
// });

app.post('/autenticazione', async (req, res) => {
	var prova3 = JSON.stringify(req.body);
	var dati = JSON.parse(prova3);
	var prova = '';

	var query = { selector: { username: dati.username, password: dati.password } };

	// TODO: distinguere i casi in cui l'utente è trovato ma la password è sbagliata, dai casi in cui l'utente non è trovato.

	utente.find(query, function (error, body, headers) {
		// prova = JSON.stringify(error);
		//let prova2 = JSON.parse(prova)
		if (error) {
			res.send(prova + 'errore');
		} else {
			let response_ajax = {};
			if (body.bookmark == 'nil') {
				// res.cookie('datiUtente', { errore: true });

				response_ajax = { errore: 'utente non trovato..' };
				res.status(404).send(JSON.stringify(response_ajax));
			} else {
				res.cookie('datiUtente', body);

				response_ajax = { redirect: '/static/home/' };
				res.status(200).send(JSON.stringify(response_ajax));
			}
		}
	});
});




/********************************************/
/*				 utils COUCHDB	 		    */
/********************************************/

app.get('/insutente', function (req, res) {
	var options = {
		url: 'http://admin:admin@' + process.env.COUCHDB_URL + '/utente/' + req.query.numero,
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
			'Accept-Charset': 'utf-8',
		},
		body: {
			username: req.query.username,
			password: req.query.password,
		},
		json: true,
	};
	request.put(options, (err, body) => {
		if (err) {
			res.send('no ' + err);
		}
		//console.log(`Status: ${res.statusCode}`);
		//res.write(response.statusCode.toString());
		res.send('ok ' + body.toJSON.toString + req.query.numero + options);
	});
});
app.get('/insperson', function (req, res) {
	var options = {
		url: 'http://admin:admin@' + process.env.COUCHDB_URL + '/persona/' + req.query.numero,
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
			'Accept-Charset': 'utf-8',
		},
		body: {
			name: req.query.nome,
			cognome: req.query.cognome,
			eta: parseInt(req.query.eta),
			sesso: req.query.sesso,
			'codice-fiscale': req.query.codf,
		},
		json: true,
	};

	request.put(options, (err, body) => {
		if (err) {
			res.send('no ' + err);
		}
		//console.log(`Status: ${res.statusCode}`);
		//res.write(response.statusCode.toString());
		res.send('ok ' + body.toJSON.toString + req.query.numero);
	});
});

app.get('/selezionatutto', function (req, res) {
	request.get(
		'http://admin:admin@' + process.env.COUCHDB_URL + '/' + req.query.db + '/_all_docs?include_docs=true',
		function (error, result, body) {
			if (error) {
				console.log('errore');
				res.send(error);
			} else {
				console.log('ok');
				res.send('ok' + result + body);
			}
		}
	);
});

app.get('/conta', function (req, res) {
	request.get(
		'http://admin:admin@' + process.env.COUCHDB_URL + '/' + req.query.db + '/_count',
		function (error, result, body) {
			if (error) {
				console.log('errore');
				res.send(error);
			} else {
				console.log('ok');
				res.send('ok' + result + body);
			}
		}
	);
});

app.get('/creadb', function (req, res) {
	request.put('http://admin:admin@' + process.env.COUCHDB_URL + '/' + req.query.db, function (error, body) {
		if (error) {
			console.log('errore');
			res.send(error);
		} else {
			console.log('ok');
			res.send(body);
		}
	});
});

app.get('/eliminadb', function (req, res) {
	console.log(req.query.db);
	request.delete('http://admin:admin@' + process.env.COUCHDB_URL + '/' + req.query.db, function (error, body) {
		if (error) {
			console.log('errore');
			res.send(error);
		} else {
			console.log('ok');
			res.send(body);
		}
	});
});

app.get('/creadb', function (req, res) {
	request.put('http://admin:admin@' + process.env.COUCHDB_URL + '/' + req.query.db, function (error, body) {
		if (error) {
			console.log('errore');
			res.send(error);
		} else {
			console.log('ok');
			res.send(body);
		}
	});
});

app.get('/eliminadb', function (req, res) {
	console.log(req.query.db);
	request.delete('http://admin:admin@' + process.env.COUCHDB_URL + '/' + req.query.db, function (error, body) {
		if (error) {
			console.log('errore');
			res.send(error);
		} else {
			res.send(body);
		}
	});
});




/********************************************/
/*				   HOME DB		 		    */
/********************************************/

app.post("/deleteriga", async(req,res)=> {
	var prova = JSON.stringify(req.body);
	var prova2 = JSON.parse(prova);
	const pool = new Pool({
		user: prova2.USER,
		host: prova2.HOST,
		database: prova2.DB,
		password: prova2.PASS,
		port: prova2.PORT,

	});

	var listaCampi= prova2.LISTACAMPI
	var listaValori= prova2.LISTAVALORI
	var query = "delete from " +  prova2.TABELLA + " where "
	var t = 0
	if( listaValori== undefined || listaValori == null || listaValori.length==0 ){
		pool.end(function (err) {
			console.log(err);
		});
		
		res.send("errore")
	    return 
	}
	else
	{listaCampi.forEach(element => {
		query = query + element + " = '" + listaValori[t] + "' and "
		t++
	
	})};

	query = query.substring(0,query.length-4)
	
	pool.query(query, (error, results, fields) => {
		if (error) {
			res.send(error);
			pool.end(function (err) {
				console.log(err);
				return;
			});
		} else {
			res.send('ok');
			pool.end(function (err) {
				console.log(err);
				return;
			});
		}
	});

})

app.post('/selezionaDatiTabella', async (req, res) => {
	const pool = new Pool({
		user: 'postgres',
		host: 'postgres',
		database: 'utente',
		password: 'adminpass',
		port: '5432',
	});

	var prova = JSON.stringify(req.body);
	var prova2 = JSON.parse(prova);

	pool.query('select * from  ' + prova2.tabella, function (err, res2) {
		res.send(res2);
	});
	pool.end(function (err) {
		console.log(err);
	});
});

app.post('/connessionedb', async (req, res) => {
	var prova = JSON.stringify(req.body);
	var prova2 = JSON.parse(prova);

	const pool = new Pool({
		user: prova2.USER,
		host: prova2.HOST,
		database: prova2.DB,
		password: prova2.PASS,
		port: prova2.PORT,
	});
	//res.send(t)
	pool.query('SELECT 1 + 1 AS solution', (error, results, fields) => {
		if (error) {
			res.send('errore');
			pool.end(function (err) {
				console.log(err);
				return;
			});
		} else {
			res.send('ok');
			pool.end(function (err) {
				console.log(err);
				return;
			});
		}
	});
});

app.post('/selezionaDatiTabelladinamico', async (req, res) => {
	var prova = JSON.stringify(req.body);
	var prova2 = JSON.parse(prova);
	const pool = new Pool({
		user: prova2.USER,
		host: prova2.HOST,
		database: prova2.DB,
		password: prova2.PASS,
		port: prova2.PORT,
	});

	pool.query('select * from  ' + prova2.tabella + ' limit 100', function (err, res2) {
		res.send(res2);
	});
	pool.end(function (err) {
		console.log(err);
	});
});

app.post('/tabelledb', async (req, res) => {
	var prova = JSON.stringify(req.body);
	var prova2 = JSON.parse(prova);
	const pool = new Pool({
		user: prova2.USER,
		host: prova2.HOST,
		database: prova2.DB,
		password: prova2.PASS,
		port: prova2.PORT,
	});

	pool.query("select table_name from information_schema.tables where table_schema = 'public'", function (err, res2) {
		if (err) {
			res.send(err);
			pool.end(function (err) {
				console.log(err);
			});
			return;
		} else res.send(res2);
	});
	pool.end(function (err) {
		console.log(err);
	});
	return;
});

app.post('/insertriga', async (req, res) => {
	var prova = JSON.stringify(req.body);
	var prova2 = JSON.parse(prova);
	const pool = new Pool({
		user: prova2.USER,
		host: prova2.HOST,
		database: prova2.DB,
		password: prova2.PASS,
		port: prova2.PORT,
	});
	var campi = '';
	var valori = '';
	var pass = 0;
	var out = '';
	for (var key in prova2) {

		if (key != 'HOST' && key != 'DB' && key != 'PORT' && key != 'PASS' && key != 'USER') {
			if (pass < 2) {
				if (pass == 1) {
					campi = campi + key;
					valori = valori + "'" + prova2[key] + "'";
				}
				pass++;
			} else {
				campi = campi + ', ' + key;
				valori = valori + ", '" + prova2[key] + "'";
			}
		}
	}
	var query = 'INSERT INTO ' + prova2.tabella + '(' + campi + ')' + 'VALUES' + '(' + valori + ');' + out;

	pool.query(query, async (error) => {
		if (error) {
			res.send(error + prova2.DB);
			pool.end(function (err) {
				console.log(err);
			});
			return;
		} else {
			res.send('ok');
			pool.end(function (err) {
				console.log(err);
			});
			return;
		}
	});
});

app.post('/updatedbutente', async (req, res) => {
	var prova3 = JSON.stringify(req.body);
	var dati = JSON.parse(prova3);
	var prova = '';

	var query = { selector: { username: dati.username, password: dati.password } };

	await utente.find(query, async (error, body, headers) => {
		prova = JSON.stringify(error);
		//let prova2 = JSON.parse(prova)
		if (error) {
			res.send(prova + 'errore con il find degli elemtni');
			return;
		} else {
			if (body.bookmark == 'nil') res.send('errore elemento non trovato');
			else {
				var listaDB = [];
				if (body.docs[0].listaDB == undefined) {
					listaDB.push(dati.db);
				} else {
					listaDB = body.docs[0].listaDB;
					if (dati.aggiungi) {
						listaDB.push(dati.db);
					}
				}
				request(
					{
						url: 'http://admin:admin@' + process.env.COUCHDB_URL + '/utente/' + body.docs[0]._id + '/',

						method: 'PUT',

						body: {
							_id: body.docs[0]._id,
							_rev: body.docs[0]._rev,
							username: dati.username,
							password: dati.password,
							email: body.docs[0].email,
							listaDB: listaDB,
						},
						content_type: 'application/json',
						json: true,
					},
					async (error, response, body2) => {
						if (error) {
							res.send('errore ' + error + body);

							return;
						} else {
							var query = { selector: { username: dati.username, password: dati.password } };
							await utente.find(query, function (error, body, headers) {
								prova = JSON.stringify(error);
								//let prova2 = JSON.parse(prova)
								if (error) {
									return;
								} else {
									if (body.bookmark == 'nil') {
										res.send('errore generico');
										return;
									} else {
										res.cookie('datiUtente', body);
										res.send('ok');
										return;
										//res.send(body)
									}
								}
							});
						}
					}
				);

				//res.send(body)
			}
		}
	});
});





app.get('/stato_server', function (req, res) {
	res.send('nodo: ' + process.env.NODE_ENV + ' \nistanza: ' + process.env.INSTANCE + ' \nporta: ' + process.env.PORT);
});

app.post('/prima_risorsa_post', function (req, res) {
	res.send('sono la prima risorsa POST su questo server');
});

app.get('/', (req,res) => {
	res.redirect('/static/');
})


server.listen(process.env.PORT || 8080, () => {
    console.log('Application server ')
});

module.exports = server // for testing
