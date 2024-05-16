import { useRouter } from "next/router"
import Chatlog from "@/components/Pages/Dashboard/Chatlog"

const Log = () => {
    const router = useRouter()
    const { sessionId } = router.query;
    console.log("[log] page session_id is >>>>",sessionId)
    return (
        <Chatlog session={sessionId}/>
    )
}

export default Log
