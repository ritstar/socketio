import './globals.css'

export const metadata = {
  title: 'Real-time Drawing Board',
  description: 'A real-time drawing board using Next.js, Socket.IO, and Tailwind CSS',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}