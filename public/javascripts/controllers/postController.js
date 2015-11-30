(function() {
  "use strict";

  var app = angular.module("flapper-news.controllers.post", [
    "ui.router",
    "pascalprecht.translate"
  ]);

  app.config([
    "$stateProvider",
  "$translateProvider",
    function($stateProvider, $translateProvider) {
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
            "langService",
            function($stateParams, postService,langService) {
              langService.get();
              return postService.get($stateParams.id);
            }
          ]
        }
      });
      $translateProvider.useStaticFilesLoader({
        prefix: '../../l10n/',
        suffix: '.json'
      });

      $translateProvider.preferredLanguage('en');
    }
  ]);


  app.controller("PostController", [
    "$scope",
    "$translate",
    "postService",
    "post",
    "authService",
    "langService",
    function($scope,$translate, postService, post, authService, langService) {
      $scope.isLoggedIn = authService.isLoggedIn;
      console.log(post);
      $scope.post = post;
      if (langService.translations) {
        $translate.use(langService.translations);
      } else {
        $translate.use('en');
      }

      function addComment() {
        if ($scope.body === '') {
          return;
        }
        console.log("test");
        postService.addComment(post._id, {
          body: $scope.body,
          author: authService.currentUserId(),
          postDay: new Date(),
        }).success(function(comment) {
          $scope.post.comments.push(comment);
        });

        $scope.body = "";
      }

      function incrementUpvotes(comment) {
        postService.upvoteComment(post, comment);
      }

      function incrementDownvotes(comment) {
        postService.downvoteComment(post, comment);
      }

      function deleteComment(comment) {
        $scope.showError = false;
        if (comment.author._id === authService.currentUserId()) {
          postService.deleteComment(post, comment).then(function(){
              $scope.post.comments.splice(post.comments.indexOf(comment), 1);
          });

        } else {
          console.log("hallo dit is fout");
          $scope.showError = true;
          $scope.error = "You are not the author of this comment";
        }
      }
      $scope.deleteComment = deleteComment;
      $scope.incrementDownvotes = incrementDownvotes;
      $scope.addComment = addComment;
      $scope.incrementUpvotes = incrementUpvotes;

    }
  ]);
})();
