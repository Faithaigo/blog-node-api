const { validationResult } = require("express-validator");

const Post = require("../models/post");
const post = require("../models/post");

exports.getPosts = (req, res, next) => {
  post.find().then(posts=>{
    res.status(200).json({message:'Fetched posts successfully', posts})
  }).catch(err=>{
    if(!err.statusCode){
      err.statusCode = 500
    }
    next(err)
  })
};

// 200 - Success
// 201 - success resource was created
exports.postPosts = (req, res, next) => {
  const errors = validationResult(req);
  console.log(errors)
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed!')
    error.statusCode = 422
    throw error
  }
  const title = req.body.title;
  const content = req.body.content;

  const post = new Post({
    title,
    content,
    imageUrl:'images/travel.jpg',
    creator: {
      name: "Faith",
    },
  });
  post.save().then(result=>{
    console.log(result)
    res.status(201).json({
      message: "Post saved successfully",
      post: result,
    });
  }).catch(err=>{
    if(!err.statusCode){
      err.statusCode = 500
    }
    next(err)
  })
 
};

exports.getPost = (req, res, next) =>{
  const postId = req.params.postId
  Post.findById(postId).then(post=>{
    if(!post){
      const error = new Error('Could not find post')
      error.statusCode = 404
      throw error
    }
    res.status(200).json({message:'Post fetched', post})
  }).catch(err=>{
    if(!err.statusCode){
      err.statusCode = 500
    }
    next(err)
  })
}
