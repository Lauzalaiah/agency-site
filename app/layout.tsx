import type { Viewport } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

export const metadata = {
  title: 'Leo OFM Elite',
  description: 'We scale creators to $10k+/month',
  icons: {
  icon: [
    { url: '/favicon.ico' },
    { url: '/android-chrome.png', sizes: '512x512', type: 'image/png' },
  ],
  shortcut: ['/favicon.ico'],
  apple: [
    { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
  ],
}
}

export const viewport: Viewport = {
  themeColor: '#000000',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${playfair.variable} ${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  )
}
