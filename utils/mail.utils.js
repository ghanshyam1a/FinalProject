import nodemailer from "nodemailer";

const sendEmail = (subject,msg,userEmail) =>{
    try {
        const transporter = nodemailer.createTransport({
            host:process.env.MAIL_HOST,
            port:process.env.MAIL_PORT,
            auth:{
                user:process.env.MAIL_USERNAME,
                pass:process.env.MAIL_PASSWORD,
            },    
        });

        const mailOption = {
            from:process.env.ADMIN_EMAIL,
            to:userEmail,
            subject,
            html:msg,
           // subject:"Registration Email",
            //text:"Thnak you for registration on our site",
        };

        transporter.sendMail(mailOption,(err,info) =>{
            if(err){
                console.log(err.message);
            }
            console.log(`Email has been sent:${userEmail}: ${info.response}`);
        });
    } catch (err) {
        return res.status(500).json({
            success:false,
            message:"Server Error",
            err:err.message,
        });
    }
};

export {sendEmail};