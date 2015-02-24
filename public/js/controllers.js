angular.module('tplReviewsApp.controllers', [])
    .controller('tplReviewsController', function ($scope, tplApiService, amznApiService) {

	$scope.searchData = { keywords: "" };
	$scope.books = [];
	$scope.status = '';
	var numReviewsToShow = 3;
	
	$scope.search = function () {
	    $scope.status = "searching...";
	    tplApiService.getBooks($scope.searchData)
		.success(function (response) {

		    $scope.status = response.length > 0 ? "" : "no results found";
		    $scope.books = response;
		    $scope.books.forEach(function (book) {
			amznApiService.getReviews({ keywords: book.title }).success(function(response) {
			    book.reviews = response.slice(0, numReviewsToShow);
			});
		    });

	    });
	    return 0;
	};
    });
