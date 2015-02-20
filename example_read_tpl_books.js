

var readBooks = require('./read_tpl_books');
var fs = require('fs');

var html = fs.readFileSync('test_data/tpl_html_test_data.html', 'utf-8');
var books = readBooks(html);
console.log(JSON.stringify(books, null, 4));
