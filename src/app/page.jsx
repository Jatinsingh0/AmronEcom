import Header from "./components/Header"
import Banner from "./components/Banner"
import ProductGrid from "./components/ProductGrid"
import Footer from "./components/Footer"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Banner />
      <ProductGrid />
      <Footer />
    </div>
  )
}
