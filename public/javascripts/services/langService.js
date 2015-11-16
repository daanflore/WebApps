(function() {
    "use strict";
    //defining app name and dependencies
    var app = angular.module("flapper-news.services.lang", []);
    //defining the recipe factory
    app.factory("langService", [
      "$http",
      "authService",
      function($http, authService) {
        var translations = {
          translations:"",
                  };

        function get() {
            return $http.get("/user/"+authService.currentUserId()+"/lang")
              .then(function(response) {

                  translations.translations=response.data;
                  console.log(translations.translations)
              });



        }


      //adds methodes to recipeFactory
      translations.get = get;

      return translations;
    }]);
})();
