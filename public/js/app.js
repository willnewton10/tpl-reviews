var tplReviewsApp = angular.module('tplReviewsApp', [
    'tplReviewsApp.controllers',
    'tplReviewsApp.services'
]);

/* when "err-src" directive is on image tag, and 404 happens when loading image, change src to err-src */
tplReviewsApp.directive('errSrc', function() {
  return {
    link: function(scope, element, attrs) {
      element.bind('error', function() {
        if (attrs.src != attrs.errSrc) {
          attrs.$set('src', attrs.errSrc);
        }
      });
    }
  };
});
