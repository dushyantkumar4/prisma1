const prisma = require("../models/user.js");
//get all posts
exports.getAllPost = async(req,res)=>{
    try{
        const posts= await prisma.post.findMany();
        return res.status(201).json(posts);
    }catch(err){
        console.error(err);
        return res.status(500).json({message:"unable to fetch posts"});
    }
}
//create post
exports.createPost = async(req,res)=>{
    const {user_id,title,description} =req.body;
    try{
        const newPost = await prisma.post.create({
            data:{
                user_id:Number(user_id),
                title,
                description,
            }
        });
        return res.json({status:200,data:newPost,msg:"post created"});
    }catch(err){
        console.error(err);
        return res.status(500).json({message:"internal server error"});
    }
}
// show post 
exports.getPost = async(req,res)=>{
    const postId = req.params.id;
    try{
        const post = await prisma.post.findFirst({
            where:{
                id:Number(postId)
            }
        });
        if(!post){
            return res.json({status:404,msg:"data not found"})
        }
        return res.json({status:200,data:post,msg:"data found successfully"})
    }catch(err){
        console.error(err);
        return res.json({status:500,msg:"can't get the post"});
    }
}
//update post
exports.updatePost = async(req,res)=>{
    const postId = req.params.id;
    const {user_id,title,description} =req.body;
    try{
        const post = await prisma.post.update({
            where:{
                id:Number(postId)
            },
            data:{
                user_id:Number(user_id),
                title,
                description
            }
        });
        return res.json({status:200,data:post});
    }catch(err){
        console.error(err)
        return res.status(500).json({message:"internal server error"});
    }
}
//delete post
exports.deletePost= async (req,res)=>{
    const postId = req.params.id;
    try{
        await prisma.post.delete({
            where:{
                id:Number(postId)
            }
        });
        return res.json({status:200,msg:"post deleted"});
    }catch(err){
        console.error(err)
        return res.status(500).json({message:"unable to delete the post"});
    }
}