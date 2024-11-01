import React, {useState} from "react"
import axios from "axios"
import { toast } from "react-toastify"
import router from "next/router"
import { AUTH_API } from "@/components/utils/serverURL"
import { useToken } from "@/providers/TokenContext"
import PasswordInputField from "@/components/PasswordInputField"

const ResetPasswordPage = () => {

  const {token} = useToken();  

  const [confirmPassword, setConfirmPassword] = useState("")
  const [password, setPassword] = useState("")
  const handleSaveButtonClick = () => {
    if( password ==="" || confirmPassword ===""){
      toast.warn("Please enter a new password and confirm password!", { position: toast.POSITION.TOP_RIGHT });
      return false;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords are not match!", { position: toast.POSITION.TOP_RIGHT });
      return false;
    }

    axios
      .post(AUTH_API.RESET_PASSWORD, { password, token })
      .then(( response ) => { // Use object destructuring here
        if (response.status===201) {
          toast.success("Successfully updated the password!", {position: toast.POSITION.TOP_RIGHT});
          router.push('/signin');
          return true;
        }
        return false;

      })
      .catch((error) => {
        if(error.status===400){
          toast.error("Token Expired!", { position: toast.POSITION.TOP_RIGHT });
        }
        if(error.status === 500){
          toast.error("Server Error!", { position: toast.POSITION.TOP_RIGHT });
        }
        return false;

      });
    return true;
  };
  /* eslint-disable */
  const handleChange = (id, value) => {
    if (id === "password") {
      setPassword(value);
    } else if (id === "confirmPassword") {
      setConfirmPassword(value);
    }
  }
  /* eslint-enable */

  return (
    <div className="w-full flex flex-col h-full mx-auto justify-center items-center md:p-5 p-2">
      <div className="md:w-full lg:w-3/5 w-3/4 gap-10 flex flex-col justify-center px-3 text-gray-600">
        
        <div className="text-center mt-5">
          <div>
            <img src="/images/logo_final_black.png" alt="Logo" className="h-12" />
          </div>              
        </div>

        <div className="text-[14px] flex flex-col">
          <h1 className="text-2xl font-bold">Reset password</h1>
          <p>Create your new password to access your account!</p>
        </div>

        <div className="flex flex-col gap-3">
          <label htmlFor="password" className="font-mono font-bold text-lg">
            New Password
          </label>
          <PasswordInputField
            id="password"
            value={password}
            handleChange={handleChange}
            placeholder="Minimum 8 characters password"
          />
        </div>

        <div className="flex flex-col gap-3">
          <label htmlFor="confirmPassword" className="font-mono font-bold text-lg">
            Confirm Password
          </label>
          <PasswordInputField
            id="confirmPassword"
            value={confirmPassword}
            handleChange={handleChange}
            placeholder="Re-enter your password"
          />
        </div>        
        <div className="text-right">
          <button
            type="button"
            onClick={handleSaveButtonClick}
            className="mt-1 mb-5 rounded-lg w-full h-[48px] bg-black text-white font-bold text-[16px] transition duration-200 ease-in-out hover:shadow-lg hover:scale-[1.01] active:scale-[.99]"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  )
}

export default ResetPasswordPage
