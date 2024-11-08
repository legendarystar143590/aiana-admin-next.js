import Layout from "../../Layout"
import Logs from "./Logs"

const Chatlog = ({session, setSession, chatLog, setChatLog, botAvatar}) => (

  <Layout type="admin">
    <div className="px-[20px] py-[20px] w-full h-full flex flex-col">
      <Logs session={session} setSession={setSession} chatLog={chatLog} setChatLog={setChatLog} botAvatar={botAvatar}/>
    </div>
  </Layout>
)

export default Chatlog
