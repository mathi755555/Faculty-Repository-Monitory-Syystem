import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { Send, UserCheck, Clock, CheckCircle, XCircle } from "lucide-react";

interface FacultyProfile {
  id: string;
  full_name: string;
  department: string;
}

interface FacultyRequest {
  id: string;
  from_faculty_id: string;
  to_faculty_id: string;
  requested_section: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  notes?: string;
  from_faculty: {
    full_name: string;
  };
  to_faculty: {
    full_name: string;
  };
}

const sections = [
  "Projects",
  "Publications",
  "Patents",
  "FDP Certifications",
  "Workshops",
  "Awards"
];

const FacultyRequests = () => {
  const [facultyList, setFacultyList] = useState<FacultyProfile[]>([]);
  const [selectedFaculty, setSelectedFaculty] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [notes, setNotes] = useState("");
  const [requests, setRequests] = useState<FacultyRequest[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCurrentUser();
    fetchFacultyList();
    fetchRequests();
  }, []);

  const fetchCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setCurrentUser(user);
    }
  };

  const fetchFacultyList = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, department')
        .not('id', 'eq', currentUser?.id);

      if (error) throw error;
      setFacultyList(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching faculty list",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const fetchRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('faculty_requests')
        .select(`
          *,
          from_faculty:profiles!faculty_requests_from_faculty_id_fkey(full_name),
          to_faculty:profiles!faculty_requests_to_faculty_id_fkey(full_name)
        `)
        .or(`from_faculty_id.eq.${currentUser?.id},to_faculty_id.eq.${currentUser?.id}`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching requests",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleSendRequest = async () => {
    if (!selectedFaculty || !selectedSection) {
      toast({
        title: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('faculty_requests')
        .insert({
          from_faculty_id: currentUser.id,
          to_faculty_id: selectedFaculty,
          requested_section: selectedSection,
          status: 'pending',
          notes: notes || null
        });

      if (error) throw error;

      toast({
        title: "Request Sent",
        description: "Your request has been sent successfully.",
      });

      setSelectedFaculty("");
      setSelectedSection("");
      setNotes("");
      fetchRequests();
    } catch (error: any) {
      toast({
        title: "Error sending request",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRequestAction = async (requestId: string, status: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('faculty_requests')
        .update({ status })
        .eq('id', requestId);

      if (error) throw error;

      toast({
        title: `Request ${status}`,
        description: `The request has been ${status} successfully.`,
      });

      fetchRequests();
    } catch (error: any) {
      toast({
        title: "Error updating request",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="flex items-center gap-1">
          <Clock className="h-3 w-3" /> Pending
        </Badge>;
      case 'approved':
        return <Badge variant="default" className="bg-green-500 flex items-center gap-1">
          <CheckCircle className="h-3 w-3" /> Approved
        </Badge>;
      case 'rejected':
        return <Badge variant="destructive" className="flex items-center gap-1">
          <XCircle className="h-3 w-3" /> Rejected
        </Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Faculty Requests</h2>
        <p className="text-gray-600">Request and manage access to faculty information</p>
      </div>

      <Tabs defaultValue="new-request" className="space-y-6">
        <TabsList>
          <TabsTrigger value="new-request">New Request</TabsTrigger>
          <TabsTrigger value="incoming">Incoming Requests</TabsTrigger>
          <TabsTrigger value="outgoing">Outgoing Requests</TabsTrigger>
        </TabsList>

        <TabsContent value="new-request">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Send className="h-5 w-5" />
                <span>Send New Request</span>
              </CardTitle>
              <CardDescription>
                Request access to view specific information from other faculty members
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div>
                  <Label htmlFor="faculty">Select Faculty *</Label>
                  <Select value={selectedFaculty} onValueChange={setSelectedFaculty}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose faculty member" />
                    </SelectTrigger>
                    <SelectContent>
                      {facultyList.map((faculty) => (
                        <SelectItem key={faculty.id} value={faculty.id}>
                          {faculty.full_name} - {faculty.department}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="section">Select Section *</Label>
                  <Select value={selectedSection} onValueChange={setSelectedSection}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose section to access" />
                    </SelectTrigger>
                    <SelectContent>
                      {sections.map((section) => (
                        <SelectItem key={section} value={section}>
                          {section}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="notes">Notes (Optional)</Label>
                  <Input
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add any additional notes or reason for the request"
                  />
                </div>

                <Button
                  type="button"
                  onClick={handleSendRequest}
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? "Sending..." : "Send Request"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="incoming">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <UserCheck className="h-5 w-5" />
                <span>Incoming Requests</span>
              </CardTitle>
              <CardDescription>
                Manage requests from other faculty members
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {requests
                  .filter(req => req.to_faculty_id === currentUser?.id)
                  .map((request) => (
                    <div key={request.id} className="border rounded-lg p-4 space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium">From: {request.from_faculty?.full_name}</p>
                          <p className="text-sm text-gray-600">Section: {request.requested_section}</p>
                          {request.notes && (
                            <p className="text-sm text-gray-500 mt-1">Note: {request.notes}</p>
                          )}
                          <p className="text-xs text-gray-500 mt-1">
                            Requested: {format(new Date(request.created_at), "PPP")}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          {getStatusBadge(request.status)}
                          {request.status === 'pending' && (
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="bg-green-50 text-green-600 hover:bg-green-100"
                                onClick={() => handleRequestAction(request.id, 'approved')}
                              >
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="bg-red-50 text-red-600 hover:bg-red-100"
                                onClick={() => handleRequestAction(request.id, 'rejected')}
                              >
                                Reject
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                {requests.filter(req => req.to_faculty_id === currentUser?.id).length === 0 && (
                  <p className="text-center text-gray-500 py-8">No incoming requests</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="outgoing">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Send className="h-5 w-5" />
                <span>Outgoing Requests</span>
              </CardTitle>
              <CardDescription>
                Track your requests to other faculty members
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {requests
                  .filter(req => req.from_faculty_id === currentUser?.id)
                  .map((request) => (
                    <div key={request.id} className="border rounded-lg p-4 space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium">To: {request.to_faculty?.full_name}</p>
                          <p className="text-sm text-gray-600">Section: {request.requested_section}</p>
                          {request.notes && (
                            <p className="text-sm text-gray-500 mt-1">Note: {request.notes}</p>
                          )}
                          <p className="text-xs text-gray-500 mt-1">
                            Requested: {format(new Date(request.created_at), "PPP")}
                          </p>
                        </div>
                        {getStatusBadge(request.status)}
                      </div>
                    </div>
                  ))}
                {requests.filter(req => req.from_faculty_id === currentUser?.id).length === 0 && (
                  <p className="text-center text-gray-500 py-8">No outgoing requests</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FacultyRequests;