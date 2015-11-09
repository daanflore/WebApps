(function() {
  "use strict";

  var app = angular.module("flapper-news.services.post", []);

  app.factory("postService", [
    "$http",
    "authService",
    function($http, authService) {
      var postFactory = {
        posts: []
      };

      function getAll() {
        return $http.get("/posts").then(function(response) {
          angular.copy(response.data, postFactory.posts);
        });
      }

      function get(id) {
        return $http.get("/posts/" + id).then(function(response) {
          return response.data;
        });
      }

      function create(post) {
        return $http.post("/posts", post, {
          headers: {
            Authorization: "Bearer " + authService.getToken()
          }
        }).success(function(savedPost) {
          postFactory.posts.push(savedPost);
        });
      }

      function deletePost(post) {
        return $http.delete("/posts/" + post._id, {
          headers: {
            Authorization: "Bearer " + authService.getToken()
          }
        }).success(function() {
          postFactory.posts.splice(postFactory.posts.indexOf(post), 1);
        });
      }


      function upvote(post) {
        return $http.put("/posts/" + post._id + "/upvote", null, {
          headers: {
            Authorization: "Bearer " + authService.getToken()
          }
        }).success(function(upvotedPost) {
          angular.copy(upvotedPost, post);
        });
      }


      function addComment(id, comment) {
        return $http.post("/posts/" + id + "/comments", comment, {
          headers: {
            Authorization: "Bearer " + authService.getToken()
          }
        });
      }

      function upvoteComment(post, comment) {
        return $http.put("/posts/" + post._id + "/comments/" + comment._id + "/upvote", null, {
          headers: {
            Authorization: "Bearer " + authService.getToken()
          }
        }).success(function(upvotedComment) {
          angular.copy(upvotedComment, comment);
        });
      }


      postFactory.getAll = getAll;
      postFactory.get = get;
      postFactory.create = create;
      postFactory.upvote = upvote;
      postFactory.addComment = addComment;
      postFactory.upvoteComment = upvoteComment;
      postFactory.deletePost = deletePost;


      return postFactory;
    }
  ]);
})();
