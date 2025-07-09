"use client"

import { useEffect, useState } from "react"
import Header from "../components/Header"
import Footer from "../components/Footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { jwtDecode } from "jwt-decode"
import { useRouter } from "next/navigation"

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

export default function OrdersPage() {
  const [orders, setOrders] = useState([])
  const router = useRouter()

  useEffect(() => {
    const user = getUser()
    const userId = user?.id || user?.userId || user?.email
    if (!userId) {
      router.replace("/")
      return
    }
    const ordersKey = `orders_${userId}`
    const savedOrders = JSON.parse(localStorage.getItem(ordersKey) || "[]")
    setOrders(savedOrders.reverse()) // latest first
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Order History</h1>
        {orders.length === 0 ? (
          <div className="text-center text-gray-600">No orders found.</div>
        ) : (
          <div className="space-y-6">
            {orders.map((order, idx) => (
              <Card key={idx}>
                <CardContent className="p-6">
                  <div className="mb-2 text-gray-700 font-semibold">
                    Order Date: {new Date(order.date).toLocaleString()}
                  </div>
                  <div className="space-y-2">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex justify-between items-center border-b pb-2">
                        <span>{item.name} x {item.quantity}</span>
                        <span className="font-bold text-blue-600">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 text-right font-bold">
                    Total: ${order.items.reduce((t, item) => t + item.price * item.quantity, 0).toFixed(2)}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
} 