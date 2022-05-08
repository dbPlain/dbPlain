var request = require('request');
var express = require('express');
var app = express();

var bodyParser = require("body-parser");
const res = require('express/lib/response');
app.use(bodyParser.urlencoded({ extended: false }));
var request = require('request');
const { query } = require('express');
const couchdb = require('nano')('http://admin:admin@'+ process.env.COUCHDB_URL+'')

const persona = couchdb.db.use("persona")
const utente = couchdb.db.use("utente")
const utentelist =  utente.list()
app.post('/registrazione', async(req,res)=>{
  var bodyrequest =  JSON.stringify(req.body) 
  var datirequest =  JSON.parse(bodyrequest)
  corpo  = await  couchdb.db.use("utente").list()
  corpoString = JSON.stringify(corpo) 
   dati =  JSON.parse(corpoString)
   var t = corpo.total_rows
   var c = corpoString.total_rows
   var l= dati.total_rows
   var t = l+1
   if(datirequest.password != datirequest.confermapassword) res.send("errore pass diverse")
   else{
   await utente.insert({ _id : t+"" , 
                        username : datirequest.username , 
                        password : datirequest.password , 
                        email : datirequest.email})
   
   res.send("registrato id: "+t)
   }

  })
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
 

app.post('/autenticazione', async(req,res)=>{
  
  
  var prova3 =  JSON.stringify(req.body) 
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
      
    }
  })
  


});
/* AUTENTICAZIONE */
app.post('/autenticazione2', function(req,res){
  var utility= ""
  var  options = {
    url: 'http://admin:admin@'+ process.env.COUCHDB_URL+"/persona/_find",
    
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Accept-Charset': 'utf-8'
      
    },
    body: {
      
        "selector": {
            "name": "\"Paolo\""
        },
        "fields": ["sesso"],
        "limit": 2,
        "skip": 0
    
         },
    timeout: 5000,
    json : true 
  
  }
   request.post(options, (err, body) => 
  {
    var prova =  JSON.stringify(req.body) 
    var dati =  JSON.parse(prova)
    
     if(err)
     {
       console.log("errore")
       res.send( "non ok " +error)
     }
     else{
      
      var dati2 = JSON.parse(body)
     
     
      res.send( "ok" +body )
      
     }
  } 
)   });


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

app.get('/insutente', function(req,res){
  var  options = {
    url: 'http://admin:admin@'+ process.env.COUCHDB_URL+'/utente/'+req.query.numero,
    method: 'PUT',
    headers: {
       'Content-Type': 'application/json',
       'Accept-Charset': 'utf-8'
       
     },
    body: {
           "username": req.query.username,
           "password": req.query.password
           
          },
    json: true
  }
  request.put(options, (err, body) => {
    
    if (err) {
      res.send("no " +err)
    }
    //console.log(`Status: ${res.statusCode}`);
    //res.write(response.statusCode.toString());
    res.send("ok "+body.toJSON.toString+ req.query.numero + options)
  });
})
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
  res.send('nodo: '+ process.env.NODE_ENV + ' \nistanza: ' + process.env.INSTANCE + ' \nporta: ' + process.env.PORT);
});

app.post('/prima_risorsa_post', function (req, res) {
  res.send('sono la prima risorsa POST su questo server');
});



/* LOGIN (form) */

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
  res.send(JSON.stringify(req.body))
  JSON.stringify(req.body.password).length<8 ? valutazione="pessima" : valutazione="ottima";
  if (valutazione=="pessima") {
    res.send("Ciao " + req.body.username + "!<br> Certo che la tua password <code>"+req.body.password+"</code> è davvero " + valutazione + "!");
  } else {
    res.redirect('http://localhost:8080/nginx');
  }
  
});

/* fine LOGIN (form) */


var server = app.listen(process.env.PORT, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});

module.exports = app; // for testing








function inserisciQualcosa(db)
{ 
   
 


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


}


app.get('/prova', function(req, res) {
  
  request.get('http://admin:admin@'+ process.env.COUCHDB_URL+"/"+req.query.db+"/_all_docs?include_docs=true", function(error,result,body)
  {
     
     if(error)
     {
       
       res.send( "non ok" + error)
     }
     else{
          var prova = JSON.stringify(body)
          var dati = JSON.parse(body)
           var t = dati.offset
         res.send(dati.total_rows+"")
          
          
          
         
      
     }
    
     
  });

});


app.get('/prova2',async(req, res) =>{
  
  
 
    var  options = {
      url: 'http://admin:admin@'+"localhost:5984"+"/persona/_find",
      
      method: 'POST',
     
      body: {
        
        "selector": {
          "name": "\"Paolo\""
      },
      "fields": ["sesso"],
      "limit": 2,
      "skip": 0
      
           },
      timeout: 500000,
      json : true
          } 
      
    
     request.get(options,  function (err,res, body)
    {
     
      
       if(err)
       {
         console.log(err)
         res.send(" non fatto")
       }
       else{
        
        var dati2 = JSON.stringify(body)
        var dati = JSON.parse(dati2)
       
        console.log("ok" + res.body.bookmark + body)
        res.send("fatto")
        
        
       }
    } 
  )
    
     });

