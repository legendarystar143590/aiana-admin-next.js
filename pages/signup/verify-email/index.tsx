import axios from "axios";
import { useEffect, useRef } from "react";
import router from "next/router"
import {AUTH_API} from "@/components/utils/serverURL";
import { customerToast } from "@/components/Toast";

const VerifyEmailPage = () => {
    const isMounted = useRef(false);
    useEffect(() => {
        if (isMounted.current)
            return;
        isMounted.current = true;
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get("token");
        console.log('token', token);
        if (token){
            const requestOptions = {
                headers: {
                    "Content-Type": "application/json",
                    "ngrok-skip-browser-warning": "1",
                },
            }
            axios
            .post(
                AUTH_API.VERIFY_EMAIL,
                {
                    token,
                },requestOptions
            )
            .then((response) => {
                if (response.status === 200) {
                    customerToast({type:'success',title:"Email is successfully verified. Please, sign in...", content:''})
                    const isVerified = "true";
                    localStorage.setItem("isVerified", isVerified);
                    router.push("/signin");
                }
                else if(response.status === 400) {
                    customerToast({type:'error', title: `${response.data.message}`, content: ""})
                    router.push("/signup/please-verify");
                }
            })
            .catch((error) => {
                if (error.response) {
                    const { message, status } = error.response;
                    if (status === 500) {
                        console.log("Internal Server Error: Something went wrong on the server");
                        customerToast({type:'error', title: "Something went wrong on the server", content: ""})
                        router.push("/signup/please-verify");
                    } else if (status === 400) {
                        console.log("Bad Request: Invalid request->>>>>", message);
                        customerToast({type:'error', title: `${error.response.data.message}`, content: ""})
                        router.push("/signup/please-verify");
                    }
                }
                else {
                    console.log("Network Error: Something went wrong with the network");
                    customerToast({type:'error', title: "Something went wrong with the network", content: ""})
                    router.push("/");
                }
            });
        }
        else {
            router.push("/signin");
        }
    },[]);
  return(
    <div>
        this is verify email page
    </div>
  )
}

export default VerifyEmailPage;