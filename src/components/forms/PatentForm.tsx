import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Plus, Award } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

interface Patent {
  id: string;
  title: string;
  status: 'Filed' | 'Granted';
  document_url: string | null;
  created_at: string;
}

const PatentForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    status: '',
    description: '',
    applicationNumber: '',
    documents: null as File | null
  });

  const [patents, setPatents] = useState<Patent[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    checkAuthAndFetchPatents();
  }, []);

  const checkAuthAndFetchPatents = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      console.log("Session:", session, "Error:", error);
      const user = session?.user;
      if (!user) {
        setCurrentUser(null);
        setPatents([]);
        return;
      }
      setCurrentUser(user);
      await fetchPatents(user.id);
    } catch (error) {
      setCurrentUser(null);
      setPatents([]);
    }
  };

  const fetchPatents = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('patents')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPatents(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching patents",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.status) {
      toast({
        title: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      if (!currentUser) throw new Error('User not authenticated');

      let documentUrl = null;

      // Upload document if provided
      if (formData.documents) {
        const fileExt = formData.documents.name.split('.').pop();
        const fileName = `${currentUser.id}/patents/${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('academic-files')
          .upload(fileName, formData.documents);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('academic-files')
          .getPublicUrl(fileName);

        documentUrl = publicUrl;
      }

      const { error } = await supabase
        .from('patents')
        .insert({
          user_id: currentUser.id,
          title: formData.title,
          status: formData.status as 'Filed' | 'Granted',
          document_url: documentUrl
        });

      if (error) throw error;

      setFormData({
        title: '',
        status: '',
        description: '',
        applicationNumber: '',
        documents: null
      });

      await fetchPatents(currentUser.id);

      toast({
        title: "Patent Added",
        description: "Your patent/design filing has been saved successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error adding patent",
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
      setFormData({ ...formData, documents: file });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Patents & Design Filing</h2>
        <p className="text-gray-600">Manage your intellectual property filings</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Plus className="h-5 w-5" />
              <span>Add New Patent/Design</span>
            </CardTitle>
            <CardDescription>
              Enter details of your patent or design filing
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Patent/Design Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter patent or design title"
                  required
                />
              </div>

              <div>
                <Label htmlFor="status">Status *</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Filed">Filed</SelectItem>
                    <SelectItem value="Granted">Granted</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="applicationNumber">Application Number</Label>
                <Input
                  id="applicationNumber"
                  value={formData.applicationNumber}
                  onChange={(e) => setFormData({ ...formData, applicationNumber: e.target.value })}
                  placeholder="Enter application number (if available)"
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of the patent/design"
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="documents">Upload Supporting Documents</Label>
                <div className="mt-1 flex items-center space-x-2">
                  <Input
                    id="documents"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('documents')?.click()}
                    className="flex items-center space-x-2"
                  >
                    <Upload className="h-4 w-4" />
                    <span>Choose File</span>
                  </Button>
                  {formData.documents && (
                    <span className="text-sm text-gray-600">{formData.documents.name}</span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Upload grant certificate, application, or related documents
                </p>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Adding..." : "Add Patent/Design"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Patents List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Award className="h-5 w-5" />
              <span>Your Patents & Designs</span>
            </CardTitle>
            <CardDescription>
              View and manage your intellectual property
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {patents.map((patent) => (
                <div key={patent.id} className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-start justify-between">
                    <h4 className="font-medium text-gray-900">{patent.title}</h4>
                    <span className={cn(
                      "px-2 py-1 text-xs rounded-full",
                      patent.status === "Granted" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
                    )}>
                      {patent.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    Added: {new Date(patent.created_at).toLocaleDateString()}
                  </p>
                  {patent.document_url && (
                    <a
                      href={patent.document_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:text-blue-800"
                    >
                      View Document
                    </a>
                  )}
                </div>
              ))}
              {patents.length === 0 && (
                <p className="text-center text-gray-500 py-8">No patents/designs added yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PatentForm;
