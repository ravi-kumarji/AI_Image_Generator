import { Wand2, Github } from 'lucide-react'

function Header() {
  return (
    <header className="border-b border-slate-800/50 bg-dark/80 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 max-w-6xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <Wand2 className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold gradient-text">AI Gen</span>
        </div>
{/* 
        <nav className="hidden md:flex items-center gap-6">
          <a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">Generate</a>
          <a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">Gallery</a>
          <a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">API</a>
        </nav> */}

        <a 
          href="https://github.com/ravi-kumarji" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-dark-light hover:bg-dark-lighter transition-colors text-sm"
        >
          <Github className="w-4 h-4" />
          <span className="hidden sm:inline">GitHub</span>
        </a>
      </div>
    </header>
  )
}

export default Header
