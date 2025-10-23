import { useMemo, useState } from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Video,
  MapPin,
  Clock,
  X,
} from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/data/utils"

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const months = [
  "January","February","March","April","May","June","July",
  "August","September","October","November","December",
]

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [events, setEvents] = useState(() => [
    {
      id: 1,
      title: "Addis Ababa Tech Summit",
      company: "EthioTech",
      companyLogo: "/placeholder.svg",
      date: new Date(),
      time: "10:00 AM",
      type: "onsite",
      status: "confirmed",
    },
    {
      id: 2,
      title: "Zoom Interview with Gebeya",
      company: "Gebeya Talent",
      companyLogo: "/placeholder.svg",
      date: new Date(new Date().setDate(new Date().getDate() + 2)),
      time: "2:00 PM",
      type: "video",
      status: "pending",
    },
  ])
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [newEvent, setNewEvent] = useState({
    title: "",
    company: "",
    time: "",
    type: "onsite",
  })

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      if (direction === "prev") newDate.setMonth(prev.getMonth() - 1)
      else newDate.setMonth(prev.getMonth() + 1)
      return newDate
    })
  }

  const getDaysInMonth = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()

  const getFirstDayOfMonth = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth(), 1).getDay()

  const addEvent = () => {
    if (!newEvent.title || !newEvent.company || !newEvent.time) return
    const newItem = {
      id: events.length + 1,
      title: newEvent.title,
      company: newEvent.company,
      companyLogo: "/placeholder.svg",
      date: selectedDate,
      time: newEvent.time,
      type: newEvent.type,
      status: "pending",
    }
    setEvents([...events, newItem])
    setNewEvent({ title: "", company: "", time: "", type: "onsite" })
    setShowAddDialog(false)
  }

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate)
    const firstDay = getFirstDayOfMonth(currentDate)
    const days = []

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 border" />)
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
      const isToday = date.toDateString() === new Date().toDateString()
      const isSelected = date.toDateString() === selectedDate.toDateString()
      const hasEvent = events.some(
        (e) => new Date(e.date).toDateString() === date.toDateString()
      )

      days.push(
        <div
          key={day}
          onClick={() => setSelectedDate(date)}
          className={cn(
            "h-24 p-2 border text-sm cursor-pointer hover:bg-blue-50 transition-all",
            isToday && "bg-blue-100 font-bold border-blue-200",
            isSelected && "bg-blue-200 border-blue-300",
          )}
        >
          <div>{day}</div>
          {hasEvent && <div className="mt-1 w-2 h-2 bg-blue-600 rounded-full" />}
        </div>
      )
    }
    return days
  }

  const getEventsForDate = (date: Date) =>
    events.filter((e) => new Date(e.date).toDateString() === date.toDateString())

  const upcoming = events
    .filter((e) => new Date(e.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">📅 My Calendar</h1>
        <p className="text-gray-600">Manage interviews & Ethiopian tech events</p>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>
                  {months[currentDate.getMonth()]} {currentDate.getFullYear()}
                </CardTitle>
                <div className="flex space-x-2">
                  <Button variant="outline" onClick={() => navigateMonth("prev")}>
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" onClick={() => setCurrentDate(new Date())}>
                    Today
                  </Button>
                  <Button variant="outline" onClick={() => navigateMonth("next")}>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 text-center text-sm font-medium text-gray-500 border-b">
                {daysOfWeek.map((d) => <div key={d} className="p-2">{d}</div>)}
              </div>
              <div className="grid grid-cols-7">{renderCalendarDays()}</div>
            </CardContent>
          </Card>

          {getEventsForDate(selectedDate).length > 0 && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>
                  Events for {selectedDate.toLocaleDateString()}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {getEventsForDate(selectedDate).map((e) => (
                  <div key={e.id} className="p-3 border rounded-lg flex items-center space-x-3 hover:bg-gray-50">
                    <Avatar>
                      <AvatarImage src={e.companyLogo} />
                      <AvatarFallback>{e.company[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h4 className="font-medium">{e.title}</h4>
                      <p className="text-sm text-gray-500">{e.company}</p>
                      <div className="flex text-xs text-gray-500 mt-1 space-x-2">
                        <Clock className="w-3 h-3" /> {e.time}
                      </div>
                    </div>
                    <Badge variant={e.status === "confirmed" ? "default" : "secondary"}>
                      {e.status}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader className="flex justify-between items-center">
              <CardTitle>Upcoming</CardTitle>
              <Button size="sm" onClick={() => setShowAddDialog(true)}>
                <Plus className="w-4 h-4 mr-2" /> Add Event
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcoming.map((e) => (
                <div key={e.id} className="p-3 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-start space-x-3">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={e.companyLogo} />
                      <AvatarFallback>{e.company[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold">{e.title}</h4>
                      <p className="text-xs text-gray-500">{e.company}</p>
                      <div className="flex items-center text-xs text-gray-500 mt-1">
                        <Clock className="w-3 h-3 mr-1" />
                        {new Date(e.date).toLocaleDateString()} at {e.time}
                      </div>
                    </div>
                    <Badge variant="outline">{e.type}</Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Add Event Modal */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Event</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>Title</Label>
              <Input
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              />
            </div>
            <div>
              <Label>Company / Organizer</Label>
              <Input
                value={newEvent.company}
                onChange={(e) => setNewEvent({ ...newEvent, company: e.target.value })}
              />
            </div>
            <div>
              <Label>Time</Label>
              <Input
                type="time"
                value={newEvent.time}
                onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
              />
            </div>
            <div>
              <Label>Type</Label>
              <select
                className="border rounded-md w-full p-2"
                value={newEvent.type}
                onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })}
              >
                <option value="onsite">On-site</option>
                <option value="video">Video Call</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={addEvent}>Save Event</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
