import React from "react";
import Image from "next/image"
import { useRouter } from "next/router";
import axios from "axios";
import { v4 as uuidv4 } from 'uuid';
import { toast } from "react-toastify";
import { FaInfoCircle } from "react-icons/fa";

import { AUTH_API } from "@/components/utils/serverURL";
import AlertDialog from "@/components/AlertDialog";
import { formatDateStringOnly } from "@/components/utils/common"
import { useTranslations } from "next-intl";



const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB in bytes

const Document = ({ documents, documentRef, setDocuments, setFiles, setIsSaved }) => {
  const t = useTranslations('knowledge');
  const toa = useTranslations('toast');
  const [openDialog, setOpenDialog] = React.useState(false);
  const [id, setId] = React.useState("");
  const [index, setIndex] = React.useState("");
  const router = useRouter();

  React.useEffect(() => {
    console.log("Documents: ", documents);
    setIsSaved(false);
  }, [documents]);

  function ConvertBytes(bytes : number):string{
    let fileSize = bytes;
    let i = 0;
    const units = ["bytes", "KB", "MB"];
    while(fileSize > 512) {
      fileSize /= 1024;
      i += 1;
    }
    fileSize = Math.round(fileSize * 100) / 100; // Round to two decimal places
    return `${fileSize} ${units[i]}`;
  }

  const handleDocumentChanged = (event) => {
    const fileList = event.target.files;
    const validFiles = [];


    for (let i = 0; i < fileList.length; i += 1) {
      if (fileList[i].size <= MAX_FILE_SIZE) {
        if(fileList[i].type === "application/pdf" || fileList[i].type === "text/plain" || fileList[i].type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" )
        validFiles.push(fileList[i]);
        // console.log(fileList[i].type);
      } else {
        toast.error(
          `File "${fileList[i].name}" exceeds the maximum size of 5MB.`,
          { position: toast.POSITION.TOP_RIGHT }
        );
      }
    }
    setFiles((prev)=>[...prev, ...validFiles]); // Only set valid files
    const newDocs = validFiles.map((file: File) => ({
      created_at: new Date().toISOString(),
      filename: file.name,
      id: uuidv4(),
      type: file.type,
      size: ConvertBytes(file.size),
      unique_id: "",
    }))
    setDocuments([...documents, ...newDocs]);
  };

  const handleDelete = (_id, _index) => {
    setId(_id);
    setIndex(_index);
    const documentsArray = documentRef.current;

    // Check if any document in the array has an ID matching _id
    const documentExists = documentsArray.some(doc => doc.id === _id);
    if (documentExists) {
      setOpenDialog(true);

    } else {
      setDocuments(documents.filter(doc => doc.id !== _id));
    }
  }

  const handleDeleteDocument = () => {

    axios
      .post(AUTH_API.DELETE_DOCUMENT, { id },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,  // Example for adding Authorization header
            'Content-Type': 'application/json',  // Explicitly defining the Content-Type
            'ngrok-skip-browser-warning': "1",
          }
        })
      .then((response) => {
        if (response.status === 201) {
          toast.success(`${toa('Successfully_deleted!')}`, { position: toast.POSITION.TOP_RIGHT });
        } else {
          toast.error(`${toa('Invalid_Request')}`, { position: toast.POSITION.TOP_RIGHT })
        }
      })
      .catch((error) => {
        if (error.response) {
          console.log('Error status code:', error.response.status);
          console.log('Error response data:', error.response.data);
          if (error.response.status === 401) {
            toast.error(`${toa('Session_Expired_Please_log_in_again')}`, { position: toast.POSITION.TOP_RIGHT });

            router.push("/signin")
          }
          // Handle the error response as needed
        } else if (error.request) {
          // The request was made but no response was received
          console.log('Error request:', error.request);
          toast.error(error.request, { position: toast.POSITION.TOP_RIGHT });

        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error message:', error.message);
          toast.error(error.message, { position: toast.POSITION.TOP_RIGHT });

        }
      });
    const updatedDocuments = documents.filter((_, i) => i !== index);
    setDocuments(updatedDocuments);

  };

  const handleAgree = () => {
    setOpenDialog(false);
    handleDeleteDocument();
  }

  const handleDisagree = () => {
    setOpenDialog(false);
  }



  return (
    <div className="w-full overflow-y-auto">
      <div className="text-left bg-blue-100 py-2 sm:mx-7 mx-3 rounded-lg">
        <span className="text-[#343434] text-sm text-left px-3">
          <FaInfoCircle className="text-blue-500 size-5 inline-block mr-3" />
          {t('Note_Build_your_Chatbot_Knowledge_Base_by_uploading_documents_These_documents_train_your_chatbot_to_answer_questions_accurately')}
        </span>
      </div>

      <div className="flex justify-center items-center my-5 sm:mx-7 mx-3 rounded-xl">
        <label
          htmlFor="file_upload"
          className="bg-transparent text-gray-600 rounded-md w-full flex flex-col h-auto cursor-pointer py-3 items-center justify-center border-dashed border-2 border-gray-200 mb-5"
        >
          <Image src="/images/knowledgebase/icon_file_upload.png" alt="icon_file_upload" width={200} height={200} />
          <p className="font-bold text-black text-[16px] text-center mt-5">
            {t('Click_to_upload')}
          </p>
          <p className="text-[#767676] max-sm:hidden text-sm text-center">
            {t('Upload_files_in_formats_PDF_DOC_TXT_with_a_maximum_size_of_5MB')}
          </p>
          <p className="text-[#767676] font-bold text-center text-sm">{t('Please_do_not_upload_any_confidential_data')}</p>

        </label>
        <input
          type="file"
          id="file_upload"
          accept=".pdf,.txt,.docx"
          onChange={handleDocumentChanged}
          multiple
          style={{ display: "none" }}
        />
      </div>
      <div>
        <div className="w-full justify-between flex my-5 sm:px-7 px-3">
          <h4 className="text-lg font-bold">{t('Uploaded_files')}</h4>
          <p className="text-[#767676] text-sm">{documents.length} {t('files_uploaded')}</p>
        </div>
        <div className="h-[220px] overflow-y-auto">
          <table className="min-w-max w-full whitespace-nowrap">
            <thead>
              <tr className="text-xs font-semibold uppercase tracking-wide text-left text-[#767676] border-b-2 w-full">
                <th className="sm:px-7 px-3 py-2 max-w-[200px]">{t('FILENAME')}</th>
                <th className="sm:px-7 px-3 py-2 max-w-[50px]">{t('TYPE')}</th>
                <th className="sm:px-7 px-3 py-2 max-w-[40px]">{t('SIZE')}</th>
                <th className="sm:px-7 px-3 py-2 max-w-[80px]">{t('UPLOADED_ON')}</th>
                <th className="sm:px-7 px-3 py-2 max-w-[30px]">{t('ACTION')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 overflow-y-auto w-full">
              {documents.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center">
                    <div className="flex flex-col items-center justify-center w-full">
                      <Image src="/images/knowledgebase/icon_no_document.png" alt="No documents" width={100} height={100} />
                      <p>No file updated yet.</p>
                    </div>
                  </td>
                </tr>
                ):(documents.map((doc, i) => (
                <tr key={doc.id} className="w-full">
                  <td className="sm:px-7 px-3 py-2 truncate max-w-[150px]">{doc.filename}</td>
                  <td className="sm:px-7 px-3 py-2 max-w-[60px]">
                    {(() => {
                      switch (doc.type) {
                        case "text/plain":
                        case ".txt":
                          return <Image src="/images/icon_txt.svg" alt="Text Document" width={20} height={20} className="ml-2" />;
                        case "application/pdf":
                        case ".pdf":
                          return <Image src="/images/icon_pdf.svg" alt="PDF Document" width={20} height={20} className="ml-2" />;
                        default:
                          return <Image src="/images/icon_doc.svg" alt="Other Document" width={20} height={20} className="ml-2" />;
                      }
                    })()}
                  </td>
                  <td className="sm:px-7 px-3 py-2 max-w-[60px]">{doc.file_size? doc.file_size : doc.size}</td>
                  <td className="sm:px-7 px-3 py-2 max-w-[80px]">{formatDateStringOnly(doc.created_at)}</td>
                  <td className="sm:px-7 px-3 py-2 max-w-[30px]">
                    <button
                      type="button"
                      onClick={() => handleDelete(doc.id, i)}
                      className="focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white border border-gray-300 size-9 pt-1 rounded-md flex justify-center items-center"
                      aria-label="Delete item"
                    >
                      <Image src="/images/knowledgebase/icon_trash_bin.png" alt="Trash_Bin" width={20} height={20} />
                    </button>
                  </td>
                </tr>
              ))
              )}
            </tbody>
          </table>
        </div>

      </div>
      <AlertDialog
        title={`${t('Confirm_Delete')}`}
        description={`${t('Are_you_sure_you_want_to_delete_this_item_This_action_cannot_be_undone')}`}
        handleAgree={handleAgree}
        handleDisagree={handleDisagree}
        open={openDialog}
        setOpen={setOpenDialog}
      />
    </div>
  )
}

export default Document
