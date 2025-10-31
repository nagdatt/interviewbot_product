import { useState } from "react";
import { useLocation } from "wouter";
import Navbar from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Calendar, Building, Code, TrendingUp } from "lucide-react";
import { useApp } from "@/contexts/AppContext";

export default function History() {
  const [, setLocation] = useLocation();
  const { interviewSessions } = useApp();
  const [searchQuery, setSearchQuery] = useState("");

  const mockSessions = interviewSessions.length > 0 ? interviewSessions : [
    {
      id: "1",
      date: new Date().toISOString(),
      companyName: "Google",
      techStacks: ["React", "Node.js", "Python"],
      duration: "60 minutes",
      accuracy: 85,
      timeTaken: "58 minutes",
      communicationScore: 80,
      codingScore: 92,
      answers: [],
    },
    {
      id: "2",
      date: new Date(Date.now() - 86400000).toISOString(),
      companyName: "Microsoft",
      techStacks: ["TypeScript", "C++", "AWS"],
      duration: "45 minutes",
      accuracy: 78,
      timeTaken: "42 minutes",
      communicationScore: 75,
      codingScore: 88,
      answers: [],
    },
  ];

  const filteredSessions = mockSessions.filter(session =>
    session.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    session.techStacks.some(stack => stack.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold">Interview History</h1>
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by company or tech stack..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                data-testid="input-search"
              />
            </div>
          </div>

          {filteredSessions.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <p className="text-muted-foreground mb-4">No interview sessions found</p>
                <Button onClick={() => setLocation("/")} data-testid="button-start-first">
                  Start Your First Interview
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredSessions.map((session) => (
                <Card key={session.id} className="hover-elevate" data-testid={`session-${session.id}`}>
                  <CardContent className="p-6">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      <div className="space-y-3 flex-1">
                        <div className="flex items-center gap-3 flex-wrap">
                          <h3 className="text-xl font-semibold">{session.companyName}</h3>
                          <Badge variant="secondary" className="gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(session.date).toLocaleDateString()}
                          </Badge>
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                          {session.techStacks.map((stack) => (
                            <Badge key={stack} variant="outline" className="gap-1">
                              <Code className="h-3 w-3" />
                              {stack}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex gap-6 text-sm text-muted-foreground">
                          <span>Duration: {session.duration}</span>
                          <span>Accuracy: {session.accuracy}%</span>
                          <span>Communication: {session.communicationScore}/100</span>
                          <span>Coding: {session.codingScore}/100</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-center">
                          <div className="flex items-center gap-1 text-2xl font-bold text-primary">
                            <TrendingUp className="h-5 w-5" />
                            {session.accuracy}%
                          </div>
                          <p className="text-xs text-muted-foreground">Overall Score</p>
                        </div>
                        <Button
                          variant="outline"
                          onClick={() => setLocation("/analysis")}
                          data-testid={`button-view-${session.id}`}
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
