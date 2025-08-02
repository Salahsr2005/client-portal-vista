import { motion } from "framer-motion"
import { Heart, Users, Shield, Sparkles, MessageCircle, Pill } from "lucide-react"

const icons = [Heart, Users, Shield, Sparkles, MessageCircle, Pill]

export function FloatingIcons() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {icons.map((Icon, index) => (
        <motion.div
          key={index}
          className="absolute text-primary/20"
          initial={{
            x: `${Math.random() * 100}%`,
            y: `${Math.random() * 100}%`,
            scale: 0,
            rotate: 0,
          }}
          animate={{
            y: [0, -30, 0],
            rotate: [0, 180, 360],
            scale: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 8 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: "easeInOut",
          }}
        >
          <Icon className="h-8 w-8 md:h-12 md:w-12" />
        </motion.div>
      ))}
    </div>
  )
}