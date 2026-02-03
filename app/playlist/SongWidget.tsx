import Waveform from "./Waveform"
import RotatingText from "./RotatingText"
import { FC, RefObject, useEffect, useRef, useState } from "react"
import { Song } from "./songs"
import Image from "next/image"
import { motion, animate } from "framer-motion"
import { PanInfo } from "framer-motion"
import { useMotionValue, useTransform } from "framer-motion"
import { Lean } from "./page"
import { cn } from "@/lib/utils"

type SongWidgetProps = {
    song: Song
    orderedSongs: string[]
    previousOrderedSongs: string[]
    emitSwipe: (direction: Exclude<Lean, null>) => void
    leaning: Lean
    setLeaning: (leaning: Lean) => void
    volume: number
    muted: boolean
    showTooltip: boolean
    setShowTooltip: (show: boolean) => void
    hasShownTooltip: boolean
    setHasShownTooltip: (shown: boolean) => void
}

const SongWidget: FC<SongWidgetProps> = ({
    song,
    orderedSongs,
    previousOrderedSongs,
    emitSwipe,
    leaning,
    setLeaning,
    volume,
    muted,
    showTooltip,
    setShowTooltip,
    hasShownTooltip,
    setHasShownTooltip,
}) => {
    const rank = orderedSongs.indexOf(song.id)
    const previousRank = previousOrderedSongs.indexOf(song.id)
    const ref = useRef<HTMLDivElement>(null)
    const [isActive, setIsActive] = useState(false)
    const [isLast, setIsLast] = useState(false)
    const [isNext, setIsNext] = useState(false)
    const [isDragging, setIsDragging] = useState(false)
    const [paused, setPaused] = useState(false)
    const dragOffset = useMotionValue(0)
    const dragRotation = useTransform(dragOffset, [-200, 200], [-5, 5])
    const affectedRotation = useMotionValue(0)
    const audioRef = useRef<HTMLAudioElement | null>(null)

    const handleMouseEnter = () => {
        console.log('Mouse entered, song id:', song.id, 'hasShownTooltip:', hasShownTooltip)
        if (song.id === 'chii' && !hasShownTooltip) {
            console.log('Showing tooltip!')
            setShowTooltip(true)
            setHasShownTooltip(true)
        }
    }

    const handleMouseLeave = () => {
        if (song.id === 'chii') {
            setShowTooltip(false)
        }
    }

    const handleDrag = (_: unknown, info: PanInfo) => {
        setIsDragging(true)
        dragOffset.set(info.offset.x)
        if (info.offset.x > 100) {
            setLeaning("right")
        } else if (info.offset.x < -100) {
            setLeaning("left")
        } else {
            setLeaning(null)
        }
    }

    const handleDragEnd = (_: unknown, info: PanInfo) => {
        setTimeout(() => {
            setIsDragging(false)
        }, 500)
        animate(dragOffset, 0, { type: "spring", stiffness: 300, damping: 30 })
        if (info.offset.x > 100) {
            emitSwipe("right")
        } else if (info.offset.x < -100) {
            emitSwipe("left")
        }
        setLeaning(null)
    }

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume
        }
    }, [volume])

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.muted = muted
        }
    }, [muted])

    useEffect(() => {
        if (!audioRef.current) return
        if (isActive) {
            audioRef.current.play().catch((error) => {
                if (error.name === "NotAllowedError") {
                    setPaused(true)
                    console.log("Audio autoplay blocked - waiting for user interaction")
                } else {
                    console.error("Audio playback error:", error)
                }
            })
        } else {
            audioRef.current.pause()
            audioRef.current.currentTime = 0
        }
        return () => {
            if (audioRef.current) {
                audioRef.current.pause()
                audioRef.current.currentTime = 0
            }
        }
    }, [isActive, song])

    useEffect(() => {
        if (isLast && leaning === "right") {
            animate(affectedRotation, -5)
            animate(ref.current!, { x: -50 })
        }
        if (isNext && leaning === "left") {
            animate(affectedRotation, 5)
            animate(ref.current!, { x: 50 })
        }
        if (!isDragging && leaning === null) {
            animate(affectedRotation, 0)
            animate(ref.current!, { x: 0 })
        }
    }, [rank, leaning, isLast, isActive, isDragging, isNext])

    useEffect(() => {
        setIsActive(rank === orderedSongs.length - 1)
        setIsNext(rank === orderedSongs.length - 2)
        setIsLast(rank === 0)
    }, [rank, orderedSongs.length])

    return (
        <motion.div
            ref={ref}
            className="absolute flex cursor-grab items-center justify-center overflow-hidden rounded-[42px] active:cursor-grabbing"
            drag="x"
            dragMomentum
            dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
            onDragEnd={handleDragEnd}
            onDrag={handleDrag}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{
                width: '280px',
                height: '280px',
                rotate: isDragging ? dragRotation : affectedRotation,
                zIndex: rank,
                boxShadow: '0 8px 16px rgba(0, 0, 0, 0.08), 0 4px 8px rgba(0, 0, 0, 0.06)',
            }}
        >
            <div className="absolute left-0 top-0 -z-10 h-full w-full bg-zinc-300"></div>
            <Image
                src={song.image}
                alt={`${song.title} by ${song.artist}`}
                className={cn(
                    "pointer-events-none h-full w-full object-cover transition-opacity duration-150",
                    !isActive && "opacity-50",
                )}
                width={300}
                height={300}
            />
            <div className="absolute bottom-0 left-0 h-1/2 w-full bg-gradient-to-t from-black to-transparent"></div>

            <div className="absolute bottom-0 left-0 flex w-full items-center justify-start gap-2 p-4">
                <Waveform
                    active={isActive}
                    audioRef={audioRef as RefObject<HTMLAudioElement>}
                    paused={paused}
                    setPaused={setPaused}
                />
                <div className="relative flex w-full flex-col items-start justify-center pr-5 -translate-x-2">
                    <RotatingText text={song.title} />
                    <RotatingText
                        text={song.artist}
                        className="w-full truncate text-xs font-normal text-zinc-300"
                    />
                </div>
            </div>
            <audio
                ref={audioRef}
                className="hidden"
                src={`/audio/${song.id}.mp3`}
                muted={muted}
                loop
            />
        </motion.div>
    )
}

export default SongWidget
