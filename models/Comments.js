var mongoose =require('mongoose');

var CommentSchema = mongoose.Schema({
  body:String,
  author: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User"
},
  postDay:Date,
  upvotes:{type:Number,default:0},
  post:{type: mongoose.Schema.Types.ObjectId,ref:'Post'}
});

CommentSchema.methods.upvote = function(cb) {
  this.upvotes += 1;
  this.save(cb);
};
CommentSchema.methods.downvote= function(cb){
  this.upvotes -=1;
  this.save(cb);
};

mongoose.model('Comment',CommentSchema);
