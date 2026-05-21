# AI Image Generator

A modern AI Image Generator built with React 19, Vite, and Tailwind CSS v4. 
Features both **Demo Mode** (instant, no API key) and **Real AI Mode** (with your own API key).

![React](https://img.shields.io/badge/React-19-blue)
![Vite](https://img.shields.io/badge/Vite-8-purple)
![Tailwind](https://img.shields.io/badge/Tailwind-4-cyan)

## ✨ Features

- **Dual Mode System:**
  - **Demo Mode** — Instant image generation using Lorem Picsum with prompt-based seeding (no API key)
  - **Real AI Mode** — True AI generation using Pollinations.ai (requires your own API key)
- **Multiple AI Models** — Flux, Turbo, Stable Diffusion (Real AI mode)
- **Customizable Settings** — Aspect ratios, seeds, model selection
- **Modern UI** — Dark theme with glassmorphism design
- **Download & Share** — One-click image download and prompt copying
- **Generation History** — Keep track of recent creations
- **Fullscreen Preview** — View images in full resolution
- **Sample Prompts** — Quick-start inspiration
- **Responsive Design** — Works on all devices

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 🎮 How to Use

### Demo Mode (Default)
1. Enter a prompt describing the image you want
2. Click **Generate Image (Demo)**
3. Get a beautiful, consistent image based on your prompt (via Lorem Picsum)

### Real AI Mode
1. Toggle **Real AI** mode in the settings
2. Enter your Pollinations API key (get one free at [enter.pollinations.ai](https://enter.pollinations.ai))
3. Click **Generate with Real AI**
4. Get a true AI-generated image

## 🛠 Tech Stack

- **React 19** — UI framework with latest features
- **Vite 8** — Fast build tool
- **Tailwind CSS v4** — Utility-first CSS with new CSS-based config
- **Lucide React** — Beautiful icons
- **Lorem Picsum** — Free placeholder images for Demo Mode
- **Pollinations.ai API** — Real AI image generation (optional)

## 📁 Project Structure

```
ai-image-generator/
├── src/
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   └── ImageGenerator.jsx
│   ├── utils/
│   │   └── api.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
├── vite.config.js
├── postcss.config.js
└── eslint.config.js
```

## 🔧 API Integration

### Demo Mode (Default)
Uses Lorem Picsum's free API:
```
https://picsum.photos/seed/{seed}/{width}/{height}
```
- Seed is generated from your prompt (consistent for same prompt)
- No API key required
- Beautiful Unsplash photos
- Works instantly

### Real AI Mode (Optional)
Uses Pollinations.ai's image generation API:
```
GET https://gen.pollinations.ai/image/{prompt}
```
Parameters:
- `model` — AI model (flux, turbo, stable-diffusion)
- `width` — Image width in pixels
- `height` — Image height in pixels
- `seed` — Reproducibility seed
- `key` — Your API key

Get your free API key at [enter.pollinations.ai](https://enter.pollinations.ai)

## ⚠️ Important Notes

- **Pollinations.ai** now requires an API key for all generation requests as of 2026
- The old `image.pollinations.ai` subdomain is no longer available
- **Demo Mode** provides instant, beautiful placeholder images without any setup
- **Real AI Mode** requires a valid Pollinations API key

## 📝 License

MIT License — feel free to use for personal and commercial projects.
