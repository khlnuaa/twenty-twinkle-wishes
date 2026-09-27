import { motion } from "framer-motion";

const items = ["🎂", "🎁", "🥳", "🎉", "✨", "⭐", "💫", "💕", "🧁", "🍰", "🌟"];

const floatingItems = Array.from({ length: 15 }, (_, i) => ({
  id: i,
  emoji: items[i % items.length],
  x: Math.random() * 100,
  delay: Math.random() * 5,
  duration: 4 + Math.random() * 4,
  size: 16 + Math.random() * 16,
  opacity: 0.2 + Math.random() * 0.3,
}));

const FloatingHearts = () => (
  <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
    {floatingItems.map((h) => (
      <motion.div
        key={h.id}
        className="absolute"
        style={{ left: `${h.x}%`, fontSize: h.size, opacity: h.opacity }}
        initial={{ y: "110vh", rotate: 0 }}
        animate={{ y: "-10vh", rotate: [0, 15, -15, 0] }}
        transition={{
          duration: h.duration,
          delay: h.delay,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        {h.emoji}
      </motion.div>
    ))}
  </div>
);

export default FloatingHearts;
