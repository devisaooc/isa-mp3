"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Phone,
  Bell,
  Users,
  MessageCircle,
  PhoneCall,
  Calendar,
  Mic,
  Loader2, // ไอคอนสำหรับ Loading
  AlertCircle, // ไอคอนสำหรับ Error
  StopCircle, // ไอคอนสำหรับปุ่ม Stop All
} from "lucide-react"
import { cn } from "@/lib/utils"

interface SoundClip {
  id: number
  title: string
  description: string
  src: string
  icon: React.ReactNode
}

// ลบ property 'color' ที่ไม่ได้ใช้ออกไป
const soundClips: SoundClip[] = [
  {
    id: 1,
    title: "ณ ห้องเรียน",
    description: "โรงเรียนแห่งหนึ่ง",
    src: "/audio/ณ-ห้องเรียน-โรงเรียนแห่งหนึ่ง.mp3",
    icon: <Users className="h-5 w-5" />,
  },
  {
    id: 2,
    title: "กริ่ง",
    description: "เสียงกริ่งโรงเรียน",
    src: "/audio/กรึ่ง.mp3",
    icon: <Bell className="h-5 w-5" />,
  },
  {
    id: 3,
    title: "เก่งเป็นเด็กซื่อสัตย์",
    description: "เรื่องราวของเก่ง",
    src: "/audio/เก่งเป็นเด็กซื่อสัตย์.mp3",
    icon: <Mic className="h-5 w-5" />,
  },
  {
    id: 4,
    title: "เสียงโทรเข้า",
    description: "เสียงโทรศัพท์",
    src: "/audio/เสียงโทรเข้า.mp3",
    icon: <PhoneCall className="h-5 w-5" />,
  },
  {
    id: 5,
    title: "เสียงเลิกกันเถอะ",
    description: "รวมกับตัดสายเลย",
    src: "/audio/เสียงเลิกกันเถอะ-รวมกับตัดสาย.mp3",
    icon: <MessageCircle className="h-5 w-5" />,
  },
  {
    id: 6,
    title: "เก่งเดินไปหาเพื่อนๆ",
    description: "ที่กินข้าวอยู่",
    src: "/audio/เก่งเดินไปหาเพื่อนๆที่กินข้าวอยู่.mp3",
    icon: <Users className="h-5 w-5" />,
  },
  {
    id: 7,
    title: "โทรออก",
    description: "เสียงโทรศัพท์",
    src: "/audio/โทรออก.mp3",
    icon: <Phone className="h-5 w-5" />,
  },
  {
    id: 8,
    title: "เสียงกู (อัดไว้ล่าสุด)",
    description: "รวมกับตัดสาย",
    src: "/audio/เสียงพีรวมกับตัดสาย.mp3",
    icon: <Mic className="h-5 w-5" />,
  },
  {
    id: 9,
    title: "มาจอง",
    description: "เสียงการจอง",
    src: "/audio/มาจอง.mp3",
    icon: <Calendar className="h-5 w-5" />,
  },
  {
    id: 10,
    title: "หลายเดือนต่อมา",
    description: "เก่งติดบุหรี่มากขึ้น",
    src: "/audio/หลายเดือนต่อมา-เก่งติดบุหรี่มากขึ้น.mp3",
    icon: <MessageCircle className="h-5 w-5" />,
  },
]

export default function Soundboard() {
  const [playingStates, setPlayingStates] = useState<{ [key: number]: boolean }>({})
  const [volume, setVolume] = useState(75)
  const [isMuted, setIsMuted] = useState(false)
  const [loadingStates, setLoadingStates] = useState<{ [key: number]: boolean }>({})
  const [errorStates, setErrorStates] = useState<{ [key: number]: boolean }>({})

  const audioRefs = useRef<{ [key: number]: HTMLAudioElement }>({})

  // useEffect สำหรับจัดการ Audio elements ยังคงเหมือนเดิม
  useEffect(() => {
    soundClips.forEach((clip) => {
      if (!audioRefs.current[clip.id]) {
        const audio = new Audio(clip.src)
        audio.preload = "auto"

        audio.addEventListener("loadstart", () => {
          setLoadingStates((prev) => ({ ...prev, [clip.id]: true }))
          setErrorStates((prev) => ({ ...prev, [clip.id]: false }))
        })
        audio.addEventListener("canplaythrough", () => {
          setLoadingStates((prev) => ({ ...prev, [clip.id]: false }))
        })
        audio.addEventListener("error", () => {
          setLoadingStates((prev) => ({ ...prev, [clip.id]: false }))
          setErrorStates((prev) => ({ ...prev, [clip.id]: true }))
        })
        audio.addEventListener("ended", () => {
          setPlayingStates((prev) => ({ ...prev, [clip.id]: false }))
        })
        audio.addEventListener("play", () => {
          setPlayingStates((prev) => ({ ...prev, [clip.id]: true }))
        })
        audio.addEventListener("pause", () => {
          setPlayingStates((prev) => ({ ...prev, [clip.id]: false }))
        })

        audioRefs.current[clip.id] = audio
      }
    })

    return () => {
      Object.values(audioRefs.current).forEach((audio) => {
        audio.pause()
        audio.src = ""
      })
    }
  }, [])

  useEffect(() => {
    Object.values(audioRefs.current).forEach((audio) => {
      audio.volume = isMuted ? 0 : volume / 100
    })
  }, [volume, isMuted])

  const togglePlayPause = (clipId: number) => {
    const audio = audioRefs.current[clipId]
    if (!audio || errorStates[clipId]) return

    if (playingStates[clipId]) {
      audio.pause()
    } else {
      // หยุดเสียงอื่นทั้งหมดก่อนเล่นเสียงใหม่ (ถ้าต้องการ)
      // stopAllSounds(); 
      audio.currentTime = 0
      audio.play().catch(() => setErrorStates((prev) => ({ ...prev, [clipId]: true })))
    }
  }
  
  const stopAllSounds = () => {
    Object.values(audioRefs.current).forEach((audio) => {
      audio.pause()
      audio.currentTime = 0
    })
    setPlayingStates({})
  }

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0])
    setIsMuted(value[0] === 0)
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const renderPlayButtonIcon = (clipId: number) => {
    if (loadingStates[clipId]) {
      return <Loader2 className="h-5 w-5 animate-spin" />
    }
    if (errorStates[clipId]) {
      return <AlertCircle className="h-5 w-5 text-destructive" />
    }
    if (playingStates[clipId]) {
      return <Pause className="h-5 w-5" />
    }
    return <Play className="h-5 w-5" />
  }

  return (
    // ใช้ bg-background จาก theme และเพิ่ม padding ให้ดูโปร่งขึ้น
    <div className="container mx-auto p-4 sm:p-6 md:p-8">
      {/* Header ที่เรียบง่ายขึ้น */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">ISA X NDC Soundboard</h1>
        <p className="mt-2 text-muted-foreground">
          โคตรขี้เกียจทำ แต่เสียงดีนะ บอกเลยอิอิ
        </p>
      </div>

      {/* Master Controls */}
      <Card className="mb-6">
        <CardHeader className="flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-base font-medium">Master Controls</CardTitle>
          <Button onClick={stopAllSounds} variant="destructive" size="sm">
            <StopCircle className="mr-2 h-4 w-4" />
            Stop All
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" onClick={toggleMute}>
              {isMuted || volume === 0 ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
            </Button>
            <Slider
              value={[isMuted ? 0 : volume]}
              onValueChange={handleVolumeChange}
              max={100}
            />
            <span className="w-12 text-sm text-muted-foreground">{isMuted ? "Muted" : `${volume}%`}</span>
          </div>
        </CardContent>
      </Card>

      {/* Soundboard Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {soundClips.map((clip) => (
          <Card
            key={clip.id}
            className={cn(
                "flex flex-col justify-between transition-all",
                playingStates[clip.id] && "border-primary"
            )}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                {/* ไอคอนดีไซน์ใหม่ */}
                <div className="bg-secondary text-secondary-foreground p-3 rounded-lg">
                  {clip.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm">{clip.title}</h3>
                  <p className="text-xs text-muted-foreground">{clip.description}</p>
                </div>
                <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => togglePlayPause(clip.id)}
                    disabled={loadingStates[clip.id] || errorStates[clip.id]}
                >
                  {renderPlayButtonIcon(clip.id)}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}