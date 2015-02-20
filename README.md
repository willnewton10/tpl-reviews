# tpl-reviews

Search the TPL for books and get the book reviews from Amazon.

####Why?

I live in Toronto and use the library... like a lot. I find myself spending too much time browsing the Toronto Public Library's (TPL) online catalogue for books and then cross referencing with Amazon to see if the book has good reviews. I really only want to read the good books.

####Goals

I would like to use something like express to make this into a web app where the user can perform a search and get back a page with the TPL search results on the left side and the corresponding Amazon reviews on the right side.

####So far I have...

 1. `tpl` that searches the TPL and returns some book JSON, with information like title, author, holds, copies
 2. `amzn' that does the same thing for Amazon, but returns review scores and the number of reviews
 3. some tests for each of the above's `parse` function

###Example Usage
 
From the node REPL, you can try it like this:

#####TPL:
```javascript
var tpl = require('./core/tpl');
tpl.search('my search keywords', function (err, books) {
  console.log(JSON.stringify(books, null, 4));          
});
```
  
#####AMZN:
```javascript
var amzn = require('./core/amzn');
amzn.search('my search keywords', function (err, books) {
  console.log(JSON.stringify(books, null, 4));            
});
```
