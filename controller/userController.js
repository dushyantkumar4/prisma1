const prisma = require("../models/user.js");

exports.getUser = async(req,res)=>{
    try{
        const user=await prisma.findMany();
        res.json(user);
    }catch(error){
        res.status(500).json({error:"failed to fetch user data"})
    }
}
exports.createUser=async(req,res)=>{
    const {name,email,password}=req.body;
    try{
        const findUser=await prisma.findUnique({
            where:{email:email}
        });
        if(findUser){
            return res.status(400).json({message:"email alread exists"}) 
        }
        const user = await prisma.create({
            data:{
                name:name,
                email:email,
                password:password
            }
        });
        res.status(201).json(user);
    }catch(err){
        console.errror(err);
        res.status(500).json({error:"failed to create user"})
    }
}