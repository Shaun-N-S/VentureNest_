export function LeftPanel() {
  return (
    <div className="relative hidden md:flex md:min-h-screen md:flex-1 overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-teal-500">
      {/* Subtle grid overlay */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg className="w-full h-full" viewBox="0 0 100 100" fill="none" aria-hidden="true">
          <defs>
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#grid)" />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-center px-6 sm:px-8 lg:px-12 xl:px-16 py-10 md:py-12 text-primary-foreground">
        {/* Brand */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-white/15 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold">VentureNest</h2>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-4 text-pretty">
            Where Innovation
            <br />
            <span className="text-blue-200">Meets Investment</span>
          </h1>
          <p className="text-lg lg:text-xl text-blue-100 leading-relaxed max-w-md">
            Join ambitious founders and forward-thinking investors building the future together.
          </p>
        </div>

        {/* Decorative illustration */}
        <div className="flex-1 flex items-center justify-center max-w-lg mx-auto">
          <svg viewBox="0 0 400 300" className="w-full h-auto" aria-hidden="true">
            <g transform="translate(200,150)">
              <ellipse cx="0" cy="0" rx="25" ry="60" fill="white" opacity="0.9" />
              <ellipse cx="0" cy="-10" rx="20" ry="40" fill="#3B82F6" />
              <path d="M-15,-50 Q0,-70 15,-50 Z" fill="white" />
              <circle cx="0" cy="-20" r="8" fill="white" opacity="0.8" />
              <circle cx="0" cy="0" r="6" fill="white" opacity="0.6" />
              <g transform="translate(0,50)">
                {/* Keep a single accent (amber) to adhere to 3–5 color rule */}
                <path d="M-20,0 Q-10,20 0,15 Q10,20 20,0 Q10,25 0,20 Q-10,25 -20,0" fill="#F59E0B" opacity="0.85" />
              </g>
            </g>

            {/* Ambient bits */}
            <g opacity="0.6">
              <g fill="white">
                <circle cx="80" cy="60" r="2" />
                <circle cx="320" cy="80" r="1.5" />
                <circle cx="350" cy="200" r="2" />
                <circle cx="50" cy="180" r="1" />
              </g>
              <g transform="translate(100,100)" fill="white" opacity="0.7">
                <rect x="-8" y="-8" width="16" height="16" rx="3" />
                <text x="0" y="3" textAnchor="middle" fontSize="10" fill="#3B82F6">
                  $
                </text>
              </g>
              <g transform="translate(300,180)" fill="white" opacity="0.7">
                <circle cx="0" cy="0" r="10" />
                <path d="M-4,-2 L0,4 L4,-2" stroke="#3B82F6" strokeWidth="2" fill="none" />
              </g>
            </g>

            {/* Curves */}
            <g stroke="white" strokeWidth="1" opacity="0.3" fill="none">
              <path d="M100,100 Q150,120 200,100" />
              <path d="M200,100 Q250,80 300,100" />
              <path d="M150,200 Q200,180 250,200" />
            </g>
          </svg>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 md:gap-8 mt-10 pt-8 border-t border-white/20">
          <div className="text-center">
            <div className="text-2xl font-bold">10K+</div>
            <div className="text-sm text-blue-200">Founders</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">$2B+</div>
            <div className="text-sm text-blue-200">Invested</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">500+</div>
            <div className="text-sm text-blue-200">Success Stories</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LeftPanel
