import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff } from "lucide-react";

interface BlowCandlesProps {
  onComplete: () => void;
}

const CANDLE_COUNT = 5;
const BLOW_THRESHOLD = 0.013;
const BLOW_DURATION_MS = 50;

const BlowCandles = ({ onComplete }: BlowCandlesProps) => {
  const [litCandles, setLitCandles] = useState<boolean[]>(
    Array(CANDLE_COUNT).fill(true)
  );
  const [micActive, setMicActive] = useState(false);
  const [micError, setMicError] = useState(false);
  const [allBlown, setAllBlown] = useState(false);

  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number>(0);
  const blowStartRef = useRef<number | null>(null);
  const birthdaySongRef = useRef<HTMLAudioElement | null>(null);

  const cleanup = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    analyserRef.current = null;
  }, []);

  // Play birthday song when component mounts
  useEffect(() => {
    const song = new Audio('/birthday-song.mp3');    
    song.loop = true;
    song.volume = 0.4;
    birthdaySongRef.current = song;
    song.play().catch(() => {});
    return () => {
      song.pause();
      song.currentTime = 0;
    };
  }, []);

  useEffect(() => () => cleanup(), [cleanup]);

  // Once all candles out, fade song and proceed immediately
  useEffect(() => {
    if (litCandles.every((c) => !c) && !allBlown) {
      setAllBlown(true);
      cleanup();
      // Fade out birthday song
      const song = birthdaySongRef.current;
      if (song) {
        const fadeOut = setInterval(() => {
          if (song.volume > 0.05) {
            song.volume = Math.max(0, song.volume - 0.05);
          } else {
            song.pause();
            clearInterval(fadeOut);
          }
        }, 80);
      }
      // Transition quickly without "Wish granted"
      setTimeout(onComplete, 600);
    }
  }, [litCandles, allBlown, onComplete, cleanup]);

  const startMic = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const ctx = new AudioContext();
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;
      setMicActive(true);
      setMicError(false);
      detectBlow();
    } catch {
      setMicError(true);
    }
  };

  const detectBlow = () => {
    const analyser = analyserRef.current;
    if (!analyser) return;

    const data = new Uint8Array(analyser.fftSize);

    const loop = () => {
      analyser.getByteTimeDomainData(data);

      // Calculate RMS volume
      let sum = 0;
      for (let i = 0; i < data.length; i++) {
        const v = (data[i] - 128) / 128;
        sum += v * v;
      }
      const rms = Math.sqrt(sum / data.length);

      if (rms > BLOW_THRESHOLD) {
        if (!blowStartRef.current) blowStartRef.current = Date.now();
        if (Date.now() - blowStartRef.current > BLOW_DURATION_MS) {
          // Blow out candles one by one rapidly
          blowOutCandles();
          return;
        }
      } else {
        blowStartRef.current = null;
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
  };

  const blowOutCandles = () => {
    // Extinguish candles with staggered timing
    for (let i = 0; i < CANDLE_COUNT; i++) {
      setTimeout(() => {
        setLitCandles((prev) => {
          const next = [...prev];
          next[i] = false;
          return next;
        });
      }, i * 200);
    }
  };

  return (
    <motion.div
      key="candles"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5, y: -40 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col items-center gap-6"
    >
      {/* Title */}
      <motion.p
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="font-script text-3xl md:text-4xl text-primary text-center"
      >
        Make a wish & blow! 🎂
      </motion.p>

      {/* Cake */}
      <div className="relative">
        {/* Cake body */}
        <div className="relative flex flex-col items-center">
          {/* Candles row */}
          <div className="flex items-end justify-center gap-4 md:gap-6 mb-0 relative z-10">
            {litCandles.map((lit, i) => (
              <Candle
                key={i}
                lit={lit}
                index={i}
                onTap={() => {
                  setLitCandles((prev) => {
                    const next = [...prev];
                    next[i] = false;
                    return next;
                  });
                }}
              />
            ))}
          </div>

          {/* Cake layers */}
          <div className="w-64 md:w-80">
            {/* Top layer */}
            <div className="h-6 md:h-8 rounded-t-2xl bg-orange-950 border-x-2 border-t-2 border-border" />
            {/* Frosting drip */}
            <div className="h-3 bg-secondary rounded-b-lg mx-2" />
            {/* Middle layer */}
            <div className="h-10 md:h-14 bg-orange-950 border-x-2 border-border flex items-center justify-center">
              <div className="flex gap-2">
                {["🍓", "🫐", "🍒", "🍓", "🫐"].map((e, i) => (
                  <span key={i} className="text-sm md:text-base">{e}</span>
                ))}
              </div>
            </div>
             {/* Frosting drip */}
             <div className="h-3 bg-secondary rounded-b-lg mx-2" />
            {/* Bottom layer */}
            <div className="h-12 md:h-16 rounded-b-2xl bg-orange-950 border-x-2 border-b-2 border-border flex items-center justify-center">
              <p className="font-script text-lg md:text-xl text-secondary text-ellipsis">Welocome to 20</p>
            </div>
          </div>

          {/* Plate */}
          <div className="w-72 md:w-88 h-4 rounded-b-[50%] bg-muted-foreground border-2 border-border -mt-1" />
        </div>
      </div>

      {/* Mic prompt */}
      <AnimatePresence>
        {!allBlown && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-3"
          >
            {!micActive ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={startMic}
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold shadow-lg"
              >
                <Mic className="w-5 h-5" />
                Tap to enable mic & blow
              </motion.button>
            ) : (
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-accent text-accent-foreground font-semibold"
              >
                <Mic className="w-5 h-5 text-primary" />
                Blow into your mic! 💨
              </motion.div>
            )}

            {micError && (
              <div className="flex items-center gap-2 text-sm text-destructive">
                <MicOff className="w-4 h-4" />
                Mic access denied — tap candles instead!
              </div>
            )}

            {/* Fallback: tap candles */}
            {(micError || micActive) && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="text-xs text-muted-foreground"
              >
                Or tap each candle to blow it out
              </motion.p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
};

/* ── Single Candle ── */
const Candle = ({ lit, index, onTap }: { lit: boolean; index: number; onTap: () => void }) => {
  return (
    <div
      className="flex flex-col items-center cursor-pointer p-2 -m-2"
      onClick={lit ? onTap : undefined}
      role="button"
      aria-label={`Candle ${index + 1}${lit ? ' - tap to blow out' : ' - already out'}`}
    >
      {/* Flame */}
      <AnimatePresence>
        {lit && (
          <motion.div
            initial={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="relative mb-0.5"
          >
            {/* Glow */}
            <motion.div
              animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 0.8, repeat: Infinity, delay: index * 0.15 }}
              className="absolute -inset-2 rounded-full bg-gold/30 blur-md"
            />
            {/* Flame shape */}
            <motion.div
              animate={{ scaleY: [1, 1.2, 0.9, 1], scaleX: [1, 0.9, 1.1, 1] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: index * 0.1 }}
              className="w-3 h-5 rounded-full"
              style={{
                background: "linear-gradient(to top, hsl(var(--gold)), hsl(40, 100%, 70%), hsl(45, 100%, 85%))",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Wick */}
      <div className="w-0.5 h-2 bg-foreground/40 rounded-full" />

      {/* Candle stick */}
      <div
        className="w-3 md:w-4 h-10 md:h-14 rounded-sm border border-border"
        style={{
          background: [
            "hsl(var(--primary))",
            "hsl(var(--secondary))",
            "hsl(var(--accent))",
            "hsl(var(--gold))",
            "hsl(var(--rose-glow))",
          ][index % 5],
        }}
      />
    </div>
  );
};

export default BlowCandles;
