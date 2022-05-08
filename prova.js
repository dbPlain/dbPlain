
var request = require('request');
const couchdb = require('nano')('http://admin:admin@localhost:5984')

const persona = couchdb.db.use("persona")
persona.listAsStream().on('error', (e) => console.log(e) )
.pipe(process.stdout)

/*
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
   request.post(options, (err,res, body) => 
  {
   
    
     if(err)
     {
       console.log(err)
       
     }
     else{
      
      var dati2 = JSON.stringify(body)
      var dati = JSON.parse(dati2)
     
      console.log("ok" + res.body.bookmark + body)
      
      
     }
  } 
)*/