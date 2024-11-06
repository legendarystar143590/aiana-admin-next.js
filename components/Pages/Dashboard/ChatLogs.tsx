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

const ChatLogs = ({setSession, chatLog, setChatLog}) => {
  const t = useTranslations('dashboard');
  const toa = useTranslations('toast')
  const [userID, setUserID] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isClickedSearchBar, setIsClickedSearchBar] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [isClickedFilterBar, setIsclickedFilterBar] = useState(false);
  const [results, setResults] = useState([]);

  useEffect(() => {
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
    const filteredWords = chatLog.filter(log =>  
      log.bot_name.toLowerCase().includes(searchValue.toLowerCase())  
    );  
    setResults(filteredWords);  
  }, [searchValue]);

  const handleRowClick = (sessionId) => {
    setSession(sessionId);
  }

  if (isLoading) {
    return (
      <div>{t('Loading')}</div>
    )
  }

  return (
    <div className="w-full h-full">
      <div className="w-full">
        <div className="h-[50px] flex items-center justify-between pt-[12px] mb-[22px]">
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
        {results !== null ? (results.map((row)=>(          
          <React.Fragment key={row.id}>
            <div  
              className="flex flex-row w-full cursor-pointer border-y py-6"  
              onClick={() => handleRowClick(row.session_id)}  
              onKeyDown={(e) => {  
                if (e.key === 'Enter' || e.key === ' ') {  
                  handleRowClick(row.session_id);  
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
          <div className="flex flex-row w-1/3 h-full justify-center items-center border">
            <div className="flex flex-col justify-center items-center text-center">
              <Image src="/images/icon_no_chat_logs.png" width={150} height={150} alt="No chat log."/>
              <p className="text-lg">No chat occured yet</p>
              <p className="w-2/3">We will show your chatlogs on this page once you have chats on your bot.</p>
            </div>
          </div>
        }
        {/* <table className="w-2/5 rounded-table min-w-[400px]" aria-label="table">
          <thead className="bg-[#EEEEEE] text-[#767676] text-sm ">
            <tr>
              <th className="px-4 py-2 text-start">{t('CHATBOT_NAME')}</th>
              <th className="px-4 py-2 text-start">{t('Website')}</th>
              <th className="px-4 py-2 text-start">{t('STARTED_ON')}</th>
              <th className="px-4 py-2 text-start">{t('ENDED_ON')}</th>
              <th className="px-4 py-2 text-start">{t('STATUS')}</th>
              <th className="px-4 py-2 text-start">{t('ACTION')}</th>
            </tr>
          </thead>
          <tbody className="gap-3 my-2">
            {chatLog.map((row) => (
              <React.Fragment key={row.id}>
                <tr className="h-3" />
                <tr className="hover:bg-gray-100 cursor-pointer border border-[#BEBEBE] border-round">

                  <td >
                    <button type="button" aria-label="bot" onClick={() => handleRowClick(row.session_id)} className="px-4 py-2 w-full h-full flex justify-start items-center gap-3 font-bold">
                      <Avatar src={row.bot_avatar || "/images/logo_sm.png"} name="avatar" className="size-10 rounded-full" />
                      {row.bot_name}
                    </button>

                  </td>
                  <td className="px-4 py-2">
                    <button type="button" aria-label="created" onClick={() => handleRowClick(row.session_id)} className="w-full h-full py-4 text-start">
                      {row.website}
                    </button>
                  </td>
                  <td className="px-4 py-2">
                    <button type="button" aria-label="created" onClick={() => handleRowClick(row.session_id)} className="w-full h-full py-4 text-start">
                      {row.created_at}
                    </button>
                  </td>
                  <td className="px-4 py-2"><button type="button" aria-label="session" onClick={() => handleRowClick(row.session_id)} className="w-full h-full py-4 text-start">{row.ended_at}</button></td>
                  <td className={`px-4 py-2 italic font-bold ${row.bot_active > 0 ? "text-black" : "text-[#BA1126]"}`}><button type="button" aria-label="session" onClick={() => handleRowClick(row.session_id)} className="w-full h-full py-4 text-start">{row.bot_active > 0 ? "Active" : "Inactive"}</button></td>
                  <td className="px-4 py-2">
                    <button
                      type="button"
                      onClick={() => handleDeleteButton(row.session_id)}
                      className="focus:outline-none focus:ring-2 focus:ring-blue-500 bg-[#D9D9D9] size-9 pt-1 rounded-md flex justify-center items-center"
                    >
                      <Image src="/images/icon_trash.svg" alt="trash_icon" width={18} height={18} />
                    </button>
                  </td>
                </tr>
              </React.Fragment>


            ))}
          </tbody>

        </table> */}
      </div>
    </div>

  )
}

export default ChatLogs
