
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Upload, Plus, Calendar as CalendarEventIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

const WorkshopForm = () => {
  const [formData, setFormData] = useState({
    eventName: '',
    organizer: '',
    fromDate: undefined as Date | undefined,
    toDate: undefined as Date | undefined,
    certificate: null as File | null
  });

  const [workshops, setWorkshops] = useState([
    {
      id: 1,
      name: "International Conference on AI in Education",
      organizer: "IEEE Computer Society",
      duration: "March 15-17, 2024",
      type: "Conference"
    },
    {
      id: 2,
      name: "Workshop on Deep Learning Fundamentals",
      organizer: "Indian Statistical Institute",
      duration: "February 20-22, 2024",
      type: "Workshop"
    }
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.eventName || !formData.organizer) {
      toast({
        title: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    const newWorkshop = {
      id: workshops.length + 1,
      name: formData.eventName,
      organizer: formData.organizer,
      duration: formData.fromDate && formData.toDate 
        ? `${format(formData.fromDate, "MMM dd")}-${format(formData.toDate, "dd, yyyy")}`
        : "TBD",
      type: formData.eventName.toLowerCase().includes('conference') ? "Conference" : "Workshop"
    };

    setWorkshops([newWorkshop, ...workshops]);
    setFormData({
      eventName: '',
      organizer: '',
      fromDate: undefined,
      toDate: undefined,
      certificate: null
    });

    toast({
      title: "Event Added",
      description: "Your workshop/conference attendance has been saved successfully.",
    });
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
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Workshops & Conferences</h2>
        <p className="text-gray-600">Track your professional development events</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Plus className="h-5 w-5" />
              <span>Add Event Attendance</span>
            </CardTitle>
            <CardDescription>
              Enter details of workshops or conferences attended
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="eventName">Name of Event *</Label>
                <Input
                  id="eventName"
                  value={formData.eventName}
                  onChange={(e) => setFormData({ ...formData, eventName: e.target.value })}
                  placeholder="Enter workshop or conference name"
                  required
                />
              </div>

              <div>
                <Label htmlFor="organizer">Organizer *</Label>
                <Input
                  id="organizer"
                  value={formData.organizer}
                  onChange={(e) => setFormData({ ...formData, organizer: e.target.value })}
                  placeholder="Enter organizing institution/body"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>From Date</Label>
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
                  <Label>To Date</Label>
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
                <Label htmlFor="certificate">Upload Participation Certificate</Label>
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

              <Button type="submit" className="w-full">
                Add Event
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Workshops List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CalendarEventIcon className="h-5 w-5" />
              <span>Events Attended</span>
            </CardTitle>
            <CardDescription>
              View your workshop and conference attendance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {workshops.map((workshop) => (
                <div key={workshop.id} className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-start justify-between">
                    <h4 className="font-medium text-gray-900">{workshop.name}</h4>
                    <span className={cn(
                      "px-2 py-1 text-xs rounded-full",
                      workshop.type === "Conference" ? "bg-purple-100 text-purple-800" : "bg-blue-100 text-blue-800"
                    )}>
                      {workshop.type}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{workshop.organizer}</p>
                  <p className="text-xs text-gray-500">Duration: {workshop.duration}</p>
                </div>
              ))}
              {workshops.length === 0 && (
                <p className="text-center text-gray-500 py-8">No events added yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WorkshopForm;
