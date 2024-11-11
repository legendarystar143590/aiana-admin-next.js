import DashboardPage from "@/components/Pages/Dashboard"

const Dashboard = () => (
    <DashboardPage />
)

export default Dashboard
export async function getStaticProps(context) {
    return {
        props: {
            messages: (await import(`@/messages/${context.locale}.json`)).default
        }
    };
}