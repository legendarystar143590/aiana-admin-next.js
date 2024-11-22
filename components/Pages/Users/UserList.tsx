import { useEffect, useState } from "react"
import axios from "axios"
import { useRouter } from "next/router"
import { FaEdit } from "react-icons/fa"
import { useTranslations } from "use-intl"
import formatDateString, { setExpiryTime } from '@/components/utils/common'
import { AUTH_API } from "@/components/utils/serverURL"
import { customerToast } from "@/components/Toast"

const UserList = () => {
  const t = useTranslations('users');
  const toa = useTranslations('toast');
  const trole = useTranslations('common');
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const userIdFromStorage = localStorage.getItem("userID");
    setIsLoading(true);
    if (userIdFromStorage !== "") {

      axios.post(AUTH_API.GET_USERS, { userId: userIdFromStorage }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,  // Example for adding Authorization header
          'Content-Type': 'application/json',  // Explicitly defining the Content-Type
        }
      })
        .then((response) => {
          if (response.status === 200) {
            setUsers(response.data);
            setExpiryTime();
          }
          if (response.status === 401) {
            customerToast({type:'error', title: `${toa('Please_login')}`, content: ""})
            router.push("/signin");
          }
          setIsLoading(false);
        })
        .catch((error) => {
          if (error.response) {
            console.log('Error status code:', error.response.status);
            console.log('Error response data:', error.response.data);
            if (error.response.status === 401) {
              customerToast({type:'error', title: `${toa('Session_Expired_Please_log_in_again')}`, content: ""})
              router.push("/signin")
            }
            // Handle the error response as needed
          } else if (error.request) {
            // The request was made but no response was received
            console.log('Error request:', error.request);
            customerToast({type:'error', title: `${error.request}`, content: ""})
          } else {
            // Something happened in setting up the request that triggered an Error
            console.log('Error message:', error.message);
            customerToast({type:'error', title: `${error.message}`, content: ""})            
          }
          setIsLoading(false);
        });
    }
  }, []);

  const handleRowClick = (index) => {
    router.push(`/users/user?user=${index}`);
  }

  if (isLoading) {
    return (
      <div>{t('Loading')}</div>
    )
  }

  return (
    <div>
      <div className="w-full h-[50px] flex items-center justify-start text-black_8 font-bold pt-[20px] mb-[10px] text-2xl pl-10" >
        {t('Users')}
      </div>
      {users.length === 0 ? (
        <div className="text-center w-full">{t('There_is_no_user')}</div>
      ) : (
          <table style={{ minWidth: 700 }} aria-label="customized table" className="overflow-auto border-collapse text-sm mx-auto w-full">
            <thead className="bg-[#EEEEEE] text-[#767676] font-bold">
              <tr>
                <td className="px-5 py-2">{t('NAME')}</td>
                <td className="">{t('CONTACTS')}</td>
                <td className="">{t('LOCATION')}</td>
                <td className="">{t('LAST_LOGIN_DATE')}</td>
                <td className="">{t('REGISTERED_AT')}</td>
                <td className="">{t('ROLE')}</td>
                <td className="">{t('ACTION')}</td>
              </tr>
            </thead>
            <tbody>
              {users.map((row) => (
                <tr key={row.id} className="border-y-2 h-16" >
                  <td className="px-5"><p className="text-[#070E0B] font-bold">{`${row.first_name} ${row.last_name}`}</p><p className="text-[#343434]">{row.com_name}</p></td>
                  <td>{row.email}</td>
                  <td><p className="text-[#070E0B] font-bold">{row.com_country}</p><p className="text-[#343434]">{row.com_city}</p></td>
                  <td className="font-bold text-[#070E0B]">{formatDateString(row.last_login)}</td>
                  <td className="font-bold text-[#070E0B]">{formatDateString(row.created_at)}</td>
                  <td className="text-[#343434]">{row.role === 'admin' ? trole('admin') : trole('username')}</td>
                  <td><button type="button" aria-label="edit" onClick={() => handleRowClick(row.index)} className="p-2 bg-[#F4F4F4] rounded-md mr-5"><FaEdit className="w-5 h-5 text-[#767676]" aria-label="edit icon" /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
      )
      }
    </div>
  );
}

export default UserList;