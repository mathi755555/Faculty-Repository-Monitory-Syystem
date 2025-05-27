
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Plus, Calendar, Download } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const TimetableForm = () => {
  const [formData, setFormData] = useState({
    course: '',
    courseCode: '',
    semester: '',
    day: '',
    timeSlot: '',
    room: '',
    credits: ''
  });

  const [timetableFile, setTimetableFile] = useState<File | null>(null);
  const [schedule, setSchedule] = useState([
    {
      id: 1,
      course: "Data Structures and Algorithms",
      courseCode: "CS201",
      semester: "3rd Semester",
      day: "Monday",
      timeSlot: "9:00 AM - 10:30 AM",
      room: "CS Lab 1",
      credits: "4"
    },
    {
      id: 2,
      course: "Database Management Systems",
      courseCode: "CS301",
      semester: "5th Semester",
      day: "Tuesday",
      timeSlot: "11:00 AM - 12:30 PM",
      room: "Room 205",
      credits: "3"
    }
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.course || !formData.courseCode || !formData.day || !formData.timeSlot) {
      toast({
        title: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    const newEntry = {
      id: schedule.length + 1,
      course: formData.course,
      courseCode: formData.courseCode,
      semester: formData.semester,
      day: formData.day,
      timeSlot: formData.timeSlot,
      room: formData.room,
      credits: formData.credits
    };

    setSchedule([...schedule, newEntry]);
    setFormData({
      course: '',
      courseCode: '',
      semester: '',
      day: '',
      timeSlot: '',
      room: '',
      credits: ''
    });

    toast({
      title: "Class Added",
      description: "Your class schedule has been updated successfully.",
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setTimetableFile(file);
      toast({
        title: "File Uploaded",
        description: `Timetable file ${file.name} uploaded successfully.`,
      });
    }
  };

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const timeSlots = [
    "8:00 AM - 9:30 AM",
    "9:30 AM - 11:00 AM", 
    "11:15 AM - 12:45 PM",
    "12:45 PM - 2:15 PM",
    "2:15 PM - 3:45 PM",
    "3:45 PM - 5:15 PM"
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Course Timetable</h2>
        <p className="text-gray-600">Manage your teaching schedule for the current semester</p>
      </div>

      {/* File Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Upload className="h-5 w-5" />
            <span>Upload Complete Timetable</span>
          </CardTitle>
          <CardDescription>
            Upload your complete semester timetable as a file
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <Input
              id="timetable-file"
              type="file"
              accept=".pdf,.doc,.docx,.xlsx,.xls"
              onChange={handleFileUpload}
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => document.getElementById('timetable-file')?.click()}
              className="flex items-center space-x-2"
            >
              <Upload className="h-4 w-4" />
              <span>Choose File</span>
            </Button>
            {timetableFile && (
              <span className="text-sm text-gray-600">{timetableFile.name}</span>
            )}
            <Button variant="outline" className="flex items-center space-x-2">
              <Download className="h-4 w-4" />
              <span>Download Template</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Manual Entry Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Plus className="h-5 w-5" />
              <span>Add Class Schedule</span>
            </CardTitle>
            <CardDescription>
              Manually enter individual class details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="course">Course Name *</Label>
                <Input
                  id="course"
                  value={formData.course}
                  onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                  placeholder="Enter course name"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="courseCode">Course Code *</Label>
                  <Input
                    id="courseCode"
                    value={formData.courseCode}
                    onChange={(e) => setFormData({ ...formData, courseCode: e.target.value })}
                    placeholder="e.g., CS201"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="semester">Semester</Label>
                  <Input
                    id="semester"
                    value={formData.semester}
                    onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                    placeholder="e.g., 3rd Semester"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="day">Day *</Label>
                <Select value={formData.day} onValueChange={(value) => setFormData({ ...formData, day: value })}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select day" />
                  </SelectTrigger>
                  <SelectContent>
                    {days.map((day) => (
                      <SelectItem key={day} value={day}>{day}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="timeSlot">Time Slot *</Label>
                <Select value={formData.timeSlot} onValueChange={(value) => setFormData({ ...formData, timeSlot: value })}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select time slot" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((slot) => (
                      <SelectItem key={slot} value={slot}>{slot}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="room">Room/Venue</Label>
                  <Input
                    id="room"
                    value={formData.room}
                    onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                    placeholder="Room number/venue"
                  />
                </div>
                <div>
                  <Label htmlFor="credits">Credits</Label>
                  <Input
                    id="credits"
                    type="number"
                    value={formData.credits}
                    onChange={(e) => setFormData({ ...formData, credits: e.target.value })}
                    placeholder="Course credits"
                  />
                </div>
              </div>

              <Button type="submit" className="w-full">
                Add to Schedule
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Current Schedule */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Current Schedule</span>
            </CardTitle>
            <CardDescription>
              Your teaching schedule for this semester
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {schedule.map((entry) => (
                <div key={entry.id} className="border rounded-lg p-3 space-y-2">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium text-gray-900">{entry.course}</h4>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {entry.courseCode}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                    <span>{entry.day}</span>
                    <span>{entry.timeSlot}</span>
                    <span>{entry.room}</span>
                    <span>{entry.credits} Credits</span>
                  </div>
                  {entry.semester && (
                    <p className="text-xs text-gray-500">{entry.semester}</p>
                  )}
                </div>
              ))}
              {schedule.length === 0 && (
                <p className="text-center text-gray-500 py-8">No classes scheduled yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TimetableForm;
