interface ShowFormProps {
  ts: any;
  email: string;
  content: string;
  handleOkayClick: () => void;
  handleCancelClick: () => void;
  setEmail: (email: string) => void;
  setContent: (content: string) => void;
}

const ShowForm = ({ts, email, content, handleOkayClick, handleCancelClick, setEmail, setContent}: ShowFormProps) => 
  <div className="p-4 mt-2">
    <p className="text-center text-[#070E0B]">
      {ts('Please_provide_your_email_and_content_to_book_a_ticket')}
    </p>
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
      <button
        type="button"
        className="mr-2 py-2 px-4 text-white bg-[#A536FA]"
        onClick={handleOkayClick}
      >
        {ts('Okay')}
      </button>
      <button
        type="button"
        className="py-2 px-4 text-[#A536FA] border-[#A536FA] border"
        onClick={handleCancelClick}
      >
        {ts('Cancel')}
      </button>
    </div>
  </div>

export default ShowForm