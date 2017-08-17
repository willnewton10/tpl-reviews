
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
    console.log('request: tpl... %s', JSON.stringify(req.query, null, 4));
    if (! req.query.keywords) {
		res.json([]);
		return;
    }
    tpl.search(req.query, function (err, books) {
	if (err) res.json(err);
		console.log("TPL Books (1st 3)", JSON.stringify(books.slice(0,3), null, 4));
		res.json(books);
    });
});

app.get('/api/amzn', function (req, res) {
    console.log('request: amzn... %s', JSON.stringify(req.query, null, 4));
     if (! req.query.keywords) {
	res.json([]);
	return;
    }
    amzn.search(req.query.keywords, function (err, books) {
	if (err) res.json(err);
	res.json(books);
    });
});


var port = process.env.OPENSHIFT_NODEJS_PORT || 8080;;
var ipaddress = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';

var terminator = function(sig){
    if (typeof sig === "string") {
        console.log('%s: Received %s - terminating sample app ...',
		    Date(Date.now()), sig);
        process.exit(1);
    }
    console.log('%s: Node server stopped.', Date(Date.now()) );
};


//  Process on exit and signals.
process.on('exit', function() { terminator(); });

// Removed 'SIGPIPE' from the list - bugz 852598.
['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
 'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'
].forEach(function(element, index, array) {
    process.on(element, function() { self.terminator(element); });
});


http.listen(port, ipaddress, function () {
    console.log('listening on ' + port);
});
