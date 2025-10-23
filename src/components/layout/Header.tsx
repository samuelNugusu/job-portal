import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import {
  Search,
  Bell,
  MessageSquare,
  FileText,
  Calendar,
  Building2,
  Briefcase,
  User,
  Menu,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { useAppSelector } from "@/store/hooks"
import { User as UserType } from "@/types"

const navigation = [
  { name: "Find Jobs", href: "/", icon: Briefcase },
  { name: "Top Companies", href: "/companies", icon: Building2 },
  { name: "Job Tracker", href: "/tracker", icon: FileText },
  { name: "My Calendar", href: "/calendar", icon: Calendar },
  { name: "Documents", href: "/documents", icon: FileText },
  { name: "Messages", href: "/messages", icon: MessageSquare },
  { name: "Notifications", href: "/notifications", icon: Bell },
  { name: "Resume", href: "/resume-builder", icon: FileText },
]

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()
  const user: UserType | null = useAppSelector((state) => state.user?.user || null)

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-[#f8fbff] via-[#eef4ff] to-[#f8fbff] border-b border-blue-100 backdrop-blur-md shadow-sm">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 transition-all duration-200">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-9 h-9 mr-1 sm:mr-4 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 shadow-inner">
              <img src="/Logo.png" alt="JobHub Logo" className="w-full h-auto rounded-md" />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden space-x-1 xl:flex">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.href
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-blue-600 text-white shadow-md scale-[1.03]"
                      : "text-gray-700 hover:text-blue-600 hover:bg-blue-50 hover:scale-[1.02]"
                  }`}
                >
                  <Icon className="w-4 h-4 opacity-80" />
                  <span className="whitespace-nowrap">{item.name}</span>
                  {item.name === "Notifications" && (
                    <Badge variant="destructive" className="ml-1 px-1.5 py-0.5 text-xs">
                      3
                    </Badge>
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Search + Profile */}
          <div className="flex items-center space-x-3">
            {/* Search */}
            <div className="relative hidden md:block">
              <Search className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
              <Input
                type="text"
                placeholder="Search..."
                className="w-40 pl-9 pr-3 text-sm bg-white/60 backdrop-blur-md border border-blue-100 rounded-md focus:ring-2 focus:ring-blue-400 transition-all"
              />
            </div>

            {/* Avatar */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative w-9 h-9 rounded-full hover:bg-blue-50 transition-all"
                >
                  <Avatar className="w-9 h-9 border border-blue-100 shadow-sm">
                    <AvatarImage src="/Samuel.jpg" alt={user?.name ?? "User"} />
                    <AvatarFallback>{user?.initials ?? "JD"}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuItem asChild>
                  <Link to="/profile">
                    <User className="w-4 h-4 mr-2" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/my-jobs">
                    <Briefcase className="w-4 h-4 mr-2" />
                    <span>My Jobs</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="xl:hidden hover:bg-blue-50 transition-all"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Nav */}
        {isMenuOpen && (
          <div className="py-3 border-t border-blue-100 xl:hidden bg-white/90 backdrop-blur-md rounded-md mt-1 shadow-sm">
            <div className="space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.href
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium ${
                      isActive
                        ? "text-blue-600 bg-blue-50"
                        : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
