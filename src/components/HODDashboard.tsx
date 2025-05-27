
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  GraduationCap, 
  BarChart3, 
  FileText, 
  Users, 
  LogOut,
  TrendingUp,
  Award,
  Briefcase,
  Download
} from "lucide-react";
import FacultyDataView from "@/components/hod/FacultyDataView";
import ReportsGeneration from "@/components/hod/ReportsGeneration";
import AnalyticsDashboard from "@/components/hod/AnalyticsDashboard";

interface HODDashboardProps {
  onLogout: () => void;
}

const HODDashboard = ({ onLogout }: HODDashboardProps) => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const stats = [
    {
      title: "Total Faculty",
      value: "24",
      change: "+2",
      icon: Users,
      color: "text-blue-600"
    },
    {
      title: "Publications This Year",
      value: "156",
      change: "+28%",
      icon: FileText,
      color: "text-green-600"
    },
    {
      title: "Active Projects",
      value: "32",
      change: "+12",
      icon: Briefcase,
      color: "text-purple-600"
    },
    {
      title: "Total Funding",
      value: "₹45.2L",
      change: "+15%",
      icon: TrendingUp,
      color: "text-orange-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <GraduationCap className="h-8 w-8 text-indigo-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">HOD Portal</h1>
                <p className="text-sm text-gray-600">Prof. Dr. Michael Chen - Department of Computer Science</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary">Head of Department</Badge>
              <Button variant="outline" onClick={onLogout} className="flex items-center space-x-2">
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-4 w-full max-w-md">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="faculty-data">Faculty Data</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Department Overview</h2>
              <p className="text-gray-600">Monitor and analyze faculty performance and departmental metrics</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <Card key={index}>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">
                      {stat.title}
                    </CardTitle>
                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <p className="text-xs text-green-600 mt-1">
                      {stat.change} from last year
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveTab("faculty-data")}>
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Users className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">View Faculty Data</CardTitle>
                      <CardDescription>Browse all faculty submissions</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveTab("reports")}>
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <FileText className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Generate Reports</CardTitle>
                      <CardDescription>Create detailed analytics reports</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveTab("analytics")}>
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <BarChart3 className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">View Analytics</CardTitle>
                      <CardDescription>Statistical insights and trends</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Faculty Activity</CardTitle>
                <CardDescription>Latest submissions and updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 rounded-full">
                        <FileText className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">Dr. Sarah Johnson</p>
                        <p className="text-sm text-gray-600">Added new research publication</p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">2 hours ago</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-green-100 rounded-full">
                        <Award className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">Prof. David Smith</p>
                        <p className="text-sm text-gray-600">Updated FDP certification</p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">5 hours ago</span>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-purple-100 rounded-full">
                        <Briefcase className="h-4 w-4 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium">Dr. Emily Rodriguez</p>
                        <p className="text-sm text-gray-600">Submitted new project proposal</p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">1 day ago</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="faculty-data">
            <FacultyDataView />
          </TabsContent>

          <TabsContent value="reports">
            <ReportsGeneration />
          </TabsContent>

          <TabsContent value="analytics">
            <AnalyticsDashboard />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default HODDashboard;
