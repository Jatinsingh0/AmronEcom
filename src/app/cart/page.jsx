"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Minus, Plus, Trash2 } from "lucide-react"
import Header from "../components/Header"
import Footer from "../components/Footer"
import { jwtDecode } from "jwt-decode"

export default function CartPage() {
  const [cartItems, setCartItems] = useState([])
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userId, setUserId] = useState(null)
  const [showOrderHistoryBtn, setShowOrderHistoryBtn] = useState(false)
  const router = useRouter()

  // Helper to get user from localStorage (prefer token)
  const getUser = () => {
    const token = localStorage.getItem("token")
    if (token) {
      try {
        return jwtDecode(token)
      } catch {
        // fallback to user if token is invalid
      }
    }
    const userStr = localStorage.getItem("user")
    if (!userStr) return null
    try {
      return JSON.parse(userStr)
    } catch {
      return null
    }
  }

  // Helper to get cart key
  const getCartKey = (user) => {
    if (user && (user.id || user.userId)) return `cart_${user.id || user.userId}`
    if (user && user.email) return `cart_${user.email}`
    return "cart_guest"
  }

  // Load cart and user info
  const loadCartAndUser = () => {
    const user = getUser()
    const isUserLoggedIn = !!user
    console.log("Cart: User logged in:", isUserLoggedIn, "User:", user)
    setIsLoggedIn(isUserLoggedIn)
    setUserId(user?.id || user?.userId || user?.email || null)
    const cartKey = getCartKey(user)
    const cart = JSON.parse(localStorage.getItem(cartKey) || "[]")
    setCartItems(cart)
  }

  useEffect(() => {
    loadCartAndUser()
    
    // Listen for localStorage changes (login/logout/cart update from other tabs)
    const handleStorage = (e) => {
      loadCartAndUser()
    }
    
    // Listen for custom logout event
    const handleLogout = () => {
      setIsLoggedIn(false)
      setUserId(null)
      loadCartAndUser()
    }
    
    window.addEventListener("storage", handleStorage)
    window.addEventListener("logout", handleLogout)
    
    return () => {
      window.removeEventListener("storage", handleStorage)
      window.removeEventListener("logout", handleLogout)
    }
  }, [])

  // Update cart in localStorage for current user
  const saveCart = (updatedCart) => {
    const user = getUser()
    const cartKey = getCartKey(user)
    localStorage.setItem(cartKey, JSON.stringify(updatedCart))
  }

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity === 0) {
      removeItem(id)
      return
    }
    const updatedCart = cartItems.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item))
    setCartItems(updatedCart)
    saveCart(updatedCart)
  }

  const removeItem = (id) => {
    const updatedCart = cartItems.filter((item) => item.id !== id)
    setCartItems(updatedCart)
    saveCart(updatedCart)
  }

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)
  }

  const handleBuy = () => {
    if (!isLoggedIn) {
      router.push("/signup")
    } else {
      // Process purchase
      alert("Purchase successful! Thank you for your order.")
      const user = getUser()
      const cartKey = getCartKey(user)
      // Save order history
      const ordersKey = user && (user.id || user.userId || user.email) ? `orders_${user.id || user.userId || user.email}` : null
      if (ordersKey) {
        const prevOrders = JSON.parse(localStorage.getItem(ordersKey) || "[]")
        prevOrders.push({
          date: new Date().toISOString(),
          items: cartItems
        })
        localStorage.setItem(ordersKey, JSON.stringify(prevOrders))
      }
      localStorage.removeItem(cartKey)
      setCartItems([])
      setShowOrderHistoryBtn(true)
    }
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold mb-8">Your Cart is Empty</h1>
          <p className="text-gray-600 mb-8">Add some products to your cart to get started!</p>
          <Button onClick={() => router.push("/")}>Continue Shopping</Button>
          {showOrderHistoryBtn && (
            <div className="mt-6">
              <Button onClick={() => router.push("/orders")}>View Order History</Button>
            </div>
          )}
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      width={80}
                      height={80}
                      className="rounded-lg object-cover"
                    />

                    <div className="flex-1">
                      <h3 className="text-lg font-semibold">{item.name}</h3>
                      <p className="text-blue-600 font-bold">${item.price}</p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                        <Minus className="h-4 w-4" />
                      </Button>

                      <span className="w-8 text-center">{item.quantity}</span>

                      <Button variant="outline" size="sm" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="text-right">
                      <p className="font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(item.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div>
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">Order Summary</h2>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>${getTotalPrice()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping:</span>
                    <span>Free</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total:</span>
                      <span>${getTotalPrice()}</span>
                    </div>
                  </div>
                </div>

                {console.log("Cart: Rendering button, isLoggedIn:", isLoggedIn)}
                {isLoggedIn ? (
                  <Button onClick={handleBuy} className="w-full" size="lg">
                    Buy Now
                  </Button>
                ) : (
                  <Button onClick={() => router.push("/login")} className="w-full" size="lg">
                    Login to Buy
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
