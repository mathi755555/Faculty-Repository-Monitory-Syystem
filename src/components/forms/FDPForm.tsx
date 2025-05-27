
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Upload, Plus, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface FDPCertification {
  id: string;
  title: string;
  organizer: string;
  duration_from: string;
  duration_to: string;
  certificate_url: string | null;
  created_at: string;
}

const FDPForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    organizer: '',
    fromDate: undefined as Date | undefined,
    toDate: undefined as Date | undefined,
    description: '',
    certificate: null as File | null
  });

  const [fdpCertifications, setFdpCertifications] = useState<FDPCertification[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchFDPCertifications();
  }, []);

  const fetchFDPCertifications = async () => {
    try {
      const { data, error } = await supabase
        .from('fdp_certifications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFdpCertifications(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching FDP certifications",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.organizer || !formData.fromDate || !formData.toDate) {
      toast({
        title: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      let certificateUrl = null;

      // Upload certificate if provided
      if (formData.certificate) {
        const fileExt = formData.certificate.name.split('.').pop();
        const fileName = `${user.id}/fdp/${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('academic-files')
          .upload(fileName, formData.certificate);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('academic-files')
          .getPublicUrl(fileName);

        certificateUrl = publicUrl;
      }

      const { error } = await supabase
        .from('fdp_certifications')
        .insert({
          user_id: user.id,
          title: formData.title,
          organizer: formData.organizer,
          duration_from: format(formData.fromDate, "yyyy-MM-dd"),
          duration_to: format(formData.toDate, "yyyy-MM-dd"),
          certificate_url: certificateUrl
        });

      if (error) throw error;

      setFormData({
        title: '',
        organizer: '',
        fromDate: undefined,
        toDate: undefined,
        description: '',
        certificate: null
      });

      await fetchFDPCertifications();

      toast({
        title: "FDP Certification Added",
        description: "Your certification has been saved successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error adding FDP certification",
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
      setFormData({ ...formData, certificate: file });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">FDP Certifications</h2>
        <p className="text-gray-600">Manage your Faculty Development Program certifications</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Plus className="h-5 w-5" />
              <span>Add New FDP Certification</span>
            </CardTitle>
            <CardDescription>
              Enter details of your faculty development program
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">FDP Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter FDP title"
                  required
                />
              </div>

              <div>
                <Label htmlFor="organizer">Organizer *</Label>
                <Input
                  id="organizer"
                  value={formData.organizer}
                  onChange={(e) => setFormData({ ...formData, organizer: e.target.value })}
                  placeholder="Enter organizing institution"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>From Date *</Label>
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
                  <Label>To Date *</Label>
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
                <Label htmlFor="certificate">Upload Certificate (PDF)</Label>
                <div className="mt-1 flex items-center space-x-2">
                  <Input
                    id="certificate"
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('certificate')?.click()}
                    className="flex items-center space-x-2"
                  >
                    <Upload className="h-4 w-4" />
                    <span>Choose File</span>
                  </Button>
                  {formData.certificate && (
                    <span className="text-sm text-gray-600">{formData.certificate.name}</span>
                  )}
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Adding..." : "Add FDP Certification"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* FDP List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Your FDP Certifications</span>
            </CardTitle>
            <CardDescription>
              View and manage your submitted certifications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {fdpCertifications.map((fdp) => (
                <div key={fdp.id} className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-start justify-between">
                    <h4 className="font-medium text-gray-900">{fdp.title}</h4>
                    <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                      Completed
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{fdp.organizer}</p>
                  <p className="text-xs text-gray-500">
                    {format(new Date(fdp.duration_from), "MMM dd, yyyy")} - {format(new Date(fdp.duration_to), "MMM dd, yyyy")}
                  </p>
                  {fdp.certificate_url && (
                    <a
                      href={fdp.certificate_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:text-blue-800"
                    >
                      View Certificate
                    </a>
                  )}
                </div>
              ))}
              {fdpCertifications.length === 0 && (
                <p className="text-center text-gray-500 py-8">No FDP certifications added yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FDPForm;
