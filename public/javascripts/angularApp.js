var app = angular.module('flapperNews', ['ui.router']);

app.controller('MainCtrl', [
  '$scope',
  'posts',
  function($scope, posts) {
    $scope.posts = posts.posts;

    $scope.addPost = function() {
      if (!$scope.title || $scope.title === '') {
        return;
      }
      posts.create({
        title: $scope.title,
        link: $scope.link
      });
      $scope.title = "";
      $scope.link = "";
    };

    $scope.incrementUpvotes = function(post) {
  posts.upvote(post);
};
  }
]);

app.factory('posts', ['$http', function($http) {
  var postFactory = {
    posts: [
      //{title: 'post 1', upvotes: 5},
      //{title: 'post 2', upvotes: 2},
      //{title: 'post 3', upvotes: 8},
      //{title: 'post 4', upvotes: 9},
      //{title: 'post 5', upvotes: 10}
    ]
  };

  postFactory.getAll = function() {
    return $http.get('/posts').success(function(data) {
      angular.copy(data, postFactory.posts);
    });
  };

  postFactory.create = function(post) {
    return $http.post('/posts', post).success(function(data) {
      postFactory.posts.push(data);
    });
  };
  postFactory.upvote = function(post) {
    return $http.put('/posts/' + post._id + '/upvote')
      .success(function(data) {
        post.upvotes += 1;
      });
  };
  postFactory.get = function(id) {
    return $http.get('/posts/' + id).then(function(res) {
      return res.data;
    });
  };
  postFactory.addComment = function(id, comment) {
    return $http.post('/posts/' + id + '/comments', comment);
  };
  postFactory.upvoteComment = function(post, comment) {
    return $http.put('/posts/' + post._id + '/comments/' + comment._id + '/upvote')
    .success(function(data) {
      comment.upvotes += 1;
    });
  };

  return postFactory;
}]);

app.config([
  '$stateProvider',
  '$urlRouterProvider',
  function($stateProvider, $urlRouterProvider) {
    $stateProvider.state('home', {
        url: '/home',
        templateUrl: '/home.html',
        controller: 'MainCtrl',
        resolve: {
          postPromise: ['posts', function(posts) {
            return posts.getAll();
          }]
        }
      })
      .state('posts', {
        url: '/posts/{id}',
        templateUrl: '/posts.html',
        controller: 'PostCtrl',
        resolve: {
          post: ['$stateParams', 'posts', function($stateParams, posts) {
            return posts.get($stateParams.id);
          }]
        }
      });


    $urlRouterProvider.otherwise('home');
  }
]);

app.controller('PostCtrl', [
  '$scope',
  'posts',
  'post',
  function($scope, posts, post) {
    $scope.post = post;
    $scope.addComment = function() {
      if ($scope.body === '') {
        return;
      }
      posts.addComment(post._id, {
        body: $scope.body,
        author: 'user',
      }).success(function(comment) {
        $scope.post.comments.push(comment);
      });
      $scope.body = '';
    };
    $scope.incrementUpvotes = function(comment) {
      posts.upvoteComment(post, comment);
    }

  }
]);
