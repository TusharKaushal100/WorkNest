import crypto from 'crypto'
import dotenv from 'dotenv'
import { sendEmail } from '../services/services.email';
import Prisma from '../config/db.js'
import bcrypt from 'bcrypt'

dotenv.config();

export const sendInvite = async (req,res,next)=>{
  
    const {name,email} = req.body;

    if(!email || !name){
        return res.status(400).json({message:"All fields are required"});
    }
   
    try{

    const inviteToken = await crypto.randomBytes(20).toString('hex');

    const inviteLink = `${process.env.CLIENT_URL}/accept-invite?token=inviteToken`;

    const user = await Prisma.user.findUnique({where:{email}});

    if(user){
        return res.status(400).json({message:"User already exist"});
    }

    const placeholderPassword = await bcrypt.hash(crypto.randomBytes(10).toString('hex'),10);

    const newUser = await Prisma.user.create({
        data:{
           name:name,
           email:email,
           passwordHash:placeholderPassword,
           orgId:req.orgId,
           isVerified:false,
           role:"MEMBER",
           inviteToken:inviteToken
        }
    });

    sendEmail(email,inviteLink,req.user.orgId);
      
    return res.status(201).json({message:'Invite sent successfully'});

    }catch(err){
       
        err.status = 500;
        next(err); 
    }
   


}

export const acceptInvite = async (req,res,next)=>{
    
    try{

    const {token,password} = req.body;
    
    if(!token || !email){
        return res.status(401).json({message:'Token missing'});
    }
   
    const user = await Prisma.user.findFirst({where :{inviteToken : token}});

    if(!user){
       return res.status(400).json({message :'token not valid'});
    }

    const hashedPassword = await bcrypt.hash(password,10);

    Prisma.user.update({
        where:{id:user.id},
        data:{
            passwordHash:hashedPassword,
            isVerified:true,
            inviteToken:null
        }
    })

    return res.status(200).json({message:'The password has been set successfully'});

    }catch(err){

        next(err);
    }
    
}

export const getMembers = async (req,res,next)=>{
   
    try{
       
        const members = await Prisma.user.findMany({
        where:{
            orgId:req.orgId
        },
        select:{
            id:true,
            name:true,
            orgId:true,
            role:true,
            createdAt:true,
            email:true
        }
    })

    return res.status(200).json({members});
    
   }catch(err){
    next(err);
   }
  

}