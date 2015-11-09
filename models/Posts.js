var mongoose =require('mongoose');

var PostSchema = mongoose.Schema({
  title:String,
  link:String,
  author: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User"
},
  postDay:Date,
  upvotes:{type:Number,default:0},
  comments:[{type: mongoose.Schema.Types.ObjectId,ref:'Comment'}]
});

PostSchema.methods.upvote = function(cb) {
  this.upvotes += 1;
  this.save(cb);
};

mongoose.model('Post',PostSchema);
