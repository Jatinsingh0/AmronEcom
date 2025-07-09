"use client"

import React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import {jwtDecode} from "jwt-decode"

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, password: formData.password })
      })
      const data = await res.json()
      if (!res.ok) {
        setErrors({ general: data.message || 'Login failed' })
        return
      }
      // Save token to localStorage
      localStorage.setItem('token', data.token)
      // Save user info to localStorage for cart key logic
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user))
      }
      // Migrate guest cart to user cart
      let user = data.user
      if (!user) {
        try {
          const decoded = jwtDecode(data.token)
          user = decoded
        } catch {}
      }
      if (user && (user.id || user.email)) {
        const guestCart = JSON.parse(localStorage.getItem('cart_guest') || '[]')
        if (guestCart.length > 0) {
          const userCartKey = `cart_${user.id || user.email}`
          const userCart = JSON.parse(localStorage.getItem(userCartKey) || '[]')
          // Merge guest cart into user cart (sum quantities if same id)
          guestCart.forEach(guestItem => {
            const existing = userCart.find(item => item.id === guestItem.id)
            if (existing) {
              existing.quantity += guestItem.quantity
            } else {
              userCart.push(guestItem)
            }
          })
          localStorage.setItem(userCartKey, JSON.stringify(userCart))
          localStorage.removeItem('cart_guest')
        }
      }
      window.dispatchEvent(new Event("storage")) // Notify other tabs/components
      router.push('/cart')
    } catch (err) {
      setErrors({ general: 'Something went wrong. Please try again.' })
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setErrors({})
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
          <p className="text-center text-gray-600">Welcome back! Please login to your account</p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {errors.general && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">{errors.general}</div>
            )}

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <Link href="/signup" className="text-blue-600 hover:underline">
                Sign up here
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
