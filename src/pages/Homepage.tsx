'use client'

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Zap, Trophy, Calendar, Sun, Moon, Droplet } from "lucide-react"
import { Button } from "../components/ui/button"
import { Progress } from "../components/ui/progress"
import { Input } from "../components/ui/input"
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardDescription,
  CardTitle,
} from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { useToast } from "../components/ui/use-toast"
import { Tabs, TabsList, TabsTrigger } from "../components/ui/tabs"

type Habit = {
  name: string
  goal: string
  unit: string
  entries: { [date: string]: string }
  streak: number
  chunks?: number
}

const initialHabits: Habit[] = [
  { name: "Study Time", goal: "6", unit: "hours", entries: {}, streak: 0 },
  { name: "Business Activities", goal: "1", unit: "activity", entries: {}, streak: 0 },
  { name: "1 Mile Run", goal: "5:00", unit: "min", entries: {}, streak: 0 },
  { name: "Pushups", goal: "30", unit: "reps", entries: {}, streak: 0 },
  { name: "Memorize Quran Ayas", goal: "1", unit: "ayah", entries: {}, streak: 0 },
  { name: "Daily Prayers", goal: "5", unit: "prayers", entries: {}, streak: 0 },
  { name: "Reading Books", goal: "20", unit: "pages", entries: {}, streak: 0 },
  { name: "Post Reels", goal: "1", unit: "reel", entries: {}, streak: 0 },
  { name: "LinkedIn Posts", goal: "1", unit: "post", entries: {}, streak: 0 },
  { name: "App Development", goal: "1", unit: "task", entries: {}, streak: 0 },
  { name: "Team Meeting", goal: "1", unit: "meeting", entries: {}, streak: 0 },
  { name: "Water Intake", goal: "5", unit: "liters", entries: {}, streak: 0, chunks: 5 },
  { name: "Podcast Creation", goal: "1", unit: "podcast", entries: {}, streak: 0 },
  { name: "Call Grandparents", goal: "1", unit: "call", entries: {}, streak: 0 },
  { name: "Sleep Schedule", goal: "22:00", unit: "PM", entries: {}, streak: 0 },
  { name: "Protein Intake", goal: "180", unit: "grams", entries: {}, streak: 0 },
]

const motivationalQuotes = [
  "Education is the most powerful weapon which you can use to change the world. - Nelson Mandela",
  "The best way to predict your future is to create it. - Abraham Lincoln",
  "Hard work beats talent when talent doesn't work hard. - Tim Notke",
  "Dream big and dare to fail. - Norman Vaughan",
  "The future belongs to those who believe in the beauty of their dreams. - Eleanor Roosevelt",
  "Success is the sum of small efforts, repeated day in and day out. - Robert Collier",
  "Perseverance is not a long race; it's many short races one after the other. - Walter Elliot",
]

export default function MITMissionTracker() {
  const [habits, setHabits] = useState<Habit[]>(() => {
    const savedHabits = localStorage.getItem("mitHabits")
    return savedHabits ? JSON.parse(savedHabits) : initialHabits
  })
  const [currentDate, setCurrentDate] = useState(new Date())
  const [level, setLevel] = useState(() => {
    const savedLevel = localStorage.getItem("mitLevel")
    return savedLevel ? parseInt(savedLevel) : 1
  })
  const [quote, setQuote] = useState("")
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('day')
  const { toast } = useToast()

  useEffect(() => {
    localStorage.setItem("mitHabits", JSON.stringify(habits))
    localStorage.setItem("mitLevel", level.toString())
  }, [habits, level])

  useEffect(() => {
    setQuote(motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)])
  }, [currentDate])

  const formatDate = (date: Date) => {
    return date.toISOString().split("T")[0]
  }

  const getDates = () => {
    const dates = []
    let startDate = new Date(currentDate)
    let endDate = new Date(currentDate)

    if (viewMode === 'day') {
      dates.push(formatDate(startDate))
    } else if (viewMode === 'week') {
      const dayOfWeek = startDate.getDay()
      startDate.setDate(startDate.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1))
      endDate = new Date(startDate)
      endDate.setDate(startDate.getDate() + 6)
    } else if (viewMode === 'month') {
      startDate = new Date(startDate.getFullYear(), startDate.getMonth(), 1)
      endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0)
    }

    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      dates.push(formatDate(new Date(d)))
    }

    return dates
  }

  const dates = getDates()

  const updateHabitProgress = (habitIndex: number, date: string, value: string) => {
    const updatedHabits = [...habits]
    const habit = updatedHabits[habitIndex]
    const prevValue = habit.entries[date]
    habit.entries[date] = value

    if (isHabitCompleted(habit, date) && !isHabitCompleted(habit, date, prevValue)) {
      habit.streak++
      if (habit.streak % 7 === 0) {
        toast({
          title: "Achievement Unlocked!",
          description: `You've maintained a 7-day streak for ${habit.name}!`,
          duration: 5000,
        })
      }
    } else if (!isHabitCompleted(habit, date) && isHabitCompleted(habit, date, prevValue)) {
      habit.streak = 0
    }

    setHabits(updatedHabits)
    updateLevel()
  }

  const isHabitCompleted = (habit: Habit, date: string, value?: string) => {
    const entry = value || habit.entries[date]
    if (!entry) return false
    if (habit.unit === "min" || habit.unit === "AM" || habit.unit === "PM") {
      const [entryHours, entryMinutes] = entry.split(":").map(Number)
      const [goalHours, goalMinutes] = habit.goal.split(":").map(Number)
      return entryHours < goalHours || (entryHours === goalHours && entryMinutes <= goalMinutes)
    }
    return parseFloat(entry) >= parseFloat(habit.goal)
  }

  const calculateProgress = (habit: Habit) => {
    const completedDays = dates.filter((date) => isHabitCompleted(habit, date)).length
    return (completedDays / dates.length) * 100
  }

  const calculateOverallProgress = () => {
    const totalProgress = habits.reduce((sum, habit) => sum + calculateProgress(habit), 0)
    return totalProgress / habits.length
  }

  const updateLevel = () => {
    const newLevel = Math.floor(calculateOverallProgress() / 10) + 1
    if (newLevel > level) {
      setLevel(newLevel)
      toast({
        title: "Level Up!",
        description: `You've reached Level ${newLevel} on your MIT Mission!`,
        duration: 5000,
      })
    }
  }

  const navigate = (direction: number) => {
    const newDate = new Date(currentDate)
    if (viewMode === 'day') {
      newDate.setDate(newDate.getDate() + direction)
    } else if (viewMode === 'week') {
      newDate.setDate(newDate.getDate() + 7 * direction)
    } else if (viewMode === 'month') {
      newDate.setMonth(newDate.getMonth() + direction)
    }
    setCurrentDate(newDate)
  }

  const getChunkIcons = (habit: Habit, date: string) => {
    const chunks = habit.chunks || 1
    const entryValue = parseFloat(habit.entries[date] || "0")
    const goalValue = parseFloat(habit.goal)
    const chunkValue = goalValue / chunks
    const filledChunks = Math.floor(entryValue / chunkValue)
    const icons = []
    for (let i = 0; i < chunks; i++) {
      icons.push(
        <Droplet
          key={i}
          className={`w-6 h-6 ${i < filledChunks ? 'text-blue-500' : 'text-gray-500'}`}
        />
      )
    }
    return icons
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-red-900 text-white p-4">
      <Card className="w-full max-w-4xl mx-auto bg-gray-800 border-gray-700">
        <div className="p-4">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-red-500 text-center">
              MIT Mission Tracker
            </CardTitle>
            <CardDescription className="text-gray-300 text-center">
              Your journey towards MIT begins here
            </CardDescription>
          </CardHeader>
        </div>
        <div className="p-4">
          <CardContent>
            <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
              <Button variant="outline" onClick={() => navigate(-1)} className="mb-2 sm:mb-0">
                <ChevronLeft className="mr-2" /> Previous {viewMode}
              </Button>
              <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as 'day' | 'week' | 'month')}>
                <TabsList>
                  <TabsTrigger value="day"><Sun className="w-4 h-4 mr-1" />Day</TabsTrigger>
                  <TabsTrigger value="week"><Calendar className="w-4 h-4 mr-1" />Week</TabsTrigger>
                  <TabsTrigger value="month"><Moon className="w-4 h-4 mr-1" />Month</TabsTrigger>
                </TabsList>
              </Tabs>
              <Button variant="outline" onClick={() => navigate(1)} className="mt-2 sm:mt-0">
                Next {viewMode} <ChevronRight className="ml-2" />
              </Button>
            </div>
            <h2 className="text-xl font-semibold text-red-400 mb-2 text-center">
              {viewMode === 'day' && currentDate.toLocaleDateString()}
              {viewMode === 'week' && `Week of ${dates[0]}`}
              {viewMode === 'month' && currentDate.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
            </h2>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {habits.map((habit, index) => (
                <div key={habit.name} className="mb-4 p-4 bg-gray-700 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-red-300">{habit.name}</h3>
                    <Badge variant="secondary" className="bg-red-600 text-white">
                      <Zap className="w-4 h-4 mr-1" />
                      {habit.streak} days
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <p>Goal: {habit.goal} {habit.unit}</p>
                    {viewMode === 'day' && (
                      <Input
                        type={habit.unit === "min" || habit.unit === "AM" || habit.unit === "PM" ? "time" : "number"}
                        value={habit.entries[dates[0]] || ""}
                        onChange={(e) => updateHabitProgress(index, dates[0], e.target.value)}
                        className="w-24 bg-gray-600 border-gray-500 text-white"
                      />
                    )}
                  </div>
                  {habit.chunks ? (
                    <div className="flex items-center">
                      {getChunkIcons(habit, dates[0])}
                    </div>
                  ) : (
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${calculateProgress(habit)}%` }}
                      transition={{ duration: 0.5 }}
                    >
                      <Progress value={calculateProgress(habit)} className="w-full h-2" />
                    </motion.div>
                  )}
                </div>
              ))}
            </motion.div>
          </CardContent>
        </div>
        <div className="flex flex-col items-center p-4">
          <CardFooter>
            <div className="w-full mb-4">
              <h3 className="text-lg font-semibold mb-2 text-red-500 text-center">Overall Progress</h3>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${calculateOverallProgress()}%` }}
                transition={{ duration: 0.5 }}
              >
                <Progress value={calculateOverallProgress()} className="w-full h-4" />
              </motion.div>
            </div>
            <div className="flex items-center justify-between w-full">
              <Badge variant="outline" className="text-lg p-2 bg-gray-800 border-red-500 text-red-500">
                <Trophy className="w-6 h-6 mr-2 text-yellow-400" />
                Level {level}
              </Badge>
              <AnimatePresence>
                <motion.p
                  key={quote}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0  }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="text-sm italic text-gray-300 max-w-md text-center"
                >
                  "{quote}"
                </motion.p>
              </AnimatePresence>
            </div>
          </CardFooter>
        </div>
      </Card>
    </div>
  )
}
