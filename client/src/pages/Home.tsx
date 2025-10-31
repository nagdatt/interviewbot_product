import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Code, MessageSquare, BarChart3 } from "lucide-react";
import Navbar from "@/components/Navbar";

export default function Home() {
  const [, setLocation] = useLocation();

  const features = [
    {
      icon: Code,
      title: "Live Coding",
      description: "Practice coding challenges with multi-language support",
    },
    {
      icon: MessageSquare,
      title: "Voice Input",
      description: "Answer questions using real-time speech-to-text",
    },
    {
      icon: BarChart3,
      title: "Performance Analytics",
      description: "Track your progress with detailed metrics and insights",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
              <Sparkles className="h-4 w-4" />
              AI-Powered Interview Practice
            </div>
            <h1 className="text-5xl font-bold tracking-tight">
              Master Your Interview Skills
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Practice mock interviews with AI, code live, and get detailed performance analytics
              to ace your next interview.
            </p>
            <Button
              size="lg"
              onClick={() => setLocation("/interview-setup")}
              className="h-12 px-8 text-base"
              data-testid="button-start-interview"
            >
              Start Interview Practice
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {features.map((feature) => (
              <Card key={feature.title} className="hover-elevate">
                <CardContent className="p-6">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="bg-card border-card-border">
            <CardContent className="p-8">
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold">How It Works</h2>
                <ol className="space-y-3 text-muted-foreground">
                  <li className="flex gap-3">
                    <span className="font-semibold text-foreground">1.</span>
                    <span>Set up your interview by selecting company, tech stack, and duration</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-semibold text-foreground">2.</span>
                    <span>Practice with technical, HR, and coding questions in real-time</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-semibold text-foreground">3.</span>
                    <span>Review your performance with detailed analytics and insights</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-semibold text-foreground">4.</span>
                    <span>Track your progress over time and improve your skills</span>
                  </li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
