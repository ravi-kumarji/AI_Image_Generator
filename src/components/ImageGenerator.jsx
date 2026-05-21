import { useState, useCallback } from 'react'
import {
  Wand2,
  Download,
  RefreshCw,
  ImageIcon,
  Settings2,
  Loader2,
  Check,
  Copy,
  Maximize2,
  X,
  Info,
  Zap,
  Key
} from 'lucide-react'
import { generateImageUrl, downloadImage, copyToClipboard, preloadImage } from '../utils/api'

const MODELS = [
  { id: 'flux', name: 'Flux', description: 'Best quality, detailed images' },
  { id: 'turbo', name: 'Turbo', description: 'Fast generation, good quality' },
  { id: 'stable-diffusion', name: 'Stable Diffusion', description: 'Versatile, artistic styles' },
]

const ASPECT_RATIOS = [
  { id: '1:1', width: 1024, height: 1024, label: 'Square' },
  { id: '16:9', width: 1024, height: 576, label: 'Landscape' },
  { id: '9:16', width: 576, height: 1024, label: 'Portrait' },
  { id: '4:3', width: 1024, height: 768, label: 'Standard' },
  { id: '3:2', width: 1024, height: 682, label: 'Photo' },
]

const SAMPLE_PROMPTS = [
  "A serene Japanese garden with cherry blossoms and a koi pond",
  "Cyberpunk cityscape at night with neon lights and flying cars",
  "A majestic dragon soaring over snow-capped mountains",
  "Cozy cottage interior with a fireplace and warm lighting",
  "Futuristic astronaut exploring an alien planet with two moons",
]

function ImageGenerator() {
  const [prompt, setPrompt] = useState('')
  const [generatedImage, setGeneratedImage] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [selectedModel, setSelectedModel] = useState('flux')
  const [selectedRatio, setSelectedRatio] = useState(ASPECT_RATIOS[0])
  const [showSettings, setShowSettings] = useState(false)
  const [showFullscreen, setShowFullscreen] = useState(false)
  const [seed, setSeed] = useState('')
  const [useRealAI, setUseRealAI] = useState(false)
  const [apiKey, setApiKey] = useState('')
  const [history, setHistory] = useState([])

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim()) {
      setError('Please enter a description for your image')
      return
    }

    setIsLoading(true)
    setError(null)
    setGeneratedImage(null)

    try {
      const imageUrl = generateImageUrl({
        prompt: prompt.trim(),
        model: selectedModel,
        width: selectedRatio.width,
        height: selectedRatio.height,
        seed: seed ? parseInt(seed) : undefined,
        useRealAI,
        apiKey,
      })

      console.log('Generated URL:', imageUrl)

      // Preload image to ensure it's ready
      await preloadImage(imageUrl)

      setGeneratedImage(imageUrl)
      setHistory(prev => [{
        url: imageUrl,
        prompt: prompt.trim(),
        model: selectedModel,
        ratio: selectedRatio.id,
        timestamp: new Date().toISOString(),
      }, ...prev].slice(0, 10))
      setIsLoading(false)
    } catch (err) {
      console.error('Generation error:', err)
      setError('Failed to load generated image. Please try again.')
      setIsLoading(false)
    }
  }, [prompt, selectedModel, selectedRatio, seed, useRealAI, apiKey])

  const handleDownload = async () => {
    if (generatedImage) {
      await downloadImage(generatedImage, `ai-generated-${Date.now()}.png`)
    }
  }

  const handleCopyPrompt = () => {
    copyToClipboard(prompt)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleGenerate()
    }
  }

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <div className="glass-card rounded-2xl p-6 md:p-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <Wand2 className="w-6 h-6 text-primary" />
            Create Image
          </h2>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${showSettings ? 'bg-primary/20 text-primary' : 'text-slate-400 hover:text-white'
              }`}
          >
            <Settings2 className="w-4 h-4" />
            Settings
          </button>
        </div>

        {/* Mode Toggle */}
        <div className="flex items-center gap-4 mb-4 p-3 rounded-xl bg-dark-light/50 border border-slate-800">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-yellow-500" />
            <span className="text-sm font-medium">Demo Mode</span>
          </div>
          <button
            onClick={() => setUseRealAI(!useRealAI)}
            className={`relative w-12 h-6 rounded-full transition-colors ${useRealAI ? 'bg-primary' : 'bg-slate-700'
              }`}
          >
            <span
              className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${useRealAI ? 'translate-x-6' : 'translate-x-0'
                }`}
            />
          </button>
          <div className="flex items-center gap-2">
            <Key className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Real AI</span>
          </div>

          {!useRealAI && (
            <div className="ml-auto flex items-center gap-1 text-xs text-slate-500">
              <Info className="w-3 h-3" />
              Using Lorem Picsum (free, no key needed)
            </div>
          )}
        </div>

        {/* API Key Input (only in Real AI mode) */}
        {useRealAI && (
          <div className="mb-4 fade-in">
            <label className="text-sm text-slate-400 mb-2 block flex items-center gap-2">
              <Key className="w-4 h-4" />
              Pollinations API Key
              <span className="text-xs text-slate-600">(get yours at enter.pollinations.ai)</span>
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk_... or pk_..."
              className="w-full bg-dark-light border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 input-glow focus:outline-none transition-all"
            />
            {!apiKey && (
              <p className="text-xs text-yellow-500/80 mt-2 flex items-center gap-1">
                <Info className="w-3 h-3" />
                Enter an API key to use real AI generation, or switch back to Demo Mode
              </p>
            )}
          </div>
        )}

        {/* Prompt Input */}
        <div className="relative mb-4">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe the image you want to generate..."
            className="w-full bg-dark-light border border-slate-700 rounded-xl px-4 py-4 pr-12 text-white placeholder-slate-500 resize-none input-glow focus:outline-none transition-all"
            rows={3}
            maxLength={1000}
          />
          <div className="absolute bottom-3 right-3 text-slate-600 text-xs">
            {prompt.length}/1000
          </div>
        </div>

        {/* Sample Prompts */}
        <div className="flex flex-wrap gap-2 mb-4">
          {SAMPLE_PROMPTS.map((sample, idx) => (
            <button
              key={idx}
              onClick={() => setPrompt(sample)}
              className="px-3 py-1.5 rounded-full bg-dark-lighter border border-slate-700 text-xs text-slate-400 hover:border-primary/50 hover:text-primary transition-all"
            >
              {sample.length > 40 ? sample.slice(0, 40) + '...' : sample}
            </button>
          ))}
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="border-t border-slate-800 pt-4 mt-4 space-y-4 fade-in">
            {/* Model Selection */}
            <div>
              <label className="text-sm text-slate-400 mb-2 block">Model</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {MODELS.map((model) => (
                  <button
                    key={model.id}
                    onClick={() => setSelectedModel(model.id)}
                    className={`p-3 rounded-xl border text-left transition-all ${selectedModel === model.id
                        ? 'border-primary bg-primary/10'
                        : 'border-slate-700 bg-dark-light hover:border-slate-600'
                      }`}
                  >
                    <div className="font-medium text-sm">{model.name}</div>
                    <div className="text-xs text-slate-500 mt-1">{model.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Aspect Ratio */}
            <div>
              <label className="text-sm text-slate-400 mb-2 block">Aspect Ratio</label>
              <div className="flex flex-wrap gap-2">
                {ASPECT_RATIOS.map((ratio) => (
                  <button
                    key={ratio.id}
                    onClick={() => setSelectedRatio(ratio)}
                    className={`px-4 py-2 rounded-lg border text-sm transition-all ${selectedRatio.id === ratio.id
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-slate-700 bg-dark-light text-slate-400 hover:border-slate-600'
                      }`}
                  >
                    {ratio.label} ({ratio.id})
                  </button>
                ))}
              </div>
            </div>

            {/* Seed */}
            <div>
              <label className="text-sm text-slate-400 mb-2 block">Seed (optional)</label>
              <input
                type="number"
                value={seed}
                onChange={(e) => setSeed(e.target.value)}
                placeholder="Random (based on your prompt)"
                className="w-full bg-dark-light border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-primary focus:outline-none"
              />
              <p className="text-xs text-slate-600 mt-1">
                Same seed + same prompt = same image. Leave empty for prompt-based seeding.
              </p>
            </div>
          </div>
        )}

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={isLoading || !prompt.trim() || (useRealAI && !apiKey)}
          className="w-full mt-6 btn-primary text-white font-semibold py-4 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Generating your masterpiece...
            </>
          ) : (
            <>
              <Wand2 className="w-5 h-5" />
              {useRealAI ? 'Generate with Real AI' : 'Generate Image (Demo)'}
            </>
          )}
        </button>

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center gap-2">
            <X className="w-4 h-4" />
            {error}
          </div>
        )}
      </div>

      {/* Generated Image Display */}
      {generatedImage && (
        <div className="glass-card rounded-2xl p-6 md:p-8 fade-in">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-primary" />
              Generated Image
              {!useRealAI && (
                <span className="text-xs px-2 py-1 rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                  Demo
                </span>
              )}
            </h3>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyPrompt}
                className="p-2 rounded-lg bg-dark-light hover:bg-dark-lighter text-slate-400 hover:text-white transition-all"
                title="Copy prompt"
              >
                <Copy className="w-4 h-4" />
              </button>
              <button
                onClick={handleDownload}
                className="p-2 rounded-lg bg-dark-light hover:bg-dark-lighter text-slate-400 hover:text-white transition-all"
                title="Download image"
              >
                <Download className="w-4 h-4" />
              </button>
              <button
                onClick={() => setShowFullscreen(true)}
                className="p-2 rounded-lg bg-dark-light hover:bg-dark-lighter text-slate-400 hover:text-white transition-all"
                title="View fullscreen"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  setGeneratedImage(null)
                  setPrompt('')
                }}
                className="p-2 rounded-lg bg-dark-light hover:bg-dark-lighter text-slate-400 hover:text-white transition-all"
                title="Clear"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="relative rounded-xl overflow-hidden bg-dark-light">
            <img
              src={generatedImage}
              alt="AI Generated"
              className="w-full h-auto object-cover"
              loading="eager"
              onError={(e) => {
                console.error('Image failed to load:', generatedImage)
                e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect fill="%231e293b" width="400" height="300"/><text fill="%2364748b" x="50%" y="50%" text-anchor="middle" font-family="sans-serif">Failed to load image</text></svg>'
              }}
            />
          </div>

          <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
            <div className="flex items-center gap-4">
              <span>Model: <span className="text-slate-300 capitalize">{selectedModel}</span></span>
              <span>Size: <span className="text-slate-300">{selectedRatio.width}×{selectedRatio.height}</span></span>
            </div>
            <button
              onClick={handleGenerate}
              className="flex items-center gap-1 text-primary hover:text-primary-dark transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Regenerate
            </button>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && !generatedImage && (
        <div className="glass-card rounded-2xl p-6 md:p-8">
          <div className="flex flex-col items-center justify-center py-12">
            <div className="relative mb-6">
              <div className="w-24 h-24 rounded-2xl image-shimmer" />
              <Loader2 className="w-8 h-8 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-spin" />
            </div>
            <p className="text-slate-400 animate-pulse">Creating your image...</p>
            <p className="text-slate-600 text-sm mt-2">
              {useRealAI ? 'This may take 5-15 seconds' : 'Generating from Lorem Picsum'}
            </p>
          </div>
        </div>
      )}

      {/* History */}
      {history.length > 0 && (
        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Generations</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {history.map((item, idx) => (
              <div
                key={idx}
                onClick={() => setGeneratedImage(item.url)}
                className="relative group cursor-pointer rounded-xl overflow-hidden bg-dark-light aspect-square"
              >
                <img
                  src={item.url}
                  alt={item.prompt}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                  onError={(e) => {
                    e.target.style.display = 'none'
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="absolute bottom-2 left-2 right-2 text-xs text-white line-clamp-2">
                    {item.prompt}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Fullscreen Modal */}
      {showFullscreen && generatedImage && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4"
          onClick={() => setShowFullscreen(false)}
        >
          <button
            onClick={() => setShowFullscreen(false)}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={generatedImage}
            alt="Fullscreen"
            className="max-w-full max-h-[90vh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  )
}

export default ImageGenerator
