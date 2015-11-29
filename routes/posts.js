(function() {
  "use strict";

  var express = require("express");
  var router = express.Router();

  var mongoose = require("mongoose");
  var Post = mongoose.model("Post");
  var Comment = mongoose.model("Comment");
  var User = mongoose.model("User");

  var jwt = require("express-jwt");
  var auth = jwt({
    secret: "SECRET", // TODO again, this should be stored in an ENV variable and kept off the codebase, same as it is in the User model
    userProperty: "payload"
  });

  router.get('/posts', function(req, res, next) {
    Post.find(function(err, posts) {
      if (err) {
        return next(err);
      }
      //load id and username
      Post.populate(posts, {
        path: "author",
        select: "username"
      }).then(function(posts) {
        Comment.populate(posts.comments,{
          path:"author",
          select:"username"
        }).then(function(){
          console.log("Comments after populate: "+comments);
          res.json(posts);
        });
        res.json(posts);
      });
    });
  });

  router.post('/posts', auth, function(req, res, next) {
    var post = new Post(req.body);
    post.auther = req.payload.username;
    post.save(function(err, post) {
        if (err) {
          return next(err);
        }

        Post.populate(post, {
          path: "author",
          select: "username"
        }).then(function(post) {
          res.json(post);
        });
      });
    });

  router.param('post', function(req, res, next, id) {
    var query = Post.findById(id);

    query.exec(function(err, post) {
      if (err) {
        return next(err);
      }
      if (!post) {
        return next(new Error('can\'t find post'));
      }

      req.post = post;
      return next();
    });
  });

  router.get('/posts/:post', function(req, res, next) {
    req.post.populate('comments', function(err, post) {
      if (err) {
        return next(err);
      }

      res.json(post);
    });
  });

  router.delete('/posts/:post', auth, function(req, res, next) {
    Comment.remove({
      post: req.post
    }, function(err) {
      if (err) {
        return next(err);
      }
      req.post.remove(function(err) {
        if (err) {
          return next(err);
        }
        res.send("succes");
      });
    });
  });


  router.put('/posts/:post/upvote', auth, function(req, res, next) {
    req.post.upvote(function(err, post) {
      if (err) {return next(err);}

      Post.populate(post,{
        path:"author",
        select:"username"
      }).then(function(post){
        res.json(post);
      });
    });
  });

  router.put("/posts/:post/downvote",auth, function(req, res, next) {
      req.post.downvote(function(err, post) {
        if (err) {return next(err);}
        Post.populate(post, {
          path: "author",
          select: "username"
        }).then(function(post) {
          res.json(post);
        });
      });
    });

  module.exports = router;
})();
