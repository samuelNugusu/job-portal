import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Bell,
  BellOff,
  Check,
  CheckCheck,
  Trash2,
  Settings,
  Briefcase,
  Calendar,
  MessageSquare,
  Star,
  TrendingUp,
  Users,
} from "lucide-react"
import { toast } from "sonner"

interface Notification {
  id: string
  type: "job_match" | "interview" | "message" | "application_update" | "profile_view" | "connection"
  title: string
  description: string
  timestamp: string
  read: boolean
  favorite?: boolean
  avatar?: string
  priority: "low" | "medium" | "high"
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "interview",
    title: "Interview Reminder",
    description: "You have an interview with Google tomorrow at 2:00 PM for UI/UX Designer position",
    timestamp: "2025-01-22T10:00:00Z",
    read: false,
    favorite: false,
    priority: "high",
    avatar: "/google-logo.png",
  },
  {
    id: "2",
    type: "message",
    title: "New Message from Sarah Johnson",
    description: "Hi Albert! We'd love to schedule an interview with you...",
    timestamp: "2025-01-22T09:30:00Z",
    read: false,
    favorite: false,
    priority: "medium",
    avatar: "/female-avatar.jpg",
  },
  {
    id: "3",
    type: "job_match",
    title: "New Job Match",
    description: "Frontend Developer at Microsoft - 95% match with your profile",
    timestamp: "2025-01-22T08:15:00Z",
    read: false,
    favorite: false,
    priority: "medium",
  },
  {
    id: "4",
    type: "application_update",
    title: "Application Status Update",
    description: "Your application for Product Designer at Apple has been reviewed",
    timestamp: "2025-01-21T16:45:00Z",
    read: true,
    favorite: false,
    priority: "medium",
  },
  {
    id: "5",
    type: "profile_view",
    title: "Profile Views",
    description: "5 recruiters viewed your profile in the last 24 hours",
    timestamp: "2025-01-21T14:20:00Z",
    read: true,
    favorite: false,
    priority: "low",
  },
  {
    id: "6",
    type: "connection",
    title: "New Connection Request",
    description: "Michael Chen wants to connect with you",
    timestamp: "2025-01-21T12:10:00Z",
    read: true,
    favorite: false,
    priority: "low",
    avatar: "/male-avatar.jpg",
  },
]

const getNotificationIcon = (type: string) => {
  switch (type) {
    case "job_match":
      return <Briefcase className="w-5 h-5 text-blue-500" />
    case "interview":
      return <Calendar className="w-5 h-5 text-green-500" />
    case "message":
      return <MessageSquare className="w-5 h-5 text-purple-500" />
    case "application_update":
      return <TrendingUp className="w-5 h-5 text-orange-500" />
    case "profile_view":
      return <Star className="w-5 h-5 text-yellow-500" />
    case "connection":
      return <Users className="w-5 h-5 text-indigo-500" />
    default:
      return <Bell className="w-5 h-5 text-gray-500" />
  }
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "high":
      return "bg-red-200 text-red-800 animate-pulse"
    case "medium":
      return "bg-yellow-200 text-yellow-800"
    case "low":
      return "bg-gray-200 text-gray-800"
    default:
      return "bg-gray-200 text-gray-800"
  }
}

const formatTime = (timestamp: string) => {
  const date = new Date(timestamp)
  const now = new Date()
  const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)
  if (diffInHours < 1) return "Just now"
  if (diffInHours < 24) return `${Math.floor(diffInHours)}h ago`
  return date.toLocaleDateString()
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [activeTab, setActiveTab] = useState("all")

  const unreadCount = notifications.filter((n) => !n.read).length

  const filteredNotifications = notifications.filter((notification) => {
    if (activeTab === "all") return true
    if (activeTab === "unread") return !notification.read
    return notification.type === activeTab
  })

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    )
    toast.success("Marked as read")
  }

  const handleToggleFavorite = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, favorite: !n.favorite } : n)),
    )
    toast.success("Toggled favorite")
  }

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    toast.success("All notifications marked as read")
  }

  const handleDelete = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
    toast.success("Notification deleted")
  }

  const handleClearAll = () => {
    setNotifications([])
    toast.success("All notifications cleared")
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-indigo-700 mb-1">Notifications</h1>
          <p className="text-gray-600">Stay updated with your job search activities</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {unreadCount > 0 && (
            <Button variant="outline" onClick={handleMarkAllAsRead} className="hover:scale-105 transition-transform">
              <CheckCheck className="w-4 h-4 mr-1" />
              Mark All Read
            </Button>
          )}
          <Button variant="outline" onClick={handleClearAll} className="hover:scale-105 transition-transform">
            <Trash2 className="w-4 h-4 mr-1" />
            Clear All
          </Button>
          <Button variant="outline" className="hover:scale-105 transition-transform">
            <Settings className="w-4 h-4 mr-1" />
            Settings
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="hover:shadow-xl transition-shadow bg-gradient-to-r from-indigo-100 to-indigo-50">
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-indigo-700">{notifications.length}</div>
            <p className="text-gray-600">Total Notifications</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-xl transition-shadow bg-gradient-to-r from-red-100 to-red-50">
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-red-700">{unreadCount}</div>
            <p className="text-gray-600">Unread</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-xl transition-shadow bg-gradient-to-r from-green-100 to-green-50">
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-green-700">
              {notifications.filter((n) => n.type === "interview").length}
            </div>
            <p className="text-gray-600">Interviews</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-xl transition-shadow bg-gradient-to-r from-purple-100 to-purple-50">
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-purple-700">
              {notifications.filter((n) => n.type === "job_match").length}
            </div>
            <p className="text-gray-600">Job Matches</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-7 border-b border-gray-200 mb-4">
          <TabsTrigger value="all" className="hover:text-indigo-600 transition-colors">All</TabsTrigger>
          <TabsTrigger value="unread" className="hover:text-indigo-600 transition-colors">
            Unread
            {unreadCount > 0 && <Badge className="ml-1 text-xs bg-red-100 text-red-700">{unreadCount}</Badge>}
          </TabsTrigger>
          <TabsTrigger value="job_match" className="hover:text-indigo-600 transition-colors">Jobs</TabsTrigger>
          <TabsTrigger value="interview" className="hover:text-indigo-600 transition-colors">Interviews</TabsTrigger>
          <TabsTrigger value="message" className="hover:text-indigo-600 transition-colors">Messages</TabsTrigger>
          <TabsTrigger value="application_update" className="hover:text-indigo-600 transition-colors">Applications</TabsTrigger>
          <TabsTrigger value="profile_view" className="hover:text-indigo-600 transition-colors">Profile</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab}>
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                <BellOff className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
              <p className="text-gray-500">
                {activeTab === "unread"
                  ? "You're all caught up! No unread notifications."
                  : "No notifications in this category."}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredNotifications.map((n) => (
                <Card
                  key={n.id}
                  className={`p-4 hover:shadow-lg transition-shadow relative rounded-lg ${
                    !n.read ? "bg-gradient-to-r from-blue-50 to-white border-l-4 border-blue-500" : "bg-white"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="relative">
                      <Avatar className="w-12 h-12 ring-2 ring-indigo-400">
                        {n.avatar && <AvatarImage src={n.avatar} />}
                        <AvatarFallback>{getNotificationIcon(n.type)}</AvatarFallback>
                      </Avatar>
                      {!n.read && <span className="absolute top-0 right-0 w-3 h-3 rounded-full bg-blue-500 animate-pulse"></span>}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                            {n.title}
                            {n.favorite && <Star className="w-4 h-4 text-yellow-400 animate-pulse" />}
                          </h4>
                          <p className="text-gray-600 text-sm mt-1">{n.description}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-xs text-gray-500">{formatTime(n.timestamp)}</span>
                            <Badge className={`text-xs ${getPriorityColor(n.priority)}`}>{n.priority}</Badge>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 ml-2">
                          <Button size="sm" variant="ghost" onClick={() => handleMarkAsRead(n.id)} className="hover:scale-110 transition-transform">
                            <Check className="w-4 h-4 text-green-600" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => handleToggleFavorite(n.id)} className="hover:scale-110 transition-transform">
                            <Star className={`w-4 h-4 ${n.favorite ? "text-yellow-400" : "text-gray-300"}`} />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => handleDelete(n.id)} className="hover:scale-110 transition-transform text-red-600">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
