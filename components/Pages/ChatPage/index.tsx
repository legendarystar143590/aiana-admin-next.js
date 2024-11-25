import React, { useEffect, useState, useRef } from "react"
import axios from "axios"
import { v4 as uuidv4 } from "uuid"
import router from "next/router"
import Image from "next/image"
import { FaCaretDown } from "react-icons/fa"
import { useTranslations } from "next-intl"
import { AUTH_API } from "@/components/utils/serverURL"
// import { isTimeBetween } from "@/components/utils/common"
import { customerToast } from "@/components/Toast"
import Spinner from "@/components/Spinner"
import Avatar from "../../Avatar"

// Define the Markdown component outside the ChatPage component


const options: Intl.DateTimeFormatOptions = {
  weekday: "short",
  year: "numeric",
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
  second: "numeric",
}

const ChatPage = ({
  userId,
  userIndex,
  startTime,
  endTime,
  botId,
  botName,
  color,
  avatar,
  visible,
  setVisible,
}) => {
  const  t  = useTranslations('chatbot');
  const toa = useTranslations('toast');
  const ts = useTranslations('chatpage');
  const [messages, setMessages] = useState([
    { id: uuidv4(), isBot: true, text: `${t('Hello_How_can_I_assist_you_today')}` },
  ])
  const lang = 10
  const inputRef = useRef(null)
  const [botAvatar, setBotAvatar] = useState("")
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isBook, setIsBook] = useState(false)
  const [visibleClass, setVisibleClass] = useState("h-[0px]")
  const messagesEndRef = useRef(null)
  const [sessionId, setSessionId] = useState("")
  const [showYesNo, setShowYesNo] = useState(false)
  const [showForm, setShowForm] = useState(false) // State to manage whether to show the form
  const [email, setEmail] = useState("") // State to store email input
  const [content, setContent] = useState("") // State to store content input

  useEffect(() => {
    if (visible) {
      setVisibleClass("h-[600px]")
      setBotAvatar(avatar === "" ? "/images/logo_sm.png" : avatar)
      const session = uuidv4().toString()
      setSessionId(session)
      setMessages([{ id: session, isBot: true, text: `${t('Hello_How_can_I_assist_you_today')}` }])
      inputRef.current.focus()
    } else {
      setVisibleClass("h-[0px]")
    }
  }, [visible])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  

  useEffect(() => {
    scrollToBottom() // Scroll to bottom whenever messages change
    inputRef.current.focus()
  }, [messages])

  const handleSendMessage = () => {
    if (input.trim() === "") return
    setIsLoading(true)
    const newMessage = { id: uuidv4(), text: input, isBot: false }
    setMessages([...messages, newMessage])
    setInput("")

    // if (!isTimeBetween(startTime, endTime)) {
    //   // toast.error(`${toa('Its_not_the_time_to_be_active_for_this_assistant')}`, {
    //   //   position: toast.POSITION.TOP_RIGHT,
    //   // })
    //   // return
    //   console.log(`Time between ${startTime} and ${endTime}`)
    // }
    const createdAt = new Date().toLocaleDateString("en-US", options)

    // console.log(createdAt)
    // const createdAt = currentDateAndTime.toISOString();
    axios
      .post(
        AUTH_API.QUERY,
        { botId, sessionId, website:'https://login.aiana.io', input, userId, createdAt, lang },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Example for adding Authorization header
            "Content-Type": "application/json", // Explicitly defining the Content-Type
          },
        },
      )
      .then((response) => {
        if (response.status === 200) {
          const { message, solve } = response.data
          const botResponse = { id: uuidv4(), text: message.replace(/\n/g, '<br>'), isBot: true }
          
          setMessages((prevMessages) => [...prevMessages, botResponse])
          if (!solve) {
            setShowYesNo(true) // Show the form if solve is false
            setIsBook(true)
          }
        }
        setInput("")
        setIsLoading(false)
      })
      .catch((error) => {
        setInput("")
        if (error.response) {
          console.log("Error status code:", error.response.status)
          console.log("Error response data:", error.response.data)
          if (error.response.status === 401) {
            customerToast({type:'error', title: `${toa('Session_Expired_Please_log_in_again')}`, content: ""})
            router.push("/signin")
          }
          // Handle the error response as needed
        } else if (error.request) {
          // The request was made but no response was received
          console.log("Error request:", error.request)
          customerToast({type:'error', title: `${error.request}`, content: ""})
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log("Error message:", error.message)
          customerToast({type:'error', title: `${error.message}`, content: ""})
        }
        setIsLoading(false)
      })
  }

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      if (event.ctrlKey) {
        event.preventDefault()
        setInput((prev) => `${prev}\n`)
      } else {
        event.preventDefault() // Prevent the default newline behavior
        handleSendMessage()
      }
    }
  }

  const handleYesClick = () => {
    setShowForm(true) // Show the form when user clicks "Yes"\
    setShowYesNo(false)
  }

  const handleNoClick = () => {
    setShowYesNo(false)
    setIsBook(false)
  }

  const handleCancelClick = () => {
    setShowForm(false) // Hide the form when user clicks "Cancel"
    setIsBook(false)
  }

  const handleOkayClick = () => {
    if (email === "" || content === "") {
      customerToast({type:'error', title: `${toa('Please_provide_an_email_and_content')}`, content: ""})
      return
    }
    // Logic to handle the form submission (e.g., send email and content to backend)
    setShowForm(false) // Hide the form after submission
    setIsBook(false)
    const createdAt = new Date().toLocaleDateString("en-US", options)

    axios
      .post(
        AUTH_API.BOOK,
        { userIndex, sessionId, botId, email, content, website: null, createdAt },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Example for adding Authorization header
            "Content-Type": "application/json", // Explicitly defining the Content-Type
          },
        },
      )
      .then((response) => {
        if (response.status === 201) {
          const { message } = response.data
          if (message === "success") {
            customerToast({type:'success',title:`${toa('Successfully_Booked')}`, content:''})
          } else {
            customerToast({type:'error', title: `${toa('Busy_Network_Try_again')}`, content: ""})
          }
          setEmail("")
          setContent("")
        }
        setInput("")
        setIsLoading(false)
      })
      .catch((error) => {
        setInput("")
        setEmail("")
        setContent("")
        if (error.response) {
          console.log("Error status code:", error.response.status)
          console.log("Error response data:", error.response.data)
          if (error.response.status === 401) {
            customerToast({type:'error', title: `${toa('Session_Expired_Please_log_in_again')}`, content: ""})
            router.push("/signin")
          }
          // Handle the error response as needed
        } else if (error.request) {
          // The request was made but no response was received
          console.log("Error request:", error.request)
          customerToast({type:'error', title: `${error.request}`, content: ""})
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log("Error message:", error.message)
          customerToast({type:'error', title: `${error.message}`, content: ""})          
        }
        setIsLoading(false)
      })
  }

  return (
    <div
      className={`sm:w-[400px] w-full transition-all rounded-md duration-300 ease-in-out absolute right-0 bottom-0 border-solid border-2 flex flex-col overflow-auto bg-white ${visibleClass}`}
    >
      <div className="relative h-[70px] flex">
        <div
          className="w-full flex justify-between items-center p-3"
          style={{ backgroundColor: color }}
        >
          <div className="flex items-center">
            <Avatar src={botAvatar} name="bot avatar" className="mr-2 size-12 rounded-full" />
            <h3 className="ml-2 text-[16px] font-bold text-white">{botName}</h3>
          </div>
          <button type="button" aria-label="hidden" className="w-8" onClick={() => setVisible(false)}>
            <FaCaretDown />
          </button>
        </div>
      </div>
      <hr className="mb-2 font-bold" />
      <div className="overflow-auto flex flex-col flex-grow space-y-2 p-2">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`p-2 flex gap-3 ${message.isBot ? "" : "justify-end"}`}
            style={{
              maxWidth: "90%",
              alignSelf: message.isBot ? "flex-start" : "flex-end",
            }}
          >
            <Avatar
              src={message.isBot ? botAvatar : "/images/logo_sm.png"}
              name="avatar"
              className={`rounded-full size-12 ${!message.isBot && "hidden"}`}
            />

            <div
              className={`flex gap-2 p-2 rounded-lg break-words ${
                message.isBot
                  ? "bg-[#EBEBEB] text-[#070E0B]"
                  : "flex-row-reverse bg-[#A536FA] text-white"
              }`}
            >
              <div
                className="flex-grow"
                style={{ textAlign: message.isBot ? "left" : "right", overflowWrap: "break-word" }}
                dangerouslySetInnerHTML={{ __html: message.text }}
              />
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      {showYesNo && (
        <div className="flex justify-center mt-2">
          <button
            type="button"
            className="mr-2 py-2 px-4 text-white bg-[#A536FA]"
            onClick={handleYesClick}
          >
            {ts('Yes')}
          </button>
          <button
            type="button"
            className="py-2 px-4 text-[#A536FA] border-[#A536FA] border"
            onClick={handleNoClick}
          >
            {ts('No')}
          </button>
        </div>
      )}
      {showForm && (
        <div className="p-4 mt-2">
          <p className="text-center text-[#070E0B]">
            {ts('Please_provide_your_email_and_content_to_book_a_ticket')}
          </p>
          <input
            type="email"
            placeholder="Email"
            className="w-full mb-2 p-2 border border-gray-300 rounded-md"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <textarea
            placeholder="Content"
            className="w-full mb-2 p-2 border border-gray-300 rounded-md"
            rows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <div className="flex justify-end">
            <button
              type="button"
              className="mr-2 py-2 px-4 text-white bg-[#A536FA]"
              onClick={handleOkayClick}
            >
              {ts('Okay')}
            </button>
            <button
              type="button"
              className="py-2 px-4 text-[#A536FA] border-[#A536FA] border"
              onClick={handleCancelClick}
            >
              {ts('Cancel')}
            </button>
          </div>
        </div>
      )}
      <div className="flex p-2 h-16">
        <div className="relative w-full">
          <textarea
            id="input"
            className="w-full h-full h-15 pt-3 pr-10 border border-gray-300 rounded-md"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading || isBook}
            ref={inputRef}
            style={{ whiteSpace: 'pre-wrap' }}
          />
          <button type="button" className="absolute bottom-1/2 translate-y-1/2 flex right-3 items-center" onClick={handleSendMessage}>
            {isLoading ? <Spinner color="#A536FA" /> : <Image src="/images/icon_send.svg" alt="send" width={20} height={20} />}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ChatPage
