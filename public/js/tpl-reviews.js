(function () {

    $('form').submit(function (e) {
        e.preventDefault();
        var data = $('form').serialize();
        console.log("data", data);
        searchTpl(data);
        return false;
    });

    function searchTpl (querystring) {
        console.log(querystring);
        $.getJSON("/api/tpl", querystring, displayBooks);
    }

    function displayBooks(books) {
        console.log(books);
        $('#results').html('');
        books.forEach(displayBook);
        books.forEach(getReviews);
    }

    function displayBook(book, i) {
        $('#results').append("<div id='"+bookId(i)+"' class='result'>" +
			     "<h4>" + book.title + "</h4>" + 
			     book.author + ", " + book.date + ", " + book.holds + "/" +
			     book.copies + "<img src='"+book.image+"' />" + 
			     "</div>");
    }

    function getReviews (book, i) {
        var data = { keywords: book.title + " " + book.author };
        $.getJSON("/api/amzn", data, function (reviews) {
            console.log("amazon reviews", reviews);
            displayReviews(reviews, i);
        });
    }

    function displayReviews(reviews, i) {
        reviews.slice(0,3).forEach(function (rev) {
            $("#"+bookId(i)).append("<div>" + rev.title + ": " + 
				    "STARS: " + rev.stars + "</div>");
        });
    }

    function bookId(resultNumber) { return "book" + resultNumber; }
})();
