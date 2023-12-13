import nodemailer from 'nodemailer';
import User from '@/models/userModel';
import bcryptjs from 'bcryptjs';

export const sendEmail = async ({email, emailType, userId}:any) =>{
    try {
        // create hashed token
        const hashedToken = await bcryptjs.hash(userId.toString(), 10);

        if (emailType === "VERIFY"){
            await User.findByIdAndUpdate(userId, {verifyToken: hashedToken, verifyTokenDate: Date.now() + 3600000}); 
        } else if(emailType === "RESET"){
            await User.findByIdAndUpdate(userId, {forgetPasswordToken: hashedToken, forgetPasswordExpiry: Date.now() + 3600000});
        }

        var transporter = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: process.env.MAILER_USER_ID,
                pass: process.env.MAILER_PASSWORD
            }
        });

        const mailOption = {
            from: 'areebamir1120@gmail.com',
            to: email,
            subject: emailType === "VERIFY" ? "Verify your email" : "Reset your Password",
            html: `<p>Click <a href="${process.env.DOMAIN}/verification?${emailType === "VERIFY" ? "token" : "resetToken"}=${hashedToken}">here</a> to ${emailType === "VERIFY" ? "verify your email" : "reset your password"}</p>`
        }

        const mailresponse = await transporter.sendMail(mailOption);
        console.log(mailresponse)
        return mailresponse;

    } catch (error:any) {
        throw new Error(error.message);
    }
}