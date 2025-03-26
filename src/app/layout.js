import './globals.css'
import { Toaster } from 'sonner';

export const metadata = {
  title: 'Notion Style Resume',
  description: 'A notion-style resume editor built with Next.js and React',
}

export default function RootLayout({ children }) {
  return (
    <html lang="zh">
      <body>
        {children}
        <Toaster position="top-center" />
      </body>
    </html>
  )
}
