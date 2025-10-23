

import { useState } from "react"
import { useAppSelector } from "@/store/hooks"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Sidebar() {
  const { user } = useAppSelector((state) => state.user)
  const { savedJobs } = useAppSelector((state) => state.user)
  const [isCalendarExpanded, setIsCalendarExpanded] = useState(false)

  return (
    <aside className="w-80 p-6 hidden lg:block">
      <Card className="mb-2">
        <CardContent className="p-0">
          <div className="text-center">
            <div className="relative rounded-t-md mb-6">
              <img src="/Samuel.jpg" alt="User Background" className="w-full h-24 object-cover rounded-t-md" />
              <div className="absolute inline-block top-1/2 left-1/2 -translate-x-1/2">
                <Avatar className="w-20 h-20 mx-auto border-[3px] border-white">
                  <AvatarImage src="/Samuel.jpg" alt={user.name} />
                  <AvatarFallback className="text-lg">{user.initials}</AvatarFallback>
                </Avatar>
                <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
              <p className="text-sm font-medium text-gray-600 mb-2">{user.title}</p>
              <div className="flex items-center justify-center text-sm text-gray-500 mb-2">
                {/* <MapPin className="w-4 h-4 mr-1" /> */}
                {user.location}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-2">
        <CardContent className="p-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center border-b border-gray-200 pb-2">
              <span className="text-sm text-gray-600">Profile Visitors</span>
              <span className="text-primary font-medium">
                {user.stats.profileVisitors}
              </span>
            </div>
            <div className="flex justify-between items-center border-b border-gray-200 pb-2">
              <span className="text-sm text-gray-600">Resume Viewers</span>
              <span className="text-primary font-medium">
                {user.stats.resumeViewers}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">My Jobs</span>
              <span className="text-primary font-medium">
                {savedJobs.length}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <Button
            variant="ghost"
            className="w-full justify-between p-2"
            onClick={() => setIsCalendarExpanded(!isCalendarExpanded)}
          >
            <div className="flex items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
              <span className="text-sm font-semibold">My calendar</span>
            </div>
            <ChevronDown className={`w-4 h-4 transition-transform ${isCalendarExpanded ? "rotate-180" : ""}`} />
          </Button>
          {isCalendarExpanded && (
            <div className="mt-2 pl-4">
              <p className="text-xs text-gray-500">Upcoming Interviews</p>
              <div className="mt-2 space-y-2">
                <div className="text-xs">
                  <div className="font-medium">Google - UI/UX Designer</div>
                  <div className="text-gray-500">Tomorrow, 2:00 PM</div>
                </div>
                <div className="text-xs">
                  <div className="font-medium">Microsoft - Frontend Dev</div>
                  <div className="text-gray-500">Friday, 10:00 AM</div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </aside>
  )
}
