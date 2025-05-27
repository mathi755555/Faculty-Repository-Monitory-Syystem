
import { useState } from "react";
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

  const [projects, setProjects] = useState([
    {
      id: 1,
      title: "AI-based Educational Platform Development",
      agency: "DST, Government of India",
      amount: "₹15,00,000",
      duration: "2023-2025",
      status: "Active"
    },
    {
      id: 2,
      title: "Machine Learning for Healthcare Analytics",
      agency: "SERB",
      amount: "₹8,50,000",
      duration: "2022-2024",
      status: "Completed"
    }
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.fundingAgency || !formData.amount) {
      toast({
        title: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    const newProject = {
      id: projects.length + 1,
      title: formData.title,
      agency: formData.fundingAgency,
      amount: `₹${formData.amount}`,
      duration: formData.fromDate && formData.toDate 
        ? `${format(formData.fromDate, "yyyy")}-${format(formData.toDate, "yyyy")}`
        : "TBD",
      status: "Active"
    };

    setProjects([newProject, ...projects]);
    setFormData({
      title: '',
      fundingAgency: '',
      amount: '',
      fromDate: undefined,
      toDate: undefined,
      description: '',
      sanctionLetter: null
    });

    toast({
      title: "Project Added",
      description: "Your funded project has been saved successfully.",
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, sanctionLetter: file });
    }
  };

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

              <Button type="submit" className="w-full">
                Add Project
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
                    <span className={cn(
                      "px-2 py-1 text-xs rounded-full",
                      project.status === "Active" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
                    )}>
                      {project.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{project.agency}</p>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Amount: {project.amount}</span>
                    <span>Duration: {project.duration}</span>
                  </div>
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
