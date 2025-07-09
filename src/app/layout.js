import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "AmronShop - Your Online Shopping Destination",
  description: "Discover amazing products at unbeatable prices. Shop t-shirts, shoes, lowers, jeans and more!",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
