import { useRouter } from 'next/router';  
import Image from 'next/image';
import { FaChevronRight } from 'react-icons/fa';

const BreadCrumbs = () => {
    const iconObject = {  
        "admin": "My Account",
        "users": "Users",
        "user": "User",  
        "chatbot": "Chatbots",  
        "knowledge": "Knowledge Base",  
        "chatlogs": "Chatlogs",  
        "tickets": "Tickets",  
        "invoice-plan": "Invoice Plan",  
        "billing-plan": "Invoice Plan",
        "editbot": "Edit Chatbot",  
        "createbot": "Create Chatbot",  
        "editknowledge": "Edit Knowledge Base",  
        "createknowledge": "Create Knowledge Base"  
    };  

    const iconImageObject = {  
        "admin": "icon_account_selected.png",
        "users": "icon_users.svg", 
        "user": "icon_account_selected.png",
        "chatbot": "icon_chatbot_selected.png",  
        "knowledge": "icon_knowledge_selected.png",  
        "chatlogs": "icon_chatlogs_selected.png",  
        "tickets": "icon_tickets_selected.png",  
        "invoice-plan": "icon_invoice_selected.png",  
        "billing-plan": "icon_invoice_selected.png"  
    }; 
    const router = useRouter();  
    const { pathname } = router;

    // Split the pathname by "/" and filter out any empty sections  
    const arry = pathname.split('/').filter(section => section !== '');  

    return (  
        <div>
            <div className='flex flex-row gap-2'> 
                {
                    arry.length!==0 && <div className='flex flex-row justify-center items-center gap-2'>
                        <Image src="/images/navbar/icon_home_unselected.png" alt="Home" width={20} height={20}/>
                        <p>HOME</p>
                    </div>
                }
                {arry.map((item, index) => (
                    <div key={`nav-${item}`} className='flex flex-row justify-center items-center gap-2'>
                        <FaChevronRight />                        
                        {item === "[edit]" ? null : (
                            <Image 
                                src={index + 1 !== arry.length 
                                    ? `/images/navbar/icon_${item}_unselected.png`
                                    : `/images/navbar/${iconImageObject[item] || `icon_${item}_unselected.png`}`
                                }
                                alt={item}
                                width={20} 
                                height={20}
                                priority
                            />
                        )}
                        <div className='flex flex-row'>
                            {index + 1 === arry.length && router.query.bot && <p>
                                { router.query.bot === "-1"? "Create Chatbot" : "Edit Chatbot"}  
                            </p>}
                            {index + 1 === arry.length && router.query.baseId && <p>
                                { router.query.baseId === "-1"? "Create Knowledge Base" : "Edit knowledge Base"}  
                            </p>}
                            <button 
                                type='button'
                                onClick={() => {if(item !== "user") router.push(`/${item}`)}}
                            >
                                {iconObject[item]}
                            </button>
                        </div>
                    </div>
                ))}
            </div>  
        </div>  
    );  
};  

export default BreadCrumbs; 