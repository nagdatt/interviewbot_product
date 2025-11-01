import { useState } from "react";
import { useLocation } from "wouter";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { X, Target, Clock, Building, Code, DollarSign, User, Briefcase, Star, Shield, Save, Search } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { useToast } from "@/hooks/use-toast";

const availableTechStacks = [
  "React", "Node.js", "Python", "C++", "Java", "TypeScript", "JavaScript",
  "MongoDB", "PostgreSQL", "AWS", "Docker", "Kubernetes", "GraphQL", "Redis",
  "Spring Boot", "Angular", "Vue.js", "Next.js", "Express.js", "MySQL"
];

const jobRoles = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "DevOps Engineer",
  "Data Scientist",
  "Machine Learning Engineer",
  "Mobile Developer",
  "Software Engineer",
  "Tech Lead",
  "Engineering Manager"
];

const difficultyLevels = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
  { value: "expert", label: "Expert" }
];

export default function InterviewSetup() {
  const [, setLocation] = useLocation();
  const { setCurrentInterviewSetup } = useApp();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    companyName: "",
    jobRole: "",
    minPackage: "300000",
    maxPackage: "800000",
    experience: "",
    techStacks: [] as string[],
    duration: "",
    difficulty: "intermediate",
    includeSystemDesign: false,
    includeBehavioral: true,
    includeCoding: true,
  });

  const [techStackSearch, setTechStackSearch] = useState("");

  const toggleTechStack = (stack: string) => {
    setFormData(prev => ({
      ...prev,
      techStacks: prev.techStacks.includes(stack)
        ? prev.techStacks.filter(s => s !== stack)
        : [...prev.techStacks, stack],
    }));
  };

  const handlePackageChange = (values: number[]) => {
    setFormData(prev => ({
      ...prev,
      minPackage: values[0].toString(),
      maxPackage: values[1].toString(),
    }));
  };

  const formatCurrency = (amount: string) => {
    return `₹${parseInt(amount).toLocaleString()}`;
  };

  // Filter tech stacks based on search
  const filteredTechStacks = availableTechStacks.filter(stack =>
    stack.toLowerCase().includes(techStackSearch.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.techStacks.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one tech stack",
        variant: "destructive",
      });
      return;
    }

    if (!formData.jobRole) {
      toast({
        title: "Error",
        description: "Please select a job role",
        variant: "destructive",
      });
      return;
    }

    if (!formData.experience) {
      toast({
        title: "Error",
        description: "Please enter your years of experience",
        variant: "destructive",
      });
      return;
    }

    setCurrentInterviewSetup(formData);
    toast({
      title: "Interview Setup Complete",
      description: "Starting your interview session...",
    });
    setLocation("/interview-room");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Header Card */}
          <Card className="border-l-4 border-l-primary">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-full">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">Customize Your Mock Interview</h2>
                  <p className="text-muted-foreground">
                    Set up parameters that match your target role and company expectations
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Building className="h-6 w-6" />
                Interview Configuration
              </CardTitle>
              <CardDescription>
                Configure your mock interview session based on your career goals
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Basic Information Section */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Basic Information
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="companyName">Target Company</Label>
                      <Input
                        id="companyName"
                        placeholder="e.g., Google, Microsoft, Amazon"
                        value={formData.companyName}
                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                        required
                        data-testid="input-company-name"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="jobRole">Job Role</Label>
                      <Select
                        value={formData.jobRole}
                        onValueChange={(value) => setFormData({ ...formData, jobRole: value })}
                        required
                      >
                        <SelectTrigger id="jobRole" data-testid="select-job-role">
                          <SelectValue placeholder="Select job role" />
                        </SelectTrigger>
                        <SelectContent>
                          {jobRoles.map((role) => (
                            <SelectItem key={role} value={role}>
                              {role}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="experience">
                      <Briefcase className="h-4 w-4 inline mr-2" />
                      Years of Experience
                    </Label>
                    <Input
                      id="experience"
                      type="number"
                      placeholder="e.g., 3"
                      min="0"
                      max="30"
                      value={formData.experience}
                      onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                      required
                      data-testid="input-experience"
                    />
                  </div>
                </div>

                <Separator />

                {/* Compensation Section */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Expected Compensation (Annual)
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Minimum</span>
                      <span className="text-muted-foreground">Maximum</span>
                    </div>
                    
                    <Slider
                      value={[parseInt(formData.minPackage), parseInt(formData.maxPackage)]}
                      onValueChange={handlePackageChange}
                      min={300000}
                      max={3000000}
                      step={50000}
                      className="my-6"
                    />
                    
                    <div className="flex justify-between">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">
                          {formatCurrency(formData.minPackage)}
                        </div>
                        <div className="text-sm text-muted-foreground">Min Package</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">
                          {formatCurrency(formData.maxPackage)}
                        </div>
                        <div className="text-sm text-muted-foreground">Max Package</div>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Technical Skills Section */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Code className="h-5 w-5" />
                    Technical Skills
                  </h3>

                  <div className="space-y-4">
                    <Label>Select Tech Stacks</Label>
                    
                    {/* Search Input */}
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search tech stacks..."
                        value={techStackSearch}
                        onChange={(e) => setTechStackSearch(e.target.value)}
                        className="pl-10"
                      />
                    </div>

                    {/* Selected Tech Stacks Display */}
                    {formData.techStacks.length > 0 && (
                      <div className="space-y-2">
                        <Label className="text-sm">Selected Tech Stacks:</Label>
                        <div className="flex flex-wrap gap-2 p-3 border rounded-md bg-muted/50 min-h-[44px] items-start">
                          {formData.techStacks.map((stack) => (
                            <Badge
                              key={stack}
                              variant="default"
                              className="gap-1 px-3 py-1 h-7 flex items-center"
                            >
                              {stack}
                              <X 
                                className="h-3 w-3 cursor-pointer" 
                                onClick={() => toggleTechStack(stack)}
                              />
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Available Tech Stacks Container */}
                    <div className="border rounded-md bg-background">
                      <div className="flex flex-wrap gap-2 p-4 min-h-[88px] max-h-40 overflow-y-auto items-start">
                        {filteredTechStacks.length === 0 ? (
                          <div className="w-full text-center text-muted-foreground py-4">
                            No tech stacks found matching "{techStackSearch}"
                          </div>
                        ) : (
                          filteredTechStacks.map((stack) => (
                            <Badge
                              key={stack}
                              variant={formData.techStacks.includes(stack) ? "default" : "outline"}
                              className="cursor-pointer transition-all px-3 py-1 h-7 flex items-center"
                              onClick={() => toggleTechStack(stack)}
                              data-testid={`badge-tech-${stack.toLowerCase()}`}
                            >
                              {stack}
                              {formData.techStacks.includes(stack) && (
                                <X className="ml-1 h-3 w-3" />
                              )}
                            </Badge>
                          ))
                        )}
                      </div>
                    </div>
                    
                    {/* Stats */}
                    <div className="flex justify-between items-center text-sm text-muted-foreground">
                      <span>
                        Selected: {formData.techStacks.length} tech stack{formData.techStacks.length !== 1 ? 's' : ''}
                      </span>
                      {techStackSearch && (
                        <span>
                          Showing {filteredTechStacks.length} of {availableTechStacks.length}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Interview Settings Section */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Interview Settings
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="duration">Interview Duration</Label>
                      <Select
                        value={formData.duration}
                        onValueChange={(value) => setFormData({ ...formData, duration: value })}
                        required
                      >
                        <SelectTrigger id="duration" data-testid="select-duration">
                          <SelectValue placeholder="Select duration" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="6">6 minutes</SelectItem>
                          <SelectItem value="45">45 minutes</SelectItem>
                          <SelectItem value="60">60 minutes</SelectItem>
                          <SelectItem value="90">90 minutes</SelectItem>
                          <SelectItem value="120">120 minutes</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="difficulty">Difficulty Level</Label>
                      <Select
                        value={formData.difficulty}
                        onValueChange={(value) => setFormData({ ...formData, difficulty: value })}
                      >
                        <SelectTrigger id="difficulty">
                          <SelectValue placeholder="Select difficulty" />
                        </SelectTrigger>
                        <SelectContent>
                          {difficultyLevels.map((level) => (
                            <SelectItem key={level.value} value={level.value}>
                              <div className="flex items-center gap-2">
                                <Star className={`h-4 w-4 ${
                                  level.value === "expert" ? "text-yellow-500" :
                                  level.value === "advanced" ? "text-orange-500" :
                                  level.value === "intermediate" ? "text-blue-500" : "text-green-500"
                                }`} />
                                {level.label}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label>Interview Components</Label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center space-x-2 p-3 border rounded-lg">
                        <Switch
                          checked={formData.includeCoding}
                          onCheckedChange={(checked) => setFormData({ ...formData, includeCoding: checked })}
                        />
                        <Label className="cursor-pointer">Coding Questions</Label>
                      </div>
                      <div className="flex items-center space-x-2 p-3 border rounded-lg">
                        <Switch
                          checked={formData.includeSystemDesign}
                          onCheckedChange={(checked) => setFormData({ ...formData, includeSystemDesign: checked })}
                        />
                        <Label className="cursor-pointer">System Design</Label>
                      </div>
                      <div className="flex items-center space-x-2 p-3 border rounded-lg">
                        <Switch
                          checked={formData.includeBehavioral}
                          onCheckedChange={(checked) => setFormData({ ...formData, includeBehavioral: checked })}
                        />
                        <Label className="cursor-pointer">Behavioral Questions</Label>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Summary Card */}
                <Card className="bg-muted/50">
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      Interview Summary
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="text-muted-foreground">Role</div>
                        <div className="font-medium">{formData.jobRole || "Not set"}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Experience</div>
                        <div className="font-medium">{formData.experience ? `${formData.experience} years` : "Not set"}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Tech Stacks</div>
                        <div className="font-medium">
                          {formData.techStacks.length > 0 
                            ? formData.techStacks.slice(0, 2).join(", ") + (formData.techStacks.length > 2 ? ` +${formData.techStacks.length - 2} more` : "")
                            : "Not set"
                          }
                        </div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Duration</div>
                        <div className="font-medium">{formData.duration ? `${formData.duration} min` : "Not set"}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex gap-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="flex-1 gap-2"
                    disabled={!formData.jobRole || formData.techStacks.length === 0}
                  >
                    <Save className="h-4 w-4" />
                    Save Settings
                  </Button>
                  <Button 
                    type="submit" 
                    className="flex-1 gap-2" 
                    size="lg" 
                    data-testid="button-start-interview"
                  >
                    <Target className="h-4 w-4" />
                    Start Mock Interview
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}