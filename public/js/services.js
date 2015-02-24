angular.module('tplReviewsApp.services', [])
    .factory('tplApiService', function ($http) {
	var tplApi = {};
	
	tplApi.getBooks = function (keywords) {
	    return $http({ 
		method: "GET", 
		url: '/api/tpl', 
		params: keywords 
	    });
	};

	return tplApi;
    })
    .factory('amznApiService', function ($http) {
	var amznApi = {};
	
	amznApi.getReviews = function (keywords) {
	    return $http({ 
		method: "GET",
		url: '/api/amzn', 
		params: keywords });
	};

	return amznApi;
    });
