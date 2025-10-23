import { useMemo, useState } from "react";
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
import { MapPin, Trash2, ExternalLink, Search, Filter, Calendar } from "lucide-react";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { unsaveJob } from "@/store/slices/userSlice";
import { User, JobSearchFilters } from "@/types"; // ensure types exported

// Placeholder withdrawApplication action
const withdrawApplication = (jobId: string) => {
  console.log("Withdraw application called for job:", jobId);
  toast("Application withdrawn (placeholder)");
};

// Job and Offer Types
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
  date: string;
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

// Mock Data (same as original)
const mockJobsData: Job[] = [
  { id: "ethio-1", title: "Frontend Developer", company: { name: "EthioTech", logo: "/placeholder.svg", website: "https://ethiotech.et" }, location: "Addis Ababa, Ethiopia", type: "Full-time", skills: ["React", "TypeScript", "TailwindCSS"], savedAt: new Date(), appliedAt: new Date(), applicationStatus: "Under Review", rating: 4.7 },
  { id: "global-1", title: "Backend Engineer", company: { name: "GlobalSoft", logo: "/placeholder.svg", website: "https://globalsoft.com" }, location: "London, UK", type: "Full-time", skills: ["Node.js", "Express", "MongoDB"], savedAt: new Date(), appliedAt: new Date(), applicationStatus: "Interview Scheduled", rating: 4.5 },
  { id: "ethio-2", title: "UI/UX Designer", company: { name: "AddisCreative", logo: "/placeholder.svg", website: "https://addiscreative.et" }, location: "Addis Ababa, Ethiopia", type: "Contract", skills: ["Figma", "Adobe XD", "Prototyping"], savedAt: new Date(), appliedAt: new Date(), applicationStatus: "Under Review", rating: 4.8 },
  { id: "global-2", title: "Full Stack Developer", company: { name: "BlueDot", logo: "/placeholder.svg", website: "https://bluedot.com" }, location: "New York, USA", type: "Full-time", skills: ["React", "Node.js", "GraphQL"], savedAt: new Date(), appliedAt: new Date(), applicationStatus: "Interview Scheduled", rating: 4.3 },
];

const mockOffers: Offer[] = [
  { id: "offer-1", jobTitle: "Senior Product Designer", company: "TechCorp Inc.", salary: "$120,000 - $150,000", remote: true, receivedAt: "2025-01-20", status: "Received" },
];

export default function MyJobsPage(): JSX.Element {
  const dispatch = useAppDispatch();
  const userState: User = useAppSelector((s) => s.user as User);

  const savedFromStore: Job[] = userState?.savedJobs ?? [];
  const appliedFromStore: Job[] = userState?.appliedJobs ?? [];

  const combinedSavedJobs = useMemo(() => [...mockJobsData, ...savedFromStore], [savedFromStore]);
  const combinedAppliedJobs = useMemo(() => [...mockJobsData, ...appliedFromStore], [appliedFromStore]);

  const [activeTab, setActiveTab] = useState<"saved" | "applied" | "interviews" | "offers">("saved");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"recent" | "company" | "title">("recent");

  const interviews: Interview[] = useMemo(() => combinedAppliedJobs.slice(0, 6).map((job, idx) => {
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
  }), [combinedAppliedJobs]);

  const [offers, setOffers] = useState<Offer[]>(mockOffers);

  const filteredSavedJobs = useMemo(
    () => combinedSavedJobs.filter((j) => {
      const q = searchTerm.trim().toLowerCase();
      if (!q) return true;
      return j.title.toLowerCase().includes(q) || j.company.name.toLowerCase().includes(q) || j.location.toLowerCase().includes(q);
    }),
    [combinedSavedJobs, searchTerm]
  );

  const filteredAppliedJobs = useMemo(
    () => combinedAppliedJobs.filter((j) => {
      const q = searchTerm.trim().toLowerCase();
      if (!q) return true;
      return j.title.toLowerCase().includes(q) || j.company.name.toLowerCase().includes(q) || j.location.toLowerCase().includes(q);
    }),
    [combinedAppliedJobs, searchTerm]
  );

  const handleUnsave = (jobId: string) => {
    try { dispatch(unsaveJob(jobId)); toast.success("Removed from saved jobs"); }
    catch { toast.error("Could not remove saved job"); }
  };

  const handleWithdraw = (jobId: string) => {
    try { withdrawApplication(jobId); }
    catch { toast.error("Could not withdraw application"); }
  };

  const handleJoinCall = (interview: Interview) => { window.open(`https://meet.example.com/${interview.id}`, "_blank"); toast.success(`Joining ${interview.company} meeting...`); };
  const handleGetDirections = (interview: Interview) => { const query = encodeURIComponent(`${interview.company} ${interview.location}`); window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, "_blank"); };
  const handleReschedule = (interviewId: string) => { toast("Requesting reschedule...", { duration: 2000 }); setTimeout(() => toast.success("Reschedule request sent"), 1200); };
  const handleAcceptOffer = (offerId: string) => setOffers(prev => prev.map(o => o.id === offerId ? { ...o, status: "Accepted" } : o)) && toast.success("Offer accepted — congratulations!");
  const handleDeclineOffer = (offerId: string) => setOffers(prev => prev.map(o => o.id === offerId ? { ...o, status: "Declined" } : o)) && toast.success("Offer declined");
  const handleNegotiateOffer = (offerId: string) => setOffers(prev => prev.map(o => o.id === offerId ? { ...o, status: "Negotiating" } : o)) && toast("Negotiation started", { duration: 2000 });

  const cardVariants = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header and all JSX unchanged, same as your original file */}
    </div>
  );
}
