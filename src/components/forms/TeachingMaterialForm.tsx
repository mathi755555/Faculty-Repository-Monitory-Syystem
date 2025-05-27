
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Plus, BookOpen, FileText, Video, Code, PenTool } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const TeachingMaterialForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    course: '',
    materialType: '',
    description: '',
    file: null as File | null
  });

  const [materials, setMaterials] = useState([
    {
      id: 1,
      title: "Data Structures - Linked Lists",
      course: "CS201 - Data Structures",
      type: "PPT",
      uploadDate: "2024-03-15",
      size: "2.5 MB"
    },
    {
      id: 2,
      title: "Database Normalization Tutorial",
      course: "CS301 - DBMS",
      type: "Video",
      uploadDate: "2024-03-10",
      size: "45.2 MB"
    }
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.course || !formData.materialType) {
      toast({
        title: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    const newMaterial = {
      id: materials.length + 1,
      title: formData.title,
      course: formData.course,
      type: formData.materialType,
      uploadDate: new Date().toISOString().split('T')[0],
      size: formData.file ? `${(formData.file.size / (1024 * 1024)).toFixed(1)} MB` : "N/A"
    };

    setMaterials([newMaterial, ...materials]);
    setFormData({
      title: '',
      course: '',
      materialType: '',
      description: '',
      file: null
    });

    toast({
      title: "Teaching Material Added",
      description: "Your teaching material has been uploaded successfully.",
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, file });
    }
  };

  const materialTypes = [
    "PPT",
    "Video",
    "Source Code",
    "Handwritten Notes",
    "PDF Document",
    "Audio Recording",
    "Interactive Content"
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "PPT": return FileText;
      case "Video": return Video;
      case "Source Code": return Code;
      case "Handwritten Notes": return PenTool;
      default: return FileText;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "PPT": return "bg-orange-100 text-orange-800";
      case "Video": return "bg-red-100 text-red-800";
      case "Source Code": return "bg-green-100 text-green-800";
      case "Handwritten Notes": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Teaching Materials</h2>
        <p className="text-gray-600">Upload and manage your educational resources</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Plus className="h-5 w-5" />
              <span>Upload Teaching Material</span>
            </CardTitle>
            <CardDescription>
              Add educational content for your courses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Material Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter material title"
                  required
                />
              </div>

              <div>
                <Label htmlFor="course">Course *</Label>
                <Input
                  id="course"
                  value={formData.course}
                  onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                  placeholder="e.g., CS201 - Data Structures"
                  required
                />
              </div>

              <div>
                <Label htmlFor="materialType">Material Type *</Label>
                <Select value={formData.materialType} onValueChange={(value) => setFormData({ ...formData, materialType: value })}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select material type" />
                  </SelectTrigger>
                  <SelectContent>
                    {materialTypes.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of the material"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="file">Upload File</Label>
                <div className="mt-1 flex items-center space-x-2">
                  <Input
                    id="file"
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                    accept=".ppt,.pptx,.pdf,.doc,.docx,.mp4,.avi,.mov,.zip,.rar,.jpg,.jpeg,.png"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('file')?.click()}
                    className="flex items-center space-x-2"
                  >
                    <Upload className="h-4 w-4" />
                    <span>Choose File</span>
                  </Button>
                  {formData.file && (
                    <span className="text-sm text-gray-600">{formData.file.name}</span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Supported formats: PPT, PDF, Videos, Images, Code files
                </p>
              </div>

              <Button type="submit" className="w-full">
                Upload Material
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Materials List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5" />
              <span>Your Teaching Materials</span>
            </CardTitle>
            <CardDescription>
              View and manage uploaded materials
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {materials.map((material) => {
                const TypeIcon = getTypeIcon(material.type);
                return (
                  <div key={material.id} className="border rounded-lg p-4 space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <div className={cn("p-2 rounded-lg", getTypeColor(material.type))}>
                          <TypeIcon className="h-4 w-4" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{material.title}</h4>
                          <p className="text-sm text-gray-600">{material.course}</p>
                        </div>
                      </div>
                      <span className={cn("px-2 py-1 text-xs rounded-full", getTypeColor(material.type))}>
                        {material.type}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 pt-2">
                      <span>Uploaded: {material.uploadDate}</span>
                      <span>Size: {material.size}</span>
                    </div>
                  </div>
                );
              })}
              {materials.length === 0 && (
                <p className="text-center text-gray-500 py-8">No teaching materials uploaded yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TeachingMaterialForm;
