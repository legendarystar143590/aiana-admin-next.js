import "react-toastify/dist/ReactToastify.css"
import "@amir04lm26/react-modern-calendar-date-picker/lib/DatePicker.css"
import type { AppProps } from "next/app"
import Head from "next/head"
import { useRouter } from "next/router";
import { NextIntlClientProvider } from "next-intl";
import { ToastContainer } from "react-toastify"
import * as React from "react"
import { Analytics } from "@vercel/analytics/react"
import TokenProvider from "@/providers/TokenContext"
import SideMenuProvider from "@/providers/SideMenuProvider"
import "../styles/globals.css"


function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter()

  return (
    <>
      <Head>
        <title>aiana</title>
        <link rel="icon" href="/favicon/favicon.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png" />
      </Head>
      <TokenProvider >
        <NextIntlClientProvider 
          locale={router.locale}
          messages={pageProps.messages}
          timeZone="America/New_York"
        >
          <SideMenuProvider>
            <Component {...pageProps} />
            <ToastContainer />
            <Analytics />
          </SideMenuProvider>
        </NextIntlClientProvider>

      </TokenProvider>
    </>
  )
}
export default MyApp
