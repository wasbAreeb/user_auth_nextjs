import {connect} from "@/database/dbConfig"
import {NextRequest, NextResponse} from "next/server"
import User from "@/models/userModel";
import jwt from "jsonwebtoken";

connect();

export async function POST(request: NextRequest){
    try {
        const reqBody = await request.json();
        const  { verificationType, token } = reqBody;

        if (verificationType === "token"){
    
            // console.log("This is the token information \n" + token);
    
            const user = await User.findOne({
                verifyToken: token, 
                verifyTokenDate: {$gt: Date.now()} 
            });
    
            // console.log("This is the user information \n" + user.email);
    
            if (!user){
                return NextResponse.json({
                    error: "Invalid token", 
                    status:400
            });
            }
    
            user.isVerified = true;
            user.verifyToken = undefined;
            user.verifyTokenDate = undefined;
            await user.save();
    
            console.log("This is the user information \n" + user);
    
            return NextResponse.json({
                message:"Email verified successfully",
                redirect:"/login",
                success: true
            });
    
        }
        
        if (verificationType === "resetToken"){
            // console.log("This is the token information \n" + token);
    
            const user = await User.findOne({
                forgetPasswordToken: token, 
                forgetPasswordExpiry: {$gt: Date.now()} 
            });
    
            // console.log("This is the user information \n" + user.email);
    
            if (!user){
                return NextResponse.json({
                    error: "Invalid token",
                    redirect: "/verification",
                    status:400
            });
            }
    
            user.forgetPasswordToken = undefined;
            user.forgetPasswordExpiry = undefined;
            user.isForget = true;
            await user.save();
    
            console.log("This is the user information \n" + user);
    
            const tokenData = {
                id: user._id,
                username: user.username,
                email: user.email
            }
    
            // create token
            const Cookietoken = await jwt.sign(tokenData, process.env.SECRET_TOKEN!, {expiresIn: "1h"});    

            const response = NextResponse.json({
                message:"Email verified successfully",
                redirect:"/reset",
                success: true
            });

            response.cookies.set("token", Cookietoken, {
                httpOnly:true,
            });
            return response;
        }
    } catch (error:any) {
        return NextResponse.json(
            {error: error.message}, 
            {status: 500}
        );
    }
}

