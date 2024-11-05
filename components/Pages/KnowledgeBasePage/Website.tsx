import React, { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/router"
import axios from "axios"
import { FaInfoCircle, FaTrash } from "react-icons/fa"
import { toast } from "react-toastify"
import { useTranslations } from "next-intl"

import AlertDialog from "@/components/AlertDialog"
import { AUTH_API } from "@/components/utils/serverURL"
import { isValidKnolwedgeUrl } from "./validation"

const options: Intl.DateTimeFormatOptions = {
  weekday: 'short',
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric'
};

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

  const handleUrlAdd = () => {
    if (isValidKnolwedgeUrl(urlInputValue)) {
      const newWebsite: WebsiteObject = {
        created_at: new Date().toISOString(),
        id: urls.length, //
        unique_id: "",
        url: urlInputValue,
      }
      setUrls([...urls, newWebsite])
      setUrlInputValue("")
      setIsSaved(false);
    } else {
      toast.error(t("Invalid_URL_Please_enter_a_valid_URL"), { position: toast.POSITION.TOP_RIGHT })
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
          toast.success(`${toa('Successfully_deleted!')}`, { position: toast.POSITION.TOP_RIGHT })
        } else {
          toast.error(`${toa('Invalid_Request')}`, { position: toast.POSITION.TOP_RIGHT })
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
        toast.error(`${toa('Invalid_Request')}`, { position: toast.POSITION.TOP_RIGHT })
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
    <div className="w-full overflow-y-auto">
      <div className="text-left bg-blue-100 py-2 sm:mx-7 mx-3">
        <span className="text-[#343434] text-sm text-left px-3">
          <FaInfoCircle className="text-blue-500 size-5 inline-block mr-3" />
          {t('Note_Build_your_Chatbot_Knowledge_Base_by_uploading_urls_These_urls_train_your_chatbot_to_answer_questions_accurately')}
        </span>
      </div>
      <p className="text-center pt-5 font-bold text-sm px-5">{t('Please_do_not_add_URLs_to_websites_that_contain_confidential_information_or_where_the_publisher_has_imposed_restrictions_on_sharing')}</p>
      <div className="w-full md:inline-flex flex-wrap justify-center items-center px-10 mt-5 max-md:space-y-5 py-10">
        <p className="w-[100px] text-lg">{t('Enter_URL')}</p>
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
      <div>
        <div className="w-full justify-between flex my-5 sm:px-7 px-3">
          <h4 className="text-lg font-bold">{t('Uploaded_files')}</h4>
          <p className="text-[#767676] text-sm">{urls.length} {t('files_uploaded')}</p>
        </div>
        <div className="h-[280px] overflow-y-auto">
          <table className="min-w-max w-full whitespace-nowrap">
            <thead>
              <tr className="text-xs font-semibold uppercase tracking-wide text-left text-[#767676] border-b-2">
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
                  <td className="sm:px-7 px-3 py-2">{new Date(url.created_at).toLocaleDateString("en-US", options)}</td>
                  <td className="sm:px-7 px-3 py-2">
                    <button
                      type="button"
                      onClick={() => handleDeleteButton(url.id, i)}
                      className="focus:outline-none focus:ring-2 focus:ring-blue-500 bg-[#D9D9D9] size-9 pt-1 rounded-md flex justify-center items-center"
                    >
                      <FaTrash className="w-5 h-5"/>
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
        title={t('Confirm_Delete')}
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
