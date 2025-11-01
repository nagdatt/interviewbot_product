import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import Navbar from "@/components/Navbar";
import CameraCard from "@/components/CameraCard";
import VoiceInputCard from "@/components/VoiceInputCard";
import CodeEditorModal from "@/components/CodeEditorModal";
import QuestionList from "@/components/QuestionList";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { sampleQuestions, type Question } from "@/utils/sampleQuestions";
import { useApp } from "@/contexts/AppContext";
import { useToast } from "@/hooks/use-toast";
import { Clock, AlertCircle, Eye, EyeOff } from "lucide-react";

interface SavedAnswer {
  questionId: string;
  questionTitle: string;
  answer: string;
  timestamp: string;
  type: "technical" | "hr" | "coding";
  videoUrl?: string;
  transcript?: string;
}

export default function InterviewRoom() {
  const [, setLocation] = useLocation();
  const { currentInterviewSetup, saveInterviewSession, clearCurrentInterview, saveAnswer } = useApp();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"technical" | "hr" | "coding">("technical");
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [answer, setAnswer] = useState("");
  const [startTime] = useState(Date.now());
  const [savedAnswers, setSavedAnswers] = useState<SavedAnswer[]>([]);
  const [showCodeEditor, setShowCodeEditor] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [showTimer, setShowTimer] = useState(true); // Hidden by default
  const [interviewDuration] = useState(currentInterviewSetup?.duration ? parseInt(currentInterviewSetup.duration) * 60 : 3600); // Default 60 minutes

  useEffect(() => {
    if (!currentInterviewSetup) {
      toast({
        title: "No Interview Setup",
        description: "Please set up your interview first",
        variant: "destructive",
      });
      setLocation("/interview-setup");
    }
  }, [currentInterviewSetup, setLocation, toast]);

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed(prev => {
        const newTime = prev + 1;

        // Check if interview time is up
        if (newTime >= interviewDuration) {
          clearInterval(timer);
          handleAutoEndInterview();
          return interviewDuration;
        }

        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [interviewDuration]);

  const questionsForTab = sampleQuestions.filter((q) => q.type === activeTab);

  const handleQuestionSelect = (questionId: string) => {
    const question = questionsForTab.find((q) => q.id === questionId);
    setSelectedQuestion(question || null);
    setAnswer("");

    if (question?.type === "coding") {
      setShowCodeEditor(true);
    }
  };

  const handleSaveAnswer = () => {
    if (selectedQuestion && answer.trim()) {
      const newAnswer: SavedAnswer = {
        questionId: selectedQuestion.id,
        questionTitle: selectedQuestion.title,
        answer,
        timestamp: new Date().toISOString(),
        type: selectedQuestion.type,
      };

      setSavedAnswers(prev => [newAnswer, ...prev]);

      saveAnswer({
        questionId: selectedQuestion.id,
        answer,
        type: selectedQuestion.type,
      });

      toast({
        title: "Answer Saved",
        description: "Your response has been recorded",
      });

      setAnswer("");
    }
  };

  const handleSaveVoiceAnswer = (voiceAnswer: string) => {
    if (selectedQuestion && voiceAnswer.trim()) {
      const newAnswer: SavedAnswer = {
        questionId: selectedQuestion.id,
        questionTitle: selectedQuestion.title,
        answer: voiceAnswer,
        timestamp: new Date().toISOString(),
        type: selectedQuestion.type,
      };

      setSavedAnswers(prev => [newAnswer, ...prev]);

      saveAnswer({
        questionId: selectedQuestion.id,
        answer: voiceAnswer,
        type: selectedQuestion.type,
      });

      toast({
        title: "Voice Answer Saved",
        description: "Your response has been recorded",
      });
    }
  };

  const handleSaveVideoAnswer = (videoUrl: string, transcript?: string) => {
    if (selectedQuestion && videoUrl) {
      const newAnswer: SavedAnswer = {
        questionId: selectedQuestion.id,
        questionTitle: selectedQuestion.title,
        answer: transcript || "", // textual answer from transcript or empty
        timestamp: new Date().toISOString(),
        type: selectedQuestion.type,
        videoUrl,
        transcript: transcript || "",
      };

      setSavedAnswers(prev => [newAnswer, ...prev]);

      toast({
        title: "Video Answer Saved",
        description: "Your video response has been added to My Answers",
      });
    }
  };

  const handleAutoEndInterview = () => {
    toast({
      title: "Time's Up!",
      description: "Interview time has ended automatically",
      variant: "destructive",
    });
    handleEndInterview();
  };

  const handleEndInterview = () => {
    const endTime = Date.now();
    const duration = Math.floor((endTime - startTime) / 1000 / 60);

    const mockSession = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      companyName: currentInterviewSetup?.companyName || "Unknown",
      techStacks: currentInterviewSetup?.techStacks || [],
      duration: `${duration} minutes`,
      accuracy: Math.floor(Math.random() * 30) + 70,
      timeTaken: `${duration} minutes`,
      communicationScore: Math.floor(Math.random() * 30) + 70,
      codingScore: Math.floor(Math.random() * 30) + 70,
      answers: [],
    };

    saveInterviewSession(mockSession);
    clearCurrentInterview();
    setLocation("/analysis");
  };

  // Format time functions
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimeRemaining = () => {
    return interviewDuration - timeElapsed;
  };

  const getProgressPercentage = () => {
    return (timeElapsed / interviewDuration) * 100;
  };

  const isTimeRunningOut = () => {
    return getTimeRemaining() <= 300; // 5 minutes remaining
  };

  if (!currentInterviewSetup) return null;

  return (
    <div className="min-h-screen lg:h-screen lg:overflow-hidden bg-background flex flex-col">
      {/* <Navbar /> */}
      <main className="flex-1 lg:min-h-0 lg:overflow-hidden container mx-auto px-3 sm:px-4 py-3 sm:py-4 flex flex-col">
        {/* Timer Header with Toggle Button */}
        {showTimer && (
          <Card className="mb-3 sm:mb-4 border-l-4 border-l-primary flex-shrink-0">
            <CardContent className="p-3 sm:p-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-1 sm:p-2 bg-primary/10 rounded-full">
                    <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-semibold">Interview in Progress</h2>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      {currentInterviewSetup.companyName} - {currentInterviewSetup.jobRole}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 justify-between sm:justify-normal">
                  {isTimeRunningOut() && (
                    <Badge variant="destructive" className="gap-1 animate-pulse text-xs">
                      <AlertCircle className="h-3 w-3" />
                      Time Running Out
                    </Badge>
                  )}

                  <div className="text-right">
                    <div className={`text-lg sm:text-xl lg:text-2xl font-bold ${isTimeRunningOut() ? 'text-destructive' : 'text-primary'
                      }`}>
                      {formatTime(getTimeRemaining())}
                    </div>
                    <div className="text-xs sm:text-sm text-muted-foreground">
                      Time Remaining
                    </div>
                  </div>

                  <div className="w-20 sm:w-32">
                    <div className="h-1.5 sm:h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-1000 ${isTimeRunningOut() ? 'bg-destructive' : 'bg-primary'
                          }`}
                        style={{ width: `${getProgressPercentage()}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Mobile Timer Toggle Button */}
        {/* <div className="flex justify-end mb-4 sm:hidden">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowTimer(!showTimer)}
            className="gap-2"
          >
            {showTimer ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            {showTimer ? "Hide Timer" : "Show Timer"}
          </Button>
        </div> */}

        <div className="lg:flex-1 lg:min-h-0 grid grid-cols-1 lg:grid-cols-[480px_1fr] gap-3 sm:gap-4">
          {/* Left Panel - Two equal height rows on desktop, stacked on mobile */}
          <div className="flex flex-col gap-3 sm:gap-4 lg:min-h-0">
            <div className="lg:flex-[0.5] lg:min-h-0">
              <CameraCard className="h-full min-h-[200px] sm:min-h-[250px] lg:min-h-0" onSaveVideoAnswer={handleSaveVideoAnswer} speechLang={(navigator.language || "en-US")} />
            </div>
            <div className="lg:flex-[0.5] lg:min-h-0">
              <VoiceInputCard
                className="h-full min-h-[300px] sm:min-h-[350px] lg:min-h-0"
                savedAnswers={savedAnswers}
                onSaveVoiceAnswer={handleSaveVoiceAnswer}
                onSaveVideoAnswer={handleSaveVideoAnswer}
                currentQuestion={selectedQuestion ? {
                  id: selectedQuestion.id,
                  title: selectedQuestion.title,
                  type: selectedQuestion.type
                } : null}
              />
            </div>
          </div>

          {/* Right Panel - Full height on desktop, auto on mobile */}
          <div className="lg:min-h-0 lg:flex lg:flex-col">
            <Card className="lg:flex-1 lg:min-h-0 lg:flex lg:flex-col">
              <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 gap-2 sm:gap-0 flex-shrink-0">
                <CardTitle className="text-lg sm:text-xl">Interview Questions</CardTitle>
                <div className="flex items-center gap-2 justify-end">
                  {/* <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowTimer(!showTimer)}
                    className="gap-2 hidden sm:flex"
                  >
                    {showTimer ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    {showTimer ? "Hide Timer" : "Show Timer"}
                  </Button> */}
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={handleEndInterview}
                    data-testid="button-end-interview"
                  >
                    End Interview
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="lg:flex-1 lg:min-h-0 lg:overflow-hidden">
                <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="lg:h-full lg:flex lg:flex-col">
                  <TabsList className="grid w-full grid-cols-3 flex-shrink-0">
                    <TabsTrigger value="technical" data-testid="tab-technical" className="text-xs sm:text-sm">Technical</TabsTrigger>
                    <TabsTrigger value="hr" data-testid="tab-hr" className="text-xs sm:text-sm">HR</TabsTrigger>
                    <TabsTrigger value="coding" data-testid="tab-coding" className="text-xs sm:text-sm">Coding</TabsTrigger>
                  </TabsList>

                  <TabsContent value="technical" className="lg:flex-1 lg:min-h-0 mt-3 sm:mt-4">
                    <QuestionList
                      questions={questionsForTab}
                      selectedQuestionId={selectedQuestion?.id}
                      onSelectQuestion={handleQuestionSelect}
                      className="lg:h-full"
                    />
                  </TabsContent>

                  <TabsContent value="hr" className="lg:flex-1 lg:min-h-0 mt-3 sm:mt-4">
                    <QuestionList
                      questions={questionsForTab}
                      selectedQuestionId={selectedQuestion?.id}
                      onSelectQuestion={handleQuestionSelect}
                      className="lg:h-full"
                    />
                  </TabsContent>

                  <TabsContent value="coding" className="lg:flex-1 lg:min-h-0 mt-3 sm:mt-4">
                    <QuestionList
                      questions={questionsForTab}
                      selectedQuestionId={selectedQuestion?.id}
                      onSelectQuestion={handleQuestionSelect}
                      className="lg:h-full"
                    />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {showCodeEditor && selectedQuestion && (
        <CodeEditorModal
          questionTitle={selectedQuestion.title}
          onClose={() => setShowCodeEditor(false)}
        />
      )}
    </div>
  );
}