import Header from "../components/Header"
import Footer from "../components/Footer"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">About ShopEasy</h1>

          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-blue-600">Our Story</h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              Welcome to ShopEasy, your trusted online shopping destination! We started with a simple mission: to make
              quality products accessible to everyone at affordable prices. Since our inception, we've been committed to
              providing an exceptional shopping experience for our customers.
            </p>

            <p className="text-gray-600 leading-relaxed mb-6">
              Our carefully curated collection includes the latest fashion trends, comfortable everyday wear, and
              premium quality products that suit every lifestyle. From trendy t-shirts to comfortable shoes, casual
              lowers to classic jeans - we have something for everyone.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4 text-blue-600">Our Mission</h3>
              <p className="text-gray-600 leading-relaxed">
                To provide high-quality products at competitive prices while ensuring excellent customer service and a
                seamless shopping experience for all our valued customers.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4 text-blue-600">Our Vision</h3>
              <p className="text-gray-600 leading-relaxed">
                To become the most trusted and preferred online shopping platform, known for quality, affordability, and
                exceptional customer satisfaction.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8 mt-8">
            <h3 className="text-2xl font-semibold mb-4 text-blue-600">Why Choose ShopEasy?</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🛍️</span>
                </div>
                <h4 className="font-semibold mb-2">Quality Products</h4>
                <p className="text-gray-600 text-sm">Carefully selected products that meet our high standards</p>
              </div>

              <div className="text-center">
                <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💰</span>
                </div>
                <h4 className="font-semibold mb-2">Best Prices</h4>
                <p className="text-gray-600 text-sm">Competitive pricing without compromising on quality</p>
              </div>

              <div className="text-center">
                <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🚚</span>
                </div>
                <h4 className="font-semibold mb-2">Fast Delivery</h4>
                <p className="text-gray-600 text-sm">Quick and reliable delivery to your doorstep</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
