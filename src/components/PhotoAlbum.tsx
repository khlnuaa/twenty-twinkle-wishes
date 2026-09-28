import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";

const PhotoAlbum = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(false);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.muted = false;
          video.play().catch(() => {
            video.muted = true;
            setIsMuted(true);
            video.play().catch(() => {});
          });
          setIsMuted(false);
        } else {
          video.muted = true;
          setIsMuted(true);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <motion.div
      key="album"
      initial={{ opacity: 0, y: 100, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, type: "spring", bounce: 0.3 }}
      className="flex flex-col items-center w-full max-w-3xl mx-auto px-4"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="flex items-center gap-3 mb-10"
      >
        <h2 className="font-script text-2xl text-muted-foreground">
        Love you so much, let’s make even more amazing memories together.
        </h2>
      </motion.div>

      {/* Video */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, rotate: -2 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ delay: 0.4, duration: 0.7, type: "spring", bounce: 0.3 }}
        className="w-full"
      >
        <div className="bg-card rounded-2xl shadow-2xl p-3 md:p-4 border border-border relative">
          <div className="rounded-xl aspect-[4/3] mx-auto relative">
            <video
              ref={videoRef}
              src="https://pub-e2d4cdbf92de47a19dea2e3fccc07d4a.r2.dev/misheel/copy_AE10B7CC-6C14-4C52-8A63-9235021BA737.mov"
              autoPlay
              loop
              playsInline
              className="w-full h-full object-contain bg-black"
            />
            <button
              onClick={toggleMute}
              className="absolute bottom-3 right-3 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm border border-border flex items-center justify-center text-foreground hover:bg-background transition-colors"
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Footer */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="mt-10 mb-8 font-script text-xl text-muted-foreground"
      >
That little girl is still in you 🤍 And honestly, I hope she stays forever—the one who gets excited over the smallest things, laughs until her stomach hurts, and somehow makes every random idea sound like the best idea ever. No matter how old we get, I hope we always keep a little bit of our younger selves with us. I hope we never become too busy, too serious, or too grown-up to laugh until we cry and do silly things together. 🤍✨ 
      </motion.p>
    </motion.div>
  );
};

export default PhotoAlbum;
