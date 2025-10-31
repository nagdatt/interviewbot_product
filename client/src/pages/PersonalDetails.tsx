import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Upload, X, Plus, Calendar, Building, MapPin, Briefcase } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { useToast } from "@/hooks/use-toast";

interface Project {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  projectLink: string;
}

interface Experience {
  id: string;
  companyName: string;
  designation: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
  currentlyWorking: boolean;
}

export default function PersonalDetails() {
  const { personalDetails, updatePersonalDetails } = useApp();
  const { toast } = useToast();
  const [formData, setFormData] = useState(personalDetails);
  const [newSkill, setNewSkill] = useState("");
  const [projects, setProjects] = useState<Project[]>(formData.projects || []);
  const [experiences, setExperiences] = useState<Experience[]>(formData.experiences || []);

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()],
      }));
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skillToRemove),
    }));
  };

  // Project Functions
  const addNewProject = () => {
    const newProject: Project = {
      id: Date.now().toString(),
      title: "",
      description: "",
      startDate: "",
      endDate: "",
      projectLink: ""
    };
    setProjects(prev => [...prev, newProject]);
  };

  const updateProject = (id: string, field: keyof Project, value: string) => {
    setProjects(prev => 
      prev.map(project => 
        project.id === id ? { ...project, [field]: value } : project
      )
    );
  };

  const removeProject = (id: string) => {
    setProjects(prev => prev.filter(project => project.id !== id));
  };

  const saveProjects = () => {
    setFormData(prev => ({
      ...prev,
      projects: projects
    }));
    toast({
      title: "Projects Saved",
      description: "Your projects have been saved successfully",
    });
  };

  // Experience Functions
  const addNewExperience = () => {
    const newExperience: Experience = {
      id: Date.now().toString(),
      companyName: "",
      designation: "",
      location: "",
      startDate: "",
      endDate: "",
      description: "",
      currentlyWorking: false
    };
    setExperiences(prev => [...prev, newExperience]);
  };

  const updateExperience = (id: string, field: keyof Experience, value: string | boolean) => {
    setExperiences(prev => 
      prev.map(experience => 
        experience.id === id ? { ...experience, [field]: value } : experience
      )
    );
  };

  const removeExperience = (id: string) => {
    setExperiences(prev => prev.filter(experience => experience.id !== id));
  };

  const saveExperiences = () => {
    setFormData(prev => ({
      ...prev,
      experiences: experiences
    }));
    toast({
      title: "Experience Saved",
      description: "Your work experience has been saved successfully",
    });
  };

  const handleSave = () => {
    const updatedFormData = {
      ...formData,
      projects: projects,
      experiences: experiences
    };
    updatePersonalDetails(updatedFormData);
    toast({
      title: "Profile Updated",
      description: "All your personal details have been saved successfully",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Personal Details</h1>
            <p className="text-muted-foreground">
              Manage your profile information and preferences
            </p>
          </div>

          <div className="space-y-6">
            <Card className="w-full">
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="John Doe"
                    data-testid="input-name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="john@example.com"
                    data-testid="input-email"
                  />
                </div>

                {/* Profile Picture Upload */}
                <div className="space-y-4 pt-4 border-t">
                  <Label>Profile Picture</Label>
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={formData.profilePicture} alt={formData.name} />
                      <AvatarFallback>
                        {formData.name.split(" ").map(n => n[0]).join("").toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <Button variant="outline" size="sm" className="gap-2" data-testid="button-upload-photo">
                      <Upload className="h-4 w-4" />
                      Upload Photo
                    </Button>
                  </div>
                </div>

                {/* Resume Upload */}
                <div className="space-y-4 pt-4 border-t">
                  <Label>Resume</Label>
                  <div className="border-2 border-dashed rounded-md p-6 space-y-3">
                    <Upload className="h-6 w-6 mx-auto text-muted-foreground" />
                    <div className="space-y-1 text-center">
                      <p className="text-sm font-medium">Upload Resume</p>
                      <p className="text-xs text-muted-foreground">PDF, up to 5MB</p>
                    </div>
                    <div className="flex justify-center">
                      <Button variant="outline" size="sm" data-testid="button-upload-resume">
                        Choose File
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="w-full">
              <CardHeader>
                <CardTitle>Skills</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="Add a skill..."
                    onKeyPress={(e) => e.key === "Enter" && handleAddSkill()}
                    data-testid="input-skill"
                  />
                  <Button onClick={handleAddSkill} data-testid="button-add-skill">
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="gap-1">
                      {skill}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => handleRemoveSkill(skill)}
                      />
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="w-full">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Projects</CardTitle>
                <div className="flex gap-2">
                  <Button onClick={saveProjects} variant="outline" size="sm">
                    Save Projects
                  </Button>
                  <Button onClick={addNewProject} size="sm" className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Project
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {projects.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No projects added yet. Click "Add Project" to get started.</p>
                  </div>
                ) : (
                  projects.map((project, index) => (
                    <div key={project.id} className="p-4 border rounded-lg space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="font-semibold">Project {index + 1}</h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeProject(project.id)}
                          className="h-8 w-8 p-0 text-destructive"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor={`project-title-${project.id}`}>Project Title</Label>
                        <Input
                          id={`project-title-${project.id}`}
                          value={project.title}
                          onChange={(e) => updateProject(project.id, 'title', e.target.value)}
                          placeholder="Enter project title"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`start-date-${project.id}`}>
                            <Calendar className="h-4 w-4 inline mr-2" />
                            Start Date
                          </Label>
                          <Input
                            id={`start-date-${project.id}`}
                            type="date"
                            value={project.startDate}
                            onChange={(e) => updateProject(project.id, 'startDate', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`end-date-${project.id}`}>
                            <Calendar className="h-4 w-4 inline mr-2" />
                            End Date
                          </Label>
                          <Input
                            id={`end-date-${project.id}`}
                            type="date"
                            value={project.endDate}
                            onChange={(e) => updateProject(project.id, 'endDate', e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`project-link-${project.id}`}>Project Link</Label>
                        <Input
                          id={`project-link-${project.id}`}
                          type="url"
                          value={project.projectLink}
                          onChange={(e) => updateProject(project.id, 'projectLink', e.target.value)}
                          placeholder="https://example.com"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`project-description-${project.id}`}>Description</Label>
                        <Textarea
                          id={`project-description-${project.id}`}
                          value={project.description}
                          onChange={(e) => updateProject(project.id, 'description', e.target.value)}
                          placeholder="Describe the project, your role, technologies used, and key achievements..."
                          className="min-h-24"
                        />
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            <Card className="w-full">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Work Experience</CardTitle>
                <div className="flex gap-2">
                  <Button onClick={saveExperiences} variant="outline" size="sm">
                    Save Experience
                  </Button>
                  <Button onClick={addNewExperience} size="sm" className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Experience
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {experiences.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No work experience added yet. Click "Add Experience" to get started.</p>
                  </div>
                ) : (
                  experiences.map((experience, index) => (
                    <div key={experience.id} className="p-4 border rounded-lg space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="font-semibold">Experience {index + 1}</h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeExperience(experience.id)}
                          className="h-8 w-8 p-0 text-destructive"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`company-name-${experience.id}`}>
                          <Building className="h-4 w-4 inline mr-2" />
                          Company Name
                        </Label>
                        <Input
                          id={`company-name-${experience.id}`}
                          value={experience.companyName}
                          onChange={(e) => updateExperience(experience.id, 'companyName', e.target.value)}
                          placeholder="Enter company name"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`designation-${experience.id}`}>
                            <Briefcase className="h-4 w-4 inline mr-2" />
                            Designation
                          </Label>
                          <Input
                            id={`designation-${experience.id}`}
                            value={experience.designation}
                            onChange={(e) => updateExperience(experience.id, 'designation', e.target.value)}
                            placeholder="Your job title"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`location-${experience.id}`}>
                            <MapPin className="h-4 w-4 inline mr-2" />
                            Location
                          </Label>
                          <Input
                            id={`location-${experience.id}`}
                            value={experience.location}
                            onChange={(e) => updateExperience(experience.id, 'location', e.target.value)}
                            placeholder="City, Country"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`exp-start-date-${experience.id}`}>
                            <Calendar className="h-4 w-4 inline mr-2" />
                            Start Date
                          </Label>
                          <Input
                            id={`exp-start-date-${experience.id}`}
                            type="date"
                            value={experience.startDate}
                            onChange={(e) => updateExperience(experience.id, 'startDate', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`exp-end-date-${experience.id}`}>
                            <Calendar className="h-4 w-4 inline mr-2" />
                            End Date
                          </Label>
                          <Input
                            id={`exp-end-date-${experience.id}`}
                            type="date"
                            value={experience.endDate}
                            onChange={(e) => updateExperience(experience.id, 'endDate', e.target.value)}
                            disabled={experience.currentlyWorking}
                          />
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              id={`currently-working-${experience.id}`}
                              checked={experience.currentlyWorking}
                              onChange={(e) => updateExperience(experience.id, 'currentlyWorking', e.target.checked)}
                              className="h-4 w-4"
                            />
                            <Label htmlFor={`currently-working-${experience.id}`} className="text-sm">
                              I currently work here
                            </Label>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`exp-description-${experience.id}`}>Job Description</Label>
                        <Textarea
                          id={`exp-description-${experience.id}`}
                          value={experience.description}
                          onChange={(e) => updateExperience(experience.id, 'description', e.target.value)}
                          placeholder="Describe your responsibilities, achievements, and key contributions..."
                          className="min-h-24"
                        />
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-center">
            <Button onClick={handleSave} size="lg" data-testid="button-save" className="px-8">
              Save All Changes
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}