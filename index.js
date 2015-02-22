
var express = require('express');
var app = express();
var http = require('http').Server(app);
var bodyParser = require('body-parser');

var amzn = require('./core/amzn');
var tpl = require('./core/tpl');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/', express.static(__dirname + '/public'));
app.use('/', router());

http.listen(3000, function () {
    console.log('listening on 3000');
});

var routes = {
    '/': function (req, res) {
	res.redirect("/index.html");
    },

    '/api/tpl': function (req, res) {
	console.log('request: tpl... %s', req.query);
	tpl.search(req.query.keywords, function (err, books) {
	    if (err) res.json(err);
	    res.json(books);
	});
    },

    '/api/amzn': function (req, res) {
	console.log('request: amzn... %s', req.query);
	amzn.search(req.query.keywords, function (err, books) {
	    if (err) res.json(err);
	    res.json(books);
	});
    }
};

function router() {
    var router = express.Router();
    for (var route in routes) {
	router.get(route, routes[route]);
    }
    return router;
}
