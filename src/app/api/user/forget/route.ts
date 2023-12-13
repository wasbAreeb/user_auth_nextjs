import { connect } from "@/database/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/helpers/mailer";
import jwt from "jsonwebtoken";

connect()

export async function POST(request: NextRequest){
    try {
        const reqBody = await request.json();
        const { email } = reqBody;
        console.log(email);

        const user = await User.findOne({email});
        if (!user){
            return NextResponse.json(
                {error:"User doesn't exist"}, 
                {status:404}
            );
        }
        // console.log("This is the id of user", user._id);

        const tokenData = {
            email: user.email,
            username: user.email
        }

        // create cookie token
        const forgetToken = await jwt.sign(tokenData, process.env.SECRET_TOKEN!, {expiresIn: "1h"});

        await sendEmail({email, emailType:"RESET", userId: user._id})
        
        const response = NextResponse.json({
            message:"Reset code is send to user's email",
            success:true
        });

        response.cookies.set("forgetToken", forgetToken, {
            httpOnly: true
        });

        return response;

    } catch (error:any) {
        return NextResponse.json(
            {error: error.message},
            {status: 500}
        );
    }
}