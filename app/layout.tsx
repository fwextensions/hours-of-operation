import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Hours of Operation',
  description: 'Parse natural language business hours descriptions using AI',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
