const prisma = require("../models/user.js");
//show all users
exports.getUsers = async(req,res)=>{
    let page = Number(req.query.page)||1;
    let limit = Number(req.query.limit)||1;
    const skip = (page-1)*limit;
    if(page<=0)page=1;
    if(limit<=0 || limit >100)limit=1;

    try{
        const user=await prisma.user.findMany({
            skip:skip,
            take:limit,
           select:{
            id:true,
            name:true,
            email:true,
            _count:{
                select:{
                    posts:true,
                    comments:true,
                },
            },
           },
        });
        const totalUser = await prisma.user.count();
        const totalPage = Math.ceil(totalUser/limit);
        return res.json({status:200,data:user,meta:{
            totalPage,
            currentPage:page,
            limit:limit,
        }});
    }catch(error){
        res.status(500).json({error:"failed to fetch user data"})
    }
}
//create user
exports.createUser=async(req,res)=>{
    const {name,email,password}=req.body;
    try{
        const findUser=await prisma.user.findUnique({
            where:{email:email}
        });
        if(findUser){
            return res.status(400).json({message:"email alread exists"}) 
        }
        const user = await prisma.user.create({
            data:{
                name:name,
                email:email,
                password:password
            }
        });
        res.status(201).json(user);
    }catch(err){
        console.error(err);
        res.status(500).json({error:"failed to create user"})
    }
}
//update user
exports.updateUser = async(req,res)=>{
    const userId = req.params.id;
    const {name,email,password} = req.body;
    try{
        const user = await prisma.user.update({
            where:{
                id:Number(userId)
            },
            data:{
                name,
                email,
                password
            }
        })
        return res.json({status:200,message:"user updated"})
    }catch(err){
        console.error(err);
        return res.status(500).json({message:"failed to update user"});
    }
    
} 
//show user
exports.getUser = async(req,res)=>{
    const userId=req.params.id;

    try{
        const user = await prisma.user.findFirst({
            where:{
                id:Number(userId)
            }
        });
        return res.json({status:200,user});

    }catch(err){
        console.error(err);
        return res.status(500).json({message:"unable to get user"});
    }
}
// delete user 
exports.deleteUser = async(req,res)=>{
    const userId = req.params.id;
    try{
        await prisma.user.delete({
            where:{
                id:Number(userId)
            }
        });
        res.json({status:200,message:"user deleted successfully"});
    }catch(err){
        console.error(err);
        return res.status(500).json({message:"can't delete the user"});
    }
}