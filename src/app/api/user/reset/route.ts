import { connect } from "@/database/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import { getDataFromToken } from "@/helpers/getDatafromToken";
import bcryptjs from "bcryptjs";

connect();

export async function POST(request: NextRequest){
    try {
        const reqBody = await request.json();
        const { password , c_password } = reqBody;

        if(!(password === c_password)){
            return NextResponse.json({
                error:"Password and confirmed password do not match",
                status: 400
            });
        }

        const userId = await getDataFromToken(request);
        console.log(userId)

        const user = await User.findOne({_id: userId});
    
        // Creating hash password
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);
    
        user.password = hashedPassword;
        user.isForget = false;
        user.forgetPasswordToken = undefined;
        user.forgetPasswordExpiry = undefined;
        user.save();


    
        const response =  NextResponse.json({
            message: "Resetting of Password has been success",
            success: true,
            redirect:"/login"
        });       

        response.cookies.delete("forgetToken");
        
        return response;
    } catch (error:any) {
        return NextResponse.json(
            {error: error.message},
            {status: 500}
        )
    }
}