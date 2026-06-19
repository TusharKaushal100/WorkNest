import redis from '../config/redis.js'
import Prisma from '../config/db.js'

export const getDashboard = async (req,res,next)=>{

    try{
       
        const cachedKey = `dashboard:${req.user?.orgId}`;
        
        const cached = await redis.get(cachedKey);

        if(cached){
             
            return res.status(200).json({source:"cache",data:JSON.parse(cached)});
        }

        const [totalExpense,
            pendingCount,
            approvedCount,
            rejectedCount,
            expenseByCategory,
            recentExpense
        ] = await promise.all(
            [
              Prisma.expense.aggregate({
                where:{orgId:req.user?.orgId , status :"APPROVED"},
                _sum:{amount : true}
              })
              ,
              Prisma.expense.count({
                where:{orgId:req.user?.orgId,status:"PENDING"}
              }
              ),

              Prisma.expense.count({
                 where:{orgId:req.user?.orgId,status:"APPROVED"}
              }),

              Prisma.expense.count({
                 where:{orgId:req.user?.orgId,status:"REJECTED"}
              }),

              Prisma.expense.groupBy({
                by:['categoryId'],
                where:{
                    orgId:req.user?.orgId,status:"APPROVED"
                },
                _sum:{amount:true},
                orderBy:{_sum:{amount:'desc'}}
              })
               ,
               Prisma.expense.findMany({
                where:{orgId:req.user?.orgId},
                include:{user:{select:{name:true}},
                        category:{select:{name:true}}},
                orderBy:{createdAt:'desc'},
                take:5
               }),
            

            ]
        );

        const categoryIds = expenseByCategory.map(e => e.categoryId);

        const categories = await Prisma.category.findMany({
            where:{id:{in:categoryIds}},
            select:{id:true,name:true,budget:true}
        });

        const spendingByCategory = expenseByCategory.map(e=>{

            const cat = categories.find(c => c.id === e.categoryId);

            return {
                category:cat?.name,
                budget:cat?.budget,
                spent:e._sum.amount || 0,
                percentageUsed:budget > 0 ? Math.round((e._sum.amount/cat.budget)*100) : null
            }
        });
       
        const data = {
            totalSpent: totalExpense._sum.amount,
            pendingCount,
            approvedCount,
            rejectedCount,
            spendingByCategory,
            recentExpense
        }

        await redis.setex(cachedKey,300,JSON.stringify(data));

        return res.status(200).json({source:"db",data});


    }catch(err){
        next(err);
    }
}

// call this whenever an expense status changes — keeps cache fresh
export const invalidateDashboardCache = async (orgId) => {
    await redis.del(`dashboard:${orgId}`);
}
