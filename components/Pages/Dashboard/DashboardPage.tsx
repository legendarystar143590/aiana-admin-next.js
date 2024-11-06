import {useState} from "react"
import Layout from "../../Layout"
import ChatLogs from "./ChatLogs"
import Logs from "./Logs"

const DashboardPage = () =>{ 
  const [session, setSession] = useState("");
  const [chatLog, setChatLog] = useState([]);
  return(  
  <Layout type="admin">
    <div className="px-[20px] py-[20px] w-full h-full flex md:flex-row flex-col gap-8">
      <div className="md:w-1/3 w-full">
        <ChatLogs setSession={setSession} chatLog={chatLog} setChatLog={setChatLog}/>
      </div>
      <div className="md:w-2/3 w-full">
        <Logs session={session} chatLog={chatLog} setChatLog={setChatLog}/>
      </div>
    </div>
  </Layout>
)
}
export default DashboardPage
