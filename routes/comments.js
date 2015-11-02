(function() {
  "use strict";

  var express = require("express");
  var router = express.Router();

  var mongoose = require("mongoose");
  var Post = mongoose.model("Post");
  var Comment = mongoose.model("Comment");

  var jwt = require("express-jwt");
  var auth = jwt({
    secret: "SECRET", // TODO again, this should be stored in an ENV variable and kept off the codebase, same as it is in the User model
    userProperty: "payload"
  });

  router.post('/posts/:post/comments',auth, function(req, res, next) {
      var comment = new Comment(req.body);
      comment.post = req.post;
      comment.upvotes = 1;

      comment.save(function(err, comment) {
        if (err) {
          return next(err);
        }

        req.post.comments.push(comment);
        req.post.save(function(err, post) {
          if (err) {
            return next(err);
          }

            res.json(comment);
          });
        })
      });

router.param('comment', function (req, res, next, id) {
  var query = Comment.findById(id);

  query.exec(function (err, comment) {
    if (err) { return next(err); }
    if (!comment) { return next(new Error('can\'t find comment')); }

    req.comment = comment;
    return next();
  });
});

router.put('/posts/:post/comments/:comment/upvote',auth, function (req, res, next) {
  req.comment.upvote(function (err, comment) {
    if (err) { return next(err); }

    res.json(comment);
  });
});

  module.exports = router;
})();
