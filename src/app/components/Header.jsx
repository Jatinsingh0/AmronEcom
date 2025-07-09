"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ShoppingCart, User, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { jwtDecode } from "jwt-decode"
import { useRouter } from "next/navigation"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  const [userName, setUserName] = useState("")
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in via token
    const token = localStorage.getItem("token")
    let user = null
    if (token) {
      setIsLoggedIn(true)
      try {
        const decoded = jwtDecode(token)
        setUserName(decoded.firstName || "User")
        user = decoded
      } catch {
        setUserName("")
      }
    } else {
      setIsLoggedIn(false)
      setUserName("")
    }
    // Get cart count
    const cartKey = user && (user.id || user.email) ? `cart_${user.id || user.email}` : "cart_guest"
    const cart = JSON.parse(localStorage.getItem(cartKey) || "[]")
    setCartCount(cart.reduce((total, item) => total + item.quantity, 0))

    // Listen for cart changes
    const handleStorage = () => {
      // Re-check user and cart key on every storage event
      const token = localStorage.getItem("token")
      let user = null
      if (token) {
        try {
          user = jwtDecode(token)
        } catch {}
      }
      const cartKey = user && (user.id || user.email) ? `cart_${user.id || user.email}` : "cart_guest"
      const cart = JSON.parse(localStorage.getItem(cartKey) || "[]")
      setCartCount(cart.reduce((total, item) => total + item.quantity, 0))
    }
    window.addEventListener("storage", handleStorage)
    return () => window.removeEventListener("storage", handleStorage)
  }, [isLoggedIn, userName])

  const handleLogout = async () => {
    // Optionally call logout API
    await fetch("/api/logout", { method: "POST" })
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setIsLoggedIn(false)
    setUserName("")
    // Dispatch custom logout event
    window.dispatchEvent(new Event("logout"))
    router.replace("/")
  }

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-blue-600">
            AmronShop
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-blue-600 transition-colors">
              Home
            </Link>
            <Link href="/" className="text-gray-700 hover:text-blue-600 transition-colors">
              Products
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-blue-600 transition-colors">
              About
            </Link>
          </nav>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-4">
            <Link href="/cart" className="relative">
              <ShoppingCart className="h-6 w-6 text-gray-700 hover:text-blue-600 transition-colors" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {isLoggedIn ? (
              <div className="flex items-center space-x-2">
                <User className="h-6 w-6 text-gray-700" />
                <span className="font-medium text-gray-700">{userName}</span>
                <Button onClick={handleLogout} variant="outline" size="sm">
                  Logout
                </Button>
              </div>
            ) : (
              <Link href="/login">
                <Button variant="outline" size="sm">
                  Login
                </Button>
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t pt-4">
            <div className="flex flex-col space-y-2">
              <Link href="/" className="text-gray-700 hover:text-blue-600 py-2">
                Home
              </Link>
              <Link href="/products" className="text-gray-700 hover:text-blue-600 py-2">
                Products
              </Link>
              <Link href="/about" className="text-gray-700 hover:text-blue-600 py-2">
                About
              </Link>
              <Link href="/contact" className="text-gray-700 hover:text-blue-600 py-2">
                Contact
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
