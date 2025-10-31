import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Volume2, FileText } from "lucide-react";

interface Answer {
  questionId: string;
  questionTitle: string;
  answer: string;
  timestamp: string;
  type: "technical" | "hr" | "coding";
}

interface AnswerHistoryCardProps {
  answers: Answer[];
}

export default function AnswerHistoryCard({ answers }: AnswerHistoryCardProps) {
  const speakAnswer = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      speechSynthesis.cancel();
      speechSynthesis.speak(utterance);
    } else {
      console.log('Text-to-speech not supported');
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">My Answers</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-64">
          <div className="space-y-3 pr-4">
            {answers.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No answers recorded yet
              </p>
            ) : (
              answers.map((answer, index) => (
                <Card key={index} className="bg-muted/50">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-sm">{answer.questionTitle}</h4>
                          <Badge variant="outline" className="text-xs">
                            {answer.type}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">
                          {new Date(answer.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="rounded-md bg-background p-3 border">
                      <p className="text-sm whitespace-pre-wrap">
                        {answer.answer || "No answer provided"}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-2"
                        onClick={() => speakAnswer(answer.answer)}
                        data-testid={`button-speak-${index}`}
                      >
                        <Volume2 className="h-3 w-3" />
                        Hear Answer
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-2"
                        onClick={stopSpeaking}
                        data-testid={`button-stop-${index}`}
                      >
                        Stop
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-2"
                        onClick={stopSpeaking}
                        data-testid={`button-stop-${index}`}
                      >
                       Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
