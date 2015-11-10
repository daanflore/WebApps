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
      $scope.showError=false;
      $scope.posts = postService.posts;

      function addPost() {
        $scope.showError=false;
        if (!$scope.title || $scope.title === "") {return;}

        postService.create({
          title: $scope.title,
          link: $scope.link,
          author: authService.currentUserId(),
          postDay: new Date()
        });

        $scope.title = "";
        $scope.link = "";

      };

      function deletePost(post){
        $scope.showError=false;
        if(post.author._id ===authService.currentUserId()){
        postService.deletePost(post);
      }
      else{
        $scope.showError=true;
        $scope.error = "You are not the author of this post";
      }
      }

      function incrementUpvotes(post) {
        $scope.showError=false;
        postService.upvote(post);
      };
      function incrementDownvotes(post){
        $scope.showError=false;
        postService.downvote(post);
      }
      $scope.addPost = addPost;
      $scope.incrementUpvotes = incrementUpvotes;
      $scope.incrementDownvotes= incrementDownvotes;
      $scope.deletePost = deletePost;
    }
  ]);
})();
