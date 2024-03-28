const express = require('express'),
bodyParser = require('body-parser'),
path = require('path'),
fs = require('fs'),
cors = require('cors'),
routers = require('./server/routs/router.js');
require('./server/db/mongoose');
const port = 3001;

const app=express();


app.use('/main', express.static(path.join(__dirname, 'client/html/index.html')));
app.use('/add_member', express.static(path.join(__dirname, 'client/html/add_member.html')));
app.use('/add_covid', express.static(path.join(__dirname, 'client/html/add_covid.html')));
app.use('/active_covid', express.static(path.join(__dirname, 'client/html/active_covid.html')));
app.use('/js', express.static(path.join(__dirname, 'client/js')));
app.use('/css', express.static(path.join(__dirname, 'client/css')));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

 app.use('/', routers);

const server = app.listen(port, () => {
console.log('listening on port %s...', server.address().port);
});
