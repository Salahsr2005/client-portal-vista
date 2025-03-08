"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { Globe } from "lucide-react"

// European countries with their coordinates and information
const EUROPEAN_COUNTRIES = [
  {
    name: "United Kingdom",
    lat: 55.3781,
    lng: -3.436,
    info: "The United Kingdom includes England, Scotland, Wales, and Northern Ireland.",
  },
  {
    name: "France",
    lat: 46.2276,
    lng: 2.2137,
    info: "France is known for its cuisine, culture, and the Eiffel Tower in Paris.",
  },
  {
    name: "Germany",
    lat: 51.1657,
    lng: 10.4515,
    info: "Germany is the most populous country in the European Union.",
  },
  {
    name: "Spain",
    lat: 40.4637,
    lng: -3.7492,
    info: "Spain is known for its vibrant culture, flamenco dancing, and beautiful beaches.",
  },
  {
    name: "Italy",
    lat: 41.8719,
    lng: 12.5674,
    info: "Italy is famous for its art, architecture, and cuisine.",
  },
  {
    name: "Poland",
    lat: 51.9194,
    lng: 19.1451,
    info: "Poland is a country with a rich history and culture in Central Europe.",
  },
  {
    name: "Sweden",
    lat: 60.1282,
    lng: 18.6435,
    info: "Sweden is known for its progressive policies and beautiful landscapes.",
  },
  {
    name: "Greece",
    lat: 39.0742,
    lng: 21.8243,
    info: "Greece is the birthplace of democracy and Western philosophy.",
  },
]

// Convert latitude and longitude to 3D coordinates on a sphere
const latLngToCartesian = (lat: number, lng: number) => {
  const latRad = (lat * Math.PI) / 180
  const lngRad = (lng * Math.PI) / 180

  return {
    x: Math.cos(latRad) * Math.sin(lngRad),
    y: Math.sin(latRad),
    z: Math.cos(latRad) * Math.cos(lngRad),
  }
}

// Generate world map coordinates (simplified)
const generateWorldMapPoints = (density = 20) => {
  const points = []

  // Generate a grid of points covering the globe
  for (let lat = -90; lat <= 90; lat += 180 / density) {
    for (let lng = -180; lng <= 180; lng += 360 / density) {
      const { x, y, z } = latLngToCartesian(lat, lng)

      // Land vs water determination (simplified)
      // This is a very basic approximation - in a real app you'd use GeoJSON data
      let isLand = false

      // Simplified continents (very rough approximation)
      // North America
      if (lng > -170 && lng < -30 && lat > 15 && lat < 80) isLand = true
      // South America
      if (lng > -90 && lng < -30 && lat > -60 && lat < 15) isLand = true
      // Europe and Africa
      if (lng > -20 && lng < 60 && lat > -40 && lat < 70) isLand = true
      // Asia and Australia
      if (lng > 60 && lng < 180 && lat > -50 && lat < 80) isLand = true

      // Different colors for land and water
      const color = isLand
        ? `rgba(100, 180, 100, ${0.5 + Math.random() * 0.5})`
        : `rgba(70, 130, 180, ${0.3 + Math.random() * 0.3})`

      points.push({
        x,
        y,
        z,
        size: isLand ? 0.8 + Math.random() * 1.2 : 0.5 + Math.random() * 0.8,
        color,
        originalX: x,
        originalY: y,
        originalZ: z,
        isLand,
        connections: [],
      })
    }
  }

  // Create connections between nearby points
  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      const p1 = points[i]
      const p2 = points[j]

      // Calculate 3D distance
      const dx = p1.x - p2.x
      const dy = p1.y - p2.y
      const dz = p1.z - p2.z
      const distance = Math.sqrt(dx * dx + dy * dy + dz * dz)

      // Connect close points (smaller threshold for more selective connections)
      // Only connect points of the same type (land-land or water-water)
      if (distance < 0.25 && p1.isLand === p2.isLand) {
        p1.connections.push(j)
        p2.connections.push(i)
      }
    }
  }

  return points
}

export const Globe3D = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null)
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })
  const [isTooltipVisible, setIsTooltipVisible] = useState(false)

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const context = canvas.getContext("2d")
    if (!context) return

    let width = 0
    let height = 0
    let points: any[] = []
    let animationFrameId: number
    let globeSize = 0
    let mouseX = 0
    let mouseY = 0
    let isMouseMoving = false
    let lastMouseMoveTime = 0
    let rotationX = 0.5
    let rotationY = 0.5
    let targetRotationX = 0.5
    let targetRotationY = 0.5

    // Track mouse position
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        mouseX = e.clientX - rect.left
        mouseY = e.clientY - rect.top
        isMouseMoving = true
        lastMouseMoveTime = Date.now()
      }
    }

    const resizeCanvas = () => {
      if (!containerRef.current || !canvas) return
      width = containerRef.current.clientWidth
      height = containerRef.current.clientHeight
      canvas.width = width
      canvas.height = height
      globeSize = Math.min(width, height) * 0.4
      initPoints()
    }

    const initPoints = () => {
      points = []

      // Create points on the globe - more points for a denser look
      const pointCount = 800

      for (let i = 0; i < pointCount; i++) {
        // Sample points on a sphere using spherical coordinates
        const theta = Math.random() * Math.PI * 2 // longitude
        const phi = Math.acos(2 * Math.random() - 1) // latitude

        // Convert to Cartesian coordinates
        const x = Math.sin(phi) * Math.cos(theta)
        const y = Math.cos(phi)
        const z = Math.sin(phi) * Math.sin(theta)

        // Aceternity UI style colors
        let color: string
        const colorRoll = Math.random()

        if (colorRoll < 0.7) {
          // Primary color (teal/blue gradient)
          const intensity = 0.4 + Math.random() * 0.6
          const hue = 180 + Math.random() * 40 // teal to blue range
          color = `hsla(${hue}, 80%, 60%, ${intensity})`
        } else if (colorRoll < 0.9) {
          // Accent color (purple/pink)
          const intensity = 0.4 + Math.random() * 0.6
          const hue = 280 + Math.random() * 40 // purple range
          color = `hsla(${hue}, 80%, 65%, ${intensity})`
        } else {
          // Highlight color (gold/yellow)
          const intensity = 0.5 + Math.random() * 0.5
          color = `hsla(45, 100%, 60%, ${intensity})`
        }

        points.push({
          x,
          y,
          z,
          size: 0.5 + Math.random() * 1.5, // Varied sizes for depth
          color,
          originalX: x,
          originalY: y,
          originalZ: z,
          connections: [], // Will store indexes of connected points
        })
      }

      // Find connections between points - network effect
      for (let i = 0; i < points.length; i++) {
        const p1 = points[i]
        const connections = []

        // Find 1-3 closest points to connect to
        const distances = []

        for (let j = 0; j < points.length; j++) {
          if (i === j) continue

          const p2 = points[j]
          const dx = p1.x - p2.x
          const dy = p1.y - p2.y
          const dz = p1.z - p2.z
          const distance = Math.sqrt(dx * dx + dy * dy + dz * dz)

          distances.push({ index: j, distance })
        }

        // Sort by distance and take 1-3 closest
        distances.sort((a, b) => a.distance - b.distance)
        const connectionCount = 1 + Math.floor(Math.random() * 3)

        for (let k = 0; k < Math.min(connectionCount, distances.length); k++) {
          connections.push(distances[k].index)
        }

        p1.connections = connections
      }

      setIsLoading(false)
    }

    const drawScene = () => {
      if (!context) return

      context.clearRect(0, 0, width, height)

      // Auto-deactivate mouse movement after a period of inactivity
      if (isMouseMoving && Date.now() - lastMouseMoveTime > 2000) {
        isMouseMoving = false
      }

      // Get time for rotation
      const time = Date.now() * 0.00005

      // Calculate rotation
      if (isMouseMoving) {
        // Adjust rotation based on mouse position, but more gently
        targetRotationX = (mouseY - height / 2) * 0.003
        targetRotationY = (mouseX - width / 2) * 0.003
      } else {
        // Auto-rotation when not interacting
        targetRotationX = Math.sin(time) * 0.2
        targetRotationY = time
      }

      // Smooth rotation transitions
      rotationX += (targetRotationX - rotationX) * 0.05
      rotationY += (targetRotationY - rotationY) * 0.05

      // Draw connections first (behind points)
      const drawnConnections = new Set() // Track connections to avoid duplicates

      for (let i = 0; i < points.length; i++) {
        const p1 = points[i]

        // 3D rotation transform
        const cosX = Math.cos(rotationX)
        const sinX = Math.sin(rotationX)
        const cosY = Math.cos(rotationY)
        const sinY = Math.sin(rotationY)

        // Apply rotation
        let x1 = p1.originalX
        let y1 = p1.originalY
        let z1 = p1.originalZ

        // Rotate around X
        const temp1Y = y1
        y1 = y1 * cosX - z1 * sinX
        z1 = temp1Y * sinX + z1 * cosX

        // Rotate around Y
        const temp1X = x1
        x1 = x1 * cosY + z1 * sinY
        z1 = -temp1X * sinY + z1 * cosY

        // Apply 3D projection
        const scale1 = 300 / (300 + z1 * 100)
        const screenX1 = width / 2 + x1 * globeSize * scale1
        const screenY1 = height / 2 + y1 * globeSize * scale1

        // Only draw if point is visible (facing camera)
        const pointVisible = z1 > -1

        // Store projected coordinates for later point drawing
        p1.screenX = screenX1
        p1.screenY = screenY1
        p1.scale = scale1
        p1.visible = pointVisible

        // Draw connections from this point
        if (pointVisible) {
          for (const connIndex of p1.connections) {
            const p2 = points[connIndex]

            // Only draw each connection once
            const connectionId = i < connIndex ? `${i}-${connIndex}` : `${connIndex}-${i}`
            if (drawnConnections.has(connectionId)) continue
            drawnConnections.add(connectionId)

            // Same rotation for connected point
            let x2 = p2.originalX
            let y2 = p2.originalY
            let z2 = p2.originalZ

            // Rotate around X
            const temp2Y = y2
            y2 = y2 * cosX - z2 * sinX
            z2 = temp2Y * sinX + z2 * cosX

            // Rotate around Y
            const temp2X = x2
            x2 = x2 * cosY + z2 * sinY
            z2 = -temp2X * sinY + z2 * cosY

            // Only draw if the connected point is also visible
            if (z2 > -1) {
              const scale2 = 300 / (300 + z2 * 100)
              const screenX2 = width / 2 + x2 * globeSize * scale2
              const screenY2 = height / 2 + y2 * globeSize * scale2

              // Store for later point drawing
              p2.screenX = screenX2
              p2.screenY = screenY2
              p2.scale = scale2
              p2.visible = true

              // Draw connection line with gradient
              const lineOpacity = 0.1 + (p1.scale + p2.scale) * 0.1

              // Create gradient for connection line
              const gradient = context.createLinearGradient(screenX1, screenY1, screenX2, screenY2)

              // Parse colors to create gradient
              const color1 = p1.color.match(/hsla?$$(\d+),\s*(\d+)%,\s*(\d+)%(?:,\s*([.\d]+))?$$/)
              const color2 = p2.color.match(/hsla?$$(\d+),\s*(\d+)%,\s*(\d+)%(?:,\s*([.\d]+))?$$/)

              if (color1 && color2) {
                gradient.addColorStop(0, p1.color.replace(/[.\d]+\)$/, `${lineOpacity})`))
                gradient.addColorStop(1, p2.color.replace(/[.\d]+\)$/, `${lineOpacity})`))

                context.strokeStyle = gradient
                context.lineWidth = 0.5 * Math.min(p1.scale, p2.scale)
                context.beginPath()
                context.moveTo(screenX1, screenY1)
                context.lineTo(screenX2, screenY2)
                context.stroke()
              }
            }
          }
        }
      }

      // Now draw all points on top of connections
      for (const p of points) {
        if (p.visible) {
          // Size affected by depth
          const size = p.size * p.scale * 2

          // Make points with gradient for more 3D feel
          const radialGradient = context.createRadialGradient(p.screenX, p.screenY, 0, p.screenX, p.screenY, size * 2)

          // Parse the color to create glow effect
          const hsla = p.color.match(/hsla?$$(\d+),\s*(\d+)%,\s*(\d+)%(?:,\s*([.\d]+))?$$/)

          if (hsla) {
            const [_, h, s, l, a] = hsla.map(Number)

            // Brighter center
            radialGradient.addColorStop(0, `hsla(${h}, ${s}%, ${Math.min(100, l + 20)}%, ${a})`)
            // Original color
            radialGradient.addColorStop(0.3, p.color)
            // Fade out
            radialGradient.addColorStop(1, `hsla(${h}, ${s}%, ${l}%, 0)`)

            // Draw main point
            context.beginPath()
            context.fillStyle = radialGradient
            context.arc(p.screenX, p.screenY, size * 2, 0, Math.PI * 2)
            context.fill()

            // Draw smaller, brighter center
            context.beginPath()
            context.fillStyle = `hsla(${h}, ${s}%, ${Math.min(100, l + 30)}%, ${a})`
            context.arc(p.screenX, p.screenY, size * 0.5, 0, Math.PI * 2)
            context.fill()
          }
        }
      }

      // Add ambient glow in the center
      const centerGlow = context.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, globeSize * 1.2)

      // Use a subtle gradient that matches the color theme
      centerGlow.addColorStop(0, "hsla(190, 80%, 60%, 0.03)")
      centerGlow.addColorStop(0.5, "hsla(210, 80%, 50%, 0.02)")
      centerGlow.addColorStop(1, "hsla(220, 80%, 40%, 0)")

      context.beginPath()
      context.fillStyle = centerGlow
      context.arc(width / 2, height / 2, globeSize * 1.2, 0, Math.PI * 2)
      context.fill()

      // Create a subtle orbital ring effect
      const ringAngle = Math.PI / 6 // Angle of the ring
      context.save()
      context.translate(width / 2, height / 2)
      context.rotate(ringAngle)
      context.scale(1, 0.3) // Make it an oval

      // Draw the orbital ring
      const ringGradient = context.createLinearGradient(-globeSize, 0, globeSize, 0)
      ringGradient.addColorStop(0, "hsla(210, 80%, 50%, 0)")
      ringGradient.addColorStop(0.5, "hsla(190, 80%, 60%, 0.1)")
      ringGradient.addColorStop(1, "hsla(210, 80%, 50%, 0)")

      context.beginPath()
      context.strokeStyle = ringGradient
      context.lineWidth = 1
      context.arc(0, 0, globeSize * 0.9, 0, Math.PI * 2)
      context.stroke()
      context.restore()

      animationFrameId = requestAnimationFrame(drawScene)
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)
    document.addEventListener("mousemove", handleMouseMove)
    drawScene()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      document.removeEventListener("mousemove", handleMouseMove)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <motion.div
      className="relative w-full h-full flex items-center justify-center bg-gradient-to-b from-background to-background/80"
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <Globe className="h-12 w-12 text-primary animate-pulse" />
        </div>
      )}

      <canvas ref={canvasRef} className="absolute inset-0" />

      {/* Background gradient elements */}
      <div className="absolute -z-10 inset-0 overflow-hidden">
        {/* Radial gradient blobs */}
        <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-gradient-radial from-purple-500/10 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/4 w-1/3 h-1/3 bg-gradient-radial from-blue-500/10 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 right-1/3 w-1/4 h-1/4 bg-gradient-radial from-teal-500/10 to-transparent rounded-full blur-3xl"></div>
      </div>

      {/* Subtle gradient overlay to enhance depth */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-background/20 rounded-lg pointer-events-none"></div>
    </motion.div>
  )
}

