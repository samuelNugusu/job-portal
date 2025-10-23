// src/lib/mockData.ts
import type { Job } from "@/types"

export const mockJobs: Job[] = [
  {
    id: "1",
    title: "UI/UX Designer",
    company: {
      name: "Teams",
      logo: "/team-img.png",
    },
    location: "Addis Ababa, Ethiopia (Remote)",
    type: "Full Time",
    salary: "$30,000 - $70,000",
    experience: "3-5 years",
    postedAt: "1 day ago",
    applicants: 22,
    skills: ["Figma", "Sketch", "Prototyping", "User Research"],
    featured: true,
    recommended: false,
    promoted: true,
  },
  {
    id: "2",
    title: "Frontend Developer",
    company: {
      name: "TechCorp",
      logo: "/team-img.png",
    },
    location: "San Francisco, USA",
    type: "Full Time",
    salary: "$90,000 - $140,000",
    experience: "2-4 years",
    postedAt: "2 days ago",
    applicants: 35,
    skills: ["React", "TypeScript", "Next.js", "Tailwind CSS"],
    featured: true,
    recommended: true,
    promoted: false,
  },
]

// Generate additional mock jobs
for (let i = 3; i <= 50; i++) {
  mockJobs.push({
    id: i.toString(),
    title: `UI/UX Designer`,
    company: {
      name: "Teams",
      logo: "/team-img.png",
    },
    location: "Seattle, USA (Remote)",
    type: "Full Time",
    salary: "$80,000 - $120,000",
    experience: "3-5 years",
    postedAt: `${Math.floor(Math.random() * 7) + 1} day${Math.floor(Math.random() * 7) + 1 > 1 ? "s" : ""} ago`,
    applicants: Math.floor(Math.random() * 50) + 10,
    skills: ["Figma", "Sketch", "Prototyping", "User Research"],
    featured: Math.random() > 0.8,
    recommended: Math.random() > 0.7,
    promoted: Math.random() > 0.9,
  })
}
