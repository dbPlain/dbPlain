// per testare manualmente e in locale: "npm test" o "npm run test" dalla root del progetto -> automatico con github actions
// (nel caso su windows non funzioni, installare mocha globalmente: "npm install -g mocha")
// documentazione chai: https://www.chaijs.com/
// per fare in modo che legga anche test altrove (ad esempio nella cartella ./src/test) scrivere in package.json: " mocha './**/*.test.js' "
// prof vuole test solo delle API? sicuro UNIT TEST


let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server/app');
let should = chai.should();

chai.use(chaiHttp);

describe('Stato Server', () => {
    // this.timeout(15000)
    describe('/POST /seleziona/dati/tabella', () => {
        it('test: POST di una risorsa qualsiasi', (done) => {

            let infodb = {
                "HOST": "postgres",
                "PORT": "5432",
                "PASS": "adminpass",
                "DB": "prova",
                "USER": "postgres",
                "tabella": "genio"
            }
            chai.request(server)
            .post('/seleziona/dati/tabella')
            .send(infodb)
            .end((err, res) => {
                // console.log(err);

                res.should.have.status(200);
                // res.body.should.be.a('object');

                done();
            });
            // infodb.connect(done)
        }).timeout(20000);

    });


    describe('/POST /insert/dati/tabella', () => {
        it('test: POST di una risorsa qualsiasi', (done) => {

            let infodb = {
                "PORT": "5432",
                "PASS": "as",
                "HOST": "ss",
                "DB": "prova",
                "USER": "dd",
                "tabella": "genio",
                "matricola": "1234",
                "nome": "lollo",
                "cognome": "ww",
                "età": "d"
            }
            chai.request(server)
            .post('/insert/dati/tabella')
            .send(infodb)
            .end((err, res) => {
                // console.log(err);

                res.should.have.status(200);
                // res.body.should.be.a('object');

                done();
            });
            // infodb.connect(done)
        }).timeout(20000);

    });
    describe('/GET stato_server', () => {
        it('it should GET state of the current server', (done) => {
            chai.request(server)
            .get('/stato_server')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object', 'Non è una stringa perchè risponde con res.send(). Questo messaggio viene visualizzato se questo test va in errore');
                // https://www.w3schools.com/js/js_object_properties.asp
                done();
            });
        });
    });

    describe('/POST risorsa', () => {
        it('test: POST di una risorsa qualsiasi', (done) => {
            let utente = {
                user: "user1",
                birth: 2000
            }
            chai.request(server)
            .post('/prima_risorsa_post')
            .send(utente)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                //
                done();
            });
        });
  
    });
  

});
