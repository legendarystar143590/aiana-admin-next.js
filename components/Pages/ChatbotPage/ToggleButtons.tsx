import React, {useState} from "react"
import { FaEdit, FaLink, FaRegCommentAlt, FaRegTrashAlt, FaEllipsisH } from "react-icons/fa"

const ToggleButton = ({bot, handleEditClickButton, handleEmbedClickButton, handleChatClickButton, handleDeleteClickButton}) => {
    const [open, setOpen] = useState(false)
    return (
        <div className="relative">
            <div>
                <button 
                    type="button" 
                    onClick={()=>setOpen(!open)} 
                    className="flex justify-between items-center w-full shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:border-gray-300" 
                    aria-haspopup="true" 
                    aria-expanded={open}
                    aria-label="icon"
                >
                    {/* {inputValue || 'Select knowledge base'} */}
                    <FaEllipsisH />
                </button>
            </div>
            {
                open && <div className="absolute top-8 z-10 w-full bg-white shadow-lg max-h-60 overflow-auto rounded-md flex flex-col gap-3">
                    <div className="group relative flex justify-center">
                        <button
                            type="button"
                            aria-label="edit-chatbot"
                            className="size-8 text-[12px] rounded-full border-2 border-[#2CA84D] text-[#2CA84D] flex justify-center items-center"
                            onClick={() => handleEditClickButton(bot.id)}
                        >
                            <FaEdit className="w-4 h-4" />
                        </button>
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
                    </div>
                </div>
            }

        </div>
    )
}

export default ToggleButton