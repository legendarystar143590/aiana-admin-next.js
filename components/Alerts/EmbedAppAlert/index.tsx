import { useTranslations } from "next-intl"
import Image from "next/image"
import React, { useState } from "react"



export default function EmbedAppAlert({ open, setOpen, description, handleCopy }) {
  const t = useTranslations('common');
  const [content, setContent] = useState("")
  const [buttonText, setButtonText] = useState("")
  const [isAppStore, setIsAppStore] = useState(true)
  // const router = useRouter()

    const alertRef = React.useRef(null)

    // const title = "To embed your chatbot onto your website, paste this snippet into your website's HTML file";
  
  const handleWordpressButton = () => {
    setContent("Install our Wordpress plugin from the Wordpress appstore")
    setButtonText("Go to Appstore")
    setIsAppStore(true)
  }

  const handleShopifyButton = () => {
    setContent("Install our Shopify plugin from the Shopify appstore")
    setButtonText("Go to Appstore")
    setIsAppStore(true)
  }

  const handleOtherButton = () => {
    setContent("Add the following code at the bottom of the body tag of your website:")
    setIsAppStore(false)
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
            className="inline-block bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-xl sm:w-full max-sm:mx-5 align-middle"
            style={{width: "-webkit-fill-available"}}
            ref={alertRef}
          >
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="relative">
                <h2 className="text-xl font-bold text-center ">Link your website</h2>
                <button type="button" className="absolute top-1/2 -translate-y-1/2 right-0 cursor-pointer text-[#A536FA] font-bold rounded-full" onClick={() => setOpen(false)}>✕</button>
              </div>
              <hr className="my-2" />
              <p className="text-gray-600 text-base mt-2">Select your type of website.</p>
              <div className={`flex flex-row justify-between items-center px-5 mt-8 ${isAppStore&&content!==""?"mb-8":"mb-4"}`}>
                <button type="button" className="flex flex-col gap-2 cursor-pointer items-center" onClick={handleWordpressButton}>
                  <Image src="/images/chatform/icon_wordpress.png" alt="Aiana wordpress" width={90} height={90} />
                  <p>Wordpress</p>
                </button>
                <button type="button" className="flex flex-col gap-2 cursor-pointer items-center" onClick={handleShopifyButton}>
                  <Image src="/images/chatform/icon_shopify.png" alt="Aiana shopify" width={80} height={80} />
                  <p>Shopify</p>
                </button>
                <button type="button" className="flex flex-col gap-2 cursor-pointer items-center" onClick={handleOtherButton}>
                  <Image src="/images/chatform/icon_other.png" alt="Aiana other" width={90} height={90} /> 
                  <p>Other</p>               
                </button>
              </div>
              {isAppStore && <div className="flex flex-col justify-center items-center gap-3 mb-5">
                <h3
                  className="text-[14px] pt-3 pl-3 leading-6 font-medium text-[#767676] text-center"
                  id="modal-title"
                >
                  {content}
                </h3>
                <button type="button" className="text-blue-700 underline" onClick={() => setOpen(false)}>
                  {buttonText}
                </button>
              </div>}
                {!isAppStore && <div>
                  <h3
                  className="text-[14px] pt-3 pl-3 leading-6 font-medium text-[#767676] text-center"
                  id="modal-title"
                >
                  {content}
                </h3>
                  <div className="mt-2">
                    <p className="text-sm text-[#070E0B] p-5 rounded-md">
                      <div className="font-bold mt-2">{description}</div>
                    </p>
                  </div>
                  <div className="mt-5 sm:mt-6 flex justify-center">
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="mt-3 w-full bg-black text-white inline-flex justify-center rounded-md border shadow-sm px-4 py-2 transition duration-150 ease-out text-base font-medium hover:bg-gray-200 hover:text-black focus:outline-none sm:mt-0 sm:w-auto sm:text-sm"
                  >
                    {t('Copy_Script')}
                  </button>
                </div>
              </div>
              }
              
              
            </div>
          </div>
        </div>
      </div>
    )
  )
}
