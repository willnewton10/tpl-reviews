angular.module('tplReviewsApp.services', [])
    .factory('tplApiService', function ($http) {
		var tplApi = {};
		
		tplApi.getBooks = function (searchData) {
			return $http({ 
				method: "GET", 
				url: '/api/tpl', 
				params: searchData 
			});
		};

		return tplApi;
    })
    .factory('amznApiService', function ($http) {
		var amznApi = {};
		
		amznApi.getReviews = function (book) {

			return $http({ 
				method: "GET",
				url: '/api/amzn', 
				params: { 
					keywords: book.title + " " + book.author
				}
			});
		};

		return amznApi;
    });
