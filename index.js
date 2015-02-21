
var express = require('express');
var app = express();
var http = require('http').Server(app);
var bodyParser = require('body-parser');

var amzn = require('./core/amzn');
var tpl = require('./core/tpl');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var router = express.Router();

router.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});
router.get('/api', function (req, res) {
    res.json({message: 'hooray! welcomt to our api!'});
});
router.route('/api/tpl/:keywords')
    .get(function (req, res) {
	var keywords = req.params.keywords.replace('+', ' ');
	console.log(keywords);
	tpl.search(keywords, function (err, books) {
	    if (err) res.json(err);
	    res.json(books);
	});
    });

router.route('/api/amzn/:keywords')
    .get(function (req, res) {
	var keywords = req.params.keywords.replace('+', ' ');
	console.log(keywords);
	amzn.search(keywords, function (err, books) {
	    if (err) res.json(err);
	    res.json(books);
	});
    });

app.use('/', router);

http.listen(3000, function () {
    console.log('listening on 3000');
});
