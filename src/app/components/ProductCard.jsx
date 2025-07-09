"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Eye, ShoppingCart } from "lucide-react"
import { useRouter } from "next/navigation"
import { jwtDecode } from "jwt-decode"

function getUser() {
  const token = localStorage.getItem("token")
  if (token) {
    try {
      return jwtDecode(token)
    } catch {}
  }
  const userStr = localStorage.getItem("user")
  if (userStr) {
    try {
      return JSON.parse(userStr)
    } catch {}
  }
  return null
}

export default function ProductCard({ product, onView }) {
  const router = useRouter()

  const addToCart = () => {
    // Get user from localStorage or token
    const user = getUser()
    const cartKey = user && (user.id || user.userId || user.email) ? `cart_${user.id || user.userId || user.email}` : "cart_guest"
    const cart = JSON.parse(localStorage.getItem(cartKey) || "[]")
    const existingItem = cart.find((item) => item.id === product.id)

    if (existingItem) {
      existingItem.quantity += 1
    } else {
      cart.push({ ...product, quantity: 1 })
    }

    localStorage.setItem(cartKey, JSON.stringify(cart))
    window.dispatchEvent(new Event("storage")) // Notify other tabs/components
    router.push("/cart")
  }

  return (
    <Card className="group hover:shadow-lg transition-shadow duration-300">
      <CardContent className="p-4">
        <div className="relative overflow-hidden rounded-lg mb-4">
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            width={300}
            height={300}
            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        <h3 className="text-lg font-semibold mb-2 text-gray-800">{product.name}</h3>

        <p className="text-2xl font-bold text-blue-600 mb-4">${product.price}</p>

        <div className="flex space-x-2">
          <Button onClick={onView} variant="outline" size="sm" className="flex-1 bg-transparent">
            <Eye className="h-4 w-4 mr-2" />
            View
          </Button>

          <Button onClick={addToCart} size="sm" className="flex-1">
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add to Cart
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
