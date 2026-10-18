// app/layout.jsx
import './globals.css'
import Providers from './Providers'
import Script from 'next/script'
import React from 'react'
import {
  Geist as V0_Font_Geist,
  Geist_Mono as V0_Font_Geist_Mono,
  Source_Serif_4 as V0_Font_Source_Serif_4
} from 'next/font/google'
import "react-toastify/dist/ReactToastify.css";
import { AppToastProvider } from './AppToastContext'
import AppToast from '@/components/AppToast'
import SmoothScrollProvider from './SmoothScrollProvider'
import VoiceAssistant from '@/components/ai/VoiceAssistant'
const _geist = V0_Font_Geist({
  subsets: ['latin'],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
})

const _geistMono = V0_Font_Geist_Mono({
  subsets: ['latin'],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
})

const _sourceSerif_4 = V0_Font_Source_Serif_4({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  variable: '--font-source-serif',
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
})

export const metadata = {
  title: 'TPF Aid | A Fundraising Website | Supporting Those In Need',
  description: 'Support those in need through transparent and trusted fundraising.',
}

export default async function RootLayout({ children }) {
  // ✅ FIX: cached + revalidated CMS fetch
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cms/all`, {
    cache: "no-store",
  })


  console.log("CMS ALL FETCHED")

  const data = await res.json()

  // ✅ FIX: freeze reference to avoid context re-triggering
  const cms = Object.freeze(data?.data || [])

  return (
    <html lang="en">
      <body
        className={`font-sans antialiased ${_geist.className} ${_geistMono.variable} ${_sourceSerif_4.variable}`}
      >
        {/* CMS available app-wide without refetching */}

        <Providers cms={cms}>
          <SmoothScrollProvider>
            {children}
          </SmoothScrollProvider>
          <VoiceAssistant />
        </Providers>


      </body>
    </html>
  )
}
