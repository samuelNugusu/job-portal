import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Search, Send, MoreVertical, Phone, Video, Paperclip, Smile, Star } from "lucide-react"
import { toast } from "sonner"

interface Message {
  id: string
  senderId: string
  content: string
  timestamp: string
  read: boolean
}

interface Participant {
  id: string
  name: string
  title: string
  company: string
  avatar: string
  online: boolean
}

interface Conversation {
  id: string
  participant: Participant
  lastMessage: Message
  unreadCount: number
  messages: Message[]
  starred: boolean
}

// Mock conversations
const mockConversations: Conversation[] = [
  {
    id: "1",
    participant: {
      id: "hr1",
      name: "Sarah Johnson",
      title: "HR Manager",
      company: "Google",
      avatar: "/female-avatar.jpg",
      online: true,
    },
    lastMessage: {
      id: "msg1",
      senderId: "hr1",
      content: "Hi! Are you available for an interview tomorrow?",
      timestamp: new Date().toISOString(),
      read: false,
    },
    unreadCount: 1,
    messages: [],
    starred: true,
  },
  {
    id: "2",
    participant: {
      id: "hr2",
      name: "Michael Chen",
      title: "Technical Recruiter",
      company: "Microsoft",
      avatar: "/male-avatar.jpg",
      online: true,
    },
    lastMessage: {
      id: "msg2",
      senderId: "hr2",
      content: "Please review the attached document.",
      timestamp: new Date().toISOString(),
      read: true,
    },
    unreadCount: 0,
    messages: [],
    starred: false,
  },
  {
    id: "3",
    participant: {
      id: "hr3",
      name: "Emily Rodriguez",
      title: "Talent Acquisition",
      company: "Apple",
      avatar: "/female-avatar-2.jpg",
      online: true,
    },
    lastMessage: {
      id: "msg3",
      senderId: "hr3",
      content: "Can we reschedule the interview?",
      timestamp: new Date().toISOString(),
      read: false,
    },
    unreadCount: 1,
    messages: [],
    starred: false,
  },
  {
    id: "4",
    participant: {
      id: "hr4",
      name: "David Lee",
      title: "Recruiter",
      company: "Amazon",
      avatar: "/male-avatar-2.jpg",
      online: false,
    },
    lastMessage: {
      id: "msg4",
      senderId: "hr4",
      content: "Please review the job description.",
      timestamp: new Date().toISOString(),
      read: false,
    },
    unreadCount: 0,
    messages: [],
    starred: false,
  },
]

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations)
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(mockConversations[0])
  const [searchTerm, setSearchTerm] = useState("")
  const [newMessage, setNewMessage] = useState("")
  const [typing, setTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  // Scroll to bottom on new message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [selectedConversation?.messages, typing])

  // Simulate receiving reply in real-time with typing indicator
  const simulateReply = (conversationId: string) => {
    const replies = [
      "Thanks for your message!",
      "We will get back to you shortly.",
      "Can you provide more details?",
      "Looking forward to it!",
      "Got it, thanks!",
    ]
    const randomReply = replies[Math.floor(Math.random() * replies.length)]

    setTyping(true)
    setTimeout(() => {
      setTyping(false)
      const newMessageObj: Message = {
        id: Date.now().toString(),
        senderId: conversationId,
        content: randomReply,
        timestamp: new Date().toISOString(),
        read: false,
      }

      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === conversationId
            ? {
                ...conv,
                messages: [...conv.messages, newMessageObj],
                lastMessage: newMessageObj,
                unreadCount: conv.unreadCount + 1,
              }
            : conv
        )
      )

      if (selectedConversation?.id === conversationId) {
        toast.info(`${selectedConversation.participant.name} replied!`)
      }
    }, 1500 + Math.random() * 2000)
  }

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return
    const message: Message = {
      id: Date.now().toString(),
      senderId: "user",
      content: newMessage,
      timestamp: new Date().toISOString(),
      read: true,
    }
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === selectedConversation.id
          ? {
              ...conv,
              messages: [...conv.messages, message],
              lastMessage: message,
            }
          : conv
      )
    )
    setNewMessage("")
    toast.success("Message sent!")
    simulateReply(selectedConversation.id)
  }

  const replySuggestions = ["Sounds good!", "Thank you!", "Can you clarify?", "Looking forward!"]

  const filteredConversations = conversations.filter(
    (conv) =>
      conv.participant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conv.participant.company.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSelectConversation = (conv: Conversation) => {
    setSelectedConversation(conv)
    // mark as read
    setConversations((prev) =>
      prev.map((c) =>
        c.id === conv.id
          ? {
              ...c,
              unreadCount: 0,
              messages: c.messages.map((m) => ({ ...m, read: true })),
            }
          : c
      )
    )
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">Messages</h1>
      <p className="text-gray-600 mb-6">Connect with recruiters and hiring managers</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
        {/* Conversations List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <div className="flex items-center justify-between mb-2">
              <CardTitle>Conversations</CardTitle>
              <Badge variant="secondary">{conversations.length}</Badge>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardHeader>
          <CardContent className="overflow-y-auto max-h-[70vh] p-0">
            {filteredConversations.map((conv) => (
              <div
                key={conv.id}
                className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors border-l-4 ${
                  selectedConversation?.id === conv.id ? "bg-blue-50 border-l-blue-500" : "border-l-transparent"
                }`}
                onClick={() => handleSelectConversation(conv)}
              >
                <div className="flex items-start space-x-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={conv.participant.avatar} />
                    <AvatarFallback>{conv.participant.name.split(" ").map((n) => n[0]).join("")}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <h4 className="text-sm font-medium truncate">{conv.participant.name}</h4>
                      <span className="text-xs text-gray-500">{formatTime(conv.lastMessage.timestamp)}</span>
                    </div>
                    <p className="text-xs text-gray-600 truncate">
                      {conv.participant.title} at {conv.participant.company}
                    </p>
                    <p className="text-sm text-gray-600 truncate">{conv.lastMessage.content}</p>
                    {conv.unreadCount > 0 && <Badge variant="destructive">{conv.unreadCount}</Badge>}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Chat Area */}
        <Card className="lg:col-span-2 flex flex-col">
          {selectedConversation ? (
            <>
              {/* Header */}
              <CardHeader className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={selectedConversation.participant.avatar} />
                    <AvatarFallback>{selectedConversation.participant.name.split(" ").map((n) => n[0]).join("")}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{selectedConversation.participant.name}</h3>
                    <p className="text-sm text-gray-600">
                      {selectedConversation.participant.title} at {selectedConversation.participant.company}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm">
                    <Phone className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Video className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>

              <Separator />

              {/* Messages */}
              <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                {selectedConversation.messages.length === 0 && !typing && (
                  <p className="text-gray-500 text-center">No messages yet</p>
                )}

                {selectedConversation.messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.senderId === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${msg.senderId === "user" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"}`}>
                      <p className="text-sm">{msg.content}</p>
                      <p className={`text-xs mt-1 ${msg.senderId === "user" ? "text-blue-100" : "text-gray-500"}`}>
                        {formatTime(msg.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}

                {/* Typing indicator */}
                {typing && (
                  <div className="flex items-center space-x-2">
                    <Avatar className="w-6 h-6">
                      <AvatarImage src={selectedConversation.participant.avatar} />
                      <AvatarFallback>{selectedConversation.participant.name[0]}</AvatarFallback>
                    </Avatar>
                    <span className="text-gray-500 italic text-sm">Typing...</span>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </CardContent>

              {/* Reply Suggestions */}
              {replySuggestions.length > 0 && !typing && (
                <div className="flex space-x-2 p-2">
                  {replySuggestions.map((suggestion) => (
                    <Button
                      key={suggestion}
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setNewMessage(suggestion)
                        handleSendMessage()
                      }}
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              )}

              <Separator />

              {/* Input */}
              <div className="p-4 flex items-center space-x-2">
                <Button variant="ghost" size="sm">
                  <Paperclip className="w-4 h-4" />
                </Button>
                <div className="flex-1 relative">
                  <Input
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    className="pr-10"
                  />
                  <Button variant="ghost" size="sm" className="absolute right-1 top-1/2 transform -translate-y-1/2">
                    <Smile className="w-4 h-4" />
                  </Button>
                </div>
                <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </>
          ) : (
            <CardContent className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
                <p className="text-gray-500">Choose a conversation to start messaging</p>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  )
}
