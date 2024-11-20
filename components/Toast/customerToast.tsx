import { toast } from "react-toastify"

export const customerToast = ({type, title, content}) => {
  toast.dismiss()
  if (type === 'success'){
    toast.success(
      <div className="text-base text-black">
        {title}<br/>
        <p className="text-sm text-gray-700">{content}</p>
      </div>, 
      {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
        theme: "colored",
        hideProgressBar: true,
        className: 'toast-icon-border black-close-icon',
        style: {
          background: `linear-gradient(to bottom, rgb(220 252 231), white)`,
          color: '#03AB83',
          borderRadius: '10px',
        }
      }
    )
  }
  else if (type === 'error') {
    toast.error(
      <div className="text-base text-black">
        {title}<br/>
        <p className="text-sm text-gray-700">{content}</p>
      </div>, 
      {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
        theme: "colored",
        hideProgressBar: true,
        className: 'toast-icon-border black-close-icon',
        style: {
          background: `linear-gradient(to bottom, rgb(220 252 231), white)`,
          color: '#03AB83',
          borderRadius: '10px',
        }
      }
    )
  }
}