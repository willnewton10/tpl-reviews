
var express = require('express');
var app = express();
var http = require('http').Server(app);
var bodyParser = require('body-parser');
var fs = require('fs');
var qs = require('querystring');

var amzn = require('./core/amzn');
var tpl = require('./core/tpl');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var router = express.Router();

router.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

router.get('/api/tpl-dummy', function (req, res) {
    console.log('request: tpl-dummy... %s', req.query.keywords);
    fs.readFile(__dirname + '/test/data/tpl.json', 'utf-8', function (err, text) {
	res.json(JSON.parse(text));
    });
});

router.get('/api/tpl', function (req, res) {
    console.log('request: tpl... %s', req.query);
    tpl.search(req.query.keywords, function (err, books) {
	if (err) res.json(err);
	res.json(books);
    });
});

router.get('/api/amzn', function (req, res) {
    console.log('request: amzn... %s', req.query);
    amzn.search(req.query.keywords, function (err, books) {
	if (err) res.json(err);
	res.json(books);
    });
});

app.use('/', router);

http.listen(3000, function () {
    console.log('listening on 3000');
});
