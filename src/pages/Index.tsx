
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Users, BarChart3, FileText, Shield, Award } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <GraduationCap className="h-8 w-8 text-indigo-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">University Academic Portal</h1>
                <p className="text-sm text-gray-600">Faculty & Research Management System</p>
              </div>
            </div>
            <Link to="/auth">
              <Button>Sign In</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Streamline Academic Management
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            A comprehensive platform for faculty to manage their academic activities, research publications, 
            and professional development. Enable HODs to monitor progress and generate insightful reports.
          </p>
          <div className="space-x-4">
            <Link to="/auth">
              <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700">
                Get Started
              </Button>
            </Link>
            <Button variant="outline" size="lg">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Powerful Features</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Everything you need to manage academic activities and generate comprehensive reports
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <FileText className="h-8 w-8 text-indigo-600 mb-2" />
                <CardTitle>Research Management</CardTitle>
                <CardDescription>
                  Upload and manage publications, patents, and research projects with ease
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Award className="h-8 w-8 text-green-600 mb-2" />
                <CardTitle>Professional Development</CardTitle>
                <CardDescription>
                  Track FDP certifications, workshops, awards, and professional memberships
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Users className="h-8 w-8 text-purple-600 mb-2" />
                <CardTitle>Student Projects</CardTitle>
                <CardDescription>
                  Manage student supervision, projects, and teaching materials efficiently
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <BarChart3 className="h-8 w-8 text-orange-600 mb-2" />
                <CardTitle>Analytics & Reports</CardTitle>
                <CardDescription>
                  Generate comprehensive reports with advanced filtering and export options
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Shield className="h-8 w-8 text-red-600 mb-2" />
                <CardTitle>Secure & Reliable</CardTitle>
                <CardDescription>
                  Role-based access control with secure file storage and data protection
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <GraduationCap className="h-8 w-8 text-blue-600 mb-2" />
                <CardTitle>Faculty Portal</CardTitle>
                <CardDescription>
                  Intuitive interface for faculty to upload and manage all academic activities
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-indigo-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Transform Your Academic Management?
          </h2>
          <p className="text-indigo-100 mb-8 max-w-2xl mx-auto">
            Join hundreds of universities already using our platform to streamline their academic processes
          </p>
          <Link to="/auth">
            <Button size="lg" variant="secondary">
              Start Your Journey
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <GraduationCap className="h-6 w-6" />
            <span className="font-semibold">University Academic Portal</span>
          </div>
          <p className="text-gray-400">
            © 2024 University Academic Portal. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
