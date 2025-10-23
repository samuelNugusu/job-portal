

import { useTransition } from "react"
import { useNavigate } from "react-router-dom"
import { MapPin, Clock, Users, Bookmark, BookmarkCheck, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { saveJob, unsaveJob, applyToJob } from "@/store/slices/userSlice"
import { toast } from "sonner"
import type { Job } from "@/types"

interface JobCardProps {
  job: Job
}

export default function JobCard({ job }: JobCardProps) {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { savedJobs, appliedJobs } = useAppSelector((state) => state.user)
  const [isPending, startTransition] = useTransition()

  const isSaved = savedJobs.some((savedJob) => savedJob.id === job.id)
  const hasApplied = appliedJobs.some((appliedJob) => appliedJob.id === job.id)

  const handleSaveJob = () => {
    if (isSaved) {
      dispatch(unsaveJob(job.id))
      toast.success("Job removed from saved jobs")
    } else {
      dispatch(saveJob(job))
      toast.success("Job saved successfully")
    }
  }

  const handleApply = () => {
    if (hasApplied) {
      toast.info("You have already applied to this job")
      return
    }

    startTransition(() => {
      dispatch(applyToJob(job))
      toast.success("Application submitted successfully")
    })
  }

  return (
    <Card className="h-full transition-shadow duration-200 hover:shadow-lg cursor-pointer">
      <CardContent className="p-4 pb-2" onClick={() => job?.id && navigate(`/jobs/${job.id}`)}>
        <div className="flex items-center space-x-2">
          {job?.promoted && (
            <Badge variant="secondary" className="mb-3 text-xs">
              Promoted
            </Badge>
          )}
        </div>
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <Avatar className="w-8 h-8 rounded-none">
              <AvatarImage src={job?.company?.logo || "/placeholder.svg"} alt={job?.company?.name} />
<AvatarFallback>{job?.company?.name?.charAt(0) ?? "?"}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">{job?.title}</h3>
              <p className="text-xs text-gray-600">{job?.company?.name}</p>
            </div>
          </div>
        </div>

        <div className="mb-4 space-y-2">
          <div className="flex items-center text-xs text-gray-500">
            <MapPin className="w-3 h-3 mr-1" />
            {job?.location} ({job?.type})
          </div>
          <div className="flex items-center text-xs text-gray-500">
            <div className="flex items-center text-xs text-gray-500">
              <Clock className="w-3 h-3 mr-1" />
              {job?.postedAt} 
              <span className="mx-2"> | </span>
            </div>
            <div className="flex items-center text-xs text-gray-500">
              <Users className="w-3 h-3 mr-1" />
              {job?.applicants} applicants
            </div>
          </div>
        </div>

        {hasApplied && (
          <Badge variant="default" className="mb-3 text-xs text-green-800 bg-green-100">
            Applied
          </Badge>
        )}

        <div className="flex flex-wrap gap-1 mb-2">
          {job?.skills?.slice(0, 3)?.map((skill) => (
            <Badge key={skill} variant="outline" className="text-xs">
              {skill}
            </Badge>
          ))}
          {job?.skills?.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{job?.skills?.length - 3}
            </Badge>
          )}
        </div>
      </CardContent>

      <CardFooter className="items-center p-4 pt-0 space-y-2">
        <Button
          className="w-2/3"
          onClick={handleApply}
          disabled={isPending || hasApplied}
          variant={hasApplied ? "outline" : "default"}
          size="sm"
        >
          {hasApplied ? (
            <>
              <Check className="w-4 h-4 mr-2" />
              Applied
            </>
          ) : isPending ? (
            "Applying..."
          ) : (
            "Apply Now"
          )}
        </Button>
        <Button variant="ghost" size="sm" onClick={handleSaveJob} className="!mt-0 h-auto p-1 w-1/3 justify-end">
            {isSaved ? (
              <BookmarkCheck className="w-6 h-6 text-blue-600" />
            ) : (
              <Bookmark className="w-6 h-6 text-gray-400" />
            )}
        </Button>
      </CardFooter>
    </Card>
  )
}
