import { useRouter } from "next/router"
import { useTranslations } from "use-intl"
import Image from "next/image"
import { FaUserFriends } from "react-icons/fa"
import { useSideMenu } from "@/providers/SideMenuProvider"

const MenuList = ({ open }) => {
  const t = useTranslations('common');
  const { push } = useRouter()


  const {
    iconActiveClasses,
    iconClasses,
    navContainerClasses,
    navClasses,
    profileActive,
    dashboardActive,
    createActive,
    knowledgeActive,
    ticketsActive,
    usersActive,
    billingActive,
    role
  } = useSideMenu()

  return (
    <div className={`relative z-[4] w-full pl-4 ${open ? "mt-3" : "mt-10"}`}>
      <div className={`flex justify-center items-center w-full pt-8 pb-4 pl-8 ${open ? navClasses : "hidden"}`}>
        <p className="flex justify-start text-left items-center w-full">
          SETUP
        </p>
      </div>
      <button
        type="button"
        className={`flex justify-center items-center w-full ${knowledgeActive ? 'border rounded-lg shadow' : ''}`}
        onClick={() => push("/knowledge")}
      >
        <div
          className={`${
            knowledgeActive ? navContainerClasses : navContainerClasses
          } flex items-center justify-start`}
          style={{ paddingRight: !open && "12px", paddingLeft: !open && "12px" }}
        >
          <div className={knowledgeActive ? iconActiveClasses : iconClasses}>
            <Image alt="icon_knowledge" src={`${ knowledgeActive ? "/images/navbar/icon_knowledge_selected.png" : "/images/navbar/icon_knowledge_unselected.png"}`} width={18} height={20} className="opacity-90" />
          </div>
          <p className={`${open ? navClasses : "hidden"} ${knowledgeActive ? "font-bold" : "font-normal"} ml-2 text-black opacity-90 text-[16px] text-left`}>
            {t('Knowledge_Base')}
          </p>
        </div>
      </button>
      <button
        type="button"
        className={`flex justify-center items-center w-full ${createActive ? 'border rounded-lg shadow' : ''}`}
        onClick={() => push("/chatbot")}
      >
        <div
          className={`${
            createActive ? navContainerClasses : navContainerClasses
          } flex items-center justify-start`}
          style={{ paddingRight: !open && "12px", paddingLeft: !open && "12px" }}
        >
          <div className={createActive ? iconActiveClasses : iconClasses}>
            <Image alt="icon_chatbot" src={`${ createActive ? "/images/navbar/icon_chatbot_selected.png" : "/images/navbar/icon_chatbot_unselected.png"}`} width={18} height={20} className="opacity-90" />
          </div>
          <p className={`${open ? navClasses : "hidden"} ${createActive ? "font-bold" : "font-normal"} ml-2 text-black opacity-90 text-[16px]`}>{t('Chatbot')}</p>
        </div>
      </button>
      <div className={`flex justify-center items-center w-full pt-8 pb-4 pl-8 ${open ? navClasses : "hidden"}`}>
        <p className="flex justify-start text-left items-center w-full">
          FOLLOW-UP
        </p>
      </div>
      <button
        type="button"
        className={`flex justify-center items-center w-full ${ticketsActive ? 'border rounded-lg shadow' : ''}`}
        onClick={() => push("/tickets")}
      >
        <div
          className={`${
            ticketsActive ? navContainerClasses : navContainerClasses
          } flex items-center justify-start`}
          style={{ paddingRight: !open && "12px", paddingLeft: !open && "12px" }}
        >
          <div className={ticketsActive ? iconActiveClasses : iconClasses}>
            <Image alt="icon_tickets" src={`${ ticketsActive ? "/images/navbar/icon_tickets_selected.png" : "/images/navbar/icon_tickets_unselected.png"}`} width={18} height={20} className="opacity-90" />
          </div>
          <p className={`${open ? navClasses : "hidden"} ${ticketsActive ? "font-bold" : "font-normal"} ml-2 text-black opacity-90 text-[16px]`}>{t('Tickets')}</p>
        </div>
      </button>
      <button
        type="button"
        className={`flex justify-center items-center w-full ${dashboardActive ? 'border rounded-lg shadow' : ''}`}
        onClick={() => push("/chatlogs")}
      >
        <div
          className={`${
            dashboardActive ? navContainerClasses : navContainerClasses
          } flex items-center justify-start`}
          style={{ paddingRight: !open && "12px", paddingLeft: !open && "12px" }}
        >
          <div className={dashboardActive ? iconActiveClasses : iconClasses}>
            <Image alt="icon_dashboard" src={`${ dashboardActive ? "/images/navbar/icon_chatlogs_selected.png" : "/images/navbar/icon_chatlogs_unselected.png"}`} width={18} height={20} className="opacity-90" />
          </div>
          <p className={`${open ? navClasses : "hidden"} ${dashboardActive ? "font-bold" : "font-normal"} ml-2 text-black opacity-90 text-[16px]`}>{t('Chatlogs')}</p>
        </div>
      </button>
      
      <button
        type="button"
        className={`flex justify-center items-center w-full ${profileActive ? 'border rounded-lg shadow' : ''}`}
        onClick={() => push("/admin")}
      >
        <div
          className={`${
            profileActive ? navContainerClasses : navContainerClasses
          } flex items-center justify-start`}
          style={{ paddingRight: !open && "12px", paddingLeft: !open && "12px" }}
        >
          <div className={profileActive ? iconActiveClasses : iconClasses}>
            <Image alt="icon_account" src={`${ profileActive ? "/images/navbar/icon_account_selected.png" : "/images/navbar/icon_account_unselected.png"}`} width={18} height={20} className="opacity-90" />
          </div>
          <p className={`${open ? navClasses : "hidden"} ${profileActive ? "font-bold" : "font-normal"} ml-2 text-black opacity-90 text-[16px]`}>
            {t('My_Account')}
          </p>
        </div>
      </button>
      {role === "admin" && (
        <button
          type="button"
          className={`flex justify-center items-center w-full ${usersActive ? 'border rounded-lg shadow' : ''}`}
          onClick={() => push("/users")}
        >
          <div
            className={`${
              usersActive ? navContainerClasses : navContainerClasses
            } flex items-center justify-start`}
            style={{ paddingRight: !open && "12px", paddingLeft: !open && "12px" }}
          >
            <div className={usersActive ? iconActiveClasses : iconClasses}>
              <FaUserFriends width={18} height={18}  />
              {/* <Image alt="icon_tickets" src={`${ ticketsActive ? "/images/navbar/icon_tickets_selected.png" : "/images/navbar/icon_tickets_unselected.png"}`} width={18} height={20} className="opacity-90" /> */}
            </div>
            <p className={`${open ? navClasses : "hidden"} ${usersActive ? "font-bold" : "font-normal"} ml-2 text-black opacity-90 text-[16px]`}>{t('Users')}</p>
          </div>
        </button>
      )}
      
      <button
        type="button"
        className={`flex justify-center items-center w-full ${billingActive ? 'border rounded-lg shadow' : ''}`}
        // onClick={() => {if(localStorage.getItem("status") === "active") push("/billing-plan"); else push("/invoice-plan");}}
        onClick={() => push("/billing-plan")}
      >
        <div
          className={`text-white ${
            billingActive ? navContainerClasses : navContainerClasses
          } flex items-center justify-start`}
          style={{ paddingRight: !open && "12px", paddingLeft: !open && "12px" }}
        >
          <div className={billingActive ? iconActiveClasses : iconClasses}>
            <Image alt="icon_invoice" src={`${ billingActive ? "/images/navbar/icon_invoice_selected.png" : "/images/navbar/icon_invoice_unselected.png"}`} width={18} height={20} className="opacity-90" />
          </div>
          <p className={`${open ? navClasses : "hidden"} ${billingActive ? "font-bold" : "font-normal"} ml-2 text-black opacity-90 text-[16px]`}>{t('Invoice_Plan')}</p>
        </div>
      </button>
    </div>
  )
}

export default MenuList
