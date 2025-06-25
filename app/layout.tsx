import type { Metadata } from 'next'
import { Inter } from 'next/font/google' // Import Inter font
import './globals.css'

// กำหนด font
const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Minimal Soundboard',
  description: 'A clean and minimalist soundboard app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark" style={{ colorScheme: 'dark' }}>
      {/* ใช้ className ของ Inter ที่ body */}
      <body className={inter.className}>{children}</body>
    </html>
  )
}