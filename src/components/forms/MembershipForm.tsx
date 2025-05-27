
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Upload, Plus, UserCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Membership {
  id: string;
  professional_body_name: string;
  membership_id: string;
  expiry_date: string | null;
  certificate_url: string | null;
}

const MembershipForm = () => {
  const [formData, setFormData] = useState({
    bodyName: '',
    membershipId: '',
    expiryDate: undefined as Date | undefined,
    certificate: null as File | null
  });

  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMemberships();
  }, []);

  const fetchMemberships = async () => {
    try {
      const { data, error } = await supabase
        .from('memberships')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMemberships(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching memberships",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.bodyName || !formData.membershipId) {
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
        const fileName = `${user.id}/memberships/${Date.now()}.${fileExt}`;
        
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
        .from('memberships')
        .insert({
          user_id: user.id,
          professional_body_name: formData.bodyName,
          membership_id: formData.membershipId,
          expiry_date: formData.expiryDate?.toISOString().split('T')[0] || null,
          certificate_url: certificateUrl
        });

      if (error) throw error;

      setFormData({
        bodyName: '',
        membershipId: '',
        expiryDate: undefined,
        certificate: null
      });

      await fetchMemberships();

      toast({
        title: "Membership Added",
        description: "Your professional membership has been saved successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error adding membership",
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

  const getStatusColor = (expiryDate: string | null) => {
    if (!expiryDate) return "bg-gray-100 text-gray-800";
    const expiry = new Date(expiryDate);
    const now = new Date();
    return expiry > now ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
  };

  const getStatus = (expiryDate: string | null) => {
    if (!expiryDate) return "No Expiry";
    const expiry = new Date(expiryDate);
    const now = new Date();
    return expiry > now ? "Active" : "Expired";
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Professional Memberships</h2>
        <p className="text-gray-600">Manage your professional body memberships</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Plus className="h-5 w-5" />
              <span>Add New Membership</span>
            </CardTitle>
            <CardDescription>
              Enter details of your professional membership
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="bodyName">Professional Body Name *</Label>
                <Input
                  id="bodyName"
                  value={formData.bodyName}
                  onChange={(e) => setFormData({ ...formData, bodyName: e.target.value })}
                  placeholder="e.g., IEEE, ACM, Computer Society of India"
                  required
                />
              </div>

              <div>
                <Label htmlFor="membershipId">Membership ID *</Label>
                <Input
                  id="membershipId"
                  value={formData.membershipId}
                  onChange={(e) => setFormData({ ...formData, membershipId: e.target.value })}
                  placeholder="Enter your membership ID"
                  required
                />
              </div>

              <div>
                <Label>Expiry Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal mt-1",
                        !formData.expiryDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.expiryDate ? format(formData.expiryDate, "PPP") : "Select expiry date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.expiryDate}
                      onSelect={(date) => setFormData({ ...formData, expiryDate: date })}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label htmlFor="certificate">Upload Membership Certificate</Label>
                <div className="mt-1 flex items-center space-x-2">
                  <Input
                    id="certificate"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
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
                {loading ? "Adding..." : "Add Membership"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Memberships List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <UserCheck className="h-5 w-5" />
              <span>Your Memberships</span>
            </CardTitle>
            <CardDescription>
              View and manage your professional memberships
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {memberships.map((membership) => (
                <div key={membership.id} className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-start justify-between">
                    <h4 className="font-medium text-gray-900">{membership.professional_body_name}</h4>
                    <span className={cn(
                      "px-2 py-1 text-xs rounded-full",
                      getStatusColor(membership.expiry_date)
                    )}>
                      {getStatus(membership.expiry_date)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">ID: {membership.membership_id}</p>
                  {membership.expiry_date && (
                    <p className="text-xs text-gray-500">
                      Expires: {format(new Date(membership.expiry_date), "PPP")}
                    </p>
                  )}
                  {membership.certificate_url && (
                    <a
                      href={membership.certificate_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:text-blue-800"
                    >
                      View Certificate
                    </a>
                  )}
                </div>
              ))}
              {memberships.length === 0 && (
                <p className="text-center text-gray-500 py-8">No memberships added yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MembershipForm;
