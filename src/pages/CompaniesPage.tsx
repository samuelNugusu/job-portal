import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Building2, MapPin, Users, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

// List of top companies
const topCompanies = [
  {
    id: 1,
    name: "Google",
    logo: "/google-logo.png",
    industry: "Technology",
    location: "Mountain View, CA, USA",
    employees: "100,000+",
    rating: 4.5,
    openJobs: 1250,
    website: "https://www.google.com",
  },
  {
    id: 2,
    name: "Microsoft",
    logo: "/microsoft-logo.png",
    industry: "Technology",
    location: "Redmond, WA, USA",
    employees: "200,000+",
    rating: 4.4,
    openJobs: 980,
    website: "https://www.microsoft.com",
  },
  {
    id: 3,
    name: "Ethio Telecom",
    logo: "/ethio-logo.png",
    industry: "Telecommunications",
    location: "Addis Ababa, Ethiopia",
    employees: "20,000+",
    rating: 4.2,
    openJobs: 150,
    website: "https://www.ethiotelecom.et",
  },
  {
    id: 4,
    name: "Jumia Ethiopia",
    logo: "/jumia-logo.png",
    industry: "E-commerce",
    location: "Addis Ababa, Ethiopia",
    employees: "500+",
    rating: 4.0,
    openJobs: 50,
    website: "https://www.jumia.com.et",
  },
];

export default function CompaniesPage() {
  const navigate = useNavigate();

  const handleViewJobs = (companyName: string) => {
    // Navigate to home page with query param ?company=CompanyName
    navigate(`/?company=${encodeURIComponent(companyName)}`);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Top Companies</h1>
        <p className="text-gray-600">
          Discover leading companies, both international and Ethiopian, and explore career opportunities.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {topCompanies.map((company) => (
          <Card key={company.id} className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <div className="flex items-start space-x-4">
                <Avatar className="w-16 h-16 rounded-none">
                  <AvatarImage src={company.logo || "/placeholder.svg"} alt={company.name} />
                  <AvatarFallback>{company.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <CardTitle className="text-xl">{company.name}</CardTitle>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500 flex-wrap">
                    <div className="flex items-center">
                      <Building2 className="w-4 h-4 mr-1" />
                      {company.industry}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {company.location}
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 mt-2 flex-wrap">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 mr-1 text-yellow-500" />
                      <span className="text-sm font-medium">{company.rating}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Users className="w-4 h-4 mr-1" />
                      {company.employees} employees
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  {company.openJobs} open jobs
                </Badge>

                <div className="flex flex-col sm:flex-row gap-2">
                  {/* Open external company website in new tab */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(company.website, "_blank")}
                  >
                    Visit Website
                  </Button>

                  {/* View jobs filtered by company */}
                  <Button
                    size="sm"
                    className="sm:!ml-2"
                    onClick={() => handleViewJobs(company.name)}
                  >
                    View Jobs
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
