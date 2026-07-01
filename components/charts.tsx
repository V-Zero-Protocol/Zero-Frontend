'use client'

import { complianceSeries, spendSeries } from '@/lib/data'

/* Token-driven SVG charts. Colors come from M3 system tokens so both
 * light and dark schemes adapt automatically. */

export function SpendBarChart() {
  const width = 520
  const height = 240
  const padding = { top: 16, right: 12, bottom: 28, left: 40 }
  const innerW = width - padding.left - padding.right
  const innerH = height - padding.top - padding.bottom

  const max = Math.max(...spendSeries.map((d) => d.usdc + d.xlm))
  const niceMax = Math.ceil(max / 50) * 50
  const bandW = innerW / spendSeries.length
  const barW = Math.min(34, bandW * 0.5)

  const ticks = 4
  const tickVals = Array.from({ length: ticks + 1 }, (_, i) =>
    Math.round((niceMax / ticks) * i),
  )

  return (
    <svg
      className="chart-svg"
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label="Monthly organization spend by asset"
      preserveAspectRatio="xMidYMid meet"
    >
      {tickVals.map((t) => {
        const y = padding.top + innerH - (t / niceMax) * innerH
        return (
          <g key={t}>
            <line
              x1={padding.left}
              x2={width - padding.right}
              y1={y}
              y2={y}
              style={{ stroke: 'var(--md-sys-color-outline-variant)' }}
              strokeWidth={1}
            />
            <text
              x={padding.left - 8}
              y={y + 4}
              textAnchor="end"
              style={{ fill: 'var(--md-sys-color-on-surface-variant)' }}
              fontSize={10}
            >
              {t}
            </text>
          </g>
        )
      })}

      {spendSeries.map((d, i) => {
        const x = padding.left + bandW * i + (bandW - barW) / 2
        const usdcH = (d.usdc / niceMax) * innerH
        const xlmH = (d.xlm / niceMax) * innerH
        const usdcY = padding.top + innerH - usdcH
        const xlmY = usdcY - xlmH
        return (
          <g key={d.label}>
            <rect
              x={x}
              y={usdcY}
              width={barW}
              height={usdcH}
              rx={3}
              style={{ fill: 'var(--md-sys-color-primary)' }}
            />
            <rect
              x={x}
              y={xlmY}
              width={barW}
              height={xlmH}
              rx={3}
              style={{ fill: 'var(--md-sys-color-secondary)' }}
            />
            <text
              x={x + barW / 2}
              y={height - 10}
              textAnchor="middle"
              style={{ fill: 'var(--md-sys-color-on-surface-variant)' }}
              fontSize={11}
            >
              {d.label}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

export function ComplianceLineChart() {
  const width = 360
  const height = 240
  const padding = { top: 16, right: 16, bottom: 28, left: 32 }
  const innerW = width - padding.left - padding.right
  const innerH = height - padding.top - padding.bottom

  const min = 80
  const max = 100
  const stepX = innerW / (complianceSeries.length - 1)

  const points = complianceSeries.map((d, i) => {
    const x = padding.left + stepX * i
    const y = padding.top + innerH - ((d.value - min) / (max - min)) * innerH
    return { x, y, ...d }
  })

  const linePath = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
    .join(' ')

  const areaPath =
    `M ${points[0].x} ${padding.top + innerH} ` +
    points.map((p) => `L ${p.x} ${p.y}`).join(' ') +
    ` L ${points[points.length - 1].x} ${padding.top + innerH} Z`

  return (
    <svg
      className="chart-svg"
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label="Compliance health index over recent weeks"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id="complianceFill" x1="0" y1="0" x2="0" y2="1">
          <stop
            offset="0%"
            style={{ stopColor: 'var(--md-sys-color-primary)' }}
            stopOpacity={0.22}
          />
          <stop
            offset="100%"
            style={{ stopColor: 'var(--md-sys-color-primary)' }}
            stopOpacity={0}
          />
        </linearGradient>
      </defs>

      {[80, 90, 100].map((t) => {
        const y = padding.top + innerH - ((t - min) / (max - min)) * innerH
        return (
          <g key={t}>
            <line
              x1={padding.left}
              x2={width - padding.right}
              y1={y}
              y2={y}
              style={{ stroke: 'var(--md-sys-color-outline-variant)' }}
              strokeWidth={1}
            />
            <text
              x={padding.left - 6}
              y={y + 4}
              textAnchor="end"
              style={{ fill: 'var(--md-sys-color-on-surface-variant)' }}
              fontSize={10}
            >
              {t}
            </text>
          </g>
        )
      })}

      <path d={areaPath} fill="url(#complianceFill)" />
      <path
        d={linePath}
        fill="none"
        style={{ stroke: 'var(--md-sys-color-primary)' }}
        strokeWidth={2.5}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {points.map((p) => (
        <circle
          key={p.label}
          cx={p.x}
          cy={p.y}
          r={3}
          style={{
            fill: 'var(--md-sys-color-surface)',
            stroke: 'var(--md-sys-color-primary)',
          }}
          strokeWidth={2}
        />
      ))}
      {points.map((p, i) =>
        i % 2 === 0 ? (
          <text
            key={`l-${p.label}`}
            x={p.x}
            y={height - 10}
            textAnchor="middle"
            style={{ fill: 'var(--md-sys-color-on-surface-variant)' }}
            fontSize={10}
          >
            {p.label}
          </text>
        ) : null,
      )}
    </svg>
  )
}
