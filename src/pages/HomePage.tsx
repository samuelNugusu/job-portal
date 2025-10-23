import { Suspense } from "react"
import Sidebar from "@/components/layout/Sidebar"
import JobSearch from "@/components/jobs/JobSearch"
import JobFilters from "@/components/jobs/JobFilters"
import JobListings from "@/components/jobs/JobListings"
import LoadingSpinner from "@/components/ui/LoadingSpinner"

export default function HomePage() {
  return (
    <div className="flex max-w-7xl mx-auto">
      <Sidebar />
      <main className="flex-1 p-6">
        <div className="mb-8">
          <div className="rounded-lg mb-6">
            <h1 className="text-2xl font-semibold mb-2">Find your Dream Job, 
              <span className="text-primary ml-2">Samuel!</span>
            </h1>
            <p className="mb-6">
              Explore the latest job openings and apply for the best opportunities available today!
            </p>
            <JobSearch />
          </div>
          <JobFilters />
        </div>
        <Suspense fallback={<LoadingSpinner />}>
          <JobListings />
        </Suspense>
      </main>
    </div>
  )
}
