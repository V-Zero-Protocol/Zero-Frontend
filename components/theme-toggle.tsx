'use client'

import { useEffect, useState } from 'react'
import { Sun, Moon } from 'lucide-react'

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'))
  }, [])

  function toggle() {
    const next = !isDark
    setIsDark(next)
    document.documentElement.classList.toggle('dark', next)
    try {
      localStorage.setItem('theme', next ? 'dark' : 'light')
    } catch {}
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle light and dark theme"
      style={{
        display: 'grid',
        placeItems: 'center',
        width: 40,
        height: 40,
        borderRadius: '50%',
        border: 'none',
        background: 'transparent',
        color: 'var(--md-sys-color-on-surface-variant)',
        cursor: 'pointer',
        transition: 'background-color 150ms ease',
      }}
      onMouseOver={(e) =>
        ((e.currentTarget as HTMLButtonElement).style.background =
          'var(--md-sys-color-surface-container-high)')
      }
      onMouseOut={(e) =>
        ((e.currentTarget as HTMLButtonElement).style.background = 'transparent')
      }
    >
      {isDark ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  )
}
