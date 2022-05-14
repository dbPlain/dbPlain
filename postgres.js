const { Pool, Client } = require("pg");


const pool = new Pool({
    user: "postgres",
    host: "postgres",
    database: "postgres",
    password: "adminpass",
    port: "5432"
  });


  pool.query("select NOW()",function(err, res){

     console.log("ciao")

  })