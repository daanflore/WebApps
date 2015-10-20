var mongoose =require('mongoose');

var Postschema = mongoose.Schema({
  title:String,
  link:String,
  upvotes:{type:Number,default:0},
  comments:[{type: mongoose.Schema.Types.ObjectId,ref:'Comment'}]
});

mongoose.model('Post',Postschema);
