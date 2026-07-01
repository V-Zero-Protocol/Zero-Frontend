'use client'

import { ThemeToggle } from './theme-toggle'

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-header-inner">
        <a
          href="/"
          className="wordmark md-typescale-title-large"
          aria-label="Material 3 home"
        >
          M<span className="wordmark-accent">3</span>
          <span className="wordmark-text">Material Design</span>
        </a>
        <nav className="site-nav md-typescale-label-large" aria-label="Main">
          <a href="#foundations">Foundations</a>
          <a href="#components">Components</a>
        </nav>
        <ThemeToggle />
      </div>
    </header>
  )
}
