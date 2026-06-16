import Prisma from "../config/db.js";

export const createCategory = async (req,res,next)=>{
   
    try{
      const {name,budgetLimit} = req.body;

    if(!name){
        return res.status(400).json({message :"Name is missing"});
    }

    const category = await Prisma.category.findFirst({where:{orgId:req.user?.orgId,name}})

    if(category){
        return res.status(400).json({message:"This category already exists"});
    }

  

    const newCategory = await Prisma.category.create({data: {name,
        budget:Number(budgetLimit) || 0,
        orgId:req.user?.orgId
    }})

    return res.status(200).json({message: "Category succesfully created"});
    
    }catch(err){
        console.log("error occured while creating category");
        next(err);
    }
   


}

export const getCategory = async (req,res,next)=>{
   try{
      const result = await Prisma.category.findMany({where:{orgId : req.user?.orgId},
      select:{id:true,name:true,budget:true,createdAt:true}
    });

    return res.status(200).json({result});
   }
   catch(err){
    next(err);
   }
   

    
}