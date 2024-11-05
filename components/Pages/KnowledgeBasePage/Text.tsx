import React, { useState } from "react"
import { useRouter } from "next/router";
import axios from "axios";
import { toast } from "react-toastify";
import { FaInfoCircle } from "react-icons/fa";
import { useTranslations } from "next-intl";

import { AUTH_API } from "@/components/utils/serverURL"
import QustionAnswerComponent from "@/components/QuestionAnswer/index"

const Text = ({ questionAnswers, setQuestionAnswers, setIsSaved }) => {
  const router = useRouter();
  const t = useTranslations('knowledge')
  const toa = useTranslations('toast')
  const [questionInputValue, setQuestionInputValue] = useState("")
  const [answerInputValue, setAnswerInputValue] = useState("")


  const handleQAAdd = () => {
    if (questionInputValue.trim() !== "" && answerInputValue.trim() !== "") {
      setQuestionAnswers([
        ...questionAnswers,
        { question: questionInputValue, answer: answerInputValue },
      ])
      setQuestionInputValue("")
      setAnswerInputValue("")
      setIsSaved(false);
    } else {
      toast.error(`${toa('Question_and_Answer_are_required')}`, { position: toast.POSITION.TOP_RIGHT });
    }
  }

  const handleDeleteQA = (id, index) => {
    axios
      .post(AUTH_API.DELETE_TEXT, { id },
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
    const updatedQuestionAnswers = questionAnswers.filter((_, i) => i !== index)
    setQuestionAnswers(updatedQuestionAnswers)
    setIsSaved(false);
  }

  return (
    <div className="w-full overflow-y-auto">
      <div className="text-left bg-blue-100 py-2 sm:mx-7 mx-3">
        <span className="text-[#343434] text-sm text-left px-3">
          <FaInfoCircle className="text-blue-500 size-5 inline-block mr-3" />
          {t('Note_Add_custom_texts_questions_to_build_your_chatbot_knowledge_base_These_texts_help_train_your_chatbot_to_answer_questions_accurately')}
        </span>
      </div>
      <div className="flex max-md:flex-col">
        <div className="p-5 flex-1">
          <div className="w-full border rounded-lg md:inline-flex justify-end flex-col p-5 max-md:space-y-5 flex-1">
            <p className="w-[100px] text-lg font-bold mb-2">{t('Question')}</p>
            <textarea
              value={questionInputValue}
              onChange={(e) => setQuestionInputValue(e.target.value)}
              className="w-full border border-[#D9D9D9] h-24 rounded-md"
              id="questionInput"
            />
            <p className="w-[100px] text-lg font-bold mt-5 mb-2">{t('Answer')}</p>
            <textarea
              value={answerInputValue}
              onChange={(e) => setAnswerInputValue(e.target.value)}
              className="w-full border border-[#D9D9D9] rounded-md h-60"
              id="answerInput"
            />
            <button className={`${questionAnswers? "bg-black text-white":"bg-gray-200 text-gray-500"} px-2 py-2 rounded-md w-[100px] ml-auto mt-4`} type="button" onClick={handleQAAdd}>
              +{t('Add')}
            </button>
          </div>
        </div>
        <div className="flex flex-1 flex-col py-5 pr-5 overflow-y-auto">
          <div className="border rounded-xl h-full">
            <div className="w-full justify-between flex mb-5 mt-10 sm:px-7 px-3">
              <h4 className="text-lg font-bold">{t('Questions_List')}</h4>
              <p className="text-[#767676] text-sm">{questionAnswers.length} {t('question_added')}</p>
            </div>
            <div className="md:px-7 max-h-[400px] overflow-y-auto">
              {questionAnswers && questionAnswers.map((questionAnswer, i) =>
                <>
                  <QustionAnswerComponent questionAnswer={questionAnswer} index={i} handleDeleteQA={handleDeleteQA} />
                  {questionAnswers.length > i + 1 ? <hr/> : ""}
                </>
                // {`Q: ${qa.question} `} secondary={`A: ${qa.answer}
                // <div key={questionAnswer.id}>
                //   <p className="text-[#070E0B] my-1"><i className="w-24 inline-block">#{t('Question')} {i + 1}:</i>{questionAnswer.question}
                //     <button
                //       type="button"
                //       onClick={() => handleDeleteQA(questionAnswer.id, i)}
                //       className="focus:outline-none focus:ring-2 ml-2 focus:ring-blue-500 bg-[#F2E3FE] size-7 rounded-md inline-flex justify-center items-center"
                //     >
                //       <Image src="/images/icon_trash_1.svg" alt="trash_icon" width={15} height={15} />
                //     </button>
                //   </p>
                //   <p className="text-[#070E0B] my-1"><i className="w-24 inline-block">#{t('Answer')} {i + 1}:</i>{questionAnswer.answer}</p>
                // </div>
              )
              }
              {
                questionAnswers.length === 0 && (
                  <div className="w-full text-center py-5">
                    <p className="text-[#767676]">{t('No_question_added_yet')}</p>
                  </div>
                )
              }
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

export default Text
