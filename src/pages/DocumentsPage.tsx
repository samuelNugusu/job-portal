import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, File, ImageIcon, Upload, Download, Eye, Trash2, Search, Plus } from "lucide-react"
import { toast } from "sonner"

interface Document {
  id: string
  name: string
  type: "resume" | "cover-letter" | "certificate" | "portfolio" | "other"
  size: string
  uploadDate: string
  lastModified: string
  status: "active" | "draft" | "archived"
  file?: File
}

// Ethiopian sample documents
const defaultDocuments: Document[] = [
  {
    id: "1",
    name: "Abel_Birhanu_Resume.pdf",
    type: "resume",
    size: "1.5 MB",
    uploadDate: "2025-01-20",
    lastModified: "2025-01-20",
    status: "active",
  },
  {
    id: "2",
    name: "Cover_Letter_Abel_Birhanu.pdf",
    type: "cover-letter",
    size: "0.9 MB",
    uploadDate: "2025-01-18",
    lastModified: "2025-01-18",
    status: "active",
  },
  {
    id: "3",
    name: "Ethiopian_UX_Certificate.pdf",
    type: "certificate",
    size: "2.2 MB",
    uploadDate: "2024-12-10",
    lastModified: "2024-12-10",
    status: "active",
  },
  {
    id: "4",
    name: "Portfolio_Abel_2025.pdf",
    type: "portfolio",
    size: "12 MB",
    uploadDate: "2025-01-05",
    lastModified: "2025-01-19",
    status: "active",
  },
  {
    id: "5",
    name: "Draft_Resume_v2.pdf",
    type: "resume",
    size: "1.3 MB",
    uploadDate: "2025-01-22",
    lastModified: "2025-01-22",
    status: "draft",
  },
]

// Document icons
const getDocumentIcon = (type: string) => {
  switch (type) {
    case "resume":
      return <FileText className="w-8 h-8 text-blue-600" />
    case "cover-letter":
      return <File className="w-8 h-8 text-green-600" />
    case "certificate":
      return <FileText className="w-8 h-8 text-purple-600" />
    case "portfolio":
      return <ImageIcon className="w-8 h-8 text-orange-600" />
    default:
      return <File className="w-8 h-8 text-gray-600" />
  }
}

// Status badge colors
const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-800"
    case "draft":
      return "bg-yellow-100 text-yellow-800"
    case "archived":
      return "bg-gray-100 text-gray-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>(defaultDocuments)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  // Upload new documents
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    const files = Array.from(e.target.files)
    const newDocs = files.map((file) => ({
      id: Date.now().toString() + Math.random(),
      name: file.name,
      type: "other" as const,
      size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
      uploadDate: new Date().toISOString(),
      lastModified: new Date(file.lastModified).toISOString(),
      status: "active" as const,
      file,
    }))
    setDocuments((prev) => [...newDocs, ...prev])
    toast.success(`${files.length} file(s) uploaded successfully!`)
    e.target.value = ""
  }

  const handleDownload = (doc: Document) => {
    if (!doc.file) return toast.error("File not available")
    const url = URL.createObjectURL(doc.file)
    const a = document.createElement("a")
    a.href = url
    a.download = doc.name
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleView = (doc: Document) => {
    if (!doc.file) return toast.error("File not available")
    const url = URL.createObjectURL(doc.file)
    window.open(url, "_blank")
  }

  const handleDelete = (id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id))
    toast.success("Document deleted successfully")
  }

  // Filter documents
  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTab = activeTab === "all" || doc.type === activeTab
    return matchesSearch && matchesTab
  })

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">Ethiopian Sample Documents</h1>
      <p className="text-gray-600 mb-6">Manage your resumes, cover letters, and portfolios</p>

      {/* Search & Upload */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search documents..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <label className="cursor-pointer">
          <input type="file" multiple className="hidden" onChange={handleUpload} />
          <Button className="inline-flex items-center">
            <Upload className="w-4 h-4 mr-2" />
            Upload Document
          </Button>
        </label>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="resume">Resumes</TabsTrigger>
          <TabsTrigger value="cover-letter">Cover Letters</TabsTrigger>
          <TabsTrigger value="certificate">Certificates</TabsTrigger>
          <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
          <TabsTrigger value="other">Other</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDocuments.length === 0 && (
              <p className="text-center col-span-full text-gray-500 py-10">No documents found</p>
            )}
            {filteredDocuments.map((doc) => (
              <Card key={doc.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    {getDocumentIcon(doc.type)}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 truncate">{doc.name}</h3>
                      <div className="mt-1 flex items-center space-x-2">
                        <Badge variant="outline" className="text-xs">
                          {doc.type.replace("-", " ")}
                        </Badge>
                        <Badge className={`text-xs ${getStatusColor(doc.status)}`}>{doc.status}</Badge>
                      </div>
                      <div className="mt-2 text-xs text-gray-500">
                        <p>Size: {doc.size}</p>
                        <p>Modified: {new Date(doc.lastModified).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleView(doc)} className="flex-1">
                      <Eye className="w-3 h-3 mr-1" /> View
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDownload(doc)} className="flex-1">
                      <Download className="w-3 h-3 mr-1" /> Download
                    </Button>
                  </div>

                  <div className="mt-2 flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(doc.id)}
                      className="flex-1 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-3 h-3 mr-1" /> Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
