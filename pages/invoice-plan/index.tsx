import PricingPage from "@/components/Pages/PricingPage"

const Pricing = () => (
    <PricingPage />
)

export default Pricing

export async function getStaticProps(context) {
    return {
        props: {
            messages: (await import(`@/messages/${context.locale}.json`)).default
        }
    };
}