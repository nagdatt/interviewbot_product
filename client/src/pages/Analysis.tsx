import { useLocation } from "wouter";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, Clock, MessageSquare, Code } from "lucide-react";

export default function Analysis() {
  const [, setLocation] = useLocation();

  // Mock data
  const mockData = [
    { category: "Technical", score: 85 },
    { category: "HR", score: 78 },
    { category: "Coding", score: 92 },
    { category: "Communication", score: 80 },
  ];

  const metrics = [
    { title: "Accuracy", value: "85%", icon: TrendingUp, color: "text-chart-1" },
    { title: "Time Taken", value: "45 min", icon: Clock, color: "text-chart-2" },
    { title: "Communication", value: "80/100", icon: MessageSquare, color: "text-chart-3" },
    { title: "Coding Score", value: "92/100", icon: Code, color: "text-chart-4" },
  ];

  const timeDistribution = [
    { category: "Technical", time: 20 },
    { category: "HR", time: 10 },
    { category: "Coding", time: 15 },
  ];

  const codingVsNonCoding = [
    { type: "Coding", score: 92 },
    { type: "Non-Coding", score: 82 },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto space-y-8">

          {/* Page Header */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Interview Analysis</h1>
            <p className="text-muted-foreground">
              Review your performance and identify areas for improvement
            </p>
          </div>

          {/* Metrics */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {metrics.map((metric) => (
              <Card key={metric.title}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-muted-foreground">{metric.title}</p>
                    <metric.icon className={`h-5 w-5 ${metric.color}`} />
                  </div>
                  <p className="text-2xl font-bold" data-testid={`metric-${metric.title.toLowerCase().replace(/\s+/g, '-')}`}>
                    {metric.value}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Performance Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={mockData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "var(--radius)",
                    }}
                  />
                  <Bar dataKey="score" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

        
          {/* Time Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Time Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={timeDistribution} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="category" />
                  <Tooltip />
                  <Bar dataKey="time" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <p className="text-xs text-muted-foreground mt-2">Time spent per category in minutes</p>
            </CardContent>
          </Card>

         

        


            {/* Key Insights */}
          <Card>
            <CardHeader>
              <CardTitle>Key Insights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="h-2 w-2 rounded-full bg-chart-1 mt-2" />
                <div>
                  <p className="font-medium">Strong coding performance</p>
                  <p className="text-sm text-muted-foreground">
                    Your coding score of 92% shows excellent problem-solving skills.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-2 w-2 rounded-full bg-chart-2 mt-2" />
                <div>
                  <p className="font-medium">Good technical knowledge</p>
                  <p className="text-sm text-muted-foreground">
                    Technical questions answered with 85% accuracy.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-2 w-2 rounded-full bg-chart-3 mt-2" />
                <div>
                  <p className="font-medium">Room for improvement in HR questions</p>
                  <p className="text-sm text-muted-foreground">
                    Consider practicing behavioral questions to improve confidence.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>


 {/* Strengths & Weaknesses */}
          <Card>
            <CardHeader>
              <CardTitle>Strengths & Weaknesses</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="h-2 w-2 rounded-full bg-red-500 mt-2" />
                <div>
                  <p className="font-medium">HR Questions Need Practice</p>
                  <p className="text-sm text-muted-foreground">
                    Accuracy below 75%. Focus on behavioral and scenario-based questions.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-2 w-2 rounded-full bg-green-500 mt-2" />
                <div>
                  <p className="font-medium">Coding Strength</p>
                  <p className="text-sm text-muted-foreground">
                    Strong performance in coding challenges; continue practicing advanced problems.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-2 w-2 rounded-full bg-yellow-500 mt-2" />
                <div>
                  <p className="font-medium">Technical Knowledge</p>
                  <p className="text-sm text-muted-foreground">
                    Moderate performance; revise key technical concepts to improve accuracy.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          {/* Navigation Buttons */}
          <div className="flex gap-4">
            <Button
              onClick={() => setLocation("/history")}
              variant="outline"
              data-testid="button-view-history"
            >
              View Interview History
            </Button>
            <Button onClick={() => setLocation("/")} data-testid="button-practice-again">
              Practice Again
            </Button>
          </div>

        </div>
      </main>
    </div>
  );
}
