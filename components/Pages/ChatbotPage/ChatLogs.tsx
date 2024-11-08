import React, { useState, useEffect } from "react"
import router from "next/router"
import axios from "axios"
import { toast } from "react-toastify"
import { useTranslations } from "use-intl"

import { AUTH_API } from "@/components/utils/serverURL"
import {formatTimeStringOnly} from "@/components/utils/common"
import Avatar from "@/components/Avatar"
import Image from "next/image"
import { FaFilter, FaSearch } from "react-icons/fa"

const ChatLogs = ({chatLog, setSession, setChatLog, setBotAvatar}) => {
  const t = useTranslations('dashboard');
  const toa = useTranslations('toast')
  const [userID, setUserID] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isClickedSearchBar, setIsClickedSearchBar] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [isClickedFilterBar, setIsclickedFilterBar] = useState(false);
  const [results, setResults] = useState([]);

  useEffect(() => {
    console.log(results)
    setUserID(localStorage.getItem("userID"))
    if (userID !== "") {
      setIsLoading(true)
      axios
        .post(AUTH_API.GET_CHAT, { userID }, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,  // Example for adding Authorization header
            'Content-Type': 'application/json',  // Explicitly defining the Content-Type
          }
        })
        .then((response) => {
          if (response.status === 200) {
            const chatLogs = response.data;
            setChatLog(chatLogs);
            setResults(chatLogs);
          }
          if (response.status === 401) {
            toast.error(`${toa('Please_login')}`, { position: toast.POSITION.TOP_RIGHT });
            router.push("/signin");
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
  }, [userID])

  useEffect(() => { 
    console.log("searchValue", searchValue); 
    const filteredWords = chatLog.filter(log =>  
      log.bot_name.toLowerCase().includes(searchValue.toLowerCase())  
    );  
    setResults(filteredWords);  
  }, [searchValue]);

  useEffect(()=>{
    setResults(chatLog)
  }, [chatLog])

  const handleRowClick = (sessionId, botAvatar) => {
    setSession(sessionId);
    setBotAvatar(botAvatar);
  }

  if (isLoading) {
    return (
      <div>{t('Loading')}</div>
    )
  }

  return (
    <div className="w-full h-full">
      <div className="w-full h-full">
        <div className="h-[10%] flex items-center justify-between">
          <h3 className="font-bold text-2xl truncate">{t('Chatlogs')}</h3>
          <div className="flex flex-row gap-3">
            <div className={`${isClickedSearchBar?"px-3 py-1 gap-2":"p-3"} w-auto flex flex-row border border-gray-300 rounded-full`}>
              <input type="text" value={searchValue} onChange={(e)=>{setSearchValue(e.target.value)}} className={`${isClickedSearchBar?"block":"hidden"} rounded-xl text-base py-1`}/>
              <button type="button" onClick={()=>setIsClickedSearchBar(!isClickedSearchBar)} aria-label="Search Button">
                <FaSearch />
              </button>            
            </div>
            <div className={`${isClickedFilterBar?"px-3 py-1 gap-2":"p-3"} w-auto flex flex-row border border-gray-300 rounded-full`}>
              <button type="button" onClick={()=>setIsclickedFilterBar(!isClickedFilterBar)} aria-label="Filter Button">
                <FaFilter />
              </button>
            </div>
          </div>
        </div>      
        {results.length !== 0 ? (results.map((row)=>(          
          <React.Fragment key={row.id}>
            <div  
              className="flex flex-row w-full cursor-pointer border-y py-6"  
              onClick={() => handleRowClick(row.session_id, row.bot_avatar)}  
              onKeyDown={(e) => {  
                if (e.key === 'Enter' || e.key === ' ') {  
                  handleRowClick(row.session_id, row.bot_avatar);  
                  e.preventDefault(); // Prevent scrolling when space is pressed  
                }  
              }}  
              tabIndex={0} // Makes the div focusable  
              role="button" // Indicates this is a button-like element  
            >
              <div className="w-[15%]">
                <Avatar src={row.bot_avatar || "/images/icon_bot_avatar.png"} name="avatar" className="size-10 rounded-full" />
              </div>            
              <div className="flex flex-col w-[85%]">
                <div className="flex flex-row justify-between">
                  <p className="text-base font-bold">{row.bot_name}</p>
                  <p className="text-sm">{formatTimeStringOnly(row.created_at)}</p>
                </div>
              </div>
            </div>
          </React.Fragment>
        ))
        ) : 
          <div className="flex flex-row w-full h-[90%] justify-center items-center border">
            <div className="flex flex-col justify-center items-center text-center">
              <Image src="/images/icon_no_chat_logs.png" width={150} height={150} alt="No chat log."/>
              <p className="text-lg">No chat occured yet</p>
              <p className="w-2/3">We will show your chatlogs on this page once you have chats on your bot.</p>
            </div>
          </div>
        }
      </div>
    </div>

  )
}

export default ChatLogs
