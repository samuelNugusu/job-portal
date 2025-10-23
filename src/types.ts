// src/types.ts
export type JobType = "Full Time" | "Part Time" | "Contract" | "Remote"

export interface Company {
  name: string
  logo?: string
}

export interface Job {
  id: string
  title: string
  company: Company
  location: string
  type: JobType | string
  salary?: string
  experience?: string
  postedAt?: string
  applicants?: number
  skills: string[]
  featured?: boolean
  recommended?: boolean
  promoted?: boolean
  // optional metadata used by UI/store:
  savedAt?: string
  appliedAt?: string
  applicationStatus?: string
}
