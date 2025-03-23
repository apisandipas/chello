import { createFileRoute } from '@tanstack/react-router'
import { Link } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-cyan-50 to-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Organize Your Work with Chello
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            A simple and powerful board app that helps you manage projects, track tasks, and collaborate with your team.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              to="/auth/signup"
              className="bg-cyan-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-cyan-800 transition-colors"
            >
              Get Started Free
            </Link>
            <Link
              to="/about"
              className="bg-white text-cyan-700 px-6 py-3 rounded-lg font-semibold border border-cyan-700 hover:bg-cyan-50 transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Chello?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="text-cyan-700 text-4xl mb-4">📋</div>
              <h3 className="text-xl font-semibold mb-2">Simple Boards</h3>
              <p className="text-gray-600">Create and organize your work with intuitive drag-and-drop boards.</p>
            </div>
            <div className="text-center p-6">
              <div className="text-cyan-700 text-4xl mb-4">👥</div>
              <h3 className="text-xl font-semibold mb-2">Team Collaboration</h3>
              <p className="text-gray-600">Work together seamlessly with real-time updates and shared boards.</p>
            </div>
            <div className="text-center p-6">
              <div className="text-cyan-700 text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold mb-2">Lightning Fast</h3>
              <p className="text-gray-600">Built for speed with modern technology and optimized performance.</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-cyan-50 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of users who are already organizing their work with Chello.
          </p>
          <Link
            to="/auth/signup"
            className="bg-cyan-700 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-cyan-800 transition-colors inline-block"
          >
            Create Your Free Account
          </Link>
        </div>
      </div>
    </div>
  )
}