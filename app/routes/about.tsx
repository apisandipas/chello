import { createFileRoute } from '@tanstack/react-router'
import { Link } from '@tanstack/react-router'

export const Route = createFileRoute('/about')({
  component: About,
})

function About() {
  return (
    <div className="min-h-screen">
      {/* About Section */}
      <div className="bg-gradient-to-b from-cyan-50 to-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">About Chello</h1>
          <p className="text-xl text-gray-600 mb-8">
            Chello is a modern, intuitive board application designed to help teams and individuals organize their work efficiently.
            We believe in simplicity, speed, and collaboration.
          </p>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 mb-4">
                We're on a mission to make project management accessible and enjoyable for everyone.
                Whether you're a small team or a large organization, Chello provides the tools you need
                to stay organized and productive.
              </p>
              <p className="text-lg text-gray-600">
                Built with modern technology and a focus on user experience, we're constantly improving
                and adding new features to make your work life easier.
              </p>
            </div>
            <div className="bg-cyan-50 p-8 rounded-xl">
              <h3 className="text-2xl font-bold mb-4">Key Features</h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-2">
                  <span className="text-cyan-700">✓</span>
                  <span>Drag-and-drop interface</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-cyan-700">✓</span>
                  <span>Real-time collaboration</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-cyan-700">✓</span>
                  <span>Mobile responsive</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-cyan-700">✓</span>
                  <span>Customizable boards</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Simple, Transparent Pricing</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col h-full">
              <div>
                <h3 className="text-2xl font-bold mb-4">Free Plan</h3>
                <div className="text-4xl font-bold mb-6">
                  $0
                  <span className="text-lg text-gray-600 font-normal">/month</span>
                </div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center gap-2">
                    <span className="text-cyan-700">✓</span>
                    <span>Up to 3 boards</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-cyan-700">✓</span>
                    <span>Basic features</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-cyan-700">✓</span>
                    <span>Community support</span>
                  </li>
                </ul>
              </div>
              <Link
                to="/auth/signup"
                className="mt-auto block w-full text-center bg-white text-cyan-700 px-6 py-3 rounded-lg font-semibold border border-cyan-700 hover:bg-cyan-50 transition-colors"
              >
                Get Started
              </Link>
            </div>

            {/* Premium Plan */}
            <div className="bg-cyan-700 rounded-xl shadow-lg p-8 text-white relative flex flex-col h-full">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-cyan-700 text-white px-4 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </span>
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-4">Premium Plan</h3>
                <div className="text-4xl font-bold mb-6">
                  $3
                  <span className="text-lg text-cyan-100 font-normal">/month</span>
                </div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center gap-2">
                    <span className="text-white">✓</span>
                    <span>Unlimited boards</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-white">✓</span>
                    <span>Advanced features</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-white">✓</span>
                    <span>Priority support</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-white">✓</span>
                    <span>Custom integrations</span>
                  </li>
                </ul>
              </div>
              <Link
                to="/auth/signup"
                className="mt-auto block w-full text-center bg-white text-cyan-700 px-6 py-3 rounded-lg font-semibold hover:bg-cyan-50 transition-colors"
              >
                Upgrade to Premium
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Have Questions?</h2>
          <p className="text-xl text-gray-600 mb-8">
            We're here to help! Contact our support team for any questions about our plans or features.
          </p>
          <Link
            to="/auth/signup"
            className="bg-cyan-700 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-cyan-800 transition-colors inline-block"
          >
            Get in Touch
          </Link>
        </div>
      </div>
    </div>
  )
}