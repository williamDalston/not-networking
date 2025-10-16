export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-gold-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-6">
            🌱 The Ecosystem
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            AI-powered networking platform that connects like-minded individuals 
            through intelligent matching and ecosystem visualization.
          </p>
          <div className="space-x-4">
            <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
              Get Started
            </button>
            <button className="bg-white hover:bg-gray-50 text-gray-900 px-8 py-3 rounded-lg font-semibold border border-gray-300 transition-colors">
              Learn More
            </button>
          </div>
        </div>
        
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
            <div className="text-4xl mb-4">🤖</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              AI Matching
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Advanced algorithms find meaningful connections based on your goals, 
              values, and complementary skills.
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
            <div className="text-4xl mb-4">🗺️</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Ecosystem Map
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Visualize your professional network and discover new opportunities 
              through interactive relationship mapping.
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
            <div className="text-4xl mb-4">📈</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Growth Tracking
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Monitor your networking progress and see how your connections 
              contribute to your professional development.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}