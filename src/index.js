var request = require('request');
var express = require('express');
var app = express();
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: false }));




var  options = {
  url: 'http://admin:admin@'+ process.env.COUCHDB_URL+'/utente/10',
  method: 'POST',
  headers: {
     'Content-Type': 'application/json',
     'Accept-Charset': 'utf-8'
     
   },
  body: {
         "name": "nome",
         "cognome": "cognome",
         "eta":21,
         "sesso": "no",
         "codice-fiscale" : "AAAABBBB"
        },
  json: true
};
app.get('/insperson', function(req,res){
  
  
  var  options = {
    
    url: 'http://admin:admin@'+ process.env.COUCHDB_URL+'/persona/'+req.query.numero,
    method: 'PUT',
    headers: {
       'Content-Type': 'application/json',
       'Accept-Charset': 'utf-8'
       
     },
    body: {
           "name": req.query.nome,
           "cognome": req.query.cognome,
           "eta":parseInt(req.query.eta),
           "sesso": req.query.sesso,
           "codice-fiscale" : req.query.codf
          },
    json: true
  };
request.put(options, (err, body) => {


  if (err) {
    res.send("no " +err)
  }
  //console.log(`Status: ${res.statusCode}`);
  //res.write(response.statusCode.toString());
   res.send("ok "+body.toJSON.toString+ req.query.numero)
});

})
app.get('/selezionatutto', function(req,res){
  //res.send('http://admin:admin@'+ process.env.COUCHDB_URL + " ----- " + process.env.INSTANCE)
  request.get('http://admin:admin@'+ process.env.COUCHDB_URL+"/"+req.query.db+"/_all_docs?include_docs=true", function(error,result,body)
  {

     if(error)
     {
       console.log("errore")
       res.send(error)
     }
     else{

      console.log("ok")
      res.send("ok" +result + body)
     }
  });
})

app.get('/conta', function(req,res){
  //res.send('http://admin:admin@'+ process.env.COUCHDB_URL + " ----- " + process.env.INSTANCE)
  request.get('http://admin:admin@'+ process.env.COUCHDB_URL+"/"+req.query.db+"/_count", function(error,result,body)
  {

     if(error)
     {
       console.log("errore")
       res.send(error)
     }
     else{

      console.log("ok")
      res.send("ok" +result + body)
     }
  });
})

app.get('/creadb', function(req,res){
  //res.send('http://admin:admin@'+ process.env.COUCHDB_URL + " ----- " + process.env.INSTANCE)
  request.put('http://admin:admin@'+ process.env.COUCHDB_URL+"/"+req.query.db, function(error,body)
  {

     if(error)
     {
       console.log("errore")
       res.send(error)
     }
     else{

      console.log("ok")
      res.send(body)
     }
  });
})
  app.get('/eliminadb', function(req,res){
    //res.send('http://admin:admin@'+ process.env.COUCHDB_URL + " ----- " + process.env.INSTANCE)
    console.log(req.query.db)
    request.delete('http://admin:admin@'+ process.env.COUCHDB_URL+"/"+req.query.db, function(error,body)
    {
  
       if(error)
       {
         console.log("errore")
         res.send(error)
       }
       else{
  
        console.log("ok")
        res.send(body)
       }
    });


})
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
     request({
    url: 'http://admin:admin@'+ process.env.COUCHDB_URL+"/utente/4",
    
    method: 'POST',
    
    body: {
        nome: "ciao",
        cognome:"prova"
         },
    content_type: 'application/json',

  
  }, function(error, response, body){
    if(error) {
      console.log(error + "AOOOO: http://admin:admin@"+ process.env.COUCHDB_URL);
      res.send(response.statusCode+"AOOOO: http://admin:admin@"+ process.env.COUCHDB_URL);
    } else {
      res.send(response.statusCode+" "+body)
      console.log(response.statusCode, body);
    }
  }); 
});
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
  res.send('nodo: '+ process.env.NODE_ENV + ' \nistanza: ' + process.env.INSTANCE + ' \nporta: ' + process.env.PORT);
});


app.post('/prima_risorsa_post', function (req, res) {
  res.send('sono la prima risorsa POST su questo server');
});



// collegato alla form del login.html //
app.post('/orario', function(req,res){
  
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
  JSON.stringify(req.body.myPassword).length<8 ? valutazione="pessima" : valutazione="ottima";
  if (valutazione=="pessima") {
    res.send("Ciao " + req.body.myEmail + "!<br> Certo che la tua password <code>"+req.body.myPassword+"</code> è davvero " + valutazione + "!");
  } else {
    res.redirect('http://localhost:8080/static/index.html?bho=email');
  }
  
});





var server = app.listen(process.env.PORT, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});

module.exports = app; // for testing