import { useState, useEffect } from "react"
import axios from "axios"
import { useTranslations } from "next-intl"
import { toast } from "react-toastify"
import router from "next/router"
import { FaDownload, FaRegTrashAlt } from "react-icons/fa"
import { AUTH_API } from "@/components/utils/serverURL"
import {formatDateStringOnly} from "@/components/utils/common"
import Avatar from "@/components/Avatar"

const Logs = ({ session, setSession, chatLog, setChatLog, botAvatar }) => {
  const t = useTranslations('chatbot');
  const toa = useTranslations('toast');
  const INITIAL_BOT_OBJ = {
    bot_name: "",
    greetings: "Hello! How can I assist you today?",
    avatar: "",
    start_time: "",
  }
  const [isLoading, setIsLoading] = useState(false);
  const [bot, setBot] = useState(INITIAL_BOT_OBJ)
  const [conversation, setConversation] = useState([])
  // const [ setBotAvatar] = useState('/images/icon_bot_avatar.png');
  const [userName, setUserName] = useState("")
  const [userEmail, setUserEmail] = useState("")

  useEffect(() => {
    toast.dismiss() // Dismiss any existing toasts
    if (session !== undefined) {
      setIsLoading(true)
      axios
        .post(AUTH_API.GET_LOG_DATA, { session }, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,  // Example for adding Authorization header
            'Content-Type': 'application/json',  // Explicitly defining the Content-Type
          }
        })
        .then((response) => {
          if (response.status === 401) {
            toast.error(`${toa('Please_login')}`, { position: toast.POSITION.TOP_RIGHT });
            router.push("/signin");
          }
          // console.log("conversation >>>>>", response.data)

          if (response.data && response.data.log) {
            // Assuming log contains keys like bot_name and created_at
            const updatedBot = {
              ...INITIAL_BOT_OBJ,
              bot_name: response.data.log.bot_name || INITIAL_BOT_OBJ.bot_name,
              start_time: formatDateStringOnly(response.data.log.created_at || INITIAL_BOT_OBJ.start_time),
              avatar: response.data.log.avatar || INITIAL_BOT_OBJ.avatar,
              greetings: response.data.log.greetings || INITIAL_BOT_OBJ.greetings,

              // Add more mappings as needed based on the structure of response.data.log
            };
            setBot(updatedBot);
          }
          if (response.data && response.data.conversation) {
            setConversation(response.data.conversation)
          }
          // if (response.data && response.data.bot_avatar) {
          //   setBotAvatar(response.data.bot_avatar)
          // }
          if (response.data && response.data.user_name) {
            setUserName(response.data.user_name)
          }
          if (response.data && response.data.user_email) {
            setUserEmail(response.data.user_email)
          }
          setIsLoading(false)
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          if (error.response) {
            console.log('Error status code:', error.response.status);
            console.log('Error response data:', error.response.data);
            if (error.response.status === 401) {
              toast.error(`${toa('Session_Expired_Please_log_in_again')}`, { position: toast.POSITION.TOP_RIGHT });

              router.push("/signin")
            }
            // Handle the error response as needed
          } else if (error.request) {
            // The request was made but no response was received
            console.log('Error request:', error.request);
            toast.error(error.request, { position: toast.POSITION.TOP_RIGHT });

          } else {
            // Something happened in setting up the request that triggered an Error
            console.log('Error message:', error.message);
            toast.error(error.message, { position: toast.POSITION.TOP_RIGHT });

          }
          setIsLoading(false);
        })
    }
  }, [session])

  const handleDelete = (sessionId) => {
    toast.dismiss() // Dismiss any existing toasts
    axios
    .post(`${AUTH_API.DELETE_CHATLOG}`, { sessionId }, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,  // Example for adding Authorization header
        'Content-Type': 'application/json',  // Explicitly defining the Content-Type
      }
    })
    .then((response) => {
      if (response.status === 201) {
        const updatedChatLog = chatLog.filter((log) => log.session_id !== sessionId);
        setChatLog(updatedChatLog);
        setSession("")
        setConversation([]);
        toast.success(`${toa('Chatlog_deleted_successfully')}`, { position: toast.POSITION.TOP_RIGHT })
      }
    })
    .catch(() => {
      toast.error(`${toa('Failed_to_delete_chatlog_Please_try_again_later')}`, { position: toast.POSITION.TOP_RIGHT });
    });
  }

  const handleExport = () => {
    // Convert data to CSV  
    const csvHeaders = `${Object.keys(conversation[0]).join(",")}\n`;  
    const csvRows = conversation  
      .map((row) => Object.values(row).join(","))  
      .join("\n");  
    
    const csvString = csvHeaders + csvRows;  
  
    // Create a Blob from the CSV string  
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });  
  
    // Create a link element and trigger the download  
    const link = document.createElement("a");  
    link.href = URL.createObjectURL(blob);  
    link.setAttribute("download", "exported_data.csv");  
    
    // Append the link to the body, click it, and remove it  
    document.body.appendChild(link);  
    link.click();  
    document.body.removeChild(link);
  }

  if (isLoading) {
    return (
      <div className="h-[700px] w-full mx-auto bg-gray-200 rounded-lg mt-[62px]"/>
    )
  }

  return (
    <div className="h-full w-full mx-auto">
      <div className="h-[10%] flex flex-row w-full items-center justify-between">
        <div className="flex flex-col">
          <h3 className="font-bold text-2xl">{userName}</h3>
          {userEmail && <p className="text-gray-500">{userEmail} | start : {bot.start_time}</p>}
          
        </div>
        <div className="flex flex-row gap-4">
          <button
            type="button"
            onClick={()=>session === "" ? "" : handleDelete(session)}
            className="px-4 py-1 flex flex-row justify-center items-center gap-2 border rounded-md border-gray-300"
          >
            <FaRegTrashAlt />
            {t('Delete')}
          </button>
          <button
            type="button"
            onClick={()=>session === "" ? "" :handleExport()}
            className="px-4 py-1 flex flex-row justify-center items-center gap-2 bg-black text-white rounded-md"
          >
            <FaDownload/>
            {t('Export')}
          </button>
        </div>
      </div>
      <div className="max-w-[1000px] overflow-y-auto bg-gray-200 rounded-lg h-[90%]">
        <div className="w-full mx-auto rounded-md mt-5 p-3">
          <div className="flex flex-col text-gray-500 overflow-y-auto">
            {conversation.map((conv) => 
              <div key={conv.id} className="flex flex-col m-2">
                <div className="flex flex-row justify-start items-center w-full pb-2 gap-4">
                  <Avatar
                    src="/images/icon_user_avatar.png"
                    name="avatar"
                    className="rounded-full size-12"
                  />
                  <div className="text-[14px] text-white bg-[#A438FA] p-2 rounded-md">
                    {conv.user_message}
                  </div>
                </div>
                <div className="flex flex-row justify-end w-full">
                  <div className="flex items-right justify-end gap-2 w-[70%]">
                    <div className="text-[14px] text-[#070E0B] bg-gray-100 rounded-md p-2">
                      {conv.response}
                    </div>
                    <Avatar
                      src={botAvatar !== "" ? botAvatar : "/images/icon_bot_avatar.png"}
                      name="avatar"
                      className="rounded-full size-12"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Logs
