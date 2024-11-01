import { useRouter } from "next/router"
import { useTranslations } from "use-intl"
import Image from "next/image"
import { GiUpgrade } from "react-icons/gi";
import { useSideMenu } from "@/providers/SideMenuProvider"

const MenuList = ({ open }) => {
  const t = useTranslations('common');
  const { push } = useRouter()


  const {
    navActiveContainerClasses,
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
    <div className={`relative z-[4] w-full ${open ? "mt-3" : "mt-10"}`}>
      <button
        type="button"
        className="flex justify-center items-center w-full"
        onClick={() => push("/admin")}
      >
        <div
          className={`${
            profileActive ? navActiveContainerClasses : navContainerClasses
          } flex items-center justify-start`}
        >
          <div className={profileActive ? iconActiveClasses : iconClasses}>
            {
              open ?
              <Image alt="icon_account" src="/images/navbar/icon_account_selected.svg" width={18} height={20} className="opacity-90" />
              :
              <Image alt="icon_account" src="/images/navbar/icon_account_unselected.svg" width={18} height={20} className="opacity-90" />
            }
          </div>
          <p className={`${open ? navClasses : "hidden"} ml-2 text-white opacity-90 text-[16px]`}>
            {t('My_Account')}
          </p>
        </div>
      </button>
      {role === "admin" && (
        <button
          type="button"
          className="flex justify-center items-center w-full"
          onClick={() => push("/users")}
        >
          <div
            className={`${
              usersActive ? navActiveContainerClasses : navContainerClasses
            } flex items-center justify-start`}
          >
            <div className={usersActive ? iconActiveClasses : iconClasses}>
              <Image alt="icon_users" src="/images/navbar/icon_users.svg" width={18} height={20} className="opacity-90" />
            </div>
            <p className={`${open ? navClasses : "hidden"} ml-2 text-white opacity-90 text-[16px]`}>{t('Users')}</p>
          </div>
        </button>
      )}
      <button
        type="button"
        className="flex justify-center items-center w-full"
        onClick={() => push("/chatbot")}
      >
        <div
          className={`${
            createActive ? navActiveContainerClasses : navContainerClasses
          } flex items-center justify-start`}
          style={{ paddingRight: !open && "14px", paddingLeft: !open && "14px" }}
        >
          <div className={createActive ? iconActiveClasses : iconClasses}>
            <Image alt="icon_chatbot" src="/images/navbar/icon_chatbot.svg" width={24} height={20} className="opacity-90" />
          </div>
          <p className={`${open ? navClasses : "hidden"} ml-2 text-white opacity-90 text-[16px]`}>{t('Chatbot')}</p>
        </div>
      </button>
      <button
        type="button"
        className="flex justify-center items-center w-full"
        onClick={() => push("/knowledge")}
      >
        <div
          className={`${
            knowledgeActive ? navActiveContainerClasses : navContainerClasses
          } flex items-center justify-start`}
        >
          <div className={knowledgeActive ? iconActiveClasses : iconClasses}>
            <Image alt="icon_knowledge" src="/images/navbar/icon_knowledge.svg" width={18} height={20} className="opacity-90" />
          </div>
          <p className={`${open ? navClasses : "hidden"} ml-2 text-white opacity-90 text-[16px] text-left`}>
            {t('Knowledge_Base')}
          </p>
        </div>
      </button>
      <button
        type="button"
        className="flex justify-center items-center w-full"
        onClick={() => push("/dashboard")}
      >
        <div
          className={`${
            dashboardActive ? navActiveContainerClasses : navContainerClasses
          } flex items-center justify-start`}
        >
          <div className={dashboardActive ? iconActiveClasses : iconClasses}>
            <Image alt="icon_chatlogs" src="/images/navbar/icon_chatlogs.svg" width={18} height={20} className="opacity-90" />
          </div>
          <p className={`${open ? navClasses : "hidden"} ml-2 text-white opacity-90 text-[16px]`}>{t('Chatlogs')}</p>
        </div>
      </button>
      <button
        type="button"
        className="flex justify-center items-center w-full"
        onClick={() => push("/tickets")}
      >
        <div
          className={`${
            ticketsActive ? navActiveContainerClasses : navContainerClasses
          } flex items-center justify-start`}
        >
          <div className={ticketsActive ? iconActiveClasses : iconClasses}>
            <Image alt="icon_tickets.svg" src="/images/navbar/icon_tickets.svg" width={18} height={20} className="opacity-90" />
          </div>
          <p className={`${open ? navClasses : "hidden"} ml-2 text-white opacity-90 text-[16px]`}>{t('Tickets')}</p>
        </div>
      </button>
      <button
        type="button"
        className="flex justify-center items-center w-full"
        onClick={() => {if(localStorage.getItem("status") === "active") push("/billing-plan"); else push("/pricing");}}
      >
        <div
          className={`text-white ${
            billingActive ? navActiveContainerClasses : navContainerClasses
          } flex items-center justify-start`}
        >
          <div className={billingActive ? iconActiveClasses : iconClasses}>
            <GiUpgrade />
          </div>
          <p className={`${open ? navClasses : "hidden"} ml-2 text-white opacity-90 text-[16px]`}>{t('BillingPlan')}</p>
        </div>
      </button>
    </div>
  )
}

export default MenuList
