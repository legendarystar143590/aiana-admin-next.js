import React from "react"
import { toast } from "react-toastify"
import Link from "next/link"
import router from "next/router"
import Image from "next/image"

import { loginUser } from "@/components/utils/common"
import Spinner from "@/components/Spinner"
import PasswordInputField from "@/components/PasswordInputField"

const EmailPasswordForm = () => {
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)
  const [isLoaded, setIsLoaded] = React.useState(false)
  const handleAuth = async () => {
    toast.dismiss() // Dismiss any existing toasts
    // const login_datetime = new Date().toISOString().slice(0, 19).replace('T', ' ');
    if (email === "") {
      toast.error("Email is required!", { 
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000, // Close after 3 seconds
      })
      return false
    }
    if (password === "") {
      toast.error("Password is required!", { 
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000, // Close after 3 seconds
      })
      return false
    }
    setIsLoading(true)
    try {
      const isVerified = await loginUser(email, password)
      console.log("isVerified: ", isVerified)
      if(isVerified === "true") {
        router.push("/admin")
        setIsLoaded(true)
        setIsLoading(false)
      } else if(isVerified === "false") {
        router.push("/signup/please-verify")
        setIsLoading(false)
      } else if(isVerified === "error") {
        toast.error("Unrecognized email or password", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 3000, // Close after 3 seconds
        })
        setIsLoading(false)
      }
    } catch (error) {
      setIsLoading(false)
      toast.error(error.message, { 
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000, // Close after 3 seconds
      })
    }
    return true
  }
  /* eslint-disable */
  const handleEmailChange = ({ target: { value } }) => {
    setEmail(value)
  }

  const handlePasswordChange = (id, value) => {
    console.log("id: ", id)
    setPassword(value)
  }
  /* eslint-enable */

  return (
    <div className="flex flex-col w-full h-full justify-center relative">
      <div className="px-5 lg:3/5 md:w-5/6 w-full flex flex-col h-full justify-center mx-auto overflow-y-auto">
        <div className="w-3/4 mx-auto">
          <div className="mt-10">
            <img src="/images/logo_final_black.png" alt="Logo" className="h-12 sm:mb-10 mb-5" />
            <div className="flex mb-5">
              <h1 className="text-[1.3rem] font-bold">Welcome Back</h1>
            </div>
          </div>
          <form className="sm:mt-10 w-full flex flex-col gap-[3vh]">
            <div>
              <label htmlFor="username" className="font-bold">
                Username/Email
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={email}
                onChange={handleEmailChange}
                className="rounded-lg border-gray-400 w-full mt-1 h-12"
                placeholder="Enter your username/email"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="password" className="font-bold mb-1">
                Password
              </label>
              <PasswordInputField 
                id = "password"
                value = {password}
                handleChange={handlePasswordChange}
                placeholder="Enter your password"
              />
            </div>
            <div className="w-full flex flex-row justify-end">
              <Link href="/forgot">
                <span className="ml-auto text-sm text-gray-600 hover:text-gray-800 cursor-pointer">
                  Forgot password?
                </span>
              </Link>
            </div>
            <div className="flex flex-col">
              <button
                id="signin"
                type="button"
                className="mt-1 mb-5 rounded-lg w-full h-[48px] bg-black text-white font-bold text-[16px] transition duration-200 ease-in-out hover:shadow-lg hover:scale-[1.01] active:scale-[.99]"
                onClick={(isLoaded || isLoading) ? ()=>{} : handleAuth}
              >
                {isLoading ? <Spinner color=""/> : "Log In"}
              </button>
            </div>
          </form>
          <div className="text-center mt-5 ">
            <p>
              Don&apos;t have an account?&nbsp;
              <Link href="/signup">
                <span className="pl-3 font-bold cursor-pointer">Sign up</span>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EmailPasswordForm
