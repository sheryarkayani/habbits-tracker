import { useState, useEffect } from "react"
import { fetchHabits, addHabit, updateHabit } from './habitService'


export default function MITMissionTracker() {
  const [habits, setHabits] = useState<Habit[]>([])
  const [currentDate, setCurrentDate] = useState(new Date())
  const [level, setLevel] = useState(1)
  const [quote, setQuote] = useState("")
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('day')
  const { toast } = useToast()

  // Fetch habits from Supabase when the component mounts
  useEffect(() => {
    const loadHabits = async () => {
      const data = await fetchHabits()
      setHabits(data)
    }

    loadHabits()
  }, [])

  const updateHabitProgress = async (habitIndex: number, date: string, value: string) => {
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

    setHabits(updatedHabits) // Update local state immediately
  }

  const saveHabits = async () => {
    for (const habit of habits) {
      await updateHabit(habit) // Save each habit to Supabase
    }
    toast({
      title: "Habits Saved!",
      description: "All habit changes have been saved successfully.",
      duration: 3000,
    })
  }

  const addNewHabit = async (newHabit: Habit) => {
    const data = await addHabit(newHabit)
    if (data) {
      setHabits([...habits, ...data]) // Update state with the new habit
    }
  }

  return (
    <div>
      {/* Render your habits here */}
      {/* Example of rendering habits */}
      {habits.map((habit, index) => (
        <div key={habit.id}>
          <h3>{habit.name}</h3>
          {/* Input fields for habit entries can go here */}
          {/* Example: <input type="text" onChange={(e) => updateHabitProgress(index, currentDate.toISOString().split('T')[0], e.target.value)} /> */}
        </div>
      ))}
      
      {/* Save Habits Button */}
      <button onClick={saveHabits}>Save Habits</button>
      {/* ... existing render code ... */}
    </div>
  )
}
