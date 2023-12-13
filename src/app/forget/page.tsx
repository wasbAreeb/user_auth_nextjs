"use client";
import React, {useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

export default function forgetPage(){
    
    const router = useRouter();

    const [user, setUser] = React.useState({
        email:""
    });

    const [buttonDisabled, setButtonDisabled] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [Notfound, SetNotfound] = React.useState(false);

    const forget = async () =>{
        try {
            setLoading(true);
            const response = await axios.post("/api/user/forget", user);
            console.log("Login Success", response.data);
            toast.success("Login Success");
            router.push("/verification");
        } catch (error:any) {
            console.log("Forget failed", error.message);
            toast.error(error.message);
            
            if(error.response.status === 404){
                SetNotfound(true);
            }
        } finally{
            setLoading(false);
        }
    }

    useEffect(()=>{
        if(user.email.length > 0){
            setButtonDisabled(false);
        } else{
            setButtonDisabled(true);
        }
    }, [user]);

    return(
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <h1 className="text-center text-black text-2xl">{loading ? "Processing" : "Forget"}</h1>
            <hr />
            <label htmlFor="email">Email</label>
            <p>{Notfound ? "User doesn't exist" : ""}</p>
            <input
                className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600"
                id="email"
                type="email"
                value={user.email}
                onChange={(e)=>{
                     setUser({...user, email:e.target.value})
                }}
            ></input>
            <button
                onClick={forget}
                className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600"
            >Reset Password</button>
        </div>
    )
}

