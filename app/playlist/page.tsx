"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { songs } from "./songs"
import SongWidget from "./SongWidget"
import VolumeBar from "./VolumeBar"
import BlurText from "@/components/BlurText"
import ClickSpark from "@/components/ClickSpark"

export type Lean = "left" | "right" | null

export default function PlaylistPage() {
  const router = useRouter()
  const [showSinging, setShowSinging] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)
  const [hasShownTooltip, setHasShownTooltip] = useState(false)

  useEffect(() => {
    // Load Google Fonts dynamically
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400..700&family=Momo+Signature&family=Pacifico&family=Playwrite+NZ+Basic:wght@100..400&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }, []);

  const [orderedSongs, setOrderedSongs] = useState<string[]>(
    Array.from({ length: songs.length }, (_, index) => songs[index].id),
  )
  const [previousOrderedSongs, setPreviousOrderedSongs] =
    useState<string[]>(orderedSongs)
  const [leaning, setLeaning] = useState<Lean>(null)
  const [volume, setVolume] = useState(0.5)
  const [muted, setMuted] = useState(true)

  const handleMascotClick = () => {
    setShowSinging(true)
    setTimeout(() => {
      setShowSinging(false)
    }, 2000)
  }

  const emitSwipe = (direction: Exclude<Lean, null>) => {
    setPreviousOrderedSongs(orderedSongs)
    if (direction === "right") {
      setOrderedSongs((prev) => [...prev.slice(1), prev[0]])
    } else {
      setOrderedSongs((prev) => [prev[prev.length - 1], ...prev.slice(0, -1)])
    }
  }

  return (
    <main className="fixed inset-0 flex flex-col items-center justify-center gap-12 pb-20" style={{ background: 'linear-gradient(to bottom, #f9a8d4 0%, #ffffff 50%, #d8b4fe 90%, #d8b4fe 100%)', overflow: 'clip' }}>
      {/* Back button */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        onClick={() => router.push('/hub')}
        className="fixed top-6 left-6 z-50 w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-sm"
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#a950bb" strokeWidth="2">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
      </motion.button>

      <div className="absolute inset-0 pointer-events-none">
        <ClickSpark
          sparkColor="#a950bbff"
          sparkSize={12}
          sparkRadius={25}
          sparkCount={12}
          duration={500}
          easing="ease-out"
          extraScale={1.2}
        >
          <motion.div
            className="absolute pointer-events-auto cursor-pointer z-30"
            style={{
              width: showSinging ? '250px' : '286px',
              height: showSinging ? '250px' : '286px',
              left: 'calc(50% - 400px)',
              top: 'calc(4rem + 30%)',
            }}
            onClick={handleMascotClick}
          >
            <motion.img
              src={showSinging ? "/assets/playlist/singing.png" : "/assets/playlist/huu.png"}
              alt="mascot"
              className="object-contain w-full h-full"
              style={{
                filter: 'drop-shadow(0 10px 20px rgba(0, 0, 0, 0.25)) drop-shadow(0 5px 10px rgba(0, 0, 0, 0.15))'
              }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            />
          </motion.div>
        </ClickSpark>
      </div>

      {/* Music icon with wipe animation */}
      {showSinging && (
        <motion.div
          className="absolute overflow-hidden"
          style={{
            width: '150px',
            height: '150px',
            left: 'calc(50% - 336px)',
            top: 'calc(4rem + 21%)',
            zIndex: 30,
            filter: 'drop-shadow(0 8px 16px rgba(0, 0, 0, 0.2)) drop-shadow(0 4px 8px rgba(0, 0, 0, 0.12))'
          }}
          initial={{ clipPath: 'inset(0 100% 0 0)' }}
          animate={{ clipPath: 'inset(0 0% 0 0)' }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <img
            src="/assets/playlist/muisc.png"
            alt="music"
            className="w-full h-full object-contain"
          />
        </motion.div>
      )}

      <div className="absolute top-16 flex items-center justify-center w-full" style={{ transform: 'translate(1%, 10%)' }}>
        <BlurText
          text="MARYAM PLAYS!"
          delay={200}
          animateBy="words"
          direction="top"
          className="text-6xl text-zinc-700 font-black tracking-wider text-with-shadow"
        />
      </div>

      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
        initial={{ y: 0 }}
        animate={{
          y: [0, -4, 0],
        }}
        transition={{
          y: {
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }
        }}
      >
        {songs.map((song) => (
          <SongWidget
            key={song.id}
            song={song}
            previousOrderedSongs={previousOrderedSongs}
            orderedSongs={orderedSongs}
            emitSwipe={emitSwipe}
            leaning={leaning}
            setLeaning={setLeaning}
            volume={volume}
            muted={muted}
            showTooltip={showTooltip}
            setShowTooltip={setShowTooltip}
            hasShownTooltip={hasShownTooltip}
            setHasShownTooltip={setHasShownTooltip}
          />
        ))}
      </motion.div>

      {/* Tooltip for custom song - speech bubble from mascot */}
      {showTooltip && (
        <motion.div
          className="absolute pointer-events-none"
          style={{
            zIndex: 1,
            left: 'calc(50% - 550px + 2%)',
            top: 'calc(50% - 200px - 5%)'
          }}
          initial={{ opacity: 0, scale: 0.792 }}
          animate={{ opacity: 1, scale: 0.88 }}
          exit={{ opacity: 0, scale: 0.792 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <img
            src="/assets/playlist/playlist text.png"
            alt="playlist text"
            className="drop-shadow-xl"
            style={{ width: '400px', height: 'auto' }}
          />
        </motion.div>
      )}

      {/* Volume Control */}
      <VolumeBar
        volume={volume}
        setVolume={setVolume}
        muted={muted}
        setMuted={setMuted}
      />

      {/* Footer instructions */}
      <div className="absolute bottom-8 flex flex-col items-center gap-2 text-zinc-600">
        <p className="text-xs font-thin tracking-wide">*Swipe left or right to change songs</p>
        <p className="text-xs font-thin tracking-wide">*Tap waveform to play/pause • Tap mascot for it to sing(There was no need btw!UwU)</p>
      </div>
    </main>
  )
}
