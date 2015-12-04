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
      function deleteComment(post,comment) {
        return $http.delete("/posts/" + post._id + "/comments/" + comment._id, {
          headers: {
            Authorization: "Bearer " + authService.getToken()
          }
        }).success(function() {
        
        });
      }


      function upvote(post) {
        console.log(authService.getToken());
        return $http.put("/posts/" + post._id + "/upvote", null, {
          headers: {
            Authorization: "Bearer " + authService.getToken()
          }
        }).success(function(upvotedPost) {
          angular.copy(upvotedPost, post);
        });
      }



      function addComment(id, comment) {
        console.log("test");
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
      function downvoteComment(post, comment) {
        return $http.put("/posts/" + post._id + "/comments/" + comment._id + "/downvote", null, {
          headers: {
            Authorization: "Bearer " + authService.getToken()
          }
        }).success(function(downvotedComment) {
          angular.copy(downvotedComment, comment);
        });
      }

      function downvote(post) {
        return $http.put("/posts/" + post._id + "/downvote", null, {
          headers: {
            Authorization: "Bearer " + authService.getToken()
          }
        }).success(function(downvotedPost) {
          angular.copy(downvotedPost, post);
        });
      }


      postFactory.getAll = getAll;
      postFactory.get = get;
      postFactory.create = create;
      postFactory.upvote = upvote;
      postFactory.downvote= downvote;
      postFactory.addComment = addComment;
      postFactory.upvoteComment = upvoteComment;
      postFactory.deletePost = deletePost;
      postFactory.downvoteComment = downvoteComment;
      postFactory.deleteComment= deleteComment;
      return postFactory;
    }
  ]);
})();
