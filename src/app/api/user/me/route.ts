import { getDataFromToken } from "@/helpers/getDatafromToken";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";
import { connect } from "@/database/dbConfig";

connect();

export async function GET(request:NextRequest){
    try {
        const userId = await getDataFromToken(request);
        const user = await User.findOne({_id : userId}).select("-password");
        return NextResponse.json({
            message: "User Founded",
            data:user
        });
    } catch (error:any) {
        return NextResponse.json({error: error.message}, {status: 400});
    }
}
