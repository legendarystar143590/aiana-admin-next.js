import React, { useEffect, useState, useRef } from "react"
import axios from "axios"
import { v4 as uuidv4 } from "uuid"
import { useRouter } from "next/router"
import { toast } from "react-toastify"
import Image from "next/image"
import { FaChevronDown } from "react-icons/fa"
import { useTranslations } from "next-intl"
import { SketchPicker } from 'react-color';
import { AUTH_API } from "@/components/utils/serverURL"
import CustomSwitch from "../CustomSwitch"
import Avatar from "../Avatar"
import CustomAutocomplete from "../CustomAutocomplete"
import { setExpiryTime, isTimeBetween } from "../utils/common"
import Spinner from "../Spinner"
import SaveChangesButton from "../Buttons/SaveChangeButton"
import CancelButton from "../Buttons/CancelButton"

const options: Intl.DateTimeFormatOptions = {
  weekday: "short",
  year: "numeric",
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
  second: "numeric",
}

const ChatbotForm = ({ bot }) => {
  const colorRef = useRef(null);
  const inputRef = useRef(null)
  const t = useTranslations('chatbot');
  const ts = useTranslations('chatpage');
  const toa = useTranslations('toast');
  const lang = 10;
  const [nameInputValue, setNameInputValue] = useState("")
  const [active, setActive] = useState(false)
  const [knowledgeBase, setKnowleBase] = useState("")
  const [avatar, setAvatar] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState(null)
  const [timeFrom, setTimeFrom] = useState("09:00")
  const [timeUntil, setTimeUntil] = useState("17:00")
  const [themeColor, setThemeColor] = useState("#703e46")
  const [isLoading, setIsLoading] = useState(false)
  const [bases, setBases] = useState([])
  const [knowledgeBases, setKnowledgeBases] = useState([])
  const [isPickerOpen, setPickerOpen] = useState(false)
  const [isSaved, setIsSaved] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [urlInputValue, setUrlInputValue] = useState("")
  const [isInitialMessaged, setIsInitialMessaged] = useState("")
  const [isSuggestedMessaged, setIsSuggestedMessaged] = useState("")
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState([
    { id: uuidv4(), isBot: true, text: `${t('Hello_How_can_I_assist_you_today')}` },
  ])
  const messagesEndRef = useRef(null)
  const [showYesNo, setShowYesNo] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [email, setEmail] = useState("") // State to store email input
  const [content, setContent] = useState("")
  const [sessionId, setSessionId] = useState("")
  const [isBook, setIsBook] = useState(false)
  const [userIndex, setUserIndex] = useState("")
  const [isAnswerLoading, setIsAnswerLoading] = useState(false)
  const [registeredWebsite, setRegisteredWebsite] = useState("")

  const router = useRouter()
  // console.log("inner >>>", bot)
  const [index, setIndex] = useState(-1)
  const [userId, setUserId] = useState(null)

  const handleColorChange = (color) => {
    setThemeColor(color.hex)
    setIsSaved(false)
  }

  useEffect(() => {
    setUserIndex(localStorage.getItem("userIndex"))
    const handleClickOutside = (event: MouseEvent) => {
      if (colorRef.current && !colorRef.current.contains(event.target as Node)) {
        setPickerOpen(false);
      }
    };
  
    if (typeof window !== 'undefined') {
      document.addEventListener("mousedown", handleClickOutside);
    }
  
    // Return a cleanup function, even if it's a no-op
    return () => {
      if (typeof window !== 'undefined') {
        document.removeEventListener("mousedown", handleClickOutside);
      }
    };
  }, []);
  // Fetch knowledge bases when component mounts
  useEffect(() => {
    if (bot === "-1") {  
      setMessages([]); // Clear messages when bot is "-1"
    } 
    setIsLoading(true)
    const userID = localStorage.getItem("userID")
    setUserId(userID)
    const requestOptions = {
      headers: new Headers({
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "1",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      }),
    }

    if (userID) {
      fetch(`${AUTH_API.CHATBOT_DATA}?userId=${userID}&botId=${bot}`, requestOptions)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`)
          }
          setExpiryTime();
          return response.json()
        })
        .then((data) => {
          setBases(data.knowledge)
          const knowldgeBases = data.knowledge
          // console.log(data.bot_data.name)
          if (data.bot_data !== "-1") {
            setNameInputValue(data.bot_data.name)
            setActive(data.bot_data.active)
            setKnowleBase(data.bot_data.knowledge_base !== "-1" ? data.bot_data.knowledge_base : "")
            const i = knowldgeBases.findIndex((base) => base.name === data.bot_data.knowledge_base)
            // console.log("Index >>>>>", i)
            setIndex(i)
            setThemeColor(data.bot_data.color)
            setAvatarPreview(data.bot_data.avatar)
            setTimeFrom(data.bot_data.start_time)
            setTimeUntil(data.bot_data.end_time)
            setUrlInputValue(data.website.domain)
            setRegisteredWebsite(data.website.domain)            
            // setIsLoading(false);
          }
          setIsLoading(false)
        })
        .catch((error) => {
          setIsSaving(false)
          console.log("Error creating a new bot :", error.message)
          if (error.message.includes("401")) {
            toast.error(`${toa('Session_Expired_Please_log_in_again')}`, {
              position: toast.POSITION.TOP_RIGHT,
            })
            router.push("/signin")
          } else {
            toast.error(`${toa('An_error_occurred_while_fetching_data')}`, {
              position: toast.POSITION.TOP_RIGHT,
            })
          }
        })
      const session = uuidv4().toString()
      setSessionId(session)
    }
  }, [bot]) // Empty dependency array means this effect will only run once after the initial render

  useEffect(() => {
    if (bases) {
      setKnowledgeBases(bases.map((base) => base.name))
    }
  }, [bases ? bases.length : undefined])

  const handleAvatarChange = (event) => {
    const file = event.target.files && event.target.files[0]
    setAvatar(file)
    const reader = new FileReader()

    reader.onload = () => {
      setAvatarPreview(reader.result)
    }

    if (file) {
      setIsSaved(false)
      reader.readAsDataURL(file)
    }
  }

  const handleSwitchChange = () => {
    setActive((prevActive) => !prevActive) // Toggle the value of active
    setIsSaved(false)
  }

  const handleTimeFromChange = (event) => {
    setTimeFrom(event.target.value)
    setIsSaved(false)
  }

  const handleTimeUntilChange = (event) => {
    setTimeUntil(event.target.value)
    setIsSaved(false)
  }

  const handleNameChange = (event) => {
    setNameInputValue(event.target.value)
    setIsSaved(false)
  }

  const handleUrlChange = (event) => {
    setUrlInputValue(event.target.value)
    setIsSaved(false)
  }

  const handleKnowledgeBaseChange = (value) => {
    // Find the index of the selected value in the bases array
    const selectedIndex = bases.findIndex((base) => base.name === value)

    // Check if a matching base was found
    if (selectedIndex !== -1) {
      // Set the name of the knowledge base
      setKnowleBase(bases[selectedIndex].name)
      // Update the index state with the found index
      setIndex(selectedIndex)
      setIsSaved(false)
    } else {
      // Handle the case where no matching base was found
      console.error("No matching base found for the selected value:", value)
    }
  }

  const isValidName = (name: string): boolean => {
    console.log("name checker")
    // Check if name is not empty, starts with a letter, ends with a letter, and contains only letters and spaces
    return /^[A-Za-z][A-Za-z\s]*[A-Za-z]$/.test(name.trim());
  };

  const handleSubmit = async () => {
    toast.dismiss() // Dismiss any existing toasts
    const formData = new FormData()
    if (nameInputValue === "" || knowledgeBase === "") {
      toast.error(`${toa('Name_and_Knowledge_Base_are_required')}`, { 
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000, // Close after 3 seconds
      })
      return
    }

    if (!isValidName(nameInputValue)) {
      toast.error(`${toa('Name_must_start_and_end_with_a_letter_and_contain_only_letters_and_spaces')}`, { 
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
      });
      return
    }
    const website = {
      domain: urlInputValue,
      uniqueId: uuidv4().toString(),
    }
    setIsSaving(true);
    formData.append("name", nameInputValue)
    formData.append("avatar", avatar)
    formData.append("color", themeColor)
    formData.append("active", active !== undefined ? active.toString() : "false")
    formData.append("start_time", timeFrom)
    formData.append("end_time", timeUntil)
    formData.append("website_domain", website.domain)
    formData.append("website_unique_id", website.uniqueId)
    if (index === -1) {
      formData.append("knowledge_base", "-1")
    } else {
      formData.append("knowledge_base", bases[index].unique_id)
    }
    formData.append("user_id", userId)

    try {
      let API_URL = ""
      if (bot !== "-1") {
        API_URL = `${AUTH_API.UPDATE_CHATBOT}?botId=${bot}`
      } else {
        API_URL = AUTH_API.CREATE_BOT
      }
      await axios.post(API_URL, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      })

      setExpiryTime();
      setIsSaved(true);
      setIsSaving(false);
      toast.success(`${ bot === "-1" ? toa('Successfully_Created') : toa('Successfully_updated')}`, { 
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000, // Close after 3 seconds
      })
      setRegisteredWebsite(website.domain)
    } catch (error) {
      setExpiryTime();
      setIsSaving(false)
      if(error.response && error.response.status === 403){

        toast.error(`${ bot === "-1" ? 'You need to upgrade to create more bots' : toa('Successfully_updated')}`, { 
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 3000, // Close after 3 seconds
        })
      }
      if (error.response && error.response.status === 401) {
        // Redirect to the sign-in page if the response status is 401
        router.push("/signin")
      }
    }
  }

  const handleSendMessage = () => {
    if (bot === "-1") return
    if (input.trim() === "") return
    setIsAnswerLoading(true)
    const newMessage = { id: uuidv4(), text: input, isBot: false }
    setMessages([...messages, newMessage])
    setInput("")

    if (!isTimeBetween(timeFrom, timeUntil)) {
      // toast.error(`${toa('Its_not_the_time_to_be_active_for_this_assistant')}`, {
      //   position: toast.POSITION.TOP_RIGHT,
      // })
      // return
      console.log(`Time between ${timeFrom} and ${timeUntil}`)
    }
    const createdAt = new Date().toLocaleDateString("en-US", options)

    // console.log(createdAt)
    // const createdAt = currentDateAndTime.toISOString();
    const botId = bot;
    axios
      .post(
        AUTH_API.QUERY,
        // { botId, sessionId, website:'https://login.aiana.io', input, userId, createdAt, lang },
        { botId, sessionId, website:registeredWebsite ||'https://login.aiana.io', input, userId, createdAt, lang },
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
          // console.log("Bot response:", registered_website)
          setMessages((prevMessages) => [...prevMessages, botResponse])
          if (!solve) {
            setShowYesNo(true) // Show the form if solve is false
            setIsBook(true)
          }
        }
        setInput("")
        setIsAnswerLoading(false)
      })
      .catch((error) => {
        setInput("")
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
        setIsAnswerLoading(false)
      })
  }

  const handleYesClick = () => {
    setShowForm(true) // Show the form when user clicks "Yes"\
    setShowYesNo(false)
  }

  const handleNoClick = () => {
    setShowYesNo(false)
    setIsBook(false)
  }

  const handleOkayClick = () => {
    if (email === "" || content === "") {
      toast.error(`${toa('Please_provide_an_email_and_content')}`, { position: toast.POSITION.TOP_RIGHT })
      return
    }
    // Logic to handle the form submission (e.g., send email and content to backend)
    setShowForm(false) // Hide the form after submission
    setIsBook(false)
    const createdAt = new Date().toLocaleDateString("en-US", options)

    axios
      .post(
        AUTH_API.BOOK,
        { userIndex, sessionId, bot, email, content, website: null, createdAt },
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
            toast.success(`${toa('Successfully_Booked')}`, { position: toast.POSITION.TOP_RIGHT })
          } else {
            toast.error(`${toa('Busy_Network_Try_again')}`, { position: toast.POSITION.TOP_RIGHT })
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

  const handleCancelClick = () => {
    router.push("/chatbot")
  }

  if (isLoading) {
    return <div>{t('Loading')}</div>
  }

  return (
    <div className="h-full w-full mx-auto">
      <div className="w-full h-full flex flex-col gap-4">
        <div className="flex flex-col w-full items-center">
          <input
            className="w-full rounded-lg p-2 text-xl font-bold border-none focus:ring-0"
            type="text"
            value={nameInputValue}
            onChange={handleNameChange}
            placeholder="Enter Bot Name"
          />
        </div>
        <div className="bg-none w-full h-full flex md:flex-row flex-col gap-4 overflow-auto">          
          <div className="p-4 gap-4 flex flex-col w-1/2 border border-[#CFCFCF] rounded-lg h-full overflow-y-auto">
            <div className="flex flex-col">
              <div className="flex flex-col">
                <CustomSwitch value={active} onChange={handleSwitchChange} />
              </div>
            </div>
            <div className="flex flex-col w-full gap-2">
              <p className="font-bold">{t('Knowledge_Base')}</p>
              <CustomAutocomplete currentValue={knowledgeBase} options={knowledgeBases || []} onChange={(value) => handleKnowledgeBaseChange(value)} />
            </div>
            <div className="flex flex-col gap-2">
              <p className="font-bold">{t('Website_URL')}</p>
              <input 
                id="urlInput"
                type="text" 
                value={urlInputValue}
                onChange={handleUrlChange}
                className="py-2 text-base rounded-md border-[#CFCFCF]" 
                placeholder="e.g. www.aiana.com" 
              />
            </div>
            <div className="flex flex-col gap-2">
              <p className="font-bold">{t('Initial_Messages')}</p>
              <textarea
                id="initialmessage"
                value={isInitialMessaged}
                onChange={(e) => setIsInitialMessaged(e.target.value)}
                className="w-full border border-[#D9D9D9] h-12 rounded-md"                
              />
            </div>
            <div className="flex flex-col gap-2">
              <p className="font-bold">{t('Suggested_Messages')}</p>
              <textarea
                id="suggestedmessage"
                value={isSuggestedMessaged}
                onChange={(e) => setIsSuggestedMessaged(e.target.value)}
                className="w-full border border-[#D9D9D9] h-12 rounded-md"  
                placeholder={t("Hello_this_is_your_bot_let_me_know_what_I_can_help_you_with")}           
              />
            </div>
            <div className="flex flex-row max-lg:flex-col w-full gap-8">
              <div className="flex flex-col justify-between md:w-1/2 w-full">
                <div>
                  <p className="font-bold">{t('Timing')}</p>
                </div>
                <div className="flex flex-row w-full mt-2 gap-2">
                  <input type="time" value={timeFrom} onChange={handleTimeFromChange} className="w-1/2 rounded-md border-[#CFCFCF]" />
                  <input
                    type="time"
                    value={timeUntil}
                    onChange={handleTimeUntilChange}
                    className="w-1/2 rounded-md border-[#CFCFCF]"
                  />
                </div>

              </div>
              <div className="flex flex-col justify-between md:w-1/2 w-full relative">
                <div className="flex flex-col">
                  <p className="font-bold mb-2 sm:mt-0 mt-4">{t('Color')}</p>
                </div>
                <div className="w-full flex">
                  {
                    isPickerOpen ? (
                      <div className="absolute top-12 left-0" ref={colorRef} >
                        <SketchPicker color={themeColor} onChangeComplete={handleColorChange} />
                      </div>
                    )
                      : (
                        <button aria-label="color-picker" type="button" onClick={() => setPickerOpen(true)} className="flex p-1 rounded-md border border-[#CFCFCF] justify-between items-center w-full">
                          <div className="rounded-md size-8" style={{ backgroundColor: themeColor }} />
                          <FaChevronDown />
                        </button>
                      )
                  }
                </div>
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex flex-col">
                <p className="font-bold">{t('Avatar')}</p>
              </div>
              <div className="flex items-center gap-4">
                <input
                  accept="image/*"
                  style={{ display: "none" }}
                  id="avatar-upload"
                  type="file"
                  onChange={handleAvatarChange}
                />
                <label htmlFor="avatar-upload">
                  <div
                    className="bg-white hover:bg-gray-200 border cursor-pointer text-black py-2 px-4 rounded-md"
                  >
                    <p className="text-sm">+ {t('Choose_File')}</p>
                  </div>
                </label>
                {avatarPreview && (
                  <div className="flex flex-col justify-center items-center">
                    <Avatar src={avatarPreview} name={nameInputValue} className="size-20 rounded-full" />
                  </div>
                )}
              </div>
            </div>            
          </div>
          <div className="p-4 flex flex-col w-1/2 border border-[#CFCFCF] rounded-lg h-full overflow-y-auto">
            <div
              className="w-full h-full transition-all rounded-md duration-300 ease-in-out border-solid border-2 flex flex-col overflow-auto bg-white"
            >
              <div className="flex">
                <div
                  className="w-full flex justify-between items-center p-3"
                  style={{ backgroundColor: themeColor }}
                >
                  <div className="flex items-center">
                    <Avatar src={avatarPreview || "/images/logo_short_black.png"} name="bot avatar" className="mr-2 size-12 rounded-full" />
                    <h3 className="ml-2 text-[16px] font-bold text-white">{nameInputValue || "My Bot"}</h3>
                  </div>
                </div>
              </div>
              <hr className="mb-2 font-bold" />
              <div className="overflow-auto flex flex-col flex-grow space-y-2 p-2">
                {messages && messages.map((message) => (
                  <div
                    key={message.id}
                    className={`p-2 flex gap-3 ${message.isBot ? "" : "justify-end"}`}
                    style={{
                      maxWidth: "90%",
                      alignSelf: message.isBot ? "flex-start" : "flex-end",
                    }}
                  >
                    <Avatar
                      src={message.isBot ? avatarPreview || "/images/logo_short_black.png" : "/images/logo_short_black.png"}
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
                    disabled={isAnswerLoading || isBook}
                    ref={inputRef}
                    style={{ whiteSpace: 'pre-wrap' }}
                  />
                  <button type="button" className="absolute bottom-1/2 translate-y-1/2 flex bg-black p-2 rounded-full right-3 items-center" onClick={handleSendMessage}>
                    {isAnswerLoading ? <Spinner color="#A536FA" /> : <Image src="/images/buttons/icon_send.png" alt="send" width={20} height={20} />}
                  </button>
                </div>
              </div>
            </div>
          </div>          
        </div>
        <div className="w-full flex sm:flex-row flex-col-reverse items-center justify-end gap-5">
          <CancelButton handleCancelClick={handleCancelClick} t={t} />
          <SaveChangesButton isSaved={isSaved} isSaving={isSaving} handleSubmit={handleSubmit} t={t} />
        </div>
      </div>
    </div>
  )
}

export default ChatbotForm
