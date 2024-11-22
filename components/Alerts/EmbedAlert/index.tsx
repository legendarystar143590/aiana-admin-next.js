import { useTranslations } from "next-intl"
import Image from "next/image"
import axios from "axios"
import { useRouter } from "next/router"
import React, { useState } from "react"
import { AUTH_API } from "@/components/utils/serverURL"
import { isValidUrl } from "@/components/Pages/KnowledgeBasePage/validation"
import Spinner from "@/components/Spinner"
import { setExpiryTime } from "@/components/utils/common"
import { customerToast } from "@/components/Toast"
import { v4 as uuidv4 } from 'uuid';


interface WebsiteObject {
  created_at: string
  id: number
  index:string
  botId: number
  userId:number
  domain: string
}

export default function EmbedAlert({ open, setOpen, description, handleCopy, botId, setRegisteredWebsite }) {
  const [urlInputValue, setUrlInputValue] = useState("")
  const t = useTranslations('common');
  const tk = useTranslations('knowledge');
  const toa = useTranslations('toast');
  const router = useRouter();
  const [index, setIndex] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)
  const [isDeleting, setIsDeleting] = React.useState(false)
  // const router = useRouter()

    const [urls, setUrls] = useState<WebsiteObject[]>([])
    const alertRef = React.useRef(null)
    
    React.useEffect(() => {
      const userID = localStorage.getItem("userID")
      
      const requestOptions = {
        headers: new Headers({
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "1",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Example for adding Authorization header
        }),
      }
      if (userID && userID !== "") {
        setIsLoading(true)
        console.log("Bot ID here", botId)

        fetch(`${AUTH_API.GET_WEBSITES}?botId=${botId}`, requestOptions)
          .then((response) => {
            if (response.status === 401) {
              // Handle 401 Unauthorized
              customerToast({type:'error',title:`${toa('Session_Expired_Please_log_in_again')}`, content:''})
              setIsLoading(false) // Ensure loading state is updated
              router.push("/signin") // Redirect to sign-in page
            }
            setExpiryTime();
            setIsLoading(false)
            return response.json() // Continue to parse the JSON body
          })
          .then((data) => {
            // console.log(data)
            setUrls(data)
            setIsLoading(false)
          })
          .catch((error) => {
            if (error.response) {
              console.log("Error status code:", error.response.status)
              console.log("Error response data:", error.response.data)
              if (error.response.status === 401) {
                customerToast({type:'error',title:`${toa('Session_Expired_Please_log_in_again')}`, content:''})

                router.push("/signin")
              }
              // Handle the error response as needed
            } else if (error.request) {
              // The request was made but no response was received
              console.log("Error request:", error.request)
              customerToast({type:'error',title:`${error.request}`, content:''})
            } else {
              // Something happened in setting up the request that triggered an Error
              console.log("Error message:", error.message)
              customerToast({type:'error',title:`${error.message}`, content:''})
            }
            setIsLoading(false)
          })
      }
    }, [botId])

    // const title = "To embed your chatbot onto your website, paste this snippet into your website's HTML file";
    const title =
      `${t('To_add_a_chatbubble_to_the_bottom_right_of_your_website_add_this_script_tag_to_your_html')}`

    const handleUrlAdd = async () => {
      // console.log(botId)
      const userId = localStorage.getItem("userID");
      if (isValidUrl(urlInputValue)) {
        if (urls.length > 0) {
          customerToast({type:'error',title:`${toa('Bot_already_has_weebsite')}`, content:''})
        }
        else {
          const existingUrl = urls.find(url => url.domain === urlInputValue);
          if (existingUrl) {
            customerToast({type:'error',title:`${toa('URL_already_exist')}`, content:''})
          } else {
            const newWebsite: WebsiteObject = {
              created_at: new Date().toISOString(),
              id:0,
              index: uuidv4(),
              domain: urlInputValue,
              userId:parseInt(userId, 10),
              botId
            };
          setIsLoading(true)
          await axios
          .post(
            AUTH_API.ADD_WEBSITE,
            { index:newWebsite.index, userId, botId, domain:urlInputValue },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`, // Example for adding Authorization header
                "Content-Type": "application/json", // Explicitly defining the Content-Type
                "ngrok-skip-browser-warning": "1",
              },
            },
          )
          .then((response) => {
            setIsLoading(false)
            if (response.status === 201) {
              customerToast({type:'success',title:`${toa('Successfully_added')}`, content:''})
              setUrls(prevUrls => [...prevUrls, newWebsite]);
              setRegisteredWebsite(urlInputValue);
              setUrlInputValue("");
            } else {
              customerToast({type:'error',title:`${toa('Invalid_Request')}`, content:''})
            }
          })
          .catch((error) => {
            setIsLoading(false)
            if (error.response) {
              console.log("Error status code:", error.response.status)
              console.log("Error response data:", error.response.data)
              if (error.response.status === 401) {
                router.push("/signin")
              }
              if (error.response.status === 402) {
                customerToast({type:'error',title:`${error.response.data.message}`, content:''})
              }
              if(error.response.status === 403){
                customerToast({type:'error',title:`${toa('Need_Upgrade_For_Website')}`, content:''})
              }
              // Handle the error response as needed
            } else if (error.request) {
              // The request was made but no response was received
              console.log("Error request:", error.request)
            } else {
              // Something happened in setting up the request that triggered an Error
              console.log("Error message:", error.message)
              customerToast({type:'error',title:`${toa('Invalid_Request')}`, content:''})

            }
          })
            
          }
        }
      } else {
        customerToast({type:'error',title:`${tk("Invalid_Domain_Please_enter_a_valid_Domain")}`, content:''})
      }
    };
  
  
    const handleDeleteButton = async (_index) => {
      setIndex(_index)
      setIsDeleting(true)
      await axios
        .post(
          AUTH_API.REMOVE_WEBSITE,
          { index:_index },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`, // Example for adding Authorization header
              "Content-Type": "application/json", // Explicitly defining the Content-Type
              "ngrok-skip-browser-warning": "1",
            },
          },
        )
        .then((response) => {
          setIsDeleting(false)
          if (response.status === 201) {
            customerToast({type:'success',title:`${toa('Successfully_deleted!')}`, content:''})
            setUrls((prevBases) => prevBases.filter((prev) => prev.index !== _index))
            setRegisteredWebsite("");
          } else {
            customerToast({type:'error',title:`${toa('Invalid_Request')}`, content:''})
          }
        })
        .catch((error) => {
          setIsDeleting(false)
          if(error.response && error.response.status === 403){
            customerToast({type:'error',title:"You need to upgrade to ask more questions to the bot!", content:''})
          } else if (error.response) {
            console.log("Error status code:", error.response.status)
            console.log("Error response data:", error.response.data)
            if (error.response.status === 401) {
              router.push("/signin")
            }
            // Handle the error response as needed
          } else if (error.request) {
            // The request was made but no response was received
            console.log("Error request:", error.request)
          } else {
            // Something happened in setting up the request that triggered an Error
            console.log("Error message:", error.message)
          }
          console.log("Error config:", error.config)
          customerToast({type:'error',title:`${toa('Invalid_Request')}`, content:''})
        })
      
    }
  

  return (
    open && (
      <div
        className="fixed z-10 inset-0 overflow-y-auto"
        aria-labelledby="modal-title"
        role="dialog"
        aria-modal="true"
      >
        <div className="min-h-screen text-center block p-0">
          {/* Background overlay */}
          <div
            className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
            aria-hidden="true"
          />

          {/* Dialog panel */}
          <span
            className="inline-block align-middle h-screen transition duration-150 ease-out"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <div
            className="inline-block bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-lg sm:w-full max-sm:mx-5 align-middle"
            ref={alertRef}
          >
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="relative">
                <h2 className="text-xl font-bold text-center ">https://www.aiana.io</h2>
                <button type="button" className="absolute top-1/2 -translate-y-1/2 right-0 cursor-pointer text-[#A536FA] font-bold rounded-full" onClick={() => setOpen(false)}>✕</button>
              </div>
              <hr className="my-2" />
              <h3
                className="text-[14px] pt-3 pl-3 leading-6 font-medium text-[#767676]"
                id="modal-title"
              >
                {t("Add_domains_where_you_want_to_use_chatbot")}{`(https://example.com)`}
              </h3>
              <div className="w-full flex justify-center items-center px-4 text-sm">
                <input
                  type="text"
                  value={urlInputValue}
                  onChange={(e) => setUrlInputValue(e.target.value)}
                  className="grow mr-5 border border-[#D9D9D9] rounded-md"
                  id="urlInput"
                  placeholder={tk('Enter_Domain')}
                />
                <button className="bg-[#A438FA] px-2 py-2 text-white rounded-md w-[90px]" type="button" onClick={handleUrlAdd}>
                  {isLoading?<Spinner color=""/>:tk('Add')}
                </button>
              </div>
              <div>
                <div className="overflow-auto max-h-[380px]">
                  {urls.length ?(<table className="min-w-max w-full whitespace-nowrap">
                    <thead>
                      <tr className="text-xs font-semibold uppercase tracking-wide text-left text-[#767676] border-b-2">
                        <th className="sm:px-7 px-3 py-2">{tk('URL')}</th>
                        <th className="sm:px-7 px-3 py-2">{tk('ACTION')}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">

                      {urls && urls.map((url) =>
                        <tr key={url.id}>
                          <td className="sm:px-7 px-3 py-2">
                            <a href={`${url.domain}`} target="_blank" className="text-[#A438FA] underline" rel="noreferrer">{url.domain}</a></td>
                          <td className="sm:px-7 px-3 py-2">
                            <button
                              type="button"
                              onClick={() => handleDeleteButton(url.index)}
                              className="focus:outline-none focus:ring-2 focus:ring-blue-500 bg-[#D9D9D9] size-9 pt-1 rounded-md flex justify-center items-center"
                            >
                              {isDeleting && (index===url.index)? <Spinner color="" />: <Image src="/images/icon_trash.svg" alt="trash_icon" width={18} height={18} />}
                            </button>
                          </td>
                        </tr>
                      )
                      }
                    </tbody>
                  </table>): ""}
                  {
                    urls.length === 0 && (
                      <div className="w-full text-center py-5">
                        <p className="text-[#767676]">{tk('No_URL_added_yet')}</p>
                      </div>
                    )
                  }
                </div>
              </div>
              <h3
                className="text-[14px] pt-3 pl-3 leading-6 font-medium text-[#767676]"
                id="modal-title"
              >
                {title}
              </h3>
              <div className="mt-2">
                <p className="text-sm text-[#070E0B] bg-[#F4E5FF] p-5 rounded-md">
                  <div className="font-bold mt-2">{description}</div>
                </p>
              </div>
              <div className="mt-5 sm:mt-6 flex justify-center">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="mt-3 w-full inline-flex justify-center rounded-md border shadow-sm px-4 py-2 transition duration-150 ease-out border-[#A536FA] text-base font-medium hover:bg-[#A536FA] hover:text-white focus:outline-none sm:mt-0 sm:w-auto sm:text-sm"
                >
                  {t('Copy_Script')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  )
}
