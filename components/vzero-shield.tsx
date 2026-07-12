'use client'

export function VZeroShield({ size = 24 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Shield shape */}
      <path
        d="M50 6.5L12.5 20V44C12.5 62.5 25 82 50 93.5C75 82 87.5 62.5 87.5 44V20L50 6.5Z"
        fill="url(#shieldFill)"
        stroke="url(#shieldStroke)"
        strokeWidth="3"
      />
      
      {/* V shape */}
      <path
        d="M30 35L50 65L70 35"
        stroke="url(#vStroke)"
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* 0/zero circle */}
      <circle
        cx="50"
        cy="55"
        r="12"
        fill="none"
        stroke="url(#vStroke)"
        strokeWidth="8"
      />
      
      <defs>
        {/* Gradients */}
        <linearGradient
          id="shieldFill"
          x1="50"
          y1="6.5"
          x2="50"
          y2="93.5"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#2563EB" />
          <stop offset="100%" stopColor="#14B8A6" />
        </linearGradient>
        
        <linearGradient
          id="shieldStroke"
          x1="50"
          y1="6.5"
          x2="50"
          y2="93.5"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#2DD4BF" />
        </linearGradient>
        
        <linearGradient
          id="vStroke"
          x1="30"
          y1="35"
          x2="70"
          y2="70"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#e0e7ff" />
        </linearGradient>
      </defs>
    </svg>
  )
}
