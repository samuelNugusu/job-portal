import { useState, useEffect, useTransition, useRef } from "react"
import { Badge } from "@/components/ui/badge"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { searchJobs, toggleFilter } from "@/store/slices/jobsSlice"

const filterOptions = [
  { id: "frontend", label: "Frontend" },
  { id: "backend", label: "Backend" },
  { id: "graphic-designer", label: "Graphic Designer" },
  { id: "full-stack", label: "Full Stack" },
  { id: "mobile", label: "Mobile" },
]

export default function JobFilters() {
  const dispatch = useAppDispatch()
  const activeFilters = useAppSelector((state) => state.jobs?.activeFilters ?? [])

  const [loadingFilterId, setLoadingFilterId] = useState<string | null>(null)
  const [, startTransition] = useTransition()
  const lastSearchTermRef = useRef("")

  const handleToggleFilter = (filterId: string) => {
    dispatch(toggleFilter(filterId))
    const label = filterOptions.find((f) => f.id === filterId)?.label || ""
    setLoadingFilterId(filterId)
    startTransition(() => {
      dispatch(searchJobs({ searchTerm: label, location: "", jobType: "" }))
      setLoadingFilterId(null)
    })
  }

  const handleClearAll = () => {
    activeFilters.forEach((id) => dispatch(toggleFilter(id)))
  }

  useEffect(() => {
    const latestActiveId = activeFilters[activeFilters.length - 1]
    const matched = filterOptions.find((f) => f.id === latestActiveId)
    if (matched && matched.label !== lastSearchTermRef.current) {
      lastSearchTermRef.current = matched.label
      startTransition(() => {
        dispatch(searchJobs({ searchTerm: matched.label, location: "", jobType: "" }))
      })
    }
  }, [activeFilters, dispatch])

  return (
    <div className="flex flex-wrap gap-2 mb-6 items-center">
      <span className="text-sm font-medium text-gray-600 mr-2">Similar:</span>
      {filterOptions.map((filter) => {
        const isActive = activeFilters.includes(filter.id)
        const isLoading = loadingFilterId === filter.id
        return (
          <Badge
            key={filter.id}
            variant={isActive ? "default" : "secondary"}
            className="cursor-pointer hover:bg-blue-100 transition-colors rounded-[5px] py-[7px] px-4 border border-gray-400 font-normal text-xs"
            onClick={() => handleToggleFilter(filter.id)}
          >
            {isLoading ? "Searching..." : filter.label}
          </Badge>
        )
      })}
      {activeFilters.length > 0 && (
        <button
          onClick={handleClearAll}
          className="ml-4 text-xs text-blue-600 underline hover:text-blue-800 transition-colors"
        >
          Clear all
        </button>
      )}
    </div>
  )
}
