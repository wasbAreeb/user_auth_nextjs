"use client";
import Link from "next/link";
import React, { useEffect } from "react";
import {useRouter} from "next/navigation"
import axios from "axios";
import toast from "react-hot-toast";


export default function SignupPage(){
    const router = useRouter();

    const [user, setUser] = React.useState({
        email: "",
        password: "",
        username: ""
    })

    const [buttonDisabled, setButtonDisabled] = React.useState(false);
    const [loading, setloading] = React.useState(false);
    
    const onSignup = async () =>{
        try {
            setloading(true);
            const response = await axios.post("/api/user/signup", user)
            console.log("Signup Success", response.data);
            router.push("/login");
        } catch (error:any) {
            console.log("Signup failed", error.message);
            toast.error(error.message);
        } finally{
            setloading(false);
        }
    }
    
    useEffect(()=>{
        if (user.email.length > 0 && user.username.length > 0 && user.password.length > 0){
            setButtonDisabled(false);
        }else{
            setButtonDisabled(true);
        }
    }, [user]);

    return(
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <h1 className="text-center text-black text-2xl">{ loading ? "Processing" : "Signup" }</h1>
            <hr />
            <label htmlFor="username">Username</label>
            <input
                className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600"
                id="username"
                type="text"
                value={user.username}
                onChange={(e)=> setUser({...user, username:e.target.value})}
            ></input>
            <label htmlFor="email">Email</label>
            <input
                className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600"
                id="email"
                type="email"
                value={user.email}
                onChange={(e)=> setUser({...user, email:e.target.value})}
            ></input>
            <label htmlFor="password">Password</label>
            <input
                className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600"
                id="password"
                type="password"
                value={user.password}
                onChange={(e)=> setUser({...user, password:e.target.value})}
            ></input>
            <button
                onClick={onSignup}
                className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focuse:border-gray-600"
            >{buttonDisabled ? "No signup" : "Signup"}</button>
            <Link href="/login">Already have account?</Link>
        </div>
    )
}