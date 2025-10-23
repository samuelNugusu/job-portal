

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { mockJobs } from "@/data/mockData"
import type { Job, JobSearchFilters } from "@/types"

interface JobContextType {
  jobs: Job[]
  loading: boolean
  activeFilters: string[]
  searchJobs: (filters: JobSearchFilters) => void
  toggleFilter: (filterId: string) => void
  clearFilters: () => void
}

const JobContext = createContext<JobContextType | undefined>(undefined)

export function JobProvider({ children }: { children: ReactNode }) {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [activeFilters, setActiveFilters] = useState<string[]>(["similar"])

  useEffect(() => {
    // Simulate API call
    const loadJobs = async () => {
      setLoading(true)
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setJobs(mockJobs)
      setLoading(false)
    }
    loadJobs()
  }, [])

  const searchJobs = async (filters: JobSearchFilters) => {
    setLoading(true)
    // Simulate API call with filters
    await new Promise((resolve) => setTimeout(resolve, 500))

    let filteredJobs = [...mockJobs]

    if (filters.searchTerm) {
      filteredJobs = filteredJobs.filter(
        (job) =>
          job.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
          job.company.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
          job.skills.some((skill) => skill.toLowerCase().includes(filters.searchTerm.toLowerCase())),
      )
    }

    if (filters.location) {
      filteredJobs = filteredJobs.filter((job) => job.location.toLowerCase().includes(filters.location.toLowerCase()))
    }

    if (filters.jobType) {
      filteredJobs = filteredJobs.filter((job) => job.type.toLowerCase() === filters.jobType.toLowerCase())
    }

    setJobs(filteredJobs)
    setLoading(false)
  }

  const toggleFilter = (filterId: string) => {
    setActiveFilters((prev) => (prev.includes(filterId) ? prev.filter((id) => id !== filterId) : [...prev, filterId]))
  }

  const clearFilters = () => {
    setActiveFilters([])
    setJobs(mockJobs)
  }

  return (
    <JobContext.Provider
      value={{
        jobs,
        loading,
        activeFilters,
        searchJobs,
        toggleFilter,
        clearFilters,
      }}
    >
      {children}
    </JobContext.Provider>
  )
}

export function useJobs() {
  const context = useContext(JobContext)
  if (context === undefined) {
    throw new Error("useJobs must be used within a JobProvider")
  }
  return context
}
