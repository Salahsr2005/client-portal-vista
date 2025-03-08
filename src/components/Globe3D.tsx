"use client"

import { useEffect, useRef } from "react"
import { useTheme } from "next-themes"
import createGlobe from "cobe"

export function GlobeDemo() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { theme } = useTheme()

  useEffect(() => {
    let phi = 0
    let width = 0
    const globe = createGlobe(canvasRef.current!, {
      devicePixelRatio: 2,
      width: 600 * 2,
      height: 600 * 2,
      phi: 0,
      theta: 0.3,
      dark: theme === "dark" ? 1 : 0,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: theme === "dark" ? [0.3, 0.3, 0.3] : [1, 1, 1],
      markerColor: [0.1, 0.8, 1],
      glowColor: [1, 1, 1],
      markers: [
        { location: [48.8566, 2.3522], size: 0.1 }, // Paris
        { location: [50.8503, 4.3517], size: 0.1 }, // Brussels
        { location: [52.2297, 21.0122], size: 0.1 }, // Warsaw
      ],
      onRender: (state) => {
        state.phi = phi
        phi += 0.01
        state.width = width * 2
        state.height = width * 2
      },
    })

    const resize = () => {
      const { current: canvas } = canvasRef
      if (canvas) {
        width = canvas.clientWidth
        canvas.width = width * 2
        canvas.height = width * 2
      }
    }

    window.addEventListener("resize", resize)
    resize()

    return () => {
      globe.destroy()
      window.removeEventListener("resize", resize)
    }
  }, [theme])

  return <canvas ref={canvasRef} style={{ width: "100%", aspectRatio: 1 / 1 }} />
}

