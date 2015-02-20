
var readBooks = require('./read_amzn_reviews');
var fs = require('fs');

var html = fs.readFileSync('test_data/amzn_html_test_data.html', 'utf-8');
var books = readBooks(html);
console.log(JSON.stringify(books, null, 4));
