import './globals.css'

export const metadata = {
  title: 'Notion Style Resume',
  description: 'A notion-style resume editor built with Next.js and React',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
