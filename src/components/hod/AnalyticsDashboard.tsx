
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from "recharts";
import { TrendingUp, TrendingDown, Users, FileText, Award, Briefcase } from "lucide-react";

const AnalyticsDashboard = () => {
  // Sample data for charts
  const publicationData = [
    { month: 'Jan', SCI: 4, Scopus: 6, Other: 2 },
    { month: 'Feb', SCI: 3, Scopus: 8, Other: 3 },
    { month: 'Mar', SCI: 5, Scopus: 5, Other: 1 },
    { month: 'Apr', SCI: 7, Scopus: 9, Other: 2 },
    { month: 'May', SCI: 6, Scopus: 7, Other: 3 },
    { month: 'Jun', SCI: 8, Scopus: 10, Other: 1 }
  ];

  const facultyActivityData = [
    { name: 'Publications', value: 156 },
    { name: 'FDP', value: 45 },
    { name: 'Projects', value: 32 },
    { name: 'Awards', value: 18 },
    { name: 'Patents', value: 12 }
  ];

  const fundingTrend = [
    { year: '2020', amount: 25.5 },
    { year: '2021', amount: 32.8 },
    { year: '2022', amount: 38.2 },
    { year: '2023', amount: 42.1 },
    { year: '2024', amount: 45.2 }
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  const kpiData = [
    {
      title: "Total Publications",
      value: "156",
      change: "+23%",
      trend: "up",
      icon: FileText,
      color: "text-blue-600"
    },
    {
      title: "Active Faculty",
      value: "24",
      change: "+8%",
      trend: "up", 
      icon: Users,
      color: "text-green-600"
    },
    {
      title: "Research Funding",
      value: "₹45.2L",
      change: "+15%",
      trend: "up",
      icon: Briefcase,
      color: "text-purple-600"
    },
    {
      title: "Awards Won",
      value: "18",
      change: "-5%",
      trend: "down",
      icon: Award,
      color: "text-orange-600"
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Analytics Dashboard</h2>
        <p className="text-gray-600">Statistical insights and performance metrics</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((kpi, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {kpi.title}
              </CardTitle>
              <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.value}</div>
              <div className="flex items-center mt-1">
                {kpi.trend === "up" ? (
                  <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
                )}
                <span className={`text-xs ${kpi.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                  {kpi.change} from last year
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Publications by Type */}
        <Card>
          <CardHeader>
            <CardTitle>Publications by Index Type</CardTitle>
            <CardDescription>Monthly publication trends by journal indexing</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={publicationData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="SCI" fill="#0088FE" />
                <Bar dataKey="Scopus" fill="#00C49F" />
                <Bar dataKey="Other" fill="#FFBB28" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Activity Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Faculty Activity Distribution</CardTitle>
            <CardDescription>Breakdown of different academic activities</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={facultyActivityData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {facultyActivityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Funding Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Research Funding Trend</CardTitle>
            <CardDescription>Year-over-year funding growth (in Lakhs)</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={fundingTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip formatter={(value) => [`₹${value}L`, 'Funding']} />
                <Line 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#8884d8" 
                  strokeWidth={3}
                  dot={{ fill: '#8884d8', strokeWidth: 2, r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Faculty Performance Rankings */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Faculty</CardTitle>
            <CardDescription>Based on overall academic activity points</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Dr. Sarah Johnson", score: 95, publications: 12, projects: 3 },
                { name: "Prof. David Smith", score: 88, publications: 8, projects: 5 },
                { name: "Dr. Emily Rodriguez", score: 82, publications: 10, projects: 2 },
                { name: "Dr. Michael Chen", score: 78, publications: 6, projects: 4 },
                { name: "Prof. Lisa Wang", score: 75, publications: 7, projects: 3 }
              ].map((faculty, index) => (
                <div key={faculty.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                      index === 0 ? 'bg-yellow-500' : 
                      index === 1 ? 'bg-gray-400' :
                      index === 2 ? 'bg-orange-500' : 'bg-blue-500'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{faculty.name}</p>
                      <p className="text-xs text-gray-600">
                        {faculty.publications} publications • {faculty.projects} projects
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-lg">{faculty.score}</div>
                    <div className="text-xs text-gray-500">points</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Summary Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Department Summary</CardTitle>
          <CardDescription>Key metrics and achievements for the current academic year</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">156</div>
              <div className="text-sm text-gray-600">Research Publications</div>
              <div className="text-xs text-green-600">↑ 23% from last year</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">₹45.2L</div>
              <div className="text-sm text-gray-600">Research Funding</div>
              <div className="text-xs text-green-600">↑ 15% from last year</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">32</div>
              <div className="text-sm text-gray-600">Active Projects</div>
              <div className="text-xs text-green-600">↑ 12 new projects</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">87%</div>
              <div className="text-sm text-gray-600">Faculty Participation</div>
              <div className="text-xs text-green-600">↑ 8% improvement</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsDashboard;
