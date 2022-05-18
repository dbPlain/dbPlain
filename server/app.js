var request = require('request');
var express = require('express');
var app = express();
const { Pool } = require('pg');

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
const couchdb = require('nano')('http://admin:admin@' + process.env.COUCHDB_URL + '');
app.use(bodyParser.json());

var googleOAuth = require('./googleOAuth');
const compression = require('compression');
const cookieParser = require('cookie-parser');
app.use(cookieParser());
app.use(compression());

//const persona = couchdb.db.use("persona")
const utente = couchdb.db.use('utente');
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
	if (datirequest.password == datirequest.confermapassword) res.send('errore pass diverse');
	await utente.insert({
		_id: t + '',
		username: datirequest.username,
		password: datirequest.password,
		email: datirequest.email,
	});

	res.redirect('/static/home/');
});
/* var prova3 =  JSON.stringify(req.body) 
  var dati =  JSON.parse(prova3)
  var prova =""

  var query = { selector: { username: dati.username  , password : dati.password } }

    utente.find(query,function (error, body , headers){
    
    prova = JSON.stringify(error)
    prova2 = JSON.parse(prova)
    if(error) 
    {
      res.send(prova + "errore")
    }
    else 
    {  
      if (body.bookmark == "nil") res.send("<h4>CREDENZIALI ERRATE</h4>") 
      else{
        res.redirect("static/home.html")
      } 
      
    }*/

app.post('/autenticazione', async (req, res) => {
	var prova3 = JSON.stringify(req.body);
	var dati = JSON.parse(prova3);
	var prova = '';

	var query = { selector: { username: dati.username, password: dati.password } };

	utente.find(query, function (error, body, headers) {
		prova = JSON.stringify(error);
		//let prova2 = JSON.parse(prova)
		if (error) {
			res.send(prova + 'errore');
		} else {
			if (body.bookmark == 'nil') res.send('<h4>CREDENZIALI ERRATE</h4>');
			else {
				res.redirect('/static/home/');
			}
		}
	});
});
/* AUTENTICAZIONE */
app.post('/autenticazione2', function (req, res) {
	//var utility= ""
	var options = {
		url: 'http://admin:admin@' + process.env.COUCHDB_URL + '/persona/_find',

		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
			'Accept-Charset': 'utf-8',
		},
		body: {
			selector: {
				name: '"Paolo"',
			},
			fields: ['sesso'],
			limit: 2,
			skip: 0,
		},
		timeout: 5000,
		json: true,
	};
	request.post(options, (err, body) => {
		//var prova =  JSON.stringify(req.body)
		//var dati =  JSON.parse(prova)

		if (err) {
			console.log('errore');
			res.send('non ok ' + err);
		} else {
			//var dati2 = JSON.parse(body)

			res.send('ok' + body);
		}
	});
});

/*app.post('/autenticazione', function(req,res){
  var utility= ""
  request.get('http://admin:admin@'+ process.env.COUCHDB_URL+"/persona"+"/_all_docs?include_docs=true", function(error,result,body)
  {
    var prova =  JSON.stringify(req.body) 
    dati =  JSON.parse(prova)
    
     if(error)
     {
       console.log("errore")
       res.send(error)
     }
     else{
      
      var dati2 = JSON.parse(body)
      var strin = ""
     
      res.send(dati2.rows[1].doc.name+" " + body + " " + dati.username)
      
     }
  });

   
  

//  var t = prova.password 
  //var c = prova.username 
 
})*/
/*
  if (valutazione=="pessima") {
    res.send("Ciao " + req.body.username + "!<br> Certo che la tua password <code>"+req.body.password+"</code> è davvero " + valutazione + "!");
  } else {
    res.redirect('http://localhost:8080/nginx');
  }
  */

/* COUCHDB */

// var  options = {
//   url: 'http://admin:admin@'+ process.env.COUCHDB_URL+'/utente/10',
//   method: 'POST',
//   headers: {
//      'Content-Type': 'application/json',
//      'Accept-Charset': 'utf-8'

//    },
//   body: {
//          "name": "nome",
//          "cognome": "cognome",
//          "eta":21,
//          "sesso": "no",
//          "codice-fiscale" : "AAAABBBB"
//         },
//   json: true
// };

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

/* request({
    url: 'http://admin:admin@'+ process.env.COUCHDB_URL,
    
    method: 'GET',
  
  }, function(error, response, body){
    if(error) {
      console.log(error + "AOOOO: http://admin:admin@"+ process.env.COUCHDB_URL);
      res.send(response.statusCode+"AOOOO: http://admin:admin@"+ process.env.COUCHDB_URL);
    } else {
      res.send(response.statusCode+" "+body)
      console.log(response.statusCode, body);
    }
  }); */

app.get('prova', function (req, res) {
	request(
		{
			url: 'http://admin:admin@' + process.env.COUCHDB_URL + '/utente/4',

			method: 'POST',

			body: {
				nome: 'ciao',
				cognome: 'prova',
			},
			content_type: 'application/json',
		},
		function (error, response, body) {
			if (error) {
				console.log(error + 'AOOOO: http://admin:admin@' + process.env.COUCHDB_URL);
				res.send(response.statusCode + 'AOOOO: http://admin:admin@' + process.env.COUCHDB_URL);
			} else {
				res.send(response.statusCode + ' ' + body);
				console.log(response.statusCode, body);
			}
		}
	);
});

/* fine COUCHDB */

app.get('/', function (req, res) {
	res.send('Sono il root!!!');
});

app.get('/prima_risorsa_get', function (req, res) {
	res.send('sono la prima risorsa GET su questo server');
});

app.get('/stessa_risorsa', function (req, res) {
	res.send('sono la stessa_risorsa acceduta in GET');
});
app.post('/stessa_risorsa', function (req, res) {
	res.send('sono la stessa_risorsa acceduta in POST');
});

app.get('/seconda_risorsa_get', function (req, res) {
	res.send('sono la seconda risorsa GET su questo server');
});

app.get('/stato_server', function (req, res) {
	res.send('nodo: ' + process.env.NODE_ENV + ' \nistanza: ' + process.env.INSTANCE + ' \nporta: ' + process.env.PORT);
});

app.post('/prima_risorsa_post', function (req, res) {
	res.send('sono la prima risorsa POST su questo server');
});

/* LOGIN (form) */

app.post('/orario', function (req, res) {
	// per reindirizzare su risorse statiche che il server conosce:
	//res.redirect('http://localhost:8080/static/index.html');

	// per comunicare con API:
	/*request({
    uri: 'http://localhost:8080/static/index.html',
    method: 'GET'
  }, function(error, response, body){
    if (error){
      console.log(error);
    } else {
      res.send(response.statusCode+" "+body);
      console.log(response.statusCode, body);
    }
  })*/

	// per fare operazioni di logica:
	/*var valutazione = "null";
  JSON.stringify(req.body.myPassword).length<8 ? valutazione="pessima" : valutazione="ottima";
  res.send("Ciao " + req.body.myEmail + "!<br> Certo che la tua password <code>"+req.body.myPassword+"</code> è davvero " + valutazione + "!");*/
	//res.status(301).redirect("https://www.google.com"); //per reindirizzare su un altro URL. ma non è possibile metterlo dopo "res.send"
	//console.log("POST "+req.body.myEmail+" and "+req.body.myPassword);

	// per fare operazioni di logica e reindirizzare con altre informazioni in più:
	res.send(JSON.stringify(req.body));
	let valutazione;
	JSON.stringify(req.body.password).length < 8 ? (valutazione = 'pessima') : (valutazione = 'ottima');
	if (valutazione == 'pessima') {
		res.send(
			'Ciao ' +
				req.body.username +
				'!<br> Certo che la tua password <code>' +
				req.body.password +
				'</code> è davvero ' +
				valutazione +
				'!'
		);
	} else {
		res.redirect('http://localhost:8080/nginx');
	}
});

/* fine LOGIN (form) */

/*** GOOGLE LOGIN ***/

// app.get('/users/auth/google_oauth2', function(req,res){
//   googleOAuth.Google_RequestCode(req,res)
// })

// app.get('/users/auth/google_oauth2/callback', function(req,res){
//   var google_authcode = req.query.code;
//   googleOAuth.Google_GetToken(req,res, google_authcode);
// })

app.get(
	'/users/auth/google_oauth2',
	googleOAuth.Google_RequestCode, //middleware function, allora ha come parametri "(req,res,next)"
	function already_Authenticated(req, res) {
		res.redirect('/static/home/');
	}
);

app.get('/users/auth/google_oauth2/callback', googleOAuth.Google_GetToken, function Google_Token_Response(req, res) {
	var data_from_google = req.decoded_body;
	var info_utente = {
		unique_id: data_from_google.sub,
		email: data_from_google.email,
		name: data_from_google.name,
		propic: data_from_google.picture,
		expire_time: Date.now() + data_from_google.exp * 1000,
	};
	res.cookie('googleLogin', info_utente, { httpOnly: true }); // set cookie
	res.redirect('/static/home/');
});

app.get('/orario2', function (req, res) {
	res.send(
		"Benvenuto/a!<br> <img src='" +
			req.cookies.googleLogin.propic +
			"' atl=''/>" +
			req.cookies.googleLogin.name +
			'<br><br><br>Questo cookie durerà fino a ' +
			req.cookies.googleLogin.expire_time +
			'<br>per sloggarti: <button onclick=\'location.href = "/elimina"\';>log out</button>'
	);
});

app.get('/elimina', function (req, res) {
	res.clearCookie('googleLogin');
	res.redirect('/');
	res.end();
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

var server = app.listen(process.env.PORT, function () {
	var host = server.address().address;
	var port = server.address().port;

	console.log('Example app listening at http://%s:%s', host, port);
});

module.exports = app; // for testing

// function inserisciQualcosa(db)
// {

//   var  options = {
//     url: 'http://admin:admin@'+ process.env.COUCHDB_URL+'/persona/'+req.query.numero,
//     method: 'PUT',
//     headers: {
//        'Content-Type': 'application/json',
//        'Accept-Charset': 'utf-8'

//      },
//     body: {
//            "name": req.query.nome,
//            "cognome": req.query.cognome,
//            "eta":parseInt(req.query.eta),
//            "sesso": req.query.sesso,
//            "codice-fiscale" : req.query.codf
//           },
//     json: true
//   };

//   request.put(options, (err, body) => {

//     if (err) {
//       res.send("no " +err)
//     }
//     //console.log(`Status: ${res.statusCode}`);
//     //res.write(response.statusCode.toString());
//     res.send("ok "+body.toJSON.toString+ req.query.numero)
//   });

// }

app.get('/prova', function (req, res) {
	request.get(
		'http://admin:admin@' + process.env.COUCHDB_URL + '/' + req.query.db + '/_all_docs?include_docs=true',
		function (error, result, body) {
			if (error) {
				res.send('non ok' + error);
			} else {
				//var prova = JSON.stringify(body)
				var dati = JSON.parse(body);
				//var t = dati.offset
				res.send(dati.total_rows + '');
			}
		}
	);
});

app.get('/prova2', async (req, res) => {
	const pool = new Pool({
		user: 'postgres',
		host: 'postgres',
		database: 'utente',
		password: 'adminpass',
		port: '5432',
	});

	pool.query("select table_name from information_schema.tables where table_schema = 'public'", function (err, res2) {
		if (err) res.send(err);
		else res.send(res2);
	});
});

app.post('/colonneTabella', async (req, res) => {
	const pool = new Pool({
		user: 'postgres',
		host: 'postgres',
		database: 'utente',
		password: 'adminpass',
		port: '5432',
	});

	var prova = JSON.stringify(req.body);
	var prova2 = JSON.parse(prova);
	pool.query(
		"select column_name from information_schema.columns where table_name = '" + prova2.tabella + "'",
		function (err, res2) {
			res.send(res2);
		}
	);
});

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
});

app.post('/connessionedb', async (req, res) => {
	/*const pool = new Pool({
        user: "postgres",
        host: "postgres",
        database: "utente",
        password: "adminpass",
        port: "5432"
      })*/
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
		if (error) res.send('errore');
		res.send('ok');
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
	/*const pool = new Pool({
            user: "postgres",
            host: "postgres",
            database: "utente",
            password: "adminpass",
            port: "5432"
          });*/

	pool.query('select * from  ' + prova2.tabella + ' limit 20', function (err, res2) {
		res.send(res2);
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
	/*const pool = new Pool({
              user: "postgres",
              host: "postgres",
              database: "utente",
              password: "adminpass",
              port: "5432"
            });*/

	pool.query("select table_name from information_schema.tables where table_schema = 'public'", function (err, res2) {
		if (err) res.send(err);
		else res.send(res2);
	});
});
