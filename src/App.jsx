import { useState } from 'react'
import ImageGenerator from './components/ImageGenerator'
import Header from './components/Header'
import Footer from './components/Footer'
import { ImageIcon, Sparkles, Zap, Key } from 'lucide-react'

function App() {
  return (
    <div className="min-h-screen bg-dark flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8 max-w-6xl">
        {/* Hero Section */}
        <div className="text-center mb-12 fade-in">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            <span className="gradient-text">AI Image Generator</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Transform your imagination into stunning visuals. Enter a prompt and let AI create
            beautiful images in seconds. Use <strong className="text-primary">Demo Mode</strong> instantly,
            or switch to <strong className="text-primary">Real AI</strong> with your own API key.
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <FeatureCard
            icon={<Sparkles className="w-8 h-8 text-primary" />}
            title="AI-Powered"
            description="Powered by state-of-the-art diffusion models for high-quality image generation"
          />
          <FeatureCard
            icon={<Zap className="w-8 h-8 text-secondary" />}
            title="Instant Results"
            description="Generate images in seconds with our optimized streaming pipeline"
          />
          <FeatureCard
            icon={<ImageIcon className="w-8 h-8 text-primary" />}
            title="Demo Mode"
            description="No signup or API keys needed. Start creating immediately with beautiful images"
          />
          <FeatureCard
            icon={<Key className="w-8 h-8 text-secondary" />}
            title="Real AI Mode"
            description="Bring your own Pollinations API key for true AI-generated images"
          />
        </div>

        {/* Info Banner */}
        <div className="mb-8 p-4 rounded-xl bg-primary/10 border border-primary/30 flex items-start gap-3">
          <Zap className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
          <div className="text-sm text-slate-300">
            <strong className="text-white">Passionate BCA student and Full Stack Developer</strong> with hands-on experience in building modern web applications. 
            Skilled in developing responsive user interfaces and robust backends using <strong>React.js, Node.js, Express.js, and MongoDB</strong>. 
            Experienced in building REST APIs and real-time applications using WebSocket technology. Let's connect on{' '}
            <a href="https://www.linkedin.com/in/ravi-kumar-tackword" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">
              LinkedIn
            </a>.
          </div>
        </div>

        {/* Main Generator */}
        <ImageGenerator />
      </main>

      <Footer />
    </div>
  )
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="glass-card rounded-2xl p-6 text-center hover:border-primary/50 transition-all duration-300">
      <div className="flex justify-center mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-slate-400 text-sm">{description}</p>
    </div>
  )
}

export default App
