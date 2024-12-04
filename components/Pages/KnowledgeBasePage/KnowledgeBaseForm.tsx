import React, { useState, useRef } from "react"
import { useRouter } from "next/router"
import axios from "axios"
import { useTranslations } from "next-intl"
import { AUTH_API } from "@/components/utils/serverURL"
import { setExpiryTime } from "@/components/utils/common"
import SaveChangesButton from "@/components/Buttons/SaveChangeButton"
import CancelButton from "@/components/Buttons/CancelButton"
import { customerToast } from "@/components/Toast"
import Document from "./Document"
import Website from "./Website"
import Text from "./Text"

// Define the interface for the base object
interface Base {
  created_at: string;
  id: number;
  name: string;
  unique_id: string;
  user_id: number;
}

const KnowledgeBaseForm = ({ baseId }) => {
  const t = useTranslations('knowledge');
  const toa = useTranslations('toast');
  const router = useRouter();
  const [value, setValue] = useState(0)
  const [nameInputValue, setNameInputValue] = useState("")
  const [oldName, setOldName] = useState("")
  const [documents, setDocuments] = useState([])
  const [files, setFiles] = useState([])
  const [urls, setUrls] = useState([])
  const [questionAnswers, setQuestionAnswers] = useState([])
  const [isSaved, setIsSaved] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  // const [length, setLength] = useState(0);
  const [base, setBase] = React.useState<Base>({
    created_at: "",
    id: 0,
    name: "",
    unique_id: "",
    user_id: 0,
  });
  const [isLoading, setIsLoading] = React.useState(false);

  const documentRef = useRef([]);
  const filesRef = useRef([]);
  const urlsRef = useRef([]);
  const qaRef = useRef([]);

  let newBaseId = baseId;

  React.useEffect(() => {
    // Use a local variable instead of modifying the parameter directly
    if (!newBaseId) {
      const storedBaseId = localStorage.getItem('lastBaseId');
      newBaseId = storedBaseId;
    } else {
      localStorage.setItem('lastBaseId', newBaseId);
    }
  }, [baseId]);
  React.useEffect(() => {
    localStorage.setItem('isSaved', 'false');
    if (newBaseId !== "-1") {
      const fetchData = async () => {
        if (newBaseId && newBaseId !== "-1") {
          setIsLoading(true);
          try {
            const requestOptions = {
              headers: new Headers({
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': "1",
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
              })
            };
            const response = await fetch(`${AUTH_API.GET_KNOWLEDGE_BASE}?baseId=${newBaseId}`, requestOptions);
            setExpiryTime();
            const data = await response.json();
            if(data.msg ==="Token has expired"){
              router.push("/signin")
            }
            setBase(data.base || {
              created_at: "",
              id: 0,
              name: "",
              unique_id: "",
              user_id: 0,
            });
            setNameInputValue(data.base.name)
            setOldName(data.base.name)
            setDocuments(data.documents || []);
            documentRef.current = data.documents;
            filesRef.current = []
            setUrls(data.websites || []);
            urlsRef.current = data.websites;
            setQuestionAnswers(data.texts || []);
            qaRef.current = data.texts;
          } catch (error) {
           
            if (error.response) {
              console.log('Error status code:', error.response.status);
              console.log('Error response data:', error.response.data);
             
              if (error.response.status === 401) {
                customerToast({type:'error', title: `${toa('Session_Expired_Please_log_in_again')}`, content: ""})
  
                router.push("/signin")
              }
              // Handle the error response as needed
            } else if (error.request) {
              // The request was made but no response was received
              console.log('Error request:', error.request);
              customerToast({type:'error', title: `${error.request}`, content: ""})

            } else {
              console.log(error.msg)              
              // Something happened in setting up the request that triggered an Error
              console.log('Error message:', error.msg);
              customerToast({type:'error', title: `${error.message}`, content: ""})

            }
            setIsLoading(false)
          }

          setIsLoading(false);
        }
      };

      fetchData();
    }
  }, []);

  React.useEffect(() => {
    // Update the local state when the base object changes
    setIsSaved(false);
  }, [nameInputValue]);

  const isValidName = (name: string): boolean => {
    console.log("name checker")
    // Check if name is not empty, starts with a letter, ends with a letter, and contains only letters and spaces
    return /^[A-Za-z0-9][A-Za-z0-9\s]*[A-Za-z0-9]$/.test(name);
  };

  const handleSubmit = async () => {
    if (nameInputValue === "") {
      customerToast({type:'error', title: `${toa('Please_input_the_name')}`, content: ""})
      return
    }

    if (!isValidName(nameInputValue)) {
      customerToast({type:'error', title: `${toa('Name_must_start_and_end_with_a_letter_and_contain_only_letters_and_spaces')}`, content: ""})
      return
    }

    if (documents.length === 0 && urls.length === 0 && questionAnswers.length === 0) {
      customerToast({type:'error', title: `${toa('Please_input_the_data')}`, content: ""})
      return
    }
    
    const userID = localStorage.getItem("userID")
    const formData = new FormData()
    formData.append("name", nameInputValue)
    console.log("Old --->", documentRef.current.length)
    const updatedDocs = documents.filter(doc => !documentRef.current.includes(doc));
    console.log("The length of the updated docs=--=---", updatedDocs.length)
    formData.append("docs", JSON.stringify(updatedDocs));
    const updatedFiles = files.filter(file => !filesRef.current.includes(file));
    console.log("The length of the updated files=--=---", files.length)
    updatedFiles.forEach(doc => formData.append("files", doc))
    const updatedUrls = urls.filter(url => !urlsRef.current.includes(url));
    console.log("The length of the updated URLs=--=---", updatedUrls.length)
    console.log("Upadated URL---> ", updatedUrls)
    formData.append("urls", JSON.stringify(updatedUrls))
    const updatedQa = questionAnswers.filter(qa => !qaRef.current.includes(qa));
    formData.append("qa", JSON.stringify(updatedQa));
    formData.append("userID", userID)
    if(updatedFiles.length + updatedQa.length + updatedUrls.length ===0 && oldName === nameInputValue) return
    // if(length === (updatedDocs.length + updatedFiles.length + updatedQa.length + updatedUrls.length))
    //   {setIsSaved(true);localStorage.setItem('isSaved', 'true')}
    // else {setIsSaved(false);setIsSaving(true); localStorage.setItem('isSaved', 'false')}
    // setLength(updatedDocs.length + updatedFiles.length + updatedQa.length + updatedUrls.length);
    setIsSaving(true)
    try {
      let API = ""
      if (newBaseId === "-1") {
        API = AUTH_API.UPLOAD_DOCUMENT
      } else {
        API = `${AUTH_API.UPDATE_KNOWLEDGE_BASE}`
        formData.append("unique_id", base.unique_id);
      }
      const response = await axios.post(API, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'ngrok-skip-browser-warning': "1",
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }
      });
      if (response.status === 200) {
        documentRef.current = documents;
        filesRef.current = files;
        urlsRef.current = urls;
        qaRef.current = questionAnswers;
        let badAlert = ""
        if (!response.data.bad_url) {
          badAlert = "The knowledge base includes invalid url."
        }
        // setIsSaved(true);
        localStorage.setItem('isSaved', 'true')
        setIsSaving(false)
        setIsSaved(true);
        setExpiryTime();
        setOldName(nameInputValue);
        customerToast({type:'success',title:`${toa('Successfully_updated')}`, content:`${badAlert}`})
        if(newBaseId === "-1") {
          router.push(`/knowledge`);
        }
      }
    } catch (error) {
      setIsSaving(false)
      // setIsSaved(false);
      setExpiryTime();
      localStorage.setItem('isSaved', 'true')
      if (error.response) {
        console.log('Error status code:', error.response.status);
        console.log('Error response data:', error.response.data);
        if (error.response.status && error.response.status === 401) {
  
          customerToast({type:'error', title: `${toa('Session_Expired')}`, content: ""})
          router.push("/signin")
        }
        if (error.response.status && error.response.status === 403) {
  
          customerToast({type:'error', title: `${toa('Need_Ugrade')}`, content: ""})   
        }
        else if (error.response.status && error.response.status === 504) {
  
          customerToast({type:'error', title: `${toa('It_takes_too_much_time_to_retrieve_information_from_your_document')}`, content: ""})
        }
        // Handle the error response as needed
      } else if (error.request) {

        // The request was made but no response was received
        console.log('Error request:', error.request.status);
      } else {

          customerToast({type:'error', title: `${toa('Busy_Network_Try_again')}`, content: ""})
        // Something happened in setting up the request that triggered an Error
        console.log('Error message:', error.message);
      }

    }
  };

  const handleCancelClick = () => {
    router.push("/knowledge");
  }

  if (isLoading) {
    return <div>{t('Loading')}</div>;
  }

  return (
    <div
      className="relative flex h-full flex-col flex-grow w-full mx-auto"
    >
      <div className="flex flex-col w-full items-center">
        <input
          className="w-full rounded-lg py-4 px-7 text-xl font-bold border-none focus:ring-0"
          type="text"
          value={nameInputValue}
          placeholder={t('Enter_knowledge_base_name')}
          onChange={(e) => setNameInputValue(e.target.value)}
        />
      </div>
      <div className="bg-none w-full h-[900px] rounded-lg flex flex-col mt-1 border border-[#CFCFCF]">
        <div className="w-full flex flex-col justify-between my-5 overflow-x-auto">

          <ul
            className="flex justify-start gap-7 ml-7 text-gray-500"
          >
            <button type="button" className={`${value === 0 && "border text-black"} border-gray rounded-lg py-1 px-2 cursor-pointer`} onClick={() => setValue(0)}>{t('Document')}</button>
            <button type="button" className={`${value === 1 && "border text-black"} border-gray rounded-lg py-1 px-2 cursor-pointer`} onClick={() => setValue(1)}>{t('Website')}</button>
            <button type="button" className={`${value === 2 && "border text-black"} border-gray rounded-lg py-1 px-2 cursor-pointer`} onClick={() => setValue(2)}>{t('Text')}</button>
          </ul>

        </div>
        <div className="w-full">
          {value === 0 && <Document documents={documents} documentRef={documentRef} setDocuments={setDocuments} setFiles={setFiles} setIsSaved={setIsSaved} />}
          {value === 1 && <Website urls={urls} setUrls={setUrls} websiteRef={urlsRef} setIsSaved={setIsSaved}/>}
          {value === 2 && <Text questionAnswers={questionAnswers} qaRef={qaRef} setQuestionAnswers={setQuestionAnswers} setIsSaved={setIsSaved}/>}
        </div>
      </div>
      <div className="w-full flex sm:flex-row flex-col-reverse items-center justify-end gap-5 sm:px-7 px-3 pt-5">
        <CancelButton handleCancelClick={handleCancelClick} t={t} />
        <SaveChangesButton isSaved={isSaved} isSaving={isSaving} handleSubmit={handleSubmit} t={t} />
      </div>
    </div>
  )
}

export default KnowledgeBaseForm
