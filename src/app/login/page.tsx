"use client";
import Link from "next/link";
import React, { useEffect } from "react";
import {useRouter} from "next/navigation"
import axios from "axios";
import toast from "react-hot-toast";


export default function LoginPage(){
    const router = useRouter();

    const [user, setUser] = React.useState({
        email: "",
        password: ""
    })

    const [buttonDisabled, setButtonDisabled] = React.useState(false);
    const [loading, setloading] = React.useState(false);

    const onLogin = async () =>{
        try {
            setloading(true);
            const response = await axios.post("/api/user/login", user);
            console.log("Login Success", response.data);
            toast.success("Login success");
            router.push("/profile");
        } catch (error:any) {
            console.log("Login failed",error.message);
            toast.error(error.message);

            if (error.response.status === 401){
                router.push('/verification');
            }

            console.log("Check the status of verification", error.status);
        } finally{
            setloading(false);
        }
    }
    
    useEffect(()=>{
        if(user.email.length > 0 && user.password.length > 0){
            setButtonDisabled(false);
        }else{
            setButtonDisabled(true); 
        }
    }, [user]);
    return(
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <h1 className="text-center text-black text-2xl">{ loading ? "Processing" : "Login"}</h1>
            <hr />
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
                onClick={onLogin}
                className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focuse:border-gray-600"
            >Login here</button>
            <Link 
            className="text-blue-500" 
            href="/forget"
            >Forget Password</Link>
            <Link href="/signup">Create an Account!</Link>
        </div>
    )
}