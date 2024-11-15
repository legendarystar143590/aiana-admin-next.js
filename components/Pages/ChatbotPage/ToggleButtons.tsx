import React, {useState} from "react"
import { FaRegTrashAlt, FaEllipsisH } from "react-icons/fa"

const ToggleButton = ({bot, handleDeleteClickButton}) => {
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