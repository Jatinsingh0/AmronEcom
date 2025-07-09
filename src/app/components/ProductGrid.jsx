"use client"

import { useState } from "react"
import ProductCard from "./ProductCard"
import ProductModal from "./ProductModal"

const products = [
  {
    id: 1,
    name: "Premium T-Shirt",
    price: 29.99,
    image: "/placeholder.svg?height=300&width=300",
    description: "Comfortable cotton t-shirt perfect for everyday wear. Made with high-quality materials.",
    category: "t-shirt",
  },
  {
    id: 2,
    name: "Running Shoes",
    price: 89.99,
    image: "/placeholder.svg?height=300&width=300",
    description: "Lightweight running shoes with excellent cushioning and support for your daily runs.",
    category: "shoes",
  },
  {
    id: 3,
    name: "Casual Lowers",
    price: 39.99,
    image: "/placeholder.svg?height=300&width=300",
    description: "Comfortable casual pants perfect for relaxed days. Soft fabric with great fit.",
    category: "lowers",
  },
  {
    id: 4,
    name: "Classic Jeans",
    price: 59.99,
    image: "/placeholder.svg?height=300&width=300",
    description: "Classic denim jeans with perfect fit and durability. A wardrobe essential.",
    category: "jeans",
  },
]

export default function ProductGrid() {
  const [selectedProduct, setSelectedProduct] = useState(null)

  return (
    <section className="py-16 px-4">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Featured Products</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} onView={() => setSelectedProduct(product)} />
          ))}
        </div>
      </div>

      {selectedProduct && <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />}
    </section>
  )
}
