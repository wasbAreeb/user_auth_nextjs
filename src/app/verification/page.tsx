"use client"
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Verification(){

    const router = useRouter();

    const [token,setToken] = useState("");
    const [verificationType, setVerificationType] = useState("");
    const [verified, setVerified] = useState(false);
    const [error, setError] = useState(false);

    const verifyUserEmail = async () =>{
        try {
           const response = await axios.post("api/user/verification", {token, verificationType}); 
           setVerified(true);
           const redirection = response.data.redirect;
           if(redirection){
                router.push(redirection);
           }
        } catch (error:any) {
           setError(true);
           console.log(error.message);
        }
    }

    useEffect(() => {
        const urlToken = window.location.search.split("=")[1];
        setToken(urlToken || "");
    }, []);

    useEffect(()=>{
        const verificationTypeSeacrh = new URLSearchParams(window.location.search);

        if(verificationTypeSeacrh.get("resetToken")){
            setVerificationType("resetToken");
        }else{
            setVerificationType("token");
        }
    })

    useEffect(() =>{
        if(token.length > 0){
            verifyUserEmail();
        }
    }, [token]);

    // useEffect(()=>{
    //     if(verified){
    //         router.push("/login");
    //     }
    // });

    return(
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <h1 className="text-4xl">Verifying your Email</h1>
            <h2 className="p-2 bg-orange-500 text-black">{token ? `${token}` : "No token"}</h2>

            {/* {verified && (
                <div>
                    <h2 className="text-2xl">Email Verified</h2>
                    <Link href="/login">
                        Login
                    </Link>
                </div>
            )} */}
            
            {error && (
                <div>
                    <h2 className="text-2xl bg-red-500 rounded">Error</h2>
                </div>
            )}
        </div>
    )
}