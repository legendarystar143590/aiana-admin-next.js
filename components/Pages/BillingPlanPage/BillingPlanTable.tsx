import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { AUTH_API } from '@/components/utils/serverURL';
import Card from '../../Card';

const BillingPlanTable: React.FC = () => {
  const toa = useTranslations('common');
  const router = useRouter()
  const [email, setEmail] = useState("")
  const cards = [
    { title: 'Try out Aiana', description: 'For business starts', price:'0', features:['1 chatbot', '25 chat sessions/month', '50MB document storage','1 linked website', 'Tickets', 'Chat logs', 'Email notifications'], iconImage:'FreePlan', buttonText:'Try for free', priceId:'price_1PqTDm2NgSmULURoVr2szyAk'},
    { title: 'Essentials', description: 'For small businesses', price:'29', features:['3 chatbot', '500 chat sessions/month', '250MB document storage','3 linked website', 'Tickets', 'Chat logs', 'Email notifications'], iconImage:'EssentialsPlan', buttonText:'Subscribe' , priceId:'price_1PqT852NgSmULURo0lpcYws8'},
    { title: 'Advanced', description: 'More of everything', price:'49' , features:['5 chatbot', '1000 chat sessions/month', '1GB document storage','Up to 7 linked website', 'Tickets', 'Chat logs', 'Email notifications'], iconImage:'AdvancedPlan', buttonText:'Subscribe' , priceId:'price_1PqTBJ2NgSmULURoqRML7ORM'},
    { title: 'Enterprise', description: 'Tailored Solutions for Enterprises Seeking Unmatched Performance', price:'' , features:[], iconImage:'EnterprisePlan', buttonText:'Contact us' , priceId:''   },
  ];

  useEffect(()=>{
    setEmail(localStorage.getItem("email")!)
  }, [])

  const handleSubscribeClick = async() => {
    try{
      const response = await fetch((`${AUTH_API.GET_UPGRADE_URL}`),{
        method:"POST",
        headers:{
          'Content-Type': 'application/json',
          'ngrok-skip-brower-warning': "1",
        },
        body: JSON.stringify({email})
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      
      if (!data.sessionId) {
        throw new Error('No session ID received');
      }
      
      window.open(`${data.sessionId}`, '_blank');
    } catch(error){
      if (error instanceof TypeError) {
        console.error('Network error:', error.message);
        // Handle network errors (e.g., no internet connection)
      } else {
        console.error('Error during subscription:', error);
        // Handle other types of errors
      }
  
      // You can show error message to user using your preferred UI method
      // For example, using an alert or toast notification
      alert('Failed to process subscription. Please try again later.');
    } finally {
      // Clean up or reset loading state if needed
    }
  }

  return (
    <div className='flex flex-col gap-3 h-full overflow-y-auto'>
        <div className="h-full overflow-y-auto grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4 p-4 items-center">
            
            {cards.map((card) => (
                <Card key={card.title} title={card.title} description={card.description} price={card.price} features={card.features} iconImage={card.iconImage} buttonText={card.buttonText} priceId={card.priceId}/>
            ))}         
        </div>
        <div className='flex items-center justify-center w-full'>
            <button type='button' className='bg-[#7412c4] rounded-md text-white w-full md:w-[500px]  h-[40px] text-[18px] hidden' onClick={handleSubscribeClick}>{toa('Upgrade')}</button>
        </div>
    </div>
  );
};

export default BillingPlanTable;