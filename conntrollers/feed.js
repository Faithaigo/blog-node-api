exports.getPosts = (req, res, next)=>{
    res.status(200).json({
        posts:[{title:'First Post', content:'This is the first post'}]
    })
}

// 200 - Success
// 201 - success resource was created 
exports.postPosts = (req, res, next) =>{
    const title = req.body.title
    const content = req.body.content
    res.status(201).json({
        message:'Post saved successfully',
        post:{ id: new Date().toISOString(), title, content}
    })
}