import { useRouter } from 'next/router';  
import Image from 'next/image';
import { FaChevronRight } from 'react-icons/fa';

const BreadCrumbs = () => {
    const iconObject: Record<string, string> = {
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

    const iconImageObject: Record<string, string> = {
        "admin": "icon_account_selected.png",
        "chatbot": "icon_chatbot_selected.png",
        "knowledge": "icon_knowledge_selected.png",
        "chatlogs": "icon_chatlogs_selected.png",
        "tickets": "icon_tickets_selected.png",
        "Invoice-Plan": "icon_invoice_selected.png"
    };

    const router = useRouter();
    const { pathname } = router;
    const arry = pathname.split('/').filter(section => section !== '');

    return (
        <div>
            <div className='flex flex-row gap-2'>
                {arry.length > 0 && (
                    <div className='flex flex-row justify-center items-center gap-2'>
                        <Image src="/images/navbar/Icon_Home_unselected.png" alt="Home" width={20} height={20}/>
                        <p>HOME</p>
                    </div>
                )}
                {arry.map((item, index) => (
                    <div key={index} className='flex flex-row justify-center items-center gap-2'>
                        <FaChevronRight />
                        {item === "[edit]" ? null : (
                            <Image 
                                src={`/images/navbar/${index + 1 === arry.length ? iconImageObject[item] : `icon_${item}_unselected.png`}`} 
                                alt={item} 
                                width={20} 
                                height={20}
                            />
                        )}
                        <div className='flex flex-row'>
                            {index + 1 === arry.length && router.query.bot && (
                                <p>{router.query.bot !== "-1" ? iconObject["editbot"] : iconObject["createbot"]}</p>
                            )}
                            {index + 1 === arry.length && router.query.baseId && (
                                <p>{router.query.baseId !== "-1" ? iconObject["editknowledge"] : iconObject["createknowledge"]}</p>
                            )}
                            <p role='button' onClick={() => router.push(`/${item}`)}>{iconObject[item]}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BreadCrumbs;