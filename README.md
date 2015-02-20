# tpl-reviews

Search the TPL for books and get the book reviews from Amazon.

####Why?

I live in Toronto and use the Toronto Public Library (the "TPL") _a lot_. I find myself spending too much time browsing their online catalogue for books and then cross referencing with Amazon to see if the book has good reviews. I really only want to read the good books.

####Next

I might make this into a web app where the user can perform a search and get back a page with the TPL search results on the left side and the corresponding Amazon reviews on the right side.

####So far I have...

 1. `tpl` that searches the TPL and returns some book JSON, with information like title, author, holds, copies
 2. `amzn` that does the same thing for Amazon, but returns review scores and the number of reviews
 3. some tests for each of the above's `parse` function (for the html returned from the search request)

###Example Usage
 
From the node command-line REPL, you can try it like this:

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

##Usage:
 1. You probably need `node.js` and `npm`
 2. After cloning, run `npm install` in the directory, since I have the `node_modules` folder in `.gitignore`
 3. The tests are run with `mocha.js` so you need that globally installed (and probably added to your PATH...)