
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Upload, Plus, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Publication {
  id: string;
  journal_conference_name: string;
  paper_title: string;
  doi: string | null;
  paper_number: string | null;
  index_type: 'SCI' | 'Scopus' | 'Website Only';
  publication_url: string | null;
  created_at: string;
}

const PublicationForm = () => {
  const [formData, setFormData] = useState({
    journalName: '',
    paperTitle: '',
    doi: '',
    paperNumber: '',
    indexType: '',
    pdf: null as File | null
  });

  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPublications();
  }, []);

  const fetchPublications = async () => {
    try {
      const { data, error } = await supabase
        .from('publications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPublications(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching publications",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.journalName || !formData.paperTitle || !formData.indexType) {
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

      let publicationUrl = null;

      // Upload PDF if provided
      if (formData.pdf) {
        const fileExt = formData.pdf.name.split('.').pop();
        const fileName = `${user.id}/publications/${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('academic-files')
          .upload(fileName, formData.pdf);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('academic-files')
          .getPublicUrl(fileName);

        publicationUrl = publicUrl;
      }

      const { error } = await supabase
        .from('publications')
        .insert({
          user_id: user.id,
          journal_conference_name: formData.journalName,
          paper_title: formData.paperTitle,
          doi: formData.doi || null,
          paper_number: formData.paperNumber || null,
          index_type: formData.indexType as 'SCI' | 'Scopus' | 'Website Only',
          publication_url: publicationUrl
        });

      if (error) throw error;

      setFormData({
        journalName: '',
        paperTitle: '',
        doi: '',
        paperNumber: '',
        indexType: '',
        pdf: null
      });

      await fetchPublications();

      toast({
        title: "Publication Added",
        description: "Your research publication has been saved successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error adding publication",
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
      setFormData({ ...formData, pdf: file });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Research Publications</h2>
        <p className="text-gray-600">Manage your research papers and publications</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Plus className="h-5 w-5" />
              <span>Add New Publication</span>
            </CardTitle>
            <CardDescription>
              Enter details of your research publication
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="journalName">Journal/Conference Name *</Label>
                <Input
                  id="journalName"
                  value={formData.journalName}
                  onChange={(e) => setFormData({ ...formData, journalName: e.target.value })}
                  placeholder="Enter journal or conference name"
                  required
                />
              </div>

              <div>
                <Label htmlFor="paperTitle">Paper Title *</Label>
                <Input
                  id="paperTitle"
                  value={formData.paperTitle}
                  onChange={(e) => setFormData({ ...formData, paperTitle: e.target.value })}
                  placeholder="Enter paper title"
                  required
                />
              </div>

              <div>
                <Label htmlFor="doi">DOI</Label>
                <Input
                  id="doi"
                  value={formData.doi}
                  onChange={(e) => setFormData({ ...formData, doi: e.target.value })}
                  placeholder="Enter DOI if available"
                />
              </div>

              <div>
                <Label htmlFor="paperNumber">Paper Number</Label>
                <Input
                  id="paperNumber"
                  value={formData.paperNumber}
                  onChange={(e) => setFormData({ ...formData, paperNumber: e.target.value })}
                  placeholder="Enter paper number if available"
                />
              </div>

              <div>
                <Label htmlFor="indexType">Index Type *</Label>
                <Select value={formData.indexType} onValueChange={(value) => setFormData({ ...formData, indexType: value })}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select index type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SCI">SCI</SelectItem>
                    <SelectItem value="Scopus">Scopus</SelectItem>
                    <SelectItem value="Website Only">Website Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="pdf">Upload Publication (PDF)</Label>
                <div className="mt-1 flex items-center space-x-2">
                  <Input
                    id="pdf"
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('pdf')?.click()}
                    className="flex items-center space-x-2"
                  >
                    <Upload className="h-4 w-4" />
                    <span>Choose File</span>
                  </Button>
                  {formData.pdf && (
                    <span className="text-sm text-gray-600">{formData.pdf.name}</span>
                  )}
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Adding..." : "Add Publication"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Publications List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Your Publications</span>
            </CardTitle>
            <CardDescription>
              View and manage your research publications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {publications.map((publication) => (
                <div key={publication.id} className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-start justify-between">
                    <h4 className="font-medium text-gray-900">{publication.paper_title}</h4>
                    <span className={cn(
                      "px-2 py-1 text-xs rounded-full",
                      publication.index_type === "SCI" ? "bg-green-100 text-green-800" :
                      publication.index_type === "Scopus" ? "bg-blue-100 text-blue-800" :
                      "bg-gray-100 text-gray-800"
                    )}>
                      {publication.index_type}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{publication.journal_conference_name}</p>
                  {publication.doi && (
                    <p className="text-xs text-gray-500">DOI: {publication.doi}</p>
                  )}
                  <p className="text-xs text-gray-500">
                    Published: {format(new Date(publication.created_at), "MMM dd, yyyy")}
                  </p>
                  {publication.publication_url && (
                    <a
                      href={publication.publication_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:text-blue-800"
                    >
                      View Publication
                    </a>
                  )}
                </div>
              ))}
              {publications.length === 0 && (
                <p className="text-center text-gray-500 py-8">No publications added yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PublicationForm;
