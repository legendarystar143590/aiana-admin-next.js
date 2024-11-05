import React, {useState} from "react";
import { FaAngleUp, FaAngleDown, FaTrash } from "react-icons/fa";

const QuestionAnswerComponent = ({handleDeleteQA, questionAnswer, index}) => {
  const [isVisible, setIsVisible] = useState(false);
    return (
    <div key={questionAnswer.id} className="py-3">
      <p className="text-[#070E0B] text-lg my-1 flex justify-between">{questionAnswer.question}
        <div>
          <button
              type="button"
              onClick={() => handleDeleteQA(questionAnswer.id, index)}
              className="focus:outline-none focus:ring-2 mr-4 focus:ring-blue-500 bg-white size-7 rounded-md inline-flex justify-center items-center"
          >
            <FaTrash/>
            {/* <Image src="/images/icon_trash_1.svg" alt="trash_icon" width={15} height={15} /> */}
          </button>
          <button
              type="button"
              onClick={() => setIsVisible(!isVisible)}
              className="focus:outline-none focus:ring-2 ml-2 focus:ring-blue-500 bg-white size-7 rounded-md inline-flex justify-center items-center"
          >
            {
              isVisible?
              <FaAngleUp />
              :
              <FaAngleDown/>
            }            
            {/* <Image src="/images/icon_trash_1.svg" alt="trash_icon" width={15} height={15} /> */}
          </button>
        </div>
      </p>
      <p className={`${isVisible?"block":"hidden"} text-base text-gray-600 my-1`}>{questionAnswer.answer}</p>
    </div>
  )
}

export default QuestionAnswerComponent;