import jwt from 'jsonwebtoken';

export const authenticate = (req,res,next)=>{

    try{
         if(req.headers.authorization?.split(" ")[0] !== "Bearer"){

        return res.status(401).json({message:"Unauthorized"});
    }

    const token = req.headers.authorization?.split(" ")[1];

    if(!token){
        return res.status(401).json({message:"Unauthorized"});
    }

    const isValid = jwt.verify(token,process.env.JWT_SECRET);

    if(!isValid){
        return res.status(401).json({message:"Unauthorized"});
    }

    req.userId = isValid.id;
    req.orgId = isValid.orgid;
    req.role = isValid.role;

      next();
    }catch(err){

        if(err.name === "JsonWebTokenError"){

            err.message = "Invalid token";
            next(err);
           
        }else if(err.name === "TokenExpiredError"){
            err.message = "Token expired";
            next(err);
        }else{
            next(err);
        }

        return;
    }
   
   
    
} 

//this is the implementation of the role based access contole policy 
export const authorize = (...roles)=>{
   
    return (req,res,next)=>{
       
        if(!req.role){
            return res.status(403).json({message:"Forbidden"}); 
        }

        if(!roles.includes(req.role)){

            const err = new Error();

            err.message = "Forbidden you don't have the required role to access this resource";
            err.statusCode = 403;
            next(err);
            return;
        }

        next();
    }
}