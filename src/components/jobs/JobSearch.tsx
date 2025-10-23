

import { useState, useTransition } from "react"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAppDispatch } from "@/store/hooks"
import { searchJobs } from "@/store/slices/jobsSlice"

export default function JobSearch() {
  const [searchTerm, setSearchTerm] = useState("")
  const [location, setLocation] = useState("")
  const [jobType, setJobType] = useState("")
  const [isPending, startTransition] = useTransition()
  const dispatch = useAppDispatch()

  const handleSearch = () => {
    startTransition(() => {
      dispatch(searchJobs({ searchTerm, location, jobType }))
    })
  }

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative w-full md:basis-1/2">
          <Input
            type="text"
            placeholder="Job Title, Company, or Keywords"
            className="pl-10 border-0 sm:border-r rounded-none w-full placeholder:-translate-x-7"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="w-full md:basis-1/4">
          <Select value={location} onValueChange={setLocation}>
            <SelectTrigger className="rounded-none border-0 sm:border-r w-full">
              <div className="flex items-center">
                <SelectValue placeholder="Select Location" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="seattle">Seattle, USA</SelectItem>
              <SelectItem value="san-francisco">San Francisco, USA</SelectItem>
              <SelectItem value="new-york">Addis Ababa, Ethiopia</SelectItem>
              <SelectItem value="remote">Remote</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="w-full md:basis-1/4">
          <Select value={jobType} onValueChange={setJobType}>
            <SelectTrigger className="rounded-none border-0 w-full">
              <div className="flex items-center">
                <SelectValue placeholder="Job Type" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="full-time">Full Time</SelectItem>
              <SelectItem value="part-time">Part Time</SelectItem>
              <SelectItem value="contract">Contract</SelectItem>
              <SelectItem value="internship">Internship</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button onClick={handleSearch} disabled={isPending} className="w-full md:w-auto">
          <Search className="w-4 h-4 mr-2" />
          {isPending ? "Searching..." : "Search"}
        </Button>
      </div>
    </div>

  )
}
