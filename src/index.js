var request = require('request');
var express = require('express');
var app = express();
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));

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
