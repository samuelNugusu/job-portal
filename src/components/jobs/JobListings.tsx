

import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { loadJobs } from "@/store/slices/jobsSlice"
import JobCard from "./JobCard"
import { Button } from "@/components/ui/button"
import { Job } from "@/types"

export default function JobListings() {
  const dispatch = useAppDispatch()
  const { jobs, loading } = useAppSelector((state) => state.jobs)

  useEffect(() => {
    if (jobs.length === 0) {
      dispatch(loadJobs())
    }
  }, [dispatch, jobs.length])

  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-48 bg-gray-200 rounded-lg"></div>
          </div>
        ))}
      </div>
    )
  }

  const featuredJobs = jobs.filter((job) => job.featured).slice(0, 5)
  const recommendedJobs = jobs.filter((job) => job.recommended).slice(0, 5)
  const latestJobs = jobs.filter((job) => !job.featured && !job.recommended).slice(0, 5)

  return (
    <div className="space-y-8">
      {/* Featured Jobs */}
      <JobSection title="Featured Jobs" jobs={featuredJobs} seeMoreText="See Featured Jobs" />
      {/* Recommended Jobs */}
      <JobSection title="Recommended Jobs" jobs={recommendedJobs} seeMoreText="See Recommended Jobs" />
      {/* Latest Jobs */}
      <JobSection title="Latest Jobs" jobs={latestJobs} seeMoreText="See Latest Jobs" />
    </div>
  )
}


function JobSection({
  title,
  jobs,
  seeMoreText,
}: {
  title: string
  jobs: Job[]
  seeMoreText: string
}) {
  return (
    <section>
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-medium text-gray-900">{title}</h2>
        <Button variant="link" className="text-blue-600 underline py-0 mb-2">
          {seeMoreText}
        </Button>
      </div>
      {jobs.length === 0 ? (
        <p className="text-sm text-gray-500">No {title.toLowerCase()} available.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </section>
  )
}
