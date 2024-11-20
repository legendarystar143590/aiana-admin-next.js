import React, { useState } from "react"
import { toast } from "react-toastify"
import Link from "next/link"
import axios from "axios"

import { AUTH_API } from "@/components/utils/serverURL"
import { customerToast } from "@/components/Toast"

const ResetPasswordForm = () => {
  const [email, setEmail] = useState("")

  const handleSendButton = () => {
    toast.dismiss() // Dismiss any existing toasts
    if (email !== "") {
      const requestOptions = {
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "1",
        },
      }

      axios
        .post(
          AUTH_API.FORGOT_PASSWORD,
          {
            email,
          },
          requestOptions,
        )
        .then((response) => {
          if (response.status === 200) {
            customerToast({type:'success',title:"Check your email.  Sent the reset password link!", content:''})
          }
        })
        .catch((error) => {
          if (error.response) {
            const { status } = error.response // Destructure status directly
            if (status === 404) {
              toast.error("Unregistered email", {
                position: toast.POSITION.TOP_RIGHT,
              })
            } else if (status === 500) {
              toast.error("Internal Server Error: Something went wrong on the server", {
                position: toast.POSITION.TOP_RIGHT,
              })
            } else {
              toast.error(`Error: ${status}`, { position: toast.POSITION.TOP_RIGHT })
            }
          } else {
            toast.error("Network Error: Unable to connect to the server", {
              position: toast.POSITION.TOP_RIGHT,
            })
          }
        })
    } else {
      toast.error("Please enter your email", { position: toast.POSITION.TOP_RIGHT })
    }
  }

  return (
    <div className="w-full flex flex-col h-full mx-auto justify-center items-center md:p-5 p-2">
      <div className="md:w-full lg:w-3/5 w-3/4 gap-10 flex flex-col justify-center">
        <div className="flex flex-col text-left text-sm">
          <div>
            <img src="/images/logo_final_black.png" alt="Logo" className="h-12" />
          </div>
        </div>
        <div className="text-[14px] px-3 flex flex-col">
          <h1 className="text-[1.3rem] font-bold">Email Verification</h1>
          <p>Enter your email and instructions will be sent to you!</p>
        </div>

        <div
          className="flex flex-col mx-3 gap-10"
        >
          <div>
            <label htmlFor="email" className="font-mono font-bold text-xl">
              Email
            </label>

            <input
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
              }}
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="Enter email"
              className="rounded-lg border-gray-400 w-full mt-1 h-12"
            />
          </div>

          <div className="text-right">
            <button
              type="button"
              onClick={handleSendButton}
              className="mt-1 mb-5 rounded-lg w-full h-[48px] bg-black text-white font-bold text-[16px] transition duration-200 ease-in-out hover:shadow-lg hover:scale-[1.01] active:scale-[.99]"
            >
              Reset
            </button>
          </div>
          <div className="text-center">
            <p>
              Or go to&nbsp;
              <Link href="/signin">
                <span className="text-black font-bold cursor-pointer">Sign in</span>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResetPasswordForm
