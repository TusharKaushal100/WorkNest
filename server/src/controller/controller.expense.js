import { includes } from 'zod';
import Prisma from '../config/db.js'

export const submitExpense = async (req,res,next)=>{
    
   try{
      const {categoryId,amount,description} = req.body;
      
      if(!categoryId || !amount || !description){
        return res.status(400).json({message :"All fields are required."});
      }

      const findCategory = await Prisma.category.findFirst({where:{id:categoryId,orgId: req.user?.orgId}});

      if(!findCategory){
        return res.status(400).json({message:"Category not found"});
      }

      const expense = await Prisma.expense.create({data:{
         categoryId : findCategory.id,
         amount : amount,
         description:description,
         status:"PENDING",
         orgId:req.user?.orgId,
         userId:req.user?.userId

      }})

      return res.status(200).json({message:"expense submitted successfully.",expense});

   }catch(err){
      
      next(err);
   } 
}

export const getExpense = async (req,res,next)=>{
  
    try{
       let whereClause;
     
    if(req.user?.role == "ADMIN"){
        whereClause = {where:{orgId:req.user?.orgId}}
    }else{
        whereClause = {where:{orgId: req.user?.orgId,
                      userId: req.user?.userId}}
    }

    const findExpense = await Prisma.expense.findMany(whereClause,
        {includes:{
            user:{select:{id:true,name:true,email:true,role:true}},
            category:{select:{id:true,name:true,budget:true}}
        }
        ,
         orderBy: { createdAt: 'desc' }
       }
       
    );

    if(!findExpense){
        return res.status(400).json({message:"No data found"});
    }

    return res.status(200).json({findExpense});
    }catch(err){
        next(err);
    }
   
}

export const updateExpenseStatus = async (req,res,next)=>{

    try{
      
         const {id} = req.params;
    const {status} = req.body;

    if(status !== "APPROVED" &&  status !== "REJECTED"){
          return res.status(400).json({message:"The status should be either approved or rejected"});
    }

    const currExpense = await Prisma.expense.findFirst({
            where:{
              id : id,
              orgId:req.user?.orgId   
            }

    });

    if(!currExpense){
        return res.status(400).json({message:"Expense not found"});
    }
    
    if(currExpense.status !== "PENDING"){
          return res.status(400).json({message:"Only pending status can be updated."})
    }

    await Prisma.expense.update(
         {
            where:{
                id:id,
                orgId:req.user?.orgId
            },
            data:{
                status
            }
         }
    );

    await Prisma.auditLog.create({
        data:{
            orgId : req.user?.id,
            auditorId : req.user?.id,
            action : `${status} expense`,
            targetId : id

        }
    })

    return res.status(200).json({message:`The status is successfullu update to ${status}`});
    
}catch(err){
    next(err);
}

   

}




