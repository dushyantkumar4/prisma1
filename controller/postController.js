const prisma = require("../models/user.js");
//get all posts
exports.getAllPost = async(req,res)=>{
    let page = Number(req.query.page)||1;
    let limit = Number(req.query.limit)||10;
    const skip = (page-1)*limit;
    if(page <= 0){
        page=1;
    }
    if(limit<=0||limit > 100){
        limit = 10;
    }

    try{
        const posts= await prisma.post.findMany({
            skip:skip,
            take:limit,
            include:{
                comments:{
                    include:{
                        user:{
                            select:{
                                name:true,
                            },
                        },
                    },
                },
            },
            orderBy:{
                id:"desc",
            },
            where:{
                NOT:[
                    {
                        title:{
                            endsWith:"lecture"
                        }
                    },
                ]
            },
        });
        //to get the total page 
        const totalPosts = await prisma.post.count();
        const totalPages = Math.ceil(totalPosts/limit);
        return res.status(201).json({data:posts,meta:{
            totalPages,
            currentPage:page,
            limit:limit,
        }});
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
//search post by full text search
exports.searchPost = async(req,res)=>{  
    const query = req.query.q;
    try{
        const posts = await prisma.post.findMany({
            where:{
                description:{
                    search:query,
                },
            },
        });
        return res.json({status:200,data:posts});
    }catch(err){
        console.error(err)
        return res.status(500).json({message:"unable to search post"});
    }
}
