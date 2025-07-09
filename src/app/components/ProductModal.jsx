"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ShoppingCart } from "lucide-react"
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

export default function ProductModal({ product, onClose }) {
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
    onClose()
    router.push("/cart")
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{product.name}</DialogTitle>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="relative">
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              width={400}
              height={400}
              className="w-full h-80 object-cover rounded-lg"
            />
          </div>

          <div className="space-y-4">
            <p className="text-3xl font-bold text-blue-600">${product.price}</p>

            <p className="text-gray-600 leading-relaxed">{product.description}</p>

            <div className="space-y-2">
              <p className="text-sm text-gray-500">
                <span className="font-semibold">Category:</span> {product.category}
              </p>
              <p className="text-sm text-gray-500">
                <span className="font-semibold">Product ID:</span> #{product.id}
              </p>
            </div>

            <Button onClick={addToCart} className="w-full" size="lg">
              <ShoppingCart className="h-5 w-5 mr-2" />
              Add to Cart
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
