import { useRouter } from 'next/router';  
import Image from 'next/image';
import { FaChevronRight } from 'react-icons/fa';

const BreadCrumbs = () => {
    const iconObject = {  
        "admin": "My Account",  
        "chatbot": "Chatbots",  
        "knowledge": "Knowledge Base",  
        "chatlogs": "Chatlogs",  
        "tickets": "Tickets",  
        "invoice-plan": "Invoice Plan",  
        "editbot": "Edit Chatbot",  
        "createbot": "Create Chatbot",  
        "editknowledge": "Edit Knowledge Base",  
        "createknowledge": "Create Knowledge Base"  
    };  

    const iconImageObject = {  
        "admin": "icon_account_selected.png",  
        "chatbot": "icon_chatbot_selected.png",  
        "knowledge": "icon_knowledge_selected.png",  
        "chatlogs": "icon_chatlogs_selected.png",  
        "tickets": "icon_tickets_selected.png",  
        "invoice-plan": "icon_invoice_selected.png"  
    }; 
    const router = useRouter();  
    const { pathname } = router;

    // Split the pathname by "/" and filter out any empty sections  
    const arry = pathname.split('/').filter(section => section !== '');  

    return (  
        <div>
            <div className='flex flex-row gap-2'>  
                {/* Display the array elements */}
                {
                    arry.length!==0 && <div className='flex flex-row justify-center items-center gap-2'>
                        <Image src="/images/navbar/icon_home_unselected.png" alt="Home" width={20} height={20}/>
                        <p>HOME</p>
                    </div>
                }
                {arry.map((item, index) => (
                    <div key={index} className='flex flex-row justify-center items-center gap-2'>
                        <FaChevronRight />
                        {
                            item === "[edit]" ?  <></> :index + 1 !== arry.length ? <Image src={`/images/navbar/icon_${item}_unselected.png`} alt={item} width={20} height={20}/> : <Image src={`/images/navbar/${iconImageObject[item]}`} alt={item} width={20} height={20}/>
                        }
                        <div className='flex flex-row'>
                            <p>{index + 1 === arry.length?router.query.bot ? router.query.bot !== "-1" ? iconObject["editbot"] : iconObject["createbot"] : <></>:<></>}</p>
                            <p>{index + 1 === arry.length?router.query.baseId ? router.query.baseId !== "-1" ? iconObject["editknowledge"] : iconObject["createknowledge"] : <></> :<></>}</p>
                            <p role='button' onClick={()=>router.push(`/${item}`)}>{iconObject[item]}</p>
                        </div>
                    </div>
                ))}  
            </div>  
        </div>  
    );  
};  

export default BreadCrumbs; 