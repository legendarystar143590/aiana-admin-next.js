import { useState, useEffect, useRef } from 'react'
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import Image from 'next/image';
import { AUTH_API } from '@/components/utils/serverURL';
import { customerToast } from '../Toast';
import Spinner from '../Spinner';
import { setExpiryTime } from '../utils/common';

const options: Intl.DateTimeFormatOptions = {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric'
};

const ChatBot = ({ userIndex, botId, website }) => {

    const INITIAL_BOT_OBJ = {
        id: "",
        index: "",
        name: "",
        avatar: "",
        color: "",
    }

    const [messages, setMessages] = useState([
        { id: uuidv4(), isBot: true, text: "Hello! How can I assist you today?" }
    ]);
    const [isError, setIsError] = useState(false)
    const [isVisible, setIsVisible] = useState(false)
    const [bot, setBot] = useState(INITIAL_BOT_OBJ);
    const [userId, setUserId] = useState("");
    const [input, setInput] = useState("");
    // const [startTime, setStartTime] = useState("");
    // const [endTime, setEndTime] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isBook, setIsBook] = useState(false)
    const [visibleClass, setVisibleClass] = useState("hidden");
    const messagesEndRef = useRef(null);
    const [sessionId, setSessionId] = useState("");
    const [showYesNo, setShowYesNo] = useState(false);
    const [showForm, setShowForm] = useState(false); // State to manage whether to show the form
    const [email, setEmail] = useState(""); // State to store email input
    const [content, setContent] = useState(""); // State to store content input
    const lang = 10;

    const toggleChatbot = () => {
        setIsVisible(!isVisible);  // Toggle the visibility state
    };

    useEffect(() => {
        window.parent.postMessage({ type: 'VISIBILITY_CHANGE', isVisible }, '*');
    }, [isVisible])

    useEffect(() => {
        if (isVisible) {
            setVisibleClass("");
            const session = uuidv4().toString();
            setSessionId(session);
            setMessages([
                { id: session, isBot: true, text: "Hello! How can I assist you today?" }
            ]);
        } else {
            setVisibleClass("hidden");
        }
        const requestOptions = {
            headers: new Headers({
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': "1",
            })
        };
        if (botId !== undefined) {
            setIsLoading(true)

            fetch(`${AUTH_API.GET_CHATBOT}?botIndex=${botId}&userIndex=${userIndex}`, requestOptions)
                .then(response => response.json())
                .then(data => {
                    setBot({ id: data.bot.id, name: data.bot.name, avatar: data.bot.avatar === "" ? "/images/users/avatar-2.jpg" : data.bot.avatar, color: data.bot.color, index: botId })
                    setUserId(data.bot.user_id);
                    // setStartTime(data.bot.start_time);
                    // setEndTime(data.bot.end_time);
                    setIsLoading(false);
                    setExpiryTime();
                })
                .catch(error => {
                    setIsError(true)
                    if (error.response) {
                        console.log('Error status code:', error.response.status);
                        console.log('Error response data:', error.response.data);
                        // Handle the error response as needed
                    } else if (error.request) {
                        // The request was made but no response was received
                        console.log('Error request:', error.request);
                        // toast.error(error.request, { position: toast.POSITION.BOTTOM_RIGHT });

                    } else {
                        // Something happened in setting up the request that triggered an Error
                        console.log('Error message:', error.message);
                        // toast.error(error.message, { position: toast.POSITION.BOTTOM_RIGHT });

                    }
                    setIsLoading(false);
                });
        }
    }, [isVisible, botId]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom(); // Scroll to bottom whenever messages change
    }, [messages]);

    const handleSendMessage = () => {
        if (input.trim() === "") return;
        setIsLoading(true);
        const newMessage = { id: uuidv4(), text: input, isBot: false };
        setMessages([...messages, newMessage]);
        setInput("");

        // if (!isTimeBetween(startTime, endTime)) {
        //     customerToast({type:'error', title: "It's not the time to be active for this assistant!", content: ""})
        //     setIsLoading(false);
        //     return;
        // }
        const createdAt = new Date().toLocaleDateString('en-US', options);
        // console.log("Here>>>>>>",createdAt)
        axios.post(AUTH_API.QUERY, { botId: bot.id, website, sessionId, input, userId, createdAt, lang })
            .then((response) => {
                if (response.status === 200) {
                    const { message, solve } = response.data;
                    const botResponse = { id: uuidv4(), text: message.replace(/\n/g, '<br>'), isBot: true };
                    setMessages(prevMessages => [...prevMessages, botResponse]);
                    if (!solve) {
                        setShowYesNo(true); // Show the form if solve is false
                        setIsBook(true);
                    }
                    setExpiryTime();
                }
                setInput("");
                setIsLoading(false);
            })
            .catch((error) => {
                setInput("");
                if(error.response && error.response.status === 403){
                    if(error.response.data.message === "Unregistered domain") {
                        customerToast({type:'error', title: "Unregistered domain!", content: ""})
                    } else {
                        customerToast({type:'error', title: "You need to upgrade to ask more questions to the bot", content: ""})
                    }
                }
                if (error.response) {
                    console.log('Error status code:', error.response.status);
                    console.log('Error response data message:', error.response.data.message);
                    // Handle the error response as needed
                } else if (error.request) {
                    // The request was made but no response was received
                    console.log('Error request:', error.request);
                    customerToast({type:'error', title: `${error.request}`, content: ""})

                } else {
                    // Something happened in setting up the request that triggered an Error
                    console.log('Error message:', error.message);
                    customerToast({type:'error', title: `${error.message}`, content: ""})

                }
                setIsLoading(false);
            });
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            if (event.ctrlKey) {
                event.preventDefault();
                setInput(prev => `${prev}\n`);
            } else {
                event.preventDefault(); // Prevent the default newline behavior
                handleSendMessage();
            }
        }
    };

    const handleYesClick = () => {
        setShowForm(true); // Show the form when user clicks "Yes"\
        setShowYesNo(false);
    };

    const handleNoClick = () => {
        setShowYesNo(false);
        setIsBook(false);
    };

    const handleCancelClick = () => {
        setShowForm(false); // Hide the form when user clicks "Cancel"
        setIsBook(false);
    };

    const handleOkayClick = () => {
        if (email === "" || content === "") {
            customerToast({type:'error', title: "Please provide an email and content!", content: ""})
            return;
        }
        // Logic to handle the form submission (e.g., send email and content to backend)
        setShowForm(false); // Hide the form after submission
        setIsBook(false);
        const createdAt = new Date().toLocaleDateString('en-US', options);

        axios.post(AUTH_API.BOOK, { userIndex, sessionId, botId: bot.id, email, content, website, createdAt })
            .then((response) => {
                if (response.status === 201) {
                    const { message } = response.data;
                    if (message === 'success') {
                        customerToast({type:'success',title:'Successfully Booked!', content:''})
                    } else {
                        customerToast({type:'error', title: "Busy Network! Try again!", content: ""})
                    }
                    setEmail("")
                    setContent("")
                    setExpiryTime();
                }
                setInput("");
                setIsLoading(false);
            })
            .catch((error) => {
                if (error.response) {
                    console.log('Error status code:', error.response.status);
                    console.log('Error response data:', error.response.data);
                    // Handle the error response as needed
                } else if (error.request) {
                    // The request was made but no response was received
                    console.log('Error request:', error.request);
                    customerToast({type:'error', title: `${error.request}`, content: ""})

                } else {
                    // Something happened in setting up the request that triggered an Error
                    console.log('Error message:', error.message);
                    customerToast({type:'error', title: `${error.message}`, content: ""})
                }
                setInput("");
                setEmail("");
                setContent("");
            });
    };

    if (isError) {
        return null;
    }

    return (
        <div style={{ position: 'fixed', zIndex: '1000', borderRadius: '5px' }}>

            {isVisible ? (
                <div
                    className={`flex flex-col overflow-auto rounded-2xl ${visibleClass}`}
                    style={{
                        height: '610px',
                        width: '410px',
                        background: `linear-gradient(to bottom, ${bot.color}, white)`,
                        border: '1px solid #ccc',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                    }}>
                    <div className='w-full h-full flex flex-col flex-grow' id="chat-form">
                        <div className="relative h-[70px] flex items-center w-full ">
                            <div className="w-full bg-none flex justify-between items-center mx-4">
                                <div className="h-full flex items-center">
                                    <img className='w-10 h-10 rounded-full' src={bot.avatar} alt="bot avatar" />
                                    <div className='ml-1'>{bot.name}</div>
                                </div>
                                <button
                                    className='flex w-8 h-8 rounded-full bg-white items-center justify-center text-center' 
                                    onClick={() => setIsVisible(!isVisible)}
                                    type='button' aria-label="Toggle Chatbot">
                                    ✕
                                </button>
                            </div>
                        </div>
                        <div className="overflow-auto flex flex-col flex-grow mt-1 mx-2 space-y-2 bg-white rounded-2xl shadow">
                            {messages.map((message) => (
                                <div
                                    key={message.id}
                                    className={`p-2 rounded-lg text-black flex items-center ${message.isBot ? '' : 'justify-end'}`}
                                    style={{
                                        maxWidth: '70%',
                                        alignSelf: message.isBot ? 'flex-start' : 'flex-end',
                                        wordWrap: 'break-word'
                                    }}
                                >
                                    <div className={`flex gap-2 ${message.isBot ? '' : 'flex-row-reverse'} items-center`}>
                                        <img
                                            src={message.isBot ? bot.avatar : "/images/logo_short_black.jpg"}
                                            alt="avatar"
                                            className={`rounded-full size-12 ${!message.isBot && "hidden"}`}
                                        />
                                        <div
                                            className={`flex gap-2 p-2 rounded-lg break-words ${message.isBot
                                                ? "bg-gray-200 text-[#070E0B] border rounded-md border-gray-300"
                                                : "flex-row-reverse bg-gray-100 text-black border rounded-md border-gray-300"
                                                }`}
                                        >
                                            <div
                                                className="flex-grow"
                                                style={{ textAlign: message.isBot ? "left" : "right", overflowWrap: "break-word", wordBreak:'break-word' }}
                                                dangerouslySetInnerHTML={{ __html: message.text }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                        {showYesNo && (
                            <div className="flex justify-center mt-2">
                                <button className="mr-2 bg-[#1976d2] px-4 h-10" type='button' aria-label="Click Yes" onClick={handleYesClick}>Yes</button>
                                <button className='mr-2 border-[#1976d2] border-[1px] px-4 h-10' type='button' onClick={handleNoClick} aria-label="Click No">No</button>
                            </div>
                        )}
                        {showForm && (
                            <div className="p-4 mt-2">
                                <div className="text-center text-[1.4rem]">Please provide your email and content to book a ticket</div>
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
                                    <button className="mr-2 bg-[#1976d2] px-4 h-10" type='button' aria-label="Click Okay" onClick={handleOkayClick}>Okay</button>
                                    <button className='mr-2 border-[#1976d2] border-[1px] px-4 h-10' type='button' onClick={handleCancelClick} aria-label="Click Cancel">Cancel</button>
                                </div>
                            </div>
                        )}
                        <div className="flex p-2 h-16 relative">
                            <style>
                                {`
                                .custom-input {
                                    width: 100%;
                                    padding: 8px;
                                    font-size: 16px;
                                    border-radius: 4px;
                                    outline: none;
                                    box-sizing: border-box;
                                    position: relative;
                                    z-index: 10;
                                }
                                .custom-input:focus {
                                    box-shadow: none;
                                }
                                `}
                            </style>
                            <textarea
                                id='input'
                                className="custom-input focus:border border-0"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                disabled={isLoading || isBook}
                            />
                            <button type="button" className={`absolute bottom-1/2 translate-y-1/2 flex z-20 rounded-full right-3 items-center ${isLoading ? "":"p-2 bg-black"}`} onClick={handleSendMessage}>
                                {isLoading ? <Spinner color="#A536FA" /> : <img src="/images/buttons/icon_send.png" alt="send" width={20} height={20} />}
                            </button>
                        </div>
                    </div>

                </div>
            ) : (
                <button type='button' aria-label="Toggle Button" onClick={toggleChatbot} style={{
                    cursor: 'pointer',
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    background: `linear-gradient(to bottom, ${bot.color}, white)`,
                    color: 'white',
                    fontSize: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }} >
                    <Image src={bot.avatar ? bot.avatar : "/images/icon_embedding_bot.png"} alt="Chatbot Icon" width={30} height={30} />
                </button>
            )}
        </div>
    )
}

export default ChatBot
