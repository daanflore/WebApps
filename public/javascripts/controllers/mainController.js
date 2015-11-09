(function() {
  "use strict";

  var app = angular.module("flapper-news.controllers.main", [
    "ui.router"
  ]);

  app.config([
    "$stateProvider",
    function($stateProvider) {
      $stateProvider.state("home", {
        parent: "root",
        url: "/home",
        views: {
          "container@": {
            templateUrl: "partials/home",
            controller: "MainController"
          }
        },
        resolve: {
          getPostsPromise: [
            "postService",
            function(postService) {
              return postService.getAll();
            }
          ]
        }
      });
    }
  ]);

  app.controller("MainController", [
    "$scope",
    "postService",
    "authService",
    function($scope, postService, authService) {

      $scope.posts = postService.posts;

      function addPost() {
        if (!$scope.title || $scope.title === "") {return;}

        postService.create({
          title: $scope.title,
          link: $scope.link
        });

        $scope.title = "";
        $scope.link = "";

      };

      function incrementUpvotes(post) {
        postService.upvote(post);
      };
      $scope.addPost = addPost;
      $scope.incrementUpvotes = incrementUpvotes;
    }
  ]);
})();
