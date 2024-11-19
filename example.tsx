import * as React from "react"
import { FaCheck, FaEdit, FaLink, FaRegCommentAlt, FaRegTrashAlt } from "react-icons/fa"
import router from "next/router"
import Image from "next/image"
import axios from "axios"
import { useTranslations } from "next-intl"
import { toast } from "react-toastify"
import { AUTH_API } from "@/components/utils/serverURL"
import { isTimeBetween, setExpiryTime } from "@/components/utils/common"
import AlertDialog from "@/components/AlertDialog"
import EmbedAlert from "@/components/Alerts/EmbedAlert"
import ChatbotPage from "@/components/Pages/ChatPage"

const Chatbots = () => {
  const t = useTranslations('chatbot');
  const toa = useTranslations('toast');
  const [isLoading, setIsLoading] = React.useState(false)
  const [bots, setBots] = React.useState([])
  const [botId, setBotId] = React.useState(0)
  const [open, setOpen] = React.useState(false)
  const [description, setDescription] = React.useState("")

  const [botVisible, setBotVisible] = React.useState(false)
  const [openDialog, setOpenDialog] = React.useState(false)
  const [botName, setBotName] = React.useState("")
  const [botAvatar, setBotAvatar] = React.useState("")
  const [botThemeColor, setBotThemeColor] = React.useState("#1976D2")
  const [userId, setUserId] = React.useState("")
  const [userIndex, setUserIndex] = React.useState("")
  const [startTime, setStartTime] = React.useState("")
  const [endTime, setEndTime] = React.useState("")
  const [index, setIndex] = React.useState("")
  const handleAddRow = () => {
    router.push(`/chatbot/edit?bot=-1`)
  }

  React.useEffect(() => {
    const userID = localStorage.getItem("userID")
    setUserIndex(localStorage.getItem("userIndex"))
    if (userID) setUserId(userID)
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

  const handleChatClickButton = (id: any) => {
    const bot = bots.find((b) => b.id === id)
    if (!bot.active || !isTimeBetween(bot.start_time, bot.end_time)) {
      toast.warn(`${toa('This_bot_is_not_active_yet_Please_wait_until_it_is_active')}`, {
        position: toast.POSITION.TOP_RIGHT,
      })
    }
    setStartTime(bot.start_time)
    setEndTime(bot.end_time)
    setBotId(id)
    setBotName(bot.name)
    setBotAvatar(bot.avatar)
    setBotThemeColor(bot.color) // Assuming there's a themeColor property
    setBotVisible(true)
  }

  const handleDelete = (bot) => {
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

  const handleEmbedClickButton = (bot) => {
    const embeddingCode = `<script src="https://login.aiana.io/aiana.js" data-user-id=${userIndex} data-bot-id=${bot.index}></script>`
    setDescription(embeddingCode)
    setBotId(bot.id)
    console.log("Clicked on ", bot.id)

    setOpen(true)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(description)
    toast.success(`${toa('Successfully_copied')}`, { position: toast.POSITION.TOP_RIGHT })
    setOpen(false)
  }

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
        <EmbedAlert
          open={open}
          setOpen={setOpen}
          description={description}
          handleCopy={handleCopy}
          botId={botId}
        />

        <ChatbotPage
          userId={userId}
          userIndex={userIndex}
          startTime={startTime}
          endTime={endTime}
          botId={botId}
          botName={botName}
          color={botThemeColor}
          avatar={botAvatar}
          visible={botVisible}
          setVisible={setBotVisible}
        />
      </div>
    )
  }

  return (
    <div className="w-[90%] mx-auto p-5">
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
      <div className="relative w-full h-fit flex flex-wrap mt-10 items-center justify-start">
        {bots&&bots.map((bot) => (
          <div
            key={bot.id}
            className="w-[300px] h-fit border border-solid border-gray-300 shadow-lg rounded-lg m-3"
          >
            <div className="w-full h-fit px-5 pt-5">
              <div className="w-full flex items-center">
                <div className="w-20 h-20 flex items-center">
                  <Image
                    src={bot.avatar ? bot.avatar : "/images/logo_sm.png"}
                    className="rounded-full size-[50px]"
                    alt="avatar"
                    width={100}
                    height={100}
                  />
                </div>
                  <p className="font-bold text-xl ml-2">{bot.name}</p>
                <div className="group relative w-32 ml-auto flex justify-end">
                  {isTimeBetween(bot.start_time, bot.end_time) && bot.active ? (
                    <div className="size-5 bg-[#2CA84D] rounded-full flex items-center justify-center">
                      <FaCheck className="text-white size-3" />
                    </div>
                  ) : (
                    <div className="size-5 border-[1px] border-[#767676] rounded-full flex items-center justify-center" />
                  )}
                  <span className="absolute top-8 w-20 text-center scale-0 rounded bg-gray-800 p-2 text-xs text-white group-hover:scale-100">{isTimeBetween(bot.start_time, bot.end_time) && bot.active ? t('Active') : t('Not_active')}</span>
                </div>
              </div>

              <div className="flex-grow flex flex-col text-[.8rem]">
                <div className="mt-3 flex items-center">
                  <p className="text-gray-600 w-1/2 ">{t('Status')}</p>
                  <p className={`italic font-bold ${bot.active ? "text-black" : "text-[#D7263C]"}`}>{bot.active ? "Active" : "Inactive"}</p>
                </div>
                <div className="flex items-center">
                  <p className="text-gray-600 w-1/2">{t('Knowledge_Base')}</p>
                  <p
                    className={`italic font-bold ${bot.knowledgebase_name ? "text-black" : "text-[#D7263C]"
                      }`}
                  >
                    {bot.knowledgebase_name ? bot.knowledgebase_name : "Not Connected"}
                  </p>
                </div>
              </div>
            </div>
            <hr className="my-5" />
            <div className="flex flex-row justify-between gap-3 mx-5 mb-5">
              <div className="group relative flex justify-center">
                <button
                  type="button"
                  aria-label="edit-chatbot"
                  className="size-8 text-[12px] rounded-full border-2 border-[#2CA84D] text-[#2CA84D] flex justify-center items-center"
                  onClick={() => handleEditClickButton(bot.id)}
                >
                  <FaEdit className="w-4 h-4" />
                </button>
                <span className="absolute top-9 scale-0 rounded bg-gray-800 p-2 text-xs text-white group-hover:scale-100">{t('Edit')}</span>
              </div>
              <div className="group relative flex justify-center">
                <button
                  type="button"
                  aria-label="embed-chatbot"
                  className="size-8 text-[12px] rounded-full border-2 border-[#184A92] text-[#184A92] flex justify-center items-center"
                  onClick={() => handleEmbedClickButton(bot)}
                >
                  <FaLink className="w-4 h-4" />
                </button>
                <span className="absolute top-9 w-24 text-center scale-0 rounded bg-gray-800 p-2 text-xs text-white group-hover:scale-100">{t('Add_to_website')}</span>
              </div>
              <div className="group relative flex justify-center">
                <button
                  type="button"
                  aria-label="open-chatbot"
                  className="size-8 text-[12px] rounded-full border-2 border-[#A438FA] text-[#A438FA] flex justify-center items-center"
                  onClick={() => handleChatClickButton(bot.id)}
                >
                  <FaRegCommentAlt className="w-4 h-4" />
                </button>
                <span className="absolute top-9 w-24 text-center scale-0 rounded bg-gray-800 p-2 text-xs text-white group-hover:scale-100">{t('Test_chatbot')}</span>
              </div>
              <div className="group relative flex justify-center">
                <button
                  type="button"
                  aria-label="delete-chatbot"
                  className="size-8 text-[12px] rounded-full border-2 border-[#D7263C] text-[#D7263C] flex justify-center items-center"
                  onClick={() => handleDeleteClickButton(bot.id)}
                >
                  <FaRegTrashAlt className="w-4 h-4" />
                </button>
                <span className="absolute top-9 scale-0 rounded bg-gray-800 p-2 text-xs text-white group-hover:scale-100">{t('Delete')}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <AlertDialog
        title={`${t("Confirm_Delete")}`}
        description={`${t('Are_you_sure_you_want_to_delete_this_item_This_action_cannot_be_undone')}`}
        handleAgree={handleAgree}
        handleDisagree={handleDisagree}
        open={openDialog}
        setOpen={setOpenDialog}
      />
      
      <EmbedAlert 
        open={open} 
        setOpen={setOpen} 
        description={description} 
        handleCopy={handleCopy} 
        botId={botId}
      />

      <ChatbotPage
        userId={userId}
        userIndex={userIndex}
        startTime={startTime}
        endTime={endTime}
        botId={botId}
        botName={botName}
        color={botThemeColor}
        avatar={botAvatar}
        visible={botVisible}
        setVisible={setBotVisible}
      />
    </div>
  )
}

export default Chatbots
