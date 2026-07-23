import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config();
 
console.log(process.env.SMTP_HOST);

const transporter = nodemailer.createTransport({
   
    secure:false,
    host: process.env.SMTP_HOST,
    port: 587,
    family: 4,  
    auth:{
        user:process.env.SMTP_USER,
        pass:process.env.SMTP_PASS
    }
})

export const sendEmail = async (to,inviteLink,orgName)=>{
 try{
    await transporter.sendMail({
    from:process.env.SMTP_USER,
    to:to,
    subject: `You are invited to join our ${orgName}`,
    html:`<p>You have been invited to join <b>${orgName}</b></p>
    <p><a href="${inviteLink}">Click here to accept and set up ur password</a></p>`

    });
  console.log('email sent')
 }catch(err){
    console.log(`An error occured ${err}`);

   
 }   
 
}

//sendEmail('kartikkaushal666@gmail.com','https://chatgpt.com/c/6a2e4613-035c-83e8-9fe5-0985bfb2a778','WorkNest');