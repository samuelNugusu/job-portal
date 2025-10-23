import React, { useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

type AppStatus = "Application Sent" | "Under Review" | "Interview Scheduled" | "Offer Received"

interface Application {
  id: string
  role: string
  company: string
  status: AppStatus
  progress: number // 0-100
  appliedDate: string // ISO
  notes?: string
}

const initialApps: Application[] = [
  {
    id: "a1",
    role: "UI/UX Designer",
    company: "Ethio Telecom",
    status: "Interview Scheduled",
    progress: 80,
    appliedDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    notes: "Interviewed by HR, portfolio requested",
  },
  {
    id: "a2",
    role: "Frontend Developer",
    company: "Safaricom Ethiopia",
    status: "Under Review",
    progress: 50,
    appliedDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    notes: "Resume submitted via referral",
  },
  {
    id: "a3",
    role: "Graphic Designer",
    company: "Dashen Bank",
    status: "Application Sent",
    progress: 25,
    appliedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "a4",
    role: "Backend Engineer",
    company: "Zemen Bank",
    status: "Offer Received",
    progress: 100,
    appliedDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    notes: "Offer accepted - started onboarding",
  },
]

export default function TrackerPage() {
  const [applications, setApplications] = useState<Application[]>(initialApps)
  const [showModal, setShowModal] = useState(false)
  const [editingApp, setEditingApp] = useState<Application | null>(null)

  // form fields for add/edit
  const [role, setRole] = useState("")
  const [company, setCompany] = useState("")
  const [status, setStatus] = useState<AppStatus>("Application Sent")
  const [progress, setProgress] = useState<number>(0)
  const [appliedDate, setAppliedDate] = useState<string>(new Date().toISOString().slice(0, 10))
  const [notes, setNotes] = useState("")

  // computed stats
  const stats = useMemo(() => {
    const sent = applications.length
    const underReview = applications.filter((a) => a.status === "Under Review").length
    const interviews = applications.filter((a) => a.status === "Interview Scheduled").length
    const offers = applications.filter((a) => a.status === "Offer Received").length
    return { sent, underReview, interviews, offers }
  }, [applications])

  // open modal for add
  const openAdd = () => {
    setEditingApp(null)
    setRole("")
    setCompany("")
    setStatus("Application Sent")
    setProgress(0)
    setAppliedDate(new Date().toISOString().slice(0, 10))
    setNotes("")
    setShowModal(true)
  }

  // open modal for edit
  const openEdit = (app: Application) => {
    setEditingApp(app)
    setRole(app.role)
    setCompany(app.company)
    setStatus(app.status)
    setProgress(app.progress)
    setAppliedDate(app.appliedDate.slice(0, 10))
    setNotes(app.notes || "")
    setShowModal(true)
  }

  // save new or edited
  const saveApplication = () => {
    if (!role.trim() || !company.trim()) {
      alert("Please provide role and company")
      return
    }

    if (editingApp) {
      setApplications((prev) =>
        prev.map((a) =>
          a.id === editingApp.id
            ? { ...a, role, company, status, progress: Math.max(0, Math.min(100, progress)), appliedDate: appliedDate + "T00:00:00.000Z", notes }
            : a
        )
      )
    } else {
      const newApp: Application = {
        id: "a" + Date.now(),
        role,
        company,
        status,
        progress: Math.max(0, Math.min(100, progress)),
        appliedDate: appliedDate + "T00:00:00.000Z",
        notes,
      }
      setApplications((prev) => [newApp, ...prev])
    }

    setShowModal(false)
  }

  // delete
  const deleteApplication = (id: string) => {
    if (!confirm("Delete this application?")) return
    setApplications((prev) => prev.filter((a) => a.id !== id))
  }

  // quick action: advance status (simple workflow)
  const advanceStatus = (app: Application) => {
    const order: AppStatus[] = ["Application Sent", "Under Review", "Interview Scheduled", "Offer Received"]
    const idx = order.indexOf(app.status)
    const next = idx < order.length - 1 ? order[idx + 1] : order[idx]
    setApplications((prev) => prev.map((a) => (a.id === app.id ? { ...a, status: next, progress: next === "Offer Received" ? 100 : Math.min(100, a.progress + 25) } : a)))
  }

  // helper to render badge classes
  const badgeClass = (s: AppStatus) => {
    switch (s) {
      case "Offer Received":
        return "bg-purple-100 text-purple-800"
      case "Interview Scheduled":
        return "bg-green-100 text-green-800"
      case "Under Review":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-blue-100 text-blue-800"
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Job Application Tracker</h1>
          <p className="text-gray-600">Track applications, progress and interviews — updated in real time.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={openAdd}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition"
          >
            ➕ Add Application
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <Card className="transition hover:shadow-lg">
          <CardContent className="p-6">
            <div className="text-3xl font-bold text-blue-600">{stats.sent}</div>
            <div className="text-sm text-gray-600 mt-1">Applications Sent</div>
          </CardContent>
        </Card>

        <Card className="transition hover:shadow-lg">
          <CardContent className="p-6">
            <div className="text-3xl font-bold text-yellow-600">{stats.underReview}</div>
            <div className="text-sm text-gray-600 mt-1">Under Review</div>
          </CardContent>
        </Card>

        <Card className="transition hover:shadow-lg">
          <CardContent className="p-6">
            <div className="text-3xl font-bold text-green-600">{stats.interviews}</div>
            <div className="text-sm text-gray-600 mt-1">Interviews Scheduled</div>
          </CardContent>
        </Card>

        <Card className="transition hover:shadow-lg">
          <CardContent className="p-6">
            <div className="text-3xl font-bold text-purple-600">{stats.offers}</div>
            <div className="text-sm text-gray-600 mt-1">Offers Received</div>
          </CardContent>
        </Card>
      </div>

      {/* Application list */}
      <Card>
        <CardHeader>
          <CardTitle>Application Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {applications.length === 0 && <div className="text-center text-gray-500 py-8">No applications yet. Click “Add Application” to start tracking.</div>}

            {applications.map((app) => (
              <div key={app.id} className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b pb-4">
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="text-lg font-semibold text-gray-800">{app.role}</div>
                      <div className="text-sm text-gray-500">{app.company}</div>
                    </div>

                    <div className="hidden md:flex items-center gap-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${badgeClass(app.status)}`}>{app.status}</span>
                    </div>
                  </div>

                  <div className="mt-3">
                    <Progress value={app.progress} className="h-2" />
                    <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
                      <div>Applied: {new Date(app.appliedDate).toLocaleDateString()}</div>
                      <div>{app.progress}%</div>
                    </div>
                    {app.notes && <div className="mt-2 text-sm text-gray-600">Notes: {app.notes}</div>}
                  </div>
                </div>

                <div className="flex-shrink-0 flex items-center gap-2">
                  {/* Inline small badge for mobile */}
                  <div className="md:hidden">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${badgeClass(app.status)}`}>{app.status}</span>
                  </div>

                  <button
                    onClick={() => advanceStatus(app)}
                    className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition text-sm"
                    title="Advance status"
                  >
                    Advance
                  </button>

                  <button
                    onClick={() => openEdit(app)}
                    className="px-3 py-2 bg-gray-100 rounded hover:bg-gray-200 transition text-sm"
                    title="Edit"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deleteApplication(app.id)}
                    className="px-3 py-2 bg-red-50 text-red-700 rounded hover:bg-red-100 transition text-sm"
                    title="Delete"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Simple modal (no external dependencies) */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowModal(false)} />

          <div className="relative bg-white rounded-lg w-full max-w-2xl p-6 shadow-lg z-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">{editingApp ? "Edit Application" : "Add Application"}</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">✕</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-gray-700 mb-1">Role</label>
                <input className="w-full border rounded px-3 py-2" value={role} onChange={(e) => setRole(e.target.value)} />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">Company</label>
                <input className="w-full border rounded px-3 py-2" value={company} onChange={(e) => setCompany(e.target.value)} />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">Status</label>
                <select className="w-full border rounded px-3 py-2" value={status} onChange={(e) => setStatus(e.target.value as AppStatus)}>
                  <option>Application Sent</option>
                  <option>Under Review</option>
                  <option>Interview Scheduled</option>
                  <option>Offer Received</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">Applied date</label>
                <input type="date" className="w-full border rounded px-3 py-2" value={appliedDate} onChange={(e) => setAppliedDate(e.target.value)} />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm text-gray-700 mb-1">Progress (%)</label>
                <input type="number" min={0} max={100} className="w-full border rounded px-3 py-2" value={progress} onChange={(e) => setProgress(Number(e.target.value))} />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm text-gray-700 mb-1">Notes (optional)</label>
                <textarea className="w-full border rounded px-3 py-2" rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} />
              </div>
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 rounded border hover:bg-gray-50">Cancel</button>
              <button onClick={saveApplication} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                {editingApp ? "Save Changes" : "Add Application"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
