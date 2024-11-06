import { useRouter } from "next/router"
import { GetStaticPaths } from "next";
import Chatlog from "@/components/Pages/Dashboard/Chatlog"

const Log = ({chatLog, setChatLog}) => {
    const router = useRouter()
    const { sessionId } = router.query;
    return (
        <Chatlog session={sessionId} chatLog={chatLog} setChatLog={setChatLog}/>
    )
}

export default Log
export async function getStaticProps(context) {
    return {
        props: {
            messages: (await import(`@/messages/${context.locale}.json`)).default
        }
    };
}
export const getStaticPaths: GetStaticPaths = async () => ({
    paths: [], // No pre-rendered paths
    fallback: 'blocking', // or 'true' for client-side rendering on unknown paths
  })