
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { 
  CalendarIcon, 
  Download, 
  FileText, 
  BarChart3, 
  PieChart, 
  Table,
  Printer,
  Mail
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

const ReportsGeneration = () => {
  const [reportType, setReportType] = useState("");
  const [dateFrom, setDateFrom] = useState<Date | undefined>();
  const [dateTo, setDateTo] = useState<Date | undefined>();
  const [selectedFaculty, setSelectedFaculty] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [outputFormat, setOutputFormat] = useState("");

  const facultyMembers = [
    "Dr. Sarah Johnson",
    "Prof. David Smith",
    "Dr. Emily Rodriguez",
    "Dr. Michael Chen",
    "Prof. Lisa Wang"
  ];

  const categories = [
    "Publications",
    "FDP Certifications", 
    "Projects",
    "Awards",
    "Patents",
    "Workshops",
    "Teaching Materials",
    "Student Projects"
  ];

  const reportTypes = [
    { value: "summary", label: "Summary Report", description: "Overall statistics and highlights" },
    { value: "detailed", label: "Detailed Report", description: "Complete data with all entries" },
    { value: "faculty-wise", label: "Faculty-wise Report", description: "Individual faculty performance" },
    { value: "activity-wise", label: "Activity-wise Report", description: "Category-based analysis" },
    { value: "comparative", label: "Comparative Report", description: "Period-wise comparison" },
    { value: "analytics", label: "Analytics Report", description: "Charts and statistical insights" }
  ];

  const formats = [
    { value: "pdf", label: "PDF Document", icon: FileText },
    { value: "excel", label: "Excel Spreadsheet", icon: Table },
    { value: "charts", label: "Charts & Graphs", icon: BarChart3 }
  ];

  const handleFacultyToggle = (faculty: string) => {
    setSelectedFaculty(prev => 
      prev.includes(faculty) 
        ? prev.filter(f => f !== faculty)
        : [...prev, faculty]
    );
  };

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleGenerateReport = () => {
    if (!reportType || !outputFormat) {
      toast({
        title: "Please select report type and format",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Report Generated",
      description: "Your report is being prepared for download.",
    });

    // Simulate report generation
    setTimeout(() => {
      toast({
        title: "Download Ready",
        description: "Your report has been generated successfully.",
      });
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Reports Generation</h2>
        <p className="text-gray-600">Generate comprehensive reports for analysis and documentation</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Report Configuration */}
        <div className="lg:col-span-2 space-y-6">
          {/* Report Type Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Report Type</CardTitle>
              <CardDescription>Choose the type of report you want to generate</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reportTypes.map((type) => (
                  <div
                    key={type.value}
                    className={cn(
                      "border rounded-lg p-4 cursor-pointer transition-colors",
                      reportType === type.value 
                        ? "border-blue-500 bg-blue-50" 
                        : "border-gray-200 hover:border-gray-300"
                    )}
                    onClick={() => setReportType(type.value)}
                  >
                    <div className="flex items-center space-x-2 mb-2">
                      <div className={cn(
                        "w-4 h-4 rounded-full border-2",
                        reportType === type.value 
                          ? "border-blue-500 bg-blue-500" 
                          : "border-gray-300"
                      )}>
                        {reportType === type.value && (
                          <div className="w-full h-full rounded-full bg-white scale-50"></div>
                        )}
                      </div>
                      <h4 className="font-medium">{type.label}</h4>
                    </div>
                    <p className="text-sm text-gray-600">{type.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Date Range */}
          <Card>
            <CardHeader>
              <CardTitle>Date Range</CardTitle>
              <CardDescription>Select the time period for the report</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>From Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal mt-1",
                          !dateFrom && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateFrom ? format(dateFrom, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={dateFrom}
                        onSelect={setDateFrom}
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
                          !dateTo && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateTo ? format(dateTo, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={dateTo}
                        onSelect={setDateTo}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Faculty Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Faculty Selection</CardTitle>
              <CardDescription>Choose specific faculty members (leave empty for all)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {facultyMembers.map((faculty) => (
                  <div key={faculty} className="flex items-center space-x-2">
                    <Checkbox
                      id={faculty}
                      checked={selectedFaculty.includes(faculty)}
                      onCheckedChange={() => handleFacultyToggle(faculty)}
                    />
                    <Label htmlFor={faculty} className="text-sm">{faculty}</Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Categories Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Categories</CardTitle>
              <CardDescription>Select the data categories to include</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {categories.map((category) => (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox
                      id={category}
                      checked={selectedCategories.includes(category)}
                      onCheckedChange={() => handleCategoryToggle(category)}
                    />
                    <Label htmlFor={category} className="text-sm">{category}</Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Output Format & Actions */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Output Format</CardTitle>
              <CardDescription>Choose how you want to receive the report</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {formats.map((fmt) => (
                <div
                  key={fmt.value}
                  className={cn(
                    "border rounded-lg p-3 cursor-pointer transition-colors",
                    outputFormat === fmt.value 
                      ? "border-blue-500 bg-blue-50" 
                      : "border-gray-200 hover:border-gray-300"
                  )}
                  onClick={() => setOutputFormat(fmt.value)}
                >
                  <div className="flex items-center space-x-3">
                    <div className={cn(
                      "w-4 h-4 rounded-full border-2",
                      outputFormat === fmt.value 
                        ? "border-blue-500 bg-blue-500" 
                        : "border-gray-300"
                    )}>
                      {outputFormat === fmt.value && (
                        <div className="w-full h-full rounded-full bg-white scale-50"></div>
                      )}
                    </div>
                    <fmt.icon className="h-4 w-4 text-gray-600" />
                    <span className="text-sm font-medium">{fmt.label}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Generate Report</CardTitle>
              <CardDescription>Create and download your customized report</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={handleGenerateReport} 
                className="w-full flex items-center space-x-2"
                size="lg"
              >
                <Download className="h-4 w-4" />
                <span>Generate & Download</span>
              </Button>

              <div className="border-t pt-4 space-y-2">
                <Button variant="outline" className="w-full flex items-center space-x-2">
                  <Printer className="h-4 w-4" />
                  <span>Print Report</span>
                </Button>
                
                <Button variant="outline" className="w-full flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>Email Report</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Reports</CardTitle>
              <CardDescription>Pre-configured report templates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                Monthly Summary
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Annual Report
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Research Activity Report
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Faculty Performance Report
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ReportsGeneration;
