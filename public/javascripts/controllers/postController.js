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
          author:"user",
          postDay: new Date()
        }).success(function(comment) {
          $scope.post.comments.push(comment);
        });

        $scope.body = "";
      }

      function incrementUpvotes(comment) {
        postService.upvoteComment(post, comment);
      }
      function incrementDownvotes(comment){
        postService.downvoteComment(post, comment);
      }
      function deleteComment(comment){
        console.log("hallo");
        $scope.showError=false;
        console.log(comment.author._id);
        console.log(authService.currentUserId())
        if(comment.author._id ===authService.currentUserId()){
        postService.deleteComment(post,comment);
      }
      else{
          console.log("hallo dit is fout");
        $scope.showError=true;
        $scope.error = "You are not the author of this comment";
      }
      }
      $scope.deleteComment=deleteComment;
      $scope.incrementDownvotes= incrementDownvotes;
      $scope.addComment = addComment;
      $scope.incrementUpvotes = incrementUpvotes;

    }
  ]);
})();
