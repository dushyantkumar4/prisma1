const prisma = require("../models/user.js");
//get all comments
exports.getAllComments= async(req,res)=>{
    try{
        const comment = await prisma.comment.findMany({
            include:{
                user:true,
                post:{
                    include:{
                        user:true,
                    },
                },
            },
        });
        return res.json({status:200,data:comment}); 
    }catch(err){
        console.error(err);
        return res.status(500).json({message:"unable to fetch comments"});
    }
}
//post the comment
exports.postComment = async(req,res)=>{
    const {post_id,user_id,comment}=req.body;
    //increase the comment counter
   
    try{
        await prisma.post.update({
            where:{
                id:Number(post_id)
            },
            data:{
                comment_count:{
                    increment:1
                },
            },
        });
        const newComment = await prisma.comment.create({
            data:{
                post_id:Number(post_id),
                user_id:Number(user_id),
                comment
            }
        });
        return res.json({status:200,data:newComment,msg:"post created"});
    }catch(err){
        console.error(err);
        return res.status(500).json({message:"cant't post the comment"});
    }
}
//get comment
exports.getComment = async (req,res)=>{
    const commentId = req.params.id;
    try{
        const comment = await prisma.comment.findFirst({
            where:{
                id:commentId
            }
        });
        return res.json({status:200,data:comment,msg:"comment gotted"});
    }catch(err){
        console.error(err);
        return res.status(500).json({message:"cant' get comment"});
    }
}
//update comment 
exports.updateComment = async(req,res)=>{
    const commentId=req.params.id;
    const {user_id,post_id,comment} = req.body;
    try{
        const updatedComment = await prisma.comment.update({
            where:{
                id:commentId
            },
            data:{
                user_id:Number(user_id),
                post_id:Number(post_id),
                comment
            }
        });
        return res.json({status:200,data:updatedComment,msg:"comment updated"});
    }catch(err){
        console.error(err);
        return res.status(500).json({message:"can't update the comment"});
    }
}
//delete comment
exports.deleteComment = async(req,res)=>{
    const commentId= req.params.id;
    try{
        const existingComment = await prisma.comment.findUnique({
            where:{id:commentId},
            select:{post_id:true}
        });
        if(!existingComment){
            return res.status(404).json({msg:"comment not found"});
        }
        await prisma.comment.delete({
            where:{
                id:commentId
            }
        });
        await prisma.post.update({
            where:{id:existingComment.post_id},
            data:{
                comment_count:{
                    decrement:1,
                },
            },
        })
        return res.status(200).json({msg:"comment deleted"});
    }catch(err){
        console.error(err);
        return res.status(500).json({message:"can't delte the comment"});
    }
}