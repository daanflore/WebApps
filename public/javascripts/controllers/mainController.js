(function() {
  "use strict";

  var app = angular.module("flapper-news.controllers.main", [
    "ui.router",
    "pascalprecht.translate"
  ]);

  app.config([
    "$stateProvider",
    "$translateProvider",
    function($stateProvider,$translateProvider) {
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
            "langService",
            function(postService,langService) {
              console.log("hallo");
              langService.get();
              return postService.getAll();
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

  app.controller("MainController", [
    "$scope",
    "postService",
    "langService",
    "$translate",
    function($scope, postService,langService ,$translate) {
      $scope.showError=false;
      $scope.posts = postService.posts;
      if(langService.translations){
    $translate.use(langService.translations);
  }else{
    $translate.use('en');
  }
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
