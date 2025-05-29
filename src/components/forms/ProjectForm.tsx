import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Upload, Plus, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Project {
  id: string;
  title: string;
  funding_agency: string;
  funded_amount: number;
  duration_from: string;
  duration_to: string;
  sanction_letter_url: string | null;
  created_at: string;
  updated_at: string;
}

const ProjectForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    fundingAgency: '',
    amount: '',
    fromDate: undefined as Date | undefined,
    toDate: undefined as Date | undefined,
    description: '',
    sanctionLetter: null as File | null
  });

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    checkAuthAndFetchData();
  }, []);

  const checkAuthAndFetchData = async () => {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        setCurrentUser(null);
        return;
      }
      setCurrentUser(user);
      await fetchProjects(user.id);
    } catch (error) {
      setCurrentUser(null);
    }
  };

  const fetchProjects = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching projects",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.fundingAgency || !formData.amount) {
      toast({
        title: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);

      let sanctionLetterUrl = null;
      if (formData.sanctionLetter && currentUser) {
        const fileExt = formData.sanctionLetter.name.split('.').pop();
        const fileName = `${currentUser.id}/projects/${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('academic-files')
          .upload(fileName, formData.sanctionLetter);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('academic-files')
          .getPublicUrl(fileName);

        sanctionLetterUrl = publicUrl;
      }

      const { error } = await supabase
        .from('projects')
        .insert({
          user_id: currentUser.id,
          title: formData.title,
          funding_agency: formData.fundingAgency,
          funded_amount: parseFloat(formData.amount),
          duration_from: formData.fromDate ? formData.fromDate.toISOString() : null,
          duration_to: formData.toDate ? formData.toDate.toISOString() : null,
          sanction_letter_url: sanctionLetterUrl,
        });

      if (error) throw error;

      toast({
        title: "Project Added",
        description: "Your funded project has been saved successfully.",
      });

      setFormData({
        title: '',
        fundingAgency: '',
        amount: '',
        fromDate: undefined,
        toDate: undefined,
        description: '',
        sanctionLetter: null
      });

      fetchProjects(currentUser.id);
    } catch (error: any) {
      toast({
        title: "Error adding project",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, sanctionLetter: file });
    }
  };

  if (!currentUser) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <p className="text-gray-500">Loading your projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Funded Projects & Consultancy</h2>
        <p className="text-gray-600">Manage your research projects and consultancy work</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Plus className="h-5 w-5" />
              <span>Add New Project</span>
            </CardTitle>
            <CardDescription>
              Enter details of your funded project or consultancy
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Project Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter project title"
                  required
                />
              </div>

              <div>
                <Label htmlFor="fundingAgency">Funding Agency *</Label>
                <Input
                  id="fundingAgency"
                  value={formData.fundingAgency}
                  onChange={(e) => setFormData({ ...formData, fundingAgency: e.target.value })}
                  placeholder="Enter funding agency name"
                  required
                />
              </div>

              <div>
                <Label htmlFor="amount">Funded Amount *</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                  <Input
                    id="amount"
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    placeholder="Enter amount"
                    className="pl-8"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Start Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal mt-1",
                          !formData.fromDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.fromDate ? format(formData.fromDate, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={formData.fromDate}
                        onSelect={(date) => setFormData({ ...formData, fromDate: date })}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <Label>End Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal mt-1",
                          !formData.toDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.toDate ? format(formData.toDate, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={formData.toDate}
                        onSelect={(date) => setFormData({ ...formData, toDate: date })}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Project Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of the project"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="sanctionLetter">Upload Sanction Letter</Label>
                <div className="mt-1 flex items-center space-x-2">
                  <Input
                    id="sanctionLetter"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('sanctionLetter')?.click()}
                    className="flex items-center space-x-2"
                  >
                    <Upload className="h-4 w-4" />
                    <span>Choose File</span>
                  </Button>
                  {formData.sanctionLetter && (
                    <span className="text-sm text-gray-600">{formData.sanctionLetter.name}</span>
                  )}
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Adding Project..." : "Add Project"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Projects List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Briefcase className="h-5 w-5" />
              <span>Your Projects</span>
            </CardTitle>
            <CardDescription>
              View and manage your funded projects
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {projects.map((project) => (
                <div key={project.id} className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-start justify-between">
                    <h4 className="font-medium text-gray-900">{project.title}</h4>
                    <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                      {project.funded_amount ? "Funded" : "Pending"}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{project.funding_agency}</p>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Amount: ₹{project.funded_amount?.toLocaleString()}</span>
                    <span>
                      Duration: {format(new Date(project.duration_from), "yyyy")} - {format(new Date(project.duration_to), "yyyy")}
                    </span>
                  </div>
                  {project.sanction_letter_url && (
                    <a
                      href={project.sanction_letter_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:text-blue-800"
                    >
                      View Sanction Letter
                    </a>
                  )}
                </div>
              ))}
              {projects.length === 0 && (
                <p className="text-center text-gray-500 py-8">No projects added yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProjectForm;
