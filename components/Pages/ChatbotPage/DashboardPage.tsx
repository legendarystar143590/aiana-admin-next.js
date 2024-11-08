import {useState} from "react"
import Layout from "../../Layout"
import ChatLogs from "./ChatLogs"
import Logs from "./Logs"

const DashboardPage = () =>{ 
  const [session, setSession] = useState("");
  const [chatLog, setChatLog] = useState([]);
  const [botAvatar, setBotAvatar] = useState("");
  return(  
  <Layout type="admin">
    <div className="px-[20px] py-[20px] w-full h-full flex md:flex-row flex-col gap-8">
      <div className="md:w-1/3 w-full">
        <ChatLogs setSession={setSession} chatLog={chatLog} setChatLog={setChatLog} setBotAvatar={setBotAvatar}/>
      </div>
      <div className="md:w-2/3 w-full">
        <Logs session={session} setSession={setSession} chatLog={chatLog} setChatLog={setChatLog} botAvatar={botAvatar}/>
      </div>
    </div>
  </Layout>
)
}
export default DashboardPage
