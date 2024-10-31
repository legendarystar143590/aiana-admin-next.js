import React from "react"
import EmailPasswordForm from "./EmailPasswordForm"

function SignInPage() {
  return (
    <div className="relative w-full h-screen md:flex flex-row overflow-y-auto sm:p-10 ">
      <div className="md:w-1/2 display-none bg-[url('/images/sign-banner.png')] bg-left 2xl:bg-left-top bg-cover bg-no-repeat rounded-[15px]">
        <div className="md:w-4/5 hidden md:block h-full rounded-[15px]">
          <p className="text-white text-4xl font-bold mt-10 ml-10">
            Make your smart chatbots in steps
          </p>
          <p className="text-white text-base ml-10">
            Improve customer experiences by easy-to-build chatbots without coding.
          </p>
        </div>      
      </div>
      <div className="w-full md:w-1/2 h-full">
        <EmailPasswordForm />
      </div>
    </div>
  )
}

export default SignInPage
