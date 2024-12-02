import React, { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/router"
import axios from "axios"
import { FaInfoCircle } from "react-icons/fa"
import { useTranslations } from "next-intl"

import AlertDialog from "@/components/AlertDialog"
import { AUTH_API } from "@/components/utils/serverURL"
import { formatDateStringOnly } from "@/components/utils/common"
import { customerToast } from "@/components/Toast"
import { isValidKnolwedgeUrl } from "./validation"

// Define the interface for a website object
interface WebsiteObject {
  created_at: string
  id: number
  unique_id: string
  url: string
}
const Website = ({ urls, setUrls, websiteRef, setIsSaved }) => {
  const t = useTranslations('knowledge');
  const toa = useTranslations('toast');
  const router = useRouter()
  const [urlInputValue, setUrlInputValue] = useState("")
  const [openDialog, setOpenDialog] = React.useState(false)
  const [id, setId] = React.useState("")
  const [index, setIndex] = React.useState("")

  function formatMySQLDateTime(date: Date): string {
    // Get local date time components
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
  
    // Format as YYYY-MM-DD HH:mm:ss
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  const handleUrlAdd = () => {
    if ( isValidKnolwedgeUrl(urlInputValue)) {
      const newWebsite: WebsiteObject = {
        created_at: formatMySQLDateTime(new Date()),
        id: urls.length, //
        unique_id: "",
        url: urlInputValue,
      }
      setUrls([...urls, newWebsite])
      setUrlInputValue("")
      setIsSaved(false);
    } else {
      customerToast({type:'error', title: `${t("Invalid_URL_Please_enter_a_valid_URL")}`, content: ""})
    }
  }

  const handleDeleteUrl = () => {
    axios
      .post(
        AUTH_API.DELETE_URL,
        { id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Example for adding Authorization header
            "Content-Type": "application/json", // Explicitly defining the Content-Type
            "ngrok-skip-browser-warning": "1",
          },
        },
      )
      .then((response) => {
        if (response.status === 201) {
          customerToast({type:'success',title:`${toa('Successfully_deleted!')}`, content:''})
        } else {
          customerToast({type:'error', title: `${toa('Invalid_Request')}`, content: ""})
        }
      })
      .catch((error) => {
        if (error.response) {
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
        customerToast({type:'error', title: `${toa('Invalid_Request')}`, content: ""})
      })
    const updatedUrls = urls.filter((_, i) => i !== index)
    setUrls(updatedUrls)
  }

  const handleDeleteButton = (_id, _index) => {
    setId(_id)
    setIndex(_index)
    let websiteArray;
    if (websiteRef.current){
      websiteArray = websiteRef.current;
    } else {
      websiteArray = []
    }

    const websiteExists = websiteArray.some(doc => doc.id === _id);
    if (websiteExists) {
      setOpenDialog(true);

    } else {
      setUrls(urls.filter(doc => doc.id !== _id));
    }
  }

  const handleAgree = () => {
    setOpenDialog(false)
    handleDeleteUrl()
  }

  const handleDisagree = () => {
    setOpenDialog(false)
  }

  return (
    <div className="w-full overflow-y-auto p-10">
      <div className="text-left bg-blue-100 py-2 rounded-lg">
        <span className="text-[#343434] text-sm text-left px-3">
          <FaInfoCircle className="text-blue-500 size-5 inline-block mr-3" />
          {t('Note_Add_URLs_to_build_your_chatbot_knowledge_base_These_URLs_help_train_your_chatbot_to_answer_questions_accurately')}
        </span>
      </div>
      <div className="w-full md:inline-flex flex-col justify-center items-left gap-3 mt-5 max-md:space-y-5 p-3 border-gry-200 border border-dashed rounded-lg">
        <p className="w-[100px] text-xl">{t('Enter_URL')}</p>
        <div className="w-full flex flex-row md:flex-row items-center justify-between">
          <input
            type="text"
            value={urlInputValue}
            onChange={(e) => setUrlInputValue(e.target.value)}
            placeholder="e.g. https://www.your-url.com"
            className="grow mr-5 border border-[#D9D9D9] rounded-md"
            id="urlInput"
          />
          <button className={`${urlInputValue? "bg-black text-white":"bg-gray-200 text-gray-500"} px-2 py-2 rounded-md w-[150px]`} type="button" onClick={handleUrlAdd}>
            {t('Add_this_URL')}
          </button>
        </div>
      </div>
      <div>
        <div className="w-full justify-between flex my-5 sm:px-7 px-3">
          <h4 className="text-lg font-bold">{t('Uploaded_files')}</h4>
          <p className="text-[#767676] text-sm">{urls.length} {t('files_uploaded')}</p>
        </div>
        <div className="h-[280px] overflow-y-auto">
          <table className="min-w-max w-full whitespace-nowrap">
            <thead>
              <tr className="text-xs font-semibold uppercase tracking-wide text-left text-[#767676]">
                <th className="sm:px-7 px-3 py-2">{t('URL')}</th>
                <th className="sm:px-7 px-3 py-2">{t('ADDED_ON')}</th>
                <th className="sm:px-7 px-3 py-2">{t('ACTION')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">

              {urls && urls.map((url, i) =>
                <tr key={url.id}>
                  <td className="sm:px-7 px-3 py-2">
                    <a href={`${url.url}`} target="_blank" className="text-[#A438FA] underline" rel="noreferrer">{url.url}</a></td>
                  <td className="sm:px-7 px-3 py-2">{formatDateStringOnly(url.created_at)}</td>
                  <td className="sm:px-7 px-3 py-2">
                    <button
                      type="button"
                      onClick={() => handleDeleteButton(url.id, i)}
                      className="focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white border border-gray-300 size-9 pt-1 rounded-md flex justify-center items-center"
                      aria-label="Delete item"
                    >
                      <Image src="/images/knowledgebase/icon_trash_bin.png" alt="Trash_Bin" width={20} height={20} />
                    </button>
                  </td>
                </tr>
              )
              }
            </tbody>
          </table>
          {
            urls.length === 0 && (
              <div className="w-full h-[150px] flex items-center justify-center">
                <div className="text-center">
                  <Image 
                    src="/images/knowledgebase/icon_no_document.png" 
                    alt="No documents" 
                    width={100} 
                    height={100} 
                    className="mx-auto"
                  />
                  <p className="text-[#767676]">{t('No_URL_added_yet')}</p>
                </div>
              </div>
            )
          }
        </div>
      </div>
      <AlertDialog
        title={t('Delete_Website')}
        description={t('Are_you_sure_you_want_to_delete_this_item_This_action_cannot_be_undone')}
        handleAgree={handleAgree}
        handleDisagree={handleDisagree}
        open={openDialog}
        setOpen={setOpenDialog}
      />
    </div>
  )
}

export default Website
