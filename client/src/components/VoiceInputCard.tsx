// In VoiceInputCard.tsx - Update to make internal components properly responsive
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Mic, MicOff, Volume2, Save, StopCircle, Trash } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SavedAnswer {
  questionId: string;
  questionTitle: string;
  answer: string;
  timestamp: string;
  type: "technical" | "hr" | "coding";
}

interface VoiceInputCardProps {
  savedAnswers?: SavedAnswer[];
  onSaveVoiceAnswer?: (answer: string) => void;
  currentQuestion?: { id: string; title: string; type: "technical" | "hr" | "coding" } | null;
  className?: string;
}

export default function VoiceInputCard({ savedAnswers = [], onSaveVoiceAnswer, currentQuestion, className }: VoiceInputCardProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event: any) => {
        let interimTranscript = "";
        let finalTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcriptPiece = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcriptPiece + " ";
          } else {
            interimTranscript += transcriptPiece;
          }
        }
        setTranscript(prev => (finalTranscript ? prev + finalTranscript : prev));
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const handleSaveVoiceAnswer = () => {
    if (transcript.trim() && onSaveVoiceAnswer) {
      onSaveVoiceAnswer(transcript);
      setTranscript("");
    }
  };

  const speakAnswer = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      speechSynthesis.cancel();
      speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
    }
  };

  return (
    <Card className={`overflow-hidden backdrop-blur-md bg-card/70 border-card-border flex flex-col ${className}`}>
      <CardHeader className="pb-3 flex-shrink-0">
        <CardTitle className="text-lg">Answer Panel</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-0 overflow-hidden">
        <Tabs defaultValue="answers" className="w-full h-full flex flex-col">
          {/* Tab List - Full width */}
          <div className="px-6 flex-shrink-0">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="answers" data-testid="tab-voice-answers">Answers</TabsTrigger>
              <TabsTrigger value="my-answers" data-testid="tab-my-answers">
                My Answers
                {savedAnswers.length > 0 && (
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {savedAnswers.length}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Answers Tab Content - Full width with proper height management */}
          <TabsContent value="answers" className="mt-4 flex-1 min-h-0 flex flex-col p-6 pt-0">
            <div className="flex-1 min-h-0 mb-4">
              <Textarea
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                placeholder="Start speaking or type your answer here..."
                className="h-full min-h-0 resize-none w-full"
                data-testid="textarea-voice-input"
              />
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <Button
                onClick={toggleListening}
                variant={isListening ? "destructive" : "default"}
                className="flex-1 gap-2"
                data-testid={isListening ? "button-stop-listening" : "button-start-listening"}
              >
                {isListening ? (
                  <>
                    <MicOff className="h-4 w-4" />
                    Stop Listening
                  </>
                ) : (
                  <>
                    <Mic className="h-4 w-4" />
                    Start Voice Input
                  </>
                )}
              </Button>
              <Button
                onClick={handleSaveVoiceAnswer}
                disabled={!transcript.trim() || !currentQuestion}
                className="gap-2"
                data-testid="button-save-voice-answer"
              >
                <Save className="h-4 w-4" />
                Save
              </Button>
            </div>
            {!currentQuestion && (
              <p className="text-xs text-muted-foreground text-center flex-shrink-0 mt-2">
                Select a question to save your answer
              </p>
            )}
          </TabsContent>

          {/* My Answers Tab Content - Full width with proper height management */}
      <TabsContent value="my-answers" className="mt-4 flex-1 min-h-0 flex flex-col p-6 pt-0">
  <div className="flex-1 min-h-0">
    <ScrollArea className="h-full w-full">
      <div className="space-y-3 w-full py-2">
        {savedAnswers.length === 0 ? (
          <div className="flex items-center justify-center h-full min-h-[100px] w-full">
            <p className="text-sm text-muted-foreground text-center">
              No answers recorded yet
            </p>
          </div>
        ) : (
          savedAnswers.map((answer, index) => (
            <Card key={index} className="bg-muted/50 w-full">
              <CardContent className="p-3 space-y-2">
                <div className="flex items-start justify-between gap-2 w-full">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h4 className="font-semibold text-sm">{answer.questionTitle}</h4>
                      <Badge variant="outline" className="text-xs">
                        {answer.type}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {new Date(answer.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                
                <div className="rounded-md bg-background p-2 border w-full max-h-40 overflow-y-auto">
                  <p className="text-sm whitespace-pre-wrap">
                    {answer.answer || "No answer provided"}
                  </p>
                </div>

                <div className="flex gap-2 flex-wrap">
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-2 text-xs"
                    onClick={() => speakAnswer(answer.answer)}
                    data-testid={`button-speak-${index}`}
                  >
                    <Volume2 className="h-3 w-3" />
                    Hear
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-2 text-xs"
                    onClick={stopSpeaking}
                    data-testid={`button-stop-${index}`}
                  >
                    <StopCircle className="h-3 w-3" />
                    Stop
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-2 text-xs !border-red-500 !text-red-500 hover:!bg-red-50"
                  >
                    <Trash className="h-3 w-3" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </ScrollArea>
  </div>
</TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}