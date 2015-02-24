
var express = require('express');
var app = express();
var http = require('http').Server(app);
var bodyParser = require('body-parser');

var amzn = require('./core/amzn');
var tpl = require('./core/tpl');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/', express.static(__dirname + '/public'));

app.get('/', function (req, res) {
    res.redirect("/index.html");
});
app.get('/api/tpl', function (req, res) {
    console.log('request: tpl... %s', req.query);
    if (! req.query.keywords) {
	res.json([]);
	return;
    }
    tpl.search(req.query.keywords, function (err, books) {
	if (err) res.json(err);
	console.log("TPL Books", JSON.stringify(books, null, 4));
	res.json(books);
    });
});
app.get('/api/amzn', function (req, res) {
    console.log('request: amzn... %s', req.query);
     if (! req.query.keywords) {
	res.json([]);
	return;
    }
    amzn.search(req.query.keywords, function (err, books) {
	if (err) res.json(err);
	res.json(books);
    });
});

http.listen(3000, function () {
    console.log('listening on 3000');
});
