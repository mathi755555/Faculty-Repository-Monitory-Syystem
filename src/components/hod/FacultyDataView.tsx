import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  FileText, 
  User,
  Calendar,
  Award,
  Briefcase,
  GraduationCap
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface Publication {
  id: string;
  journal_conference_name: string;
  paper_title: string;
  index_type: string;
  created_at: string;
  profiles: {
    full_name: string;
  };
}

interface FDP {
  id: string;
  title: string;
  organizer: string;
  duration_from: string;
  duration_to: string;
  profiles: {
    full_name: string;
  };
}

interface Project {
  id: string;
  title: string;
  funding_agency: string;
  funded_amount: number;
  duration_from: string;
  duration_to: string;
  profiles: {
    full_name: string;
  };
}

interface AwardData {
  id: string;
  title: string;
  issuing_body: string;
  date_awarded: string;
  profiles: {
    full_name: string;
  };
}

const FacultyDataView = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFaculty, setSelectedFaculty] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [dateRange, setDateRange] = useState("");

  const [publications, setPublications] = useState<Publication[]>([]);
  const [fdpData, setFdpData] = useState<FDP[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [awards, setAwards] = useState<AwardData[]>([]);
  const [facultyMembers, setFacultyMembers] = useState<string[]>([]);

  useEffect(() => {
    fetchAllData();
    fetchFacultyMembers();
  }, []);
  
  const fetchFacultyMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('full_name')
        .not('full_name', 'is', null);

      if (error) throw error;
      
      const names = data.map(profile => profile.full_name).filter(Boolean);
      setFacultyMembers(['All Faculty', ...names]);
    } catch (error) {
      console.error('Error fetching faculty members:', error);
    }
  };

  const fetchAllData = async () => {
    try {
      // Fetch publications with faculty names
      const { data: pubData, error: pubError } = await supabase
        .from('publications')
        .select(`
          *,
          profiles:user_id (full_name)
        `)
        .order('created_at', { ascending: false });

      if (pubError) throw pubError;
      setPublications(pubData || []);

      // Fetch FDP data with faculty names
      const { data: fdpDataResult, error: fdpError } = await supabase
        .from('fdp_certifications')
        .select(`
          *,
          profiles:user_id (full_name)
        `)
        .order('created_at', { ascending: false });

      if (fdpError) throw fdpError;
      setFdpData(fdpDataResult || []);

      // Fetch projects with faculty names
      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .select(`
          *,
          profiles:user_id (full_name)
        `)
        .order('created_at', { ascending: false });

      if (projectError) throw projectError;
      setProjects(projectData || []);

      // Fetch awards with faculty names
      const { data: awardData, error: awardError } = await supabase
        .from('awards')
        .select(`
          *,
          profiles:user_id (full_name)
        `)
        .order('created_at', { ascending: false });

      if (awardError) throw awardError;
      setAwards(awardData || []);

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const categories = [
    "All Categories",
    "Publications",
    "FDP Certifications",
    "Projects",
    "Awards",
    "Patents",
    "Workshops"
  ];

  // Filter functions
  const filterBySearch = (items: any[], searchFields: string[]) => {
    if (!searchTerm) return items;
    return items.filter(item =>
      searchFields.some(field => 
        item[field]?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  };

  const filterByFaculty = (items: any[]) => {
    if (!selectedFaculty || selectedFaculty === "All Faculty") return items;
    return items.filter(item => item.profiles?.full_name === selectedFaculty);
  };

  // Apply filters
  const filteredPublications = filterByFaculty(filterBySearch(publications, ['paper_title', 'journal_conference_name']));
  const filteredFdp = filterByFaculty(filterBySearch(fdpData, ['title', 'organizer']));
  const filteredProjects = filterByFaculty(filterBySearch(projects, ['title', 'funding_agency']));
  const filteredAwards = filterByFaculty(filterBySearch(awards, ['title', 'issuing_body']));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Faculty Data Overview</h2>
        <p className="text-gray-600">View and analyze all faculty submissions</p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Filter & Search</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search titles, faculty..."
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="faculty">Faculty Member</Label>
              <Select value={selectedFaculty} onValueChange={setSelectedFaculty}>
                <SelectTrigger>
                  <SelectValue placeholder="Select faculty" />
                </SelectTrigger>
                <SelectContent>
                  {facultyMembers.map((faculty) => (
                    <SelectItem key={faculty} value={faculty}>{faculty}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="category">Category</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="dateRange">Date Range</Label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="last30days">Last 30 Days</SelectItem>
                  <SelectItem value="last3months">Last 3 Months</SelectItem>
                  <SelectItem value="last6months">Last 6 Months</SelectItem>
                  <SelectItem value="lastyear">Last Year</SelectItem>
                  <SelectItem value="all">All Time</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-between items-center mt-4">
            <Button variant="outline" className="flex items-center space-x-2">
              <Download className="h-4 w-4" />
              <span>Export Filtered Data</span>
            </Button>
            <Button 
              variant="outline"
              onClick={() => {
                setSearchTerm("");
                setSelectedFaculty("");
                setSelectedCategory("");
                setDateRange("");
              }}
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Data Tables */}
      <Tabs defaultValue="publications" className="space-y-4">
        <TabsList className="grid grid-cols-4 w-full max-w-md">
          <TabsTrigger value="publications">Publications</TabsTrigger>
          <TabsTrigger value="fdp">FDP</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="awards">Awards</TabsTrigger>
        </TabsList>

        <TabsContent value="publications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>Research Publications</span>
                </div>
                <Badge variant="secondary">{filteredPublications.length} entries</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredPublications.map((pub) => (
                  <div key={pub.id} className="border rounded-lg p-4 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">{pub.paper_title}</h4>
                        <p className="text-sm text-gray-600">{pub.journal_conference_name}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <User className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{pub.profiles?.full_name || 'Unknown Faculty'}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={pub.index_type === "SCI" ? "default" : "secondary"}>
                          {pub.index_type}
                        </Badge>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">
                      Added: {format(new Date(pub.created_at), "MMM dd, yyyy")}
                    </p>
                  </div>
                ))}
                {filteredPublications.length === 0 && (
                  <p className="text-center text-gray-500 py-8">No publications found</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent> 
        <TabsContent value="fdp">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Briefcase className="h-5 w-5" />
                  <span>Funded Projects</span>
                </div>
                <Badge variant="secondary">{filteredProjects.length} entries</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredProjects.map((project) => (
                  <div key={project.id} className="border rounded-lg p-4 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">{project.title}</h4>
                        <p className="text-sm text-gray-600">{project.funding_agency}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <User className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{project.profiles?.full_name || 'Unknown Faculty'}</span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Amount: ₹{project.funded_amount?.toLocaleString()}</span>
                      <span>
                        Duration: {format(new Date(project.duration_from), "yyyy")} - {format(new Date(project.duration_to), "yyyy")}
                      </span>
                    </div>
                  </div>
                ))}
                {filteredProjects.length === 0 && (
                  <p className="text-center text-gray-500 py-8">No projects found</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="projects">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Briefcase className="h-5 w-5" />
                  <span>Funded Projects</span>
                </div>
                <Badge variant="secondary">{filteredProjects.length} entries</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredProjects.map((project) => (
                  <div key={project.id} className="border rounded-lg p-4 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">{project.title}</h4>
                        <p className="text-sm text-gray-600">{project.funding_agency}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <User className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{project.profiles?.full_name || 'Unknown Faculty'}</span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Amount: ₹{project.funded_amount?.toLocaleString()}</span>
                      <span>
                        Duration: {format(new Date(project.duration_from), "yyyy")} - {format(new Date(project.duration_to), "yyyy")}
                      </span>
                    </div>
                  </div>
                ))}
                {filteredProjects.length === 0 && (
                  <p className="text-center text-gray-500 py-8">No projects found</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="awards">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Award className="h-5 w-5" />
                  <span>Awards & Recognition</span>
                </div>
                <Badge variant="secondary">{filteredAwards.length} entries</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredAwards.map((award) => (
                  <div key={award.id} className="border rounded-lg p-4 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">{award.title}</h4>
                        <p className="text-sm text-gray-600">{award.issuing_body}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <User className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{award.profiles?.full_name || 'Unknown Faculty'}</span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500">
                      Awarded: {format(new Date(award.date_awarded), "MMM dd, yyyy")}
                    </p>
                  </div>
                ))}
                {filteredAwards.length === 0 && (
                  <p className="text-center text-gray-500 py-8">No awards found</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FacultyDataView;
