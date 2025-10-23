

import { createContext, useContext, useState, type ReactNode } from "react"
import type { Job, User } from "@/types"

interface UserContextType {
  user: User
  savedJobs: Job[]
  appliedJobs: Job[]
  saveJob: (job: Job) => void
  unsaveJob: (jobId: string) => void
  applyToJob: (job: Job) => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

const mockUser: User = {
  id: "1",
  name: "Albert Flores",
  email: "albert.flores@email.com",
  title: "Senior Product Designer | UI/UX Designer | Graphic Designer | Web...",
  location: "Clinton, Maryland",
  initials: "AF",
  stats: {
    profileVisitors: 140,
    resumeViewers: 20,
    myJobs: 88,
  },
}

export function UserProvider({ children }: { children: ReactNode }) {
  const [user] = useState<User>(mockUser)
  const [savedJobs, setSavedJobs] = useState<Job[]>([])
  const [appliedJobs, setAppliedJobs] = useState<Job[]>([])

  const saveJob = (job: Job) => {
    setSavedJobs((prev) => {
      if (prev.some((savedJob) => savedJob.id === job.id)) {
        return prev
      }
      return [...prev, { ...job, savedAt: new Date().toISOString() }]
    })
  }

  const unsaveJob = (jobId: string) => {
    setSavedJobs((prev) => prev.filter((job) => job.id !== jobId))
  }

  const applyToJob = (job: Job) => {
    setAppliedJobs((prev) => {
      if (prev.some((appliedJob) => appliedJob.id === job.id)) {
        return prev
      }
      return [...prev, { ...job, appliedAt: new Date().toISOString(), applicationStatus: "Under Review" }]
    })
  }

  return (
    <UserContext.Provider
      value={{
        user,
        savedJobs,
        appliedJobs,
        saveJob,
        unsaveJob,
        applyToJob,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}
