"use client"
import React, {useEffect, useState} from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

export default function resetPage(){

    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [user, setUser] = React.useState({
        password:"",
        c_password:""
    });

    const resetPass = async () => {
        try {
            setLoading(true);
            await axios.post("/api/user/reset", user);
            toast.success("Reset Password Completed");
            await axios.get('/api/user/logout');
            toast.success('Logout Successful');
            router.push("/login");
        } catch (error:any) {
            console.log("Reset Password", error.message);
            toast.error(error.message);            
        }
    }


    return(
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <h1 className="text-center text-black text-2xl">{loading ? "Processing" : "Reset Your Password"}</h1>
            <hr />
            <label htmlFor="password">Password</label>
            <input
                className="p-2 border border-gray-300 rounded-kg mb-4 focus:outline-none focus:border-gray-600"
                id="password"
                type="password"
                value={user.password}
                onChange={(e)=>{
                    setUser({...user, password:e.target.value});
                }}
            ></input>
            <label htmlFor="c_password">Confirm Password</label>
            <input
                className="p-2 border border-gray-300 rounded-kg mb-4 focus:outline-none focus:border-gray-600"
                id="c_password"
                type="password"
                value={user.c_password}
                onChange={(e)=>{
                    setUser({...user, c_password:e.target.value});
                }}
            ></input>
            <button
                className="p-2 border border-gray-300 rounded-lg"
                onClick={resetPass}
            >Reset Password</button>
        </div>
    )
}