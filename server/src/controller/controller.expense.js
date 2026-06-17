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
