
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface CardProps {
  title: string;
  description: string;
  price:string;
  features:string[];
  iconImage:string;
  buttonText:string;
}

const Card: React.FC<CardProps> = ({ title, description, price, features, iconImage, buttonText }) => {
    const router = useRouter()
    const [billingPlan, setBillingPlan] = useState("")
    useEffect(()=>{
        const plan = localStorage.getItem("plan");
        console.log(plan)
        if(plan) {
          if(plan==='aiana_try'){
            setBillingPlan('0')
          } else if(plan==='aiana_essentials'){
            setBillingPlan('29')
          } else if(plan==='aiana_advanced'){
            setBillingPlan('49')
          } else {
            setBillingPlan('')
          }
        } else {
          router.push("/signin")
        }
    }, [])

  return (
    <div className="relative rounded-xl border-gray-200 border p-5 m-4 flex flex-col gap-3 pt-[70px] h-full">
      <div className='absolute top-5 left-5 flex items-center justify-center text-white'>
        <Image src={`/images/icon_${iconImage}.png`} alt='iconImage' width={35} height={35} />
      </div>
      <div className='flex flex-col justify-between h-[180px]'>
        <div>
            <h2 className="text-xl font-bold mb-2">{title}</h2>
            <p className="text-gray-800">{description}</p>
        </div>
        <div className='flex flex-col gap-2'>
            {price!==''&&(
                 <div className='flex flex-row items-end'>
                    <p className='text-[30px] font-semibold'>&euro;{price}</p>
                    <p className='text-gray-500 w-[10px] text-[12px] pb-1.5'>/month</p>
                </div>
            )}
        </div>
        <div>
          <button 
            type='button' 
            className='w-full bg-black text-white text-[14px] py-2 rounded-lg'
            onClick={()=>{
              localStorage.setItem("plan", billingPlan)
              router.push("/signin")
            }}
          >
            {buttonText}
          </button>
        </div>
      </div>
      <hr className='my-3'/>
      {features.length!==0&&(
        <div className='flex flex-col gap-2'>
            This includes:
            {features.map((item)=>(
                <div key={item.toString()} className='flex flex-row justify-start items-center text-[14px] gap-1'>
                    <Image src="/images/circle-check-solid.png" alt="avatar" width={16} height={16} />
                    {item}
                </div>
            ))}
        </div>
      )}

    </div>
  );
};

export default Card;