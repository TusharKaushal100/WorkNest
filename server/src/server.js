import app from './app.js';
import prisma from './config/db.js';//if this was a named export instead of the default one then we needed to use the {prisma} for the import also the name should have been the same

const PORT = process.env.PORT || 5000;

const startServer = async () =>{
   
    try{
     await prisma.$connect();// well it automatically gets called when we use something like prisma.users.find() but we can also call it explicitly to make sure that the connection is established before we start the server
     console.log("Database connected successfully");
     app.listen(PORT,()=>{
     console.log(`Server is running on port ${PORT}`);
    }
);
   }catch(error){
     console.log("Error connecting to the database",error);
   }
}

startServer();

