
import React, { useState, useEffect } from "react"
import axios from "axios"
import Image from "next/image"
import router from "next/router"
import { useTranslations } from "next-intl"
import { FaSearch, FaFilter } from "react-icons/fa"

import { AUTH_API } from "@/components/utils/serverURL"
import {formatTimeStringOnly, setExpiryTime } from '@/components/utils/common'
import Avatar from "@/components/Avatar"
import { customerToast } from "@/components/Toast"

const Tickets = ({setSession, tickets, setTickets, setBotAvatar, setTicketContent, setCurrentTicketId}) => {
  const t = useTranslations('ticket');
  const toa = useTranslations('toast');
  const [userId, setUserId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isClickedSearchBar, setIsClickedSearchBar] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [isClickedFilterBar, setIsclickedFilterBar] = useState(false);
  const [results, setResults] = useState([]);

  useEffect(() => {
    const userIdFromStorage = localStorage.getItem("userID");
    setIsLoading(true);
    if (userIdFromStorage !== "") {
      setUserId(userIdFromStorage);

      axios.post(AUTH_API.GET_TICKETS, { userId: userIdFromStorage }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,  // Example for adding Authorization header
          'Content-Type': 'application/json',  // Explicitly defining the Content-Type
        }
      })
        .then((response) => {
          if (response.status === 200) {
            setTickets(response.data);
            setResults(response.data);
            setExpiryTime();
          }
          if (response.status === 401) {
            customerToast({type:'error', title: `${toa('Please_login')}`, content: ""})
            router.push("/signin");

          }
          setIsLoading(false);
        })
        .catch((error) => {
          if (error.response) {
            console.log('Error status code:', error.response.status);
            console.log('Error response data:', error.response.data);
            if (error.response.status === 401) {
              customerToast({type:'error', title: `${toa('Session_Expired_Please_log_in_again')}`, content: ""})

              router.push("/signin")
            }
            // Handle the error response as needed
          } else if (error.request) {
            customerToast({type:'error', title: `${error.request}`, content: ""})

          } else {
            customerToast({type:'error', title: `${error.message}`, content: ""})            

          }
          setIsLoading(false);
        });
    }
  }, []);

  useEffect(() => {  
    const filteredWords = tickets.filter(log =>  
      log.bot_name.toLowerCase().includes(searchValue.toLowerCase())  
    );  
    setResults(filteredWords);  
  }, [searchValue]);

  useEffect(()=>{
    setResults(tickets)
  },[tickets]);

  const handleRowClick = (sessionId, botAvatar, content, ticketId) => {
    setSession(sessionId);
    setBotAvatar(botAvatar);
    setTicketContent(content);
    setCurrentTicketId(ticketId);
  }

  if (isLoading || !userId) {
    return (
      <div>{t('Loading')}</div>
    )
  }

  return (
    <div className="w-full h-full">
      <div className="h-[10%] flex items-center justify-between">
          <h3 className="font-bold text-2xl truncate">{t('tickets')}</h3>
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
      {results.length === 0 ? 
        <div className="flex flex-row w-full h-[90%] justify-center items-center border">
          <div className="flex flex-col justify-center items-center text-center">
            <Image src="/images/icon_no_chat_logs.png" width={150} height={150} alt="No chat log."/>
            <p className="text-lg">No chat occured yet</p>
            <p className="w-2/3">We will show your chatlogs on this page once you have chats on your bot.</p>
          </div>
        </div>
      : (
        results.map((row)=>(          
          <React.Fragment key={row.id}>
            <div  
              className="flex flex-row w-full cursor-pointer border-y py-6"  
              onClick={() => handleRowClick(row.session_id, row.bot_avatar, row.content, row.id)}  
              onKeyDown={(e) => {  
                if (e.key === 'Enter' || e.key === ' ') {  
                  handleRowClick(row.session_id, row.bot_avatar, row.content, row.id);  
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
      )}
    </div>
  )
}

export default Tickets
