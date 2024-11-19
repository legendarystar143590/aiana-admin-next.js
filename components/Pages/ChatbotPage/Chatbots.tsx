import * as React from "react"
import { FaCheck, FaExclamation } from "react-icons/fa"
import router from "next/router"
import Image from "next/image"
import axios from "axios"
import { useTranslations } from "next-intl"
import { toast } from "react-toastify"
import { AUTH_API } from "@/components/utils/serverURL"
import { isTimeBetween, setExpiryTime } from "@/components/utils/common"
import AlertDialog from "@/components/AlertDialog"
// import ChatbotPage from "@/components/Pages/ChatPage"
import ToggleButton from "./ToggleButtons"

const Chatbots = () => {
  const t = useTranslations('chatbot');
  const toa = useTranslations('toast');
  const [isLoading, setIsLoading] = React.useState(false)
  const [bots, setBots] = React.useState([])
  const [openDialog, setOpenDialog] = React.useState(false)
  const [index, setIndex] = React.useState("")
  const handleAddRow = () => {
    router.push(`/chatbot/edit?bot=-1`)
  }

  React.useEffect(() => {
    toast.dismiss()
    const userID = localStorage.getItem("userID")
    // if (userID) setUserId(userID)
    const requestOptions = {
      headers: new Headers({
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "1",
        Authorization: `Bearer ${localStorage.getItem("token")}`, // Example for adding Authorization header
      }),
    }
    if (userID && userID !== "") {
      setIsLoading(true)

      fetch(`${AUTH_API.GET_CHATBOTS}?userId=${userID}`, requestOptions)
        .then((response) => {
          if (response.status === 401) {
            // Handle 401 Unauthorized
            toast.error(`${toa('Session_Expired_Please_log_in_again')}`, {
              position: toast.POSITION.TOP_RIGHT,
            })
            setIsLoading(false) // Ensure loading state is updated
            router.push("/signin") // Redirect to sign-in page
          }
          setExpiryTime();
          setIsLoading(false)
          return response.json() // Continue to parse the JSON body
        })
        .then((data) => {
          setBots(data)
          console.log(data)
          setIsLoading(false)
        })
        .catch((error) => {
          if (error.response) {
            console.log("Error status code:", error.response.status)
            console.log("Error response data:", error.response.data)
            if (error.response.status === 401) {
              toast.error(`${toa('Session_Expired_Please_log_in_again')}`, {
                position: toast.POSITION.TOP_RIGHT,
              })

              router.push("/signin")
            }
            // Handle the error response as needed
          } else if (error.request) {
            // The request was made but no response was received
            console.log("Error request:", error.request)
            toast.error(error.request, { position: toast.POSITION.TOP_RIGHT })
          } else {
            // Something happened in setting up the request that triggered an Error
            console.log("Error message:", error.message)
            toast.error(error.message, { position: toast.POSITION.TOP_RIGHT })
          }
          setIsLoading(false)
        })
    }
  }, []) // Empty dependency array means this effect will only run once after the initial render
  const handleEditClickButton = (id: any) => {
    router.push(`/chatbot/edit?bot=${id}`)
  }

  const handleDelete = (bot) => {
    toast.dismiss()
    axios
      .post(
        AUTH_API.DELETE_BOT,
        { botId: bot },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Example for adding Authorization header
            "Content-Type": "application/json", // Explicitly defining the Content-Type
            "ngrok-skip-browser-warning": "1",
          },
        },
      )
      .then((response) => {
        if (response.status === 201) {
          setBots((prevBases) => prevBases.filter((prev) => prev.id !== bot))
          toast.success(`${toa('Successfully_deleted!')}`, { position: toast.POSITION.TOP_RIGHT })
        } else {
          toast.error(`${toa('Invalid_Request')}`, { position: toast.POSITION.TOP_RIGHT })
        }
      })
      .catch((error) => {
        if (error.response) {
          console.log("Error status code:", error.response.status)
          console.log("Error response data:", error.response.data)
          if (error.response.status === 401) {
            toast.error(`${toa('Session_Expired_Please_log_in_again')}`, {
              position: toast.POSITION.TOP_RIGHT,
            })

            router.push("/signin")
          }
          // Handle the error response as needed
        } else if (error.request) {
          // The request was made but no response was received
          console.log("Error request:", error.request)
          toast.error(error.request, { position: toast.POSITION.TOP_RIGHT })
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log("Error message:", error.message)
          toast.error(error.message, { position: toast.POSITION.TOP_RIGHT })
        }
        setIsLoading(false)
      })
  }

  const handleDeleteClickButton = (bot) => {
    setIndex(bot)
    setOpenDialog(true)
  }

  // const handleEmbedClickButton = (bot) => {
  //   const embeddingCode = `<script src="https://login.aiana.io/aiana.js" data-user-id=${userIndex} data-bot-id=${bot.index}></script>`
  //   setDescription(embeddingCode)
  //   setBotId(bot.id)
  //   console.log("Clicked on ", bot.id)

  //   setOpen(true)
  // }

  const handleAgree = () => {
    setOpenDialog(false)
    handleDelete(index)
  }

  const handleDisagree = () => {
    setOpenDialog(false)
  }

  if (isLoading) {
    return <div>{t('Loading')}</div>
  }
  if (bots && bots.length === 0) {
    return (
      <div className="w-[90%] mx-auto p-5">
        <div className="w-full h-[50px] flex items-center justify-between pt-[24px] mb-[10px]">
          <h3 className="font-bold text-2xl">{t('Chatbots')}</h3>
        </div>
        <div className="max-sm:w-full w-[300px] h-fit mx-auto mt-10 flex flex-col items-center justify-between">
          <Image src="/images/icon_no_bot.png" alt="no_bot" width={200} height={200} />
          <p className="text-xl font-bold text-center">{t('No_chatbots_created_yet')}</p>
          <p className="text-[#767676] text-center my-5">
            {t('Create_chatbots_to_help_you_communicate_You_will_see_chatbots_here_after_creating')}
          </p>
          <div className="w-full flex justify-center">
            <button
              type="button"
              onClick={handleAddRow}
              className="bg-black max-sm:w-full w-[160px] h-[40px] flex items-center justify-center gap-1 text-white font-bold rounded-md"
            >
              + 
              <p>{t('Create_Chatbot')}</p>
            </button>
          </div>
        </div>
        <AlertDialog
          title={`${t('Confirm_Delete')}`}
          description={`${t('Are_you_sure_you_want_to_delete_this_item_This_action_cannot_be_undone')}`}
          handleAgree={handleAgree}
          handleDisagree={handleDisagree}
          open={openDialog}
          setOpen={setOpenDialog}
        />
      </div>
    )
  }

  return (
    <div className="w-full mx-auto p-5 relative">
      <div className="w-full h-[50px] flex items-center justify-between pt-[24px] mb-[10px]">
        <h3 className="font-bold text-2xl">{t('Chatbots')}</h3>
        <div>
          <button
            type="button"
            onClick={handleAddRow}
            className="bg-black w-[160px] h-[40px] flex items-center justify-center gap-1 text-white font-bold rounded-md"
          >
            + 
            <p>{t('Create_Chatbot')}</p>
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-10">
        {bots&&bots.map((bot) => (
          <div
            key={bot.id}
            className="relative h-fit border border-solid border-gray-300 shadow-lg rounded-xl min-w-[240px] max-h-[400px] hover:shadow-2xl hover:scale-105 duration-300 cursor-pointer"
          >
            <div className="w-full h-fit flex flex-col gap-2 p-2">
              <div className="w-full flex flex-row items-center justify-between py-2">
                <div className="flex flex-row items-center justify-center">
                  <div className="flex items-center">
                    <Image
                      src={bot.avatar ? bot.avatar : "/images/logo_short_black.png"}
                      className="rounded-full size-[30px]"
                      alt="avatar"
                      width={50}
                      height={50}
                    />
                  </div>
                  <p className="font-bold text-xl ml-2 truncate">{bot.name}</p>
                </div>
                <ToggleButton 
                  bot={bot} 
                  handleDeleteClickButton={handleDeleteClickButton}
                />
              </div>

              <div 
                role="button" 
                tabIndex={0} 
                className="flex-grow flex flex-col w-full text-base gap-2 rounded-xl border p-2" 
                onClick={()=>handleEditClickButton(bot.id)}
                onKeyDown={(e)=>console.log("onKeyDown", e.key)}
              >
                <div className="flex flex-row w-full justify-between items-center">
                  <p className="text-gray-400 w-1/2 truncate">{t('Knowledge_Base')}</p>
                  <p
                    className={`${bot.knowledgebase_name ? "text-black" : "text-[#D7263C]"
                      } truncate`}
                  >
                    {bot.knowledgebase_name ? bot.knowledgebase_name : "Not Connected"}
                  </p>
                </div>
                <div className="flex flex-row w-full justify-between">
                  <p className="text-gray-400 truncate">Linked to</p>
                  <p className="truncate">{bot.registered_website ? bot.registered_website:"Not connected"}</p>
                </div>
                <div className="flex flex-row w-full justify-between">
                  <p className="text-gray-400">Bot color</p>
                  <div className="h-5 w-8 rounded-lg" style={{ backgroundColor: bot.color }} />
                </div>                
                <div className="group relative w-full flex flex-row justify-between">
                  <p className="text-gray-400">Status</p>
                  {isTimeBetween(bot.start_time, bot.end_time) && bot.active ? (
                    <div className="border border-gray-300 rounded-full flex flex-row items-center justify-center px-1 gap-2">
                      <div className="bg-green-600 border rounded-full p-1">
                        <FaCheck className="text-gray-100 size-2" />
                      </div>
                      <p>Active</p>
                    </div>
                  ) : (
                    <div className="bg-gray-100 border border-gray-300 rounded-full flex flex-row items-center justify-center px-1 gap-2">
                      <div className="bg-gray-600 border rounded-full p-1">
                        <FaExclamation className="text-gray-100 size-2" />
                      </div>
                      <p>Inactive</p>
                    </div>
                  )}
                  <span className="absolute top-8 w-20 text-center scale-0 rounded bg-gray-800 p-2 text-xs text-white group-hover:scale-100">{isTimeBetween(bot.start_time, bot.end_time) && bot.active ? t('Active') : t('Not_active')}</span>
                </div>
              </div>
            </div>
          </div>
        ))}        
        {/* <script src="https://login.aiana.io/aiana.js" data-user-id="b33417f7-37c8-4ab8-b30c-5176225f6be0" data-bot-id="74c9fd11-8e0a-4c62-bf4b-2c78be389c4d"/> */}
      </div>
      <AlertDialog
        title={`${t("Confirm_Delete")}`}
        description={`${t('Are_you_sure_you_want_to_delete_this_item_This_action_cannot_be_undone')}`}
        handleAgree={handleAgree}
        handleDisagree={handleDisagree}
        open={openDialog}
        setOpen={setOpenDialog}
      />
    </div>
  )
}

export default Chatbots
