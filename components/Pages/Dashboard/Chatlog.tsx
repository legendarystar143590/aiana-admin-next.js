import Layout from "../../Layout"
import Logs from "./Logs"

const Chatlog = ({session, chatLog, setChatLog}) => (

  <Layout type="admin">
    <div className="px-[20px] py-[20px] w-full h-full flex flex-col">
      <Logs session={session} chatLog={chatLog} setChatLog={setChatLog}/>
    </div>
  </Layout>
)

export default Chatlog
