import React, {useState} from "react"
import withAuth from "@/providers/AuthContext"
import Layout from "../../Layout"
import Tickets from "./Tickets"
import Logs from "./Logs"

const DashboardPage = () => {
  const [session, setSession] = useState("");
  const [tickets, setTickets] = useState([]);
  const [botAvatar, setBotAvatar] = useState("");
  const [ticketContent, setTicketContent] = useState("");
  const [currentTicketId, setCurrentTicketId] = useState("");
  return(
    <Layout type="admin">
      <div className="px-[20px] py-[20px] w-full h-full flex md:flex-row flex-col gap-8">
        <div className="md:w-1/3 w-full">
          <Tickets setSession={setSession} tickets={tickets} setTickets={setTickets} setBotAvatar={setBotAvatar} setTicketContent={setTicketContent} setCurrentTicketId={setCurrentTicketId}/>
        </div>
        <div className="md:w-2/3 w-full">
          <Logs session={session} setSession={setSession} tickets={tickets} setTickets={setTickets} ticketContent={ticketContent} botAvatar={botAvatar} currentTicketId={currentTicketId}/>
        </div>
      </div>
    </Layout>
  )
}

export default withAuth(DashboardPage)
