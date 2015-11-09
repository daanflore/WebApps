(function() {
  "use strict";

  var app = angular.module("flapper-news.controllers.post", [
    "ui.router"
  ]);

  app.config([
    "$stateProvider",
    function($stateProvider) {
      $stateProvider.state("post", {
        parent: "root",
        url: "/posts/{id}",
        views: {
          "container@": {
            templateUrl: "partials/post",
            controller: "PostController"
          }
        },
        resolve: {
          post: [
            "$stateParams",
            "postService",
            function($stateParams, postService) {
              return postService.get($stateParams.id);
            }
          ]
        }
      });
    }
  ]);

  app.controller("PostController", [
    "$scope",
    "postService",
    "post",
    "authService",
    function($scope, postService, post, authService) {
      $scope.isLoggedIn = authService.isLoggedIn;

      $scope.post = post;


      function addComment() {
        if ($scope.body === '') {
          return;
        }

        postService.addComment(post._id, {
          body: $scope.body,
          author:"user"
        }).success(function(comment) {
          $scope.post.comments.push(comment);
        });

        $scope.body = "";
      }

      function incrementUpvotes(comment) {
        postService.upvoteComment(post, comment);
      }


      $scope.addComment = addComment;
      $scope.incrementUpvotes = incrementUpvotes;

    }
  ]);
})();
