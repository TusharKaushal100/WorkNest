import z from 'zod';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Prisma from '../config/db.js';

const generateToken = (user)=>{

    const token = jwt.sign({id:user.id,
        orgid:user.orgId,
        role:user.role},
        process.env.JWT_SECRET,
        {expiresIn:'1d'}
    );

    return token;
}

export const register = async (req,res,next) =>{

   try{
        const {orgname,name,email,password} = req.body;

    if(!orgname || !name || !email || !password){
       return res.status(400).json({message:"All fields are required"});
    }

    const requiredFormat = z.object({
        orgname:z.string().min(1).max(20),
        name:z.string().min(1).max(20),
        password:z.string().min(6).max(20),
        email:z.string().email()
    })

    const isValid = requiredFormat.safeParse({orgname,name,email,password});;

    if(!isValid.success){
        return res.status(400).json({message:"invalid input",error:isValid.error.errors});
    }

    const hadUser = await Prisma.user.findUnique({
        where:{email}
    })

    if(hadUser){
        return res.status(400).json({message:"User already exists"});
    }

    const hashedPassword = await bcrypt.hash(password,10);

  

    const result = await Prisma.$transaction(async (tx)=>{
        
        const org = await tx.organisation.create({
            data:{
                name:orgname
            }
        })

        const user = await tx.user.create({
            data:{name:name
                ,email:email,
                passwordHash:hashedPassword,
                orgId:org.id,
                role:"ADMIN",
                isVerified:true

            }
        })

        return {org,user};
    })

    const token = generateToken(result.user);

    return res.status(201).json({message:"user created successfully",token});

   }catch(error){
     next(error);
   } 
   
   
    

}

export const login = async(req,res,next) =>{

    try{
      const {email,password} = req.body;

    if(!email || !password){
        return res.status(400).json({message:"All fields are required"});
    }

    const requiredFormat = z.object({
    password:z.string().min(6).max(20),
    email:z.string().email()
});
    
   const isValid = requiredFormat.safeParse({email,password});

   if(!isValid.success){
    return res.status(400).json({message:"invalid input",error:isValid.error.errors});

   }
   
   const user = await Prisma.user.findUnique({where:{email}});

   if(!user){

    const err = new Error();
  
    err.statusCode = 400;
    err.message = "user not found";
    
    next(err);

    return;// if we didnt returned here then all the code after this would have also executed
   }
   
   const check  = await bcrypt.compare(password,user.passwordHash);
   
   if(!check){

    const err = new Error();
    err.statusCode = 400;
    err.message = "invalid credentials";
    next(err);

    return;
   }

   const token = generateToken(user);

   return res.status(200).json({message:"login successful",token});
    
  }catch(error){
    error.message = "Error logging in";
    next(error);

    return;
  }
   
   

}