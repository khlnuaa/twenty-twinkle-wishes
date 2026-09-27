import { motion } from "framer-motion";

const sparkles = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  delay: Math.random() * 3,
  size: 4 + Math.random() * 8,
}));

const Sparkle = () => (
  <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
    {sparkles.map((s) => (
      <motion.div
        key={s.id}
        className="absolute rounded-full bg-gold"
        style={{
          left: `${s.x}%`,
          top: `${s.y}%`,
          width: s.size,
          height: s.size,
        }}
        animate={{
          opacity: [0, 1, 0],
          scale: [0, 1.2, 0],
        }}
        transition={{
          duration: 2,
          delay: s.delay,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    ))}
  </div>
);

export default Sparkle;
