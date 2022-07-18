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

    describe('/GET selezionare una tabella senza dare abbastanza informazioni', () => {
        it('GET ricevere messaggio: valori mancanti nella richiesta ', (done) => {
            let infodb = {
                "USER": "postgres",
                "HOST": "postgres",
                "DB": "prova",
                "PASS": "adminpass",
                // "PORT": "5432",
                // "tabella": "genio"
            }
            chai.request(server)
            .get('/seleziona/dati/tabella')
            .send(infodb)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.should.have.property('msg');
                res.body.msg.should.be.equal('valori mancanti nella richiesta');
                done();
            });
        })
    });

    describe('/POST Inserisci dati nella tabella', () => {
        it('POST di una tupla in una tabella indicata dall\'utente', (done) => {
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
                "età": "55"
            }
            chai.request(server)
            .post('/insert/dati/tabella')
            .send(infodb)
            .end((err, res) => {
                res.should.have.status(200);
                done();
            });
        })
    });

    describe('/GET stato_server', () => {
        it('it should GET the state of the current server', (done) => {
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

});
