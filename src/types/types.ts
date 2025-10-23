export interface Job {
  id: string
  title: string
  company: { name: string; logo: string }
  location: string
  type: string
  salary: string
  experience: string
  postedAt: string
  applicants: number
  skills: string[]
  featured: boolean
  recommended: boolean
  promoted: boolean
  savedAt?: string
  appliedAt?: string
  applicationStatus?: string
}

export interface User {
  id: string
  name: string
  email: string
  title: string
  location: string
  initials: string
  stats: { profileVisitors: number; resumeViewers: number; myJobs: number }
}

export interface JobSearchFilters {
  searchTerm: string
  location: string
  jobType: string
}
