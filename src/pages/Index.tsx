import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FloatingHearts from "@/components/FloatingHearts";
import Sparkle from "@/components/Sparkle";
import BlowCandles from "@/components/BlowCandles";
import { Cake, Star, PartyPopper, Mail, MailOpen } from "lucide-react";
import PhotoAlbum from "@/components/PhotoAlbum";

const Index = () => {
  const [step, setStep] = useState<"envelope" | "candles" | "message" | "album">("envelope");
  const [showAlbum, setShowAlbum] = useState(false);

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <FloatingHearts />
      <Sparkle />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-12">
        <AnimatePresence mode="wait">
          {step === "envelope" && (
            <EnvelopeScreen onOpen={() => setStep("candles")} />
          )}
          {step === "candles" && (
            <BlowCandles onComplete={() => setStep("message")} />
          )}
          {step === "message" && (
            <div className="flex flex-col items-center w-full">
              <BirthdayMessage onNext={() => setShowAlbum(true)} />
              <AnimatePresence>
                {showAlbum && <PhotoAlbum />}
              </AnimatePresence>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

/* ── Envelope Screen ── */
const EnvelopeScreen = ({ onOpen }: { onOpen: () => void }) => (
  <motion.div
    key="envelope"
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.5, y: -60 }}
    transition={{ duration: 0.6, ease: "easeOut" as const }}
    className="flex flex-col items-center gap-8 cursor-pointer select-none"
    onClick={onOpen}
  >
    {/* Envelope icon with bounce */}
    <motion.div
      animate={{ y: [0, -12, 0] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      className="relative"
    >
      <div className="w-40 h-40 md:w-52 md:h-52 rounded-3xl bg-card border-2 border-border shadow-2xl flex items-center justify-center">
        <Mail className="w-20 h-20 md:w-28 md:h-28 text-primary" />
      </div>

      {/* Seal */}
      <motion.div
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-lg"
      >
        <p className="w-5 h-5 font-bold text-cyan-50 size-8 flex justify-center items-center">20+</p> 
      </motion.div>
    </motion.div>

    <div className="text-center">
      <p className="font-script text-3xl md:text-4xl text-primary mb-2">
        You've got a message!
      </p>
      <p className="font-script text-xl md:text-xl text-primary mb-2">
      from khulan
      </p>
      <motion.p
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="text-sm text-muted-foreground tracking-widest uppercase"
      >
        Tap to open
      </motion.p>
    </div>
  </motion.div>
);

/* ── Birthday Message ── */
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.3, duration: 0.8, ease: "easeOut" as const },
  }),
};

const BirthdayMessage = ({ onNext }: { onNext: () => void }) => {
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Play celebration sound on mount
  useEffect(() => {
    const celebrationSound = new Audio('/wish2.mp3'); 
    celebrationSound.volume = 0.6;
    celebrationSound.play().catch(() => {});
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const el = containerRef.current;
      if (!el) return;
      const scrollBottom = el.scrollTop + el.clientHeight;
      if (scrollBottom >= el.scrollHeight - 40) {
        onNext();
      }
    };
    const el = containerRef.current;
    el?.addEventListener("scroll", handleScroll, { passive: true });
    return () => el?.removeEventListener("scroll", handleScroll);
  }, [onNext]);

  return (
    <motion.div
      key="message"
      initial={{ opacity: 0, scale: 0, rotate: -10 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      exit={{ opacity: 0, y: -40, transition: { duration: 0.3 } }}
      transition={{
        duration: 0.8,
        type: "spring",
        bounce: 0.6,
      }}
      ref={containerRef}
      className="flex flex-col items-center max-h-[85vh] overflow-y-auto scrollbar-hide"
    >
      {/* Explosion particles */}
      <div className="fixed inset-0 pointer-events-none z-50">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{
              opacity: 1,
              scale: 0,
              x: "50vw",
              y: "50vh",
            }}
            animate={{
              opacity: 0,
              scale: [0, 1.5, 0.5],
              x: `${Math.random() * 100}vw`,
              y: `${Math.random() * 100}vh`,
            }}
            transition={{
              duration: 1.5 + Math.random(),
              delay: Math.random() * 0.3,
              ease: "easeOut",
            }}
            className="absolute w-3 h-3 rounded-full"
            style={{
              background: [
                "hsl(var(--primary))",
                "hsl(var(--gold))",
                "hsl(var(--rose-glow))",
                "hsl(var(--accent))",
                "hsl(var(--secondary))",
              ][i % 5],
            }}
          />
        ))}
      </div>

      {/* Big flash overlay */}
      <motion.div
        initial={{ opacity: 0.8 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.6 }}
        className="fixed inset-0 bg-primary/20 pointer-events-none z-40"
      />

      {/* Opened envelope icon */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 0.8, delay: 0.3, type: "spring", bounce: 0.5 }}
        className="mb-6"
      >
        <div className="w-24 h-24 rounded-full bg-accent flex items-center justify-center shadow-lg overflow-hidden">
          <img src="https://pub-e2d4cdbf92de47a19dea2e3fccc07d4a.r2.dev/misheel/IMG_5427.png" alt="logo" className="w-full h-full object-cover" />
        </div>
      </motion.div>

      {/* Date badge */}
      <motion.div custom={0.5} variants={fadeUp} initial="hidden" animate="visible" className="mb-4">
        <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-red-400 text-primary-foreground text-sm font-semibold tracking-wide uppercase">
          <PartyPopper className="w-4 h-4" />
          SEPTEMBER 28TH
          <PartyPopper className="w-4 h-4" />
        </span>
      </motion.div>

      {/* Heading with scale bounce */}
      <motion.h1
        initial={{ opacity: 0, scale: 0.3, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6, type: "spring", bounce: 0.5 }}
        className="font-script text-5xl sm:text-6xl md:text-8xl text-gold text-center leading-tight mb-2"
      >
        Happy 20th
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, scale: 0.3 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8, duration: 0.5, type: "spring", bounce: 0.5 }}
        className="font-script text-3xl sm:text-4xl md:text-5xl text-gold text-center mb-8"
      >
        Birthday!
      </motion.p>

      {/* Decorative divider */}
      <motion.div
        initial={{ opacity: 0, width: 0 }}
        animate={{ opacity: 1, width: "auto" }}
        transition={{ delay: 1.1, duration: 0.6 }}
        className="flex items-center gap-3 mb-10 overflow-hidden"
      >
        <Star className="w-4 h-4 text-gold" />
        <Mail className="w-5 h-5 text-primary" />
        <div className="w-16 h-1.5 bg-border rounded-full" />
        <Cake className="w-6 h-6 text-rose-glow" />
        <div className="w-16 h-1.5 bg-border rounded-full" />
        <MailOpen className="w-5 h-5 text-primary" />
        <Star className="w-4 h-4 text-gold" />
      </motion.div>

      {/* Message card */}
      <motion.div
        initial={{ opacity: 0, y: 60, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 1.3, duration: 0.7, type: "spring", bounce: 0.3 }}
        className="max-w-lg w-full"
      >
        <div className="rounded-2xl bg-card border border-border p-8 md:p-10 shadow-xl backdrop-blur-sm">
          
        <p className="text-base md:text-lg font-paragraph italic leading-relaxed text-muted-foreground text-center mb-6">
        Dear my lovely Misheel  
        </p>

        <p className="text-base md:text-lg font-paragraph italic leading-relaxed text-muted-foreground text-center mb-6">
        Welcome to your 20s, a beautiful new chapter filled with endless possibilities. This is the age when we begin building the lives we've always imagined, making our own decisions, chasing our biggest dreams, and discovering even more about ourselves along the way. It's exciting, a little scary at times, but above all, it's an adventure waiting for us.
        </p>

        <p className="text-base md:text-lg font-paragraph italic leading-relaxed text-muted-foreground text-center mb-6">
        What makes this journey even more special is knowing that I get to share it with you and our girls. Through every stage of life, every success, every challenge, and every new adventure, I'm so grateful to have you by my side. Ten years of friendship is such a precious gift, and I can't wait to see what memories we'll create in the next ten years.
        </p>

        <p className="text-base md:text-lg font-paragraph italic leading-relaxed text-muted-foreground text-center mb-6">
        One of the things I've always admired most about you is your warm heart. You care so deeply about your family and the people around you, and you always show up for them. You notice when someone needs a hug, a kind word, or just someone to listen, and somehow you always know the right thing to say. It's such a beautiful quality, and everyone in your life is so lucky to have you. And sometimes, it's okay to be the first one on your own list too. Your happiness, your dreams, and your feelings matter just as much as everyone else's, and you're allowed to enjoy them fully. I hope in this new chapter you'll do exactly what feels right for you, follow what your heart wants, and give yourself the same love you give to everyone else.
        </p>

        <p className="text-base md:text-lg font-paragraph italic leading-relaxed text-muted-foreground text-center mb-6">
        Happy 20th birthday, my bestie. Thank you for being such an important part of my life. I'm so proud of you, so grateful for our friendship, and so excited to see all the beautiful things waiting for you in this new decade. 🤍✨
        </p>

          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="h-px w-12 bg-accent" />
            <Star className="w-4 h-4 text-gold" />
            <div className="h-px w-12 bg-accent" />
          </div>

          <p className="font-script text-2xl md:text-3xl text-primary text-center">
          Cheers to all your wishes coming true          </p>
          <p className="font-script text-xl md:text-2xl text-brown text-end mt-1">
          ~ Your forever bestie khulan ~
          </p>
        </div>
      </motion.div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="mt-10 mb-6 flex flex-col items-center gap-2"
      >
        <p className="text-sm text-muted-foreground tracking-widest uppercase">Scroll down</p>
        <motion.span
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="text-2xl"
        >
          ↓
        </motion.span>
      </motion.div>

      {/* Bouncing emojis */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
        className="mt-2 mb-8 flex items-center gap-4"
      >
        {["🎊", "✨", "🥂", "✨", "🎊"].map((emoji, i) => (
          <motion.span
            key={i}
            className="text-2xl md:text-3xl"
            animate={{ y: [0, -8, 0] }}
            transition={{
              duration: 1.5,
              delay: i * 0.2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {emoji}
          </motion.span>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default Index;
