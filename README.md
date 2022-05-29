![Tests workflow](https://github.com/dbPlain/dbPlain/actions/workflows/security.yml/badge.svg)
![Security workflow](https://github.com/dbPlain/dbPlain/actions/workflows/CICD-tests.yml/badge.svg)
[![CodeFactor](https://www.codefactor.io/repository/github/dbplain/dbplain/badge)](https://www.codefactor.io/repository/github/dbplain/dbplain)
![GitHub repo size](https://img.shields.io/github/repo-size/dbPlain/dbPlain)

# dbPlain


## PERCHE' DBPLAIN?

> "Il 90% dei dati esistenti oggi è stato creato soltanto negli ultimi due anni. Ogni giorni produciamo 2,5 miliardi di miliardi di bytes" 

Partendo dalle evidenze statistiche sulla produzione dei dati negli ultimi anni, abbiamo riflettuto sul fatto che ormai, la gestione dei dati, non è più un'attività che possono fare solo pochi esperti, ma un lavoro che deve poter essere svolto in modo più semplice, veloce e da un maggior numero di persone.


## DESCRIZIONE DEL PROGETTO

L'applicazione si pone l'obiettivo di interporsi nella gestione tra utente e database, con lo scopo di facilitare e velocizzare i meccanismi di gestione di questi ultimi. 
In particolare l'applicazione consente di gestire più database in contemporanea, permettendo la visualizzazzione delle tabelle che ne fanno parte e il successivo inserimento/eliminazione dei dati a seconda della necessità dell'utente.


## TECNOLOGIE UTILIZZATE

- Docker: utilizzato per creare l'ambiente di sviluppo dell'applicazione;
- nginx: web server che gestisce la parte statica dell'applicazione; 
- nodeJs: ambiente di runtime che abbiamo impiegato per creare la parte back-end dell'applicazione in javascript; 
- couchDb: database utilizzato per i dati utili al funzionamento dell'applicazione;
- postgres sql: database relazionali per simulare i DB dell'utente da gestire;
- bootstrap, jquery, ajax: librerie javascript e html/css che abbiamo adoperato lato client.


## POSSIBILI SVILUPPI FUTURI 

Per migliorare l'efficacia del prodotto, verrà implementata la possibilità di creare/eliminare tabelle tramite interfaccia, inoltre sarà possibile modificare le tabelle già esistenti e introdurre analisi di Data quality sui dati.
Ulteriori sviluppi riguarderanno l'analisi dei dati tramite grafici e report, che permetteranno non solo la gestione ma anche lo studio di questi ultimi.
In conclusione, lo sviluppo più ambizioso sarà quello di implementare tutte queste funzionalità non solo per i DB relazionali ma anche per ulteriori fonti di dati(file json,file csv, file xml, database NoSql) e l'opportunità di interconnettere queste fonti in un unico database. 


## SET-UP DEVELOPMENT 

1. ```git clone```
2. ```cd dbPlain```
3. ```npm ci```
4. modificare il file .env.sample e inserirci le chiavi private 

Per avviare il progetto ```docker-compose up --build```
Per fermare l'esecuzione ```docker-compose down```
