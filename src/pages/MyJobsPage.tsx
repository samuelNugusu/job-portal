import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Clock, Trash2, ExternalLink, Search, Filter, Calendar, Building2 } from "lucide-react";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { unsaveJob } from "@/store/slices/userSlice";

/**
 * Professional MyJobsPage
 * - Saved / Applied / Interviews / Offers
 * - Ethiopian + Global mock data
 * - Animated cards (framer-motion)
 * - Buttons fully functional (simulate some actions)
 *
 * Notes:
 * - This file expects your UI components to exist under "@/components/ui/*".
 * - It expects Redux actions unsaveJob and withdrawApplication to exist.
 * - Apply opens the company website (in new tab).
 * - View Job links to `/jobs/:id` (React Router).
 */

type Job = {
  id: string;
  title: string;
  company: { name: string; logo?: string; website?: string };
  location: string;
  type: string;
  skills: string[];
  savedAt?: string | Date;
  appliedAt?: string | Date;
  applicationStatus?: string;
  rating?: number;
};

type Interview = {
  id: string;
  jobId: string;
  company: string;
  jobTitle: string;
  companyLogo?: string;
  date: string; // YYYY-MM-DD
  time: string;
  type: "Video Call" | "On-site";
  status: "Scheduled" | "Confirmed" | "Completed";
  location: string;
};

type Offer = {
  id: string;
  jobTitle: string;
  company: string;
  salary: string;
  remote: boolean;
  receivedAt: string;
  status: "Received" | "Accepted" | "Declined" | "Negotiating";
};

const mockJobsData: Job[] = [
  {
    id: "ethio-1",
    title: "Frontend Developer",
    company: { name: "EthioTech", logo: "/placeholder.svg", website: "https://ethiotech.et" },
    location: "Addis Ababa, Ethiopia",
    type: "Full-time",
    skills: ["React", "TypeScript", "TailwindCSS"],
    savedAt: new Date(),
    appliedAt: new Date(),
    applicationStatus: "Under Review",
    rating: 4.7,
  },
  {
    id: "global-1",
    title: "Backend Engineer",
    company: { name: "GlobalSoft", logo: "/placeholder.svg", website: "https://globalsoft.com" },
    location: "London, UK",
    type: "Full-time",
    skills: ["Node.js", "Express", "MongoDB"],
    savedAt: new Date(),
    appliedAt: new Date(),
    applicationStatus: "Interview Scheduled",
    rating: 4.5,
  },
  {
    id: "ethio-2",
    title: "UI/UX Designer",
    company: { name: "AddisCreative", logo: "/placeholder.svg", website: "https://addiscreative.et" },
    location: "Addis Ababa, Ethiopia",
    type: "Contract",
    skills: ["Figma", "Adobe XD", "Prototyping"],
    savedAt: new Date(),
    appliedAt: new Date(),
    applicationStatus: "Under Review",
    rating: 4.8,
  },
  {
    id: "global-2",
    title: "Full Stack Developer",
    company: { name: "BlueDot", logo: "/placeholder.svg", website: "https://bluedot.com" },
    location: "New York, USA",
    type: "Full-time",
    skills: ["React", "Node.js", "GraphQL"],
    savedAt: new Date(),
    appliedAt: new Date(),
    applicationStatus: "Interview Scheduled",
    rating: 4.3,
  },
];

const mockOffers: Offer[] = [
  {
    id: "offer-1",
    jobTitle: "Senior Product Designer",
    company: "TechCorp Inc.",
    salary: "$120,000 - $150,000",
    remote: true,
    receivedAt: "2025-01-20",
    status: "Received",
  },
];

export default function MyJobsPage(): JSX.Element {
  const dispatch = useAppDispatch();
  const userState = useAppSelector((s) => s.user);
  // In case your store shape is different, adjust above line - earlier errors indicated issues: useAppSelector(state => state.user)

  // Use the saved/applied lists from store if available, otherwise empty arrays
  const savedFromStore: Job[] = userState?.savedJobs ?? [];
  const appliedFromStore: Job[] = userState?.appliedJobs ?? [];

  const combinedSavedJobs = useMemo(() => [...mockJobsData, ...savedFromStore], [savedFromStore]);
  const combinedAppliedJobs = useMemo(() => [...mockJobsData, ...appliedFromStore], [appliedFromStore]);

  // Local state
  const [activeTab, setActiveTab] = useState<"saved" | "applied" | "interviews" | "offers">("saved");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"recent" | "company" | "title">("recent");

  // Build interviews list from applied jobs
  const interviews: Interview[] = useMemo(() => {
    return combinedAppliedJobs.slice(0, 6).map((job, idx) => {
      const d = new Date();
      d.setDate(d.getDate() + idx + 1);
      return {
        id: `${job.id}-iv-${idx}`,
        jobId: job.id,
        company: job.company.name,
        jobTitle: job.title,
        companyLogo: job.company.logo,
        date: d.toISOString().split("T")[0],
        time: idx % 3 === 0 ? "10:00 AM" : idx % 3 === 1 ? "2:00 PM" : "4:00 PM",
        type: idx % 2 === 0 ? "Video Call" : "On-site",
        status: idx === 0 ? "Scheduled" : "Confirmed",
        location: job.location,
      };
    });
  }, [combinedAppliedJobs]);

  // Offer state (local, simulated)
  const [offers, setOffers] = useState<Offer[]>(mockOffers);

  // Keep lists filtered by search
  const filteredSavedJobs = useMemo(
    () =>
      combinedSavedJobs.filter((j) => {
        const q = searchTerm.trim().toLowerCase();
        if (!q) return true;
        return (
          j.title.toLowerCase().includes(q) ||
          j.company.name.toLowerCase().includes(q) ||
          j.location.toLowerCase().includes(q)
        );
      }),
    [combinedSavedJobs, searchTerm]
  );

  const filteredAppliedJobs = useMemo(
    () =>
      combinedAppliedJobs.filter((j) => {
        const q = searchTerm.trim().toLowerCase();
        if (!q) return true;
        return (
          j.title.toLowerCase().includes(q) ||
          j.company.name.toLowerCase().includes(q) ||
          j.location.toLowerCase().includes(q)
        );
      }),
    [combinedAppliedJobs, searchTerm]
  );

  // Handlers (these call Redux where appropriate, or mutate local state)
  const handleUnsave = (jobId: string) => {
    try {
      dispatch(unsaveJob(jobId));
      toast.success("Removed from saved jobs");
    } catch (e) {
      toast.error("Could not remove saved job");
    }
  };

  const handleWithdraw = (jobId: string) => {
    try {
      dispatch(withdrawApplication(jobId));
      toast.success("Application withdrawn");
    } catch (e) {
      toast.error("Could not withdraw application");
    }
  };

  const handleJoinCall = (interview: Interview) => {
    // For demo: open a dummy meeting URL and show toast
    const meetingUrl = `https://meet.example.com/${interview.id}`;
    window.open(meetingUrl, "_blank");
    toast.success(`Joining ${interview.company} meeting...`);
  };

  const handleGetDirections = (interview: Interview) => {
    // Open Google Maps with query = company + location
    const query = encodeURIComponent(`${interview.company} ${interview.location}`);
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${query}`;
    window.open(mapsUrl, "_blank");
  };

  const handleReschedule = (interviewId: string) => {
    // For demo: show toast and mark as Confirmed after a short delay
    toast("Requesting reschedule...", { duration: 2000 });
    setTimeout(() => {
      toast.success("Reschedule request sent");
    }, 1200);
  };

  const handleAcceptOffer = (offerId: string) => {
    setOffers((prev) => prev.map((o) => (o.id === offerId ? { ...o, status: "Accepted" } : o)));
    toast.success("Offer accepted — congratulations!");
  };

  const handleDeclineOffer = (offerId: string) => {
    setOffers((prev) => prev.map((o) => (o.id === offerId ? { ...o, status: "Declined" } : o)));
    toast.success("Offer declined");
  };

  const handleNegotiateOffer = (offerId: string) => {
    setOffers((prev) => prev.map((o) => (o.id === offerId ? { ...o, status: "Negotiating" } : o)));
    toast("Negotiation started", { duration: 2000 });
  };

  // small animation
  const cardVariants = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">My Jobs Dashboard</h1>
        <p className="text-gray-600">
          Track saved jobs, applications, interviews, and offers — includes Ethiopian companies and global listings.
        </p>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <Card className="hover:shadow-xl transition-shadow">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{combinedSavedJobs.length}</div>
            <div className="text-sm text-gray-500">Saved Jobs</div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-xl transition-shadow">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{combinedAppliedJobs.length}</div>
            <div className="text-sm text-gray-500">Applications</div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-xl transition-shadow">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{interviews.length}</div>
            <div className="text-sm text-gray-500">Interviews</div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-xl transition-shadow">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">{offers.length}</div>
            <div className="text-sm text-gray-500">Offers</div>
          </CardContent>
        </Card>
      </div>

      {/* Search + Sort */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search by title, company or location"
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Select value={sortBy} onValueChange={(v) => setSortBy(v as any)}>
          <SelectTrigger className="w-44">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Most recent</SelectItem>
            <SelectItem value="company">Company</SelectItem>
            <SelectItem value="title">Job title</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
        <TabsList className="grid grid-cols-4 gap-2 mb-4">
          <TabsTrigger value="saved">Saved ({combinedSavedJobs.length})</TabsTrigger>
          <TabsTrigger value="applied">Applied ({combinedAppliedJobs.length})</TabsTrigger>
          <TabsTrigger value="interviews">Interviews ({interviews.length})</TabsTrigger>
          <TabsTrigger value="offers">Offers ({offers.length})</TabsTrigger>
        </TabsList>

        {/* SAVED */}
        <TabsContent value="saved">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSavedJobs.length === 0 && (
              <div className="col-span-full text-center py-12 text-gray-500">No saved jobs yet.</div>
            )}

            {filteredSavedJobs.map((job, idx) => (
              <motion.div
                key={job.id}
                initial="hidden"
                animate="show"
                variants={cardVariants}
                transition={{ delay: idx * 0.04 }}
              >
                <Card className="hover:shadow-2xl transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-12 h-12">
                          {job.company.logo ? <AvatarImage src={job.company.logo} /> : <AvatarFallback>{job.company.name.charAt(0)}</AvatarFallback>}
                        </Avatar>
                        <div>
                          <CardTitle className="text-base">{job.title}</CardTitle>
                          <div className="text-sm text-gray-500">{job.company.name}</div>
                          <div className="text-xs text-gray-400 flex items-center mt-1">
                            <MapPin className="w-3 h-3 mr-1" /> {job.location}
                          </div>
                        </div>
                      </div>

                      <div>
                        <Button variant="ghost" size="sm" onClick={() => handleUnsave(job.id)} className="text-red-600">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {job.skills.slice(0, 6).map((s) => (
                        <Badge key={s} variant="outline" className="text-xs">{s}</Badge>
                      ))}
                    </div>

                    <div className="flex items-center gap-2">
                      <Button onClick={() => window.open(job.company.website ?? "#", "_blank")} className="flex-1">
                        Apply Now
                      </Button>

                      <Link to={`/jobs/${job.id}`}>
                        <Button variant="outline" size="sm">
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* APPLIED */}
        <TabsContent value="applied">
          <div className="space-y-4">
            {filteredAppliedJobs.length === 0 && (
              <div className="text-center py-10 text-gray-500">No applications yet. Apply to jobs and they'll show up here.</div>
            )}

            {filteredAppliedJobs.map((job) => (
              <motion.div key={job.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
                <Card>
                  <CardContent className="p-4 md:p-6 flex flex-col md:flex-row justify-between items-start md:items-center">
                    <div className="flex items-start md:items-center gap-4">
                      <Avatar className="w-12 h-12">
                        {job.company.logo ? <AvatarImage src={job.company.logo} /> : <AvatarFallback>{job.company.name.charAt(0)}</AvatarFallback>}
                      </Avatar>
                      <div>
                        <div className="font-semibold">{job.title}</div>
                        <div className="text-sm text-gray-500">{job.company.name}</div>
                        <div className="text-xs text-gray-400 mt-1">
                          Applied {job.appliedAt ? new Date(job.appliedAt).toLocaleDateString() : "Recently"} • {job.location}
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 md:mt-0 flex items-center gap-3">
                      <Badge className={`px-3 py-1 text-xs ${job.applicationStatus === "Interview Scheduled" ? "bg-green-100 text-green-800" : job.applicationStatus === "Under Review" ? "bg-yellow-100 text-yellow-800" : "bg-gray-100 text-gray-800"}`}>
                        {job.applicationStatus ?? "Under Review"}
                      </Badge>

                      <Link to={`/jobs/${job.id}`}>
                        <Button variant="outline" size="sm">View Job</Button>
                      </Link>

                      <Button variant="ghost" size="sm" onClick={() => handleWithdraw(job.id)}>Withdraw</Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* INTERVIEWS */}
        <TabsContent value="interviews">
          <div className="space-y-4">
            {interviews.length === 0 && (
              <div className="text-center py-10 text-gray-500">No interviews scheduled yet.</div>
            )}

            {interviews.map((iv) => (
              <motion.div key={iv.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                <Card>
                  <CardContent className="p-4 md:p-6 flex flex-col md:flex-row justify-between gap-4 items-start md:items-center">
                    <div className="flex items-start gap-4">
                      <Avatar className="w-12 h-12">
                        {iv.companyLogo ? <AvatarImage src={iv.companyLogo} /> : <AvatarFallback>{iv.company.charAt(0)}</AvatarFallback>}
                      </Avatar>
                      <div>
                        <div className="font-semibold">{iv.jobTitle}</div>
                        <div className="text-sm text-gray-500">{iv.company}</div>
                        <div className="text-xs text-gray-400 mt-1 flex items-center gap-2">
                          <Calendar className="w-4 h-4" /> {new Date(iv.date).toLocaleDateString()} • {iv.time} • {iv.type}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {iv.type === "Video Call" ? (
                        <Button size="sm" onClick={() => handleJoinCall(iv)}>Join Call</Button>
                      ) : (
                        <Button variant="outline" size="sm" onClick={() => handleGetDirections(iv)}>Get Directions</Button>
                      )}
                      <Button variant="ghost" size="sm" onClick={() => handleReschedule(iv.id)}>Reschedule</Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* OFFERS */}
        <TabsContent value="offers">
          <div className="space-y-4">
            {offers.length === 0 && (
              <div className="text-center py-10 text-gray-500">No offers at the moment.</div>
            )}

            {offers.map((off) => (
              <motion.div key={off.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                <Card>
                  <CardContent className="p-4 md:p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <div className="font-semibold text-lg">{off.jobTitle}</div>
                      <div className="text-sm text-gray-500">{off.company}</div>
                      <div className="text-xs text-gray-400 mt-1">
                        Offer received: {new Date(off.receivedAt).toLocaleDateString()} • {off.salary} • {off.remote ? "Remote" : "On-site"}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge className={`px-3 py-1 text-xs ${off.status === "Received" ? "bg-blue-100 text-blue-800" : off.status === "Accepted" ? "bg-green-100 text-green-800" : off.status === "Negotiating" ? "bg-yellow-100 text-yellow-800" : "bg-gray-100 text-gray-800"}`}>
                        {off.status}
                      </Badge>

                      <div className="flex items-center gap-2">
                        <Button size="sm" onClick={() => handleAcceptOffer(off.id)} disabled={off.status !== "Received"}>Accept</Button>
                        <Button variant="outline" size="sm" onClick={() => handleNegotiateOffer(off.id)} disabled={off.status !== "Received"}>Negotiate</Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeclineOffer(off.id)} disabled={off.status !== "Received"}>Decline</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
