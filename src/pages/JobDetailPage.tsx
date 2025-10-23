// src/pages/JobDetailPage.tsx
import React from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { ArrowLeft, MapPin, Clock, Users, Building2, DollarSign, Bookmark, BookmarkCheck, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { mockJobs } from "@/data/mockData"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { saveJob, unsaveJob, applyToJob } from "@/store/slices/userSlice"
import { toast } from "sonner"

export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { savedJobs, appliedJobs } = useAppSelector((s) => s.user)

  const job = mockJobs.find((j) => j.id === id)

  if (!job) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Job Not Found</h1>
          <p className="text-gray-600 mb-4">The job you're looking for doesn't exist.</p>
          <Link to="/">
            <Button>Back to Jobs</Button>
          </Link>
        </div>
      </div>
    )
  }

  const isSaved = savedJobs.some((s) => s.id === job.id)
  const hasApplied = appliedJobs.some((a) => a.id === job.id)

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
    // simulate async apply
    try {
      dispatch(applyToJob(job))
      toast.success("Application submitted successfully")
    } catch (err) {
      toast.error("Failed to apply")
    }
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Jobs
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4 sm:w-auto">
                  <Avatar className="w-12 h-12 sm:w-16 sm:h-16">
                    {job.company.logo ? (
                      <AvatarImage src={job.company.logo} alt={job.company.name} className="object-cover" />
                    ) : null}
                    <AvatarFallback>{job.company.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg sm:text-2xl">{job.title}</CardTitle>
                    <p className="text-lg text-gray-600">{job.company.name}</p>
                    <div className="flex sm:flex-row flex-col sm:items-center mt-2 sm:space-x-4 text-sm text-gray-500">
                      <div className="flex items-center sm:mb-0 mb-2">
                        <MapPin className="w-4 h-4 mr-1" />
                        {job.location}
                      </div>
                      <div className="flex items-center sm:ml-2 ml-0 sm:mb-0 mb-2">
                        <Clock className="w-4 h-4 mr-1" />
                        {job.postedAt}
                      </div>
                      <div className="flex items-center sm:ml-2 ml-0">
                        <Users className="w-4 h-4 mr-1" />
                        {job.applicants ?? 0} applicants
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" onClick={handleSaveJob}>
                    {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {hasApplied && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <Check className="w-5 h-5 text-green-600 mr-2" />
                    <span className="text-green-800 font-medium">You have applied to this job</span>
                  </div>
                </div>
              )}

              <div>
                <h3 className="text-lg font-semibold mb-3">Job Description</h3>
                <div className="prose prose-sm max-w-none">
                  <p>
                    We are looking for a talented {job.title} to join our growing team. You will be responsible for
                    designing and implementing user interfaces that are both beautiful and functional.
                  </p>

                  <h4 className="font-semibold mt-4 mb-2">Key Responsibilities:</h4>
                  <ul>
                    <li>Design and develop responsive web applications</li>
                    <li>Collaborate with cross-functional teams</li>
                    <li>Conduct user research and usability testing</li>
                    <li>Create wireframes, prototypes, and high-fidelity designs</li>
                    <li>Ensure consistent brand experience across all platforms</li>
                  </ul>

                  <h4 className="font-semibold mt-4 mb-2">Requirements:</h4>
                  <ul>
                    <li>3+ years of experience in UI/UX design</li>
                    <li>Proficiency in design tools (Figma, Sketch, Adobe Creative Suite)</li>
                    <li>Strong understanding of HTML, CSS, and JavaScript</li>
                    <li>Experience with design systems and component libraries</li>
                    <li>Excellent communication and collaboration skills</li>
                  </ul>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-3">Required Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-3">About {job.company.name}</h3>
                <p className="text-gray-600">
                  {job.company.name} is a leading company focused on creating impactful solutions. We believe in
                  fostering a collaborative and inclusive work environment where everyone can thrive.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleApply}
                  disabled={hasApplied}
                  variant={hasApplied ? "outline" : "default"}
                >
                  {hasApplied ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Applied
                    </>
                  ) : (
                    "Apply Now"
                  )}
                </Button>

                <Button variant="outline" className="w-full" onClick={handleSaveJob}>
                  {isSaved ? "Remove from Saved" : "Save Job"}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Job Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Building2 className="w-4 h-4 mr-2 text-gray-400" />
                  <span className="text-sm">Job Type</span>
                </div>
                <Badge variant="secondary">{job.type}</Badge>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <DollarSign className="w-4 h-4 mr-2 text-gray-400" />
                  <span className="text-sm">Salary</span>
                </div>
                <span className="text-sm font-medium">{job.salary ?? "Competitive"}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-2 text-gray-400" />
                  <span className="text-sm">Experience</span>
                </div>
                <span className="text-sm font-medium">{job.experience ?? "N/A"}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Similar Jobs</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {mockJobs
                .filter((m) => m.id !== job.id)
                .slice(0, 3)
                .map((similarJob) => (
                  <Link key={similarJob.id} to={`/jobs/${similarJob.id}`}>
                    <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                      <Avatar className="w-8 h-8">
                        {similarJob.company.logo ? (
                          <AvatarImage src={similarJob.company.logo} alt={similarJob.company.name} />
                        ) : null}
                        <AvatarFallback>{similarJob.company.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{similarJob.title}</p>
                        <p className="text-xs text-gray-500">{similarJob.company.name}</p>
                      </div>
                    </div>
                  </Link>
                ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
