"use client"

import type React from "react"

import { useEffect, useRef } from "react"

interface WavyBackgroundProps {
  className?: string
  children?: React.ReactNode
  containerClassName?: string
  colors?: string[]
  waveWidth?: number
  backgroundFill?: string
  blur?: number
  speed?: "slow" | "fast"
  waveOpacity?: number
}

export function WavyBackground({
  className,
  children,
  containerClassName,
  colors = ["#38bdf8", "#818cf8", "#c084fc", "#e879f9", "#22d3ee"],
  waveWidth = 50,
  backgroundFill = "black",
  blur = 10,
  speed = "fast",
  waveOpacity = 0.5,
  ...props
}: WavyBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationId: number
    let time = 0

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const drawWave = () => {
      ctx.fillStyle = backgroundFill
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      const waveColors = colors
      const numWaves = waveColors.length

      for (let i = 0; i < numWaves; i++) {
        ctx.globalAlpha = waveOpacity
        ctx.fillStyle = waveColors[i]

        const waveHeight = canvas.height * 0.3
        const frequency = 0.01 + i * 0.005
        const amplitude = 50 + i * 20
        const phase = time * (speed === "fast" ? 0.02 : 0.01) + i * 0.5

        ctx.beginPath()
        ctx.moveTo(0, canvas.height)

        for (let x = 0; x <= canvas.width; x += 5) {
          const y =
            Math.sin(x * frequency + phase) * amplitude +
            Math.sin(x * frequency * 2 + phase * 1.5) * (amplitude * 0.5) +
            canvas.height -
            waveHeight -
            i * 30
          ctx.lineTo(x, y)
        }

        ctx.lineTo(canvas.width, canvas.height)
        ctx.lineTo(0, canvas.height)
        ctx.closePath()
        ctx.fill()
      }

      time += 1
      animationId = requestAnimationFrame(drawWave)
    }

    resizeCanvas()
    drawWave()

    window.addEventListener("resize", resizeCanvas)

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [colors, waveWidth, backgroundFill, blur, speed, waveOpacity])

  return (
    <div className={`relative ${containerClassName}`} ref={containerRef} {...props}>
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 z-0 ${className}`}
        style={{
          filter: `blur(${blur}px)`,
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  )
}
