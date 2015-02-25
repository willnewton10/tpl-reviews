angular.module('tplReviewsApp.controllers', [])
    .controller('tplReviewsController', tplReviewsController);

function tplReviewsController ($scope, tplApiService, amznApiService) {
    var $s = $scope;

    $s.searchData = { keywords: "" };
    $s.books = [];
    $s.status = '';
    $s.numReviewsToShow = 3;
    $s.search = search;
    $s.getReviews = getReviews;

    function showError (res) {
	$s.status = "OMG, ERROR: " + JSON.stringify(res, null, 4);
    }
    function getReviews (book) {
	if (!book.isGettingReviews == true) {
	    amznApiService
		.getReviews(book)
		.success(saveAt(book, "reviews"))
		.error(showError);
	}
	book.isGettingReviews = true;
    }
    function handleBooks (books) {
	$s.status = books.length > 0 
	    ? "" : "no results found";
	$s.books = books;
	$s.books.slice(0,3).forEach(getReviews);
    }
    function search () {
	$s.status = "searching...";
	tplApiService
	    .getBooks($s.searchData)
	    .success(handleBooks)
	    .error(showError);
    }
}

function saveAt (obj, attr) {
    return function (val) {
	obj[attr] = val;
    };
}
