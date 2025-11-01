import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { type Question } from "@/utils/sampleQuestions";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface QuestionListProps {
  questions: Question[];
  selectedQuestionId?: string;
  onSelectQuestion: (questionId: string) => void;
  className?: string;
}

export default function QuestionList({ questions, selectedQuestionId, onSelectQuestion, className }: QuestionListProps) {
  const [showAnswers, setShowAnswers] = useState<Record<string, boolean>>({});

  const toggleAnswer = (questionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setShowAnswers(prev => ({ ...prev, [questionId]: !prev[questionId] }));
  };

  return (
   <ScrollArea className={cn("h-full", className)}>
  <div className="space-y-2 pr-4 pb-4">
        {questions.map((question) => (
          <Card
            key={question.id}
            className={cn(
              "cursor-pointer transition-all hover-elevate active-elevate-2",
              selectedQuestionId === question.id && "border-primary bg-accent"
            )}
            onClick={() => onSelectQuestion(question.id)}
            data-testid={`question-${question.id}`}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex-1">
                  <h4 className="font-semibold text-sm mb-1">{question.title}</h4>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {question.description}
                  </p>
                </div>
                <div className="flex flex-col gap-1">
                  <Badge variant="secondary" className="text-xs">
                    {question.category}
                  </Badge>
                  {question.difficulty && (
                    <Badge
                      variant={
                        question.difficulty === "easy"
                          ? "default"
                          : question.difficulty === "medium"
                          ? "secondary"
                          : "destructive"
                      }
                      className="text-xs"
                    >
                      {question.difficulty}
                    </Badge>
                  )}
                </div>
              </div>

              {question.answer && (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
                    <Switch
                      id={`show-answer-${question.id}`}
                      checked={showAnswers[question.id] || false}
                      onCheckedChange={() => setShowAnswers(prev => ({ ...prev, [question.id]: !prev[question.id] }))}
                      data-testid={`switch-answer-${question.id}`}
                    />
                    <Label htmlFor={`show-answer-${question.id}`} className="text-xs cursor-pointer">
                      Show Answer
                    </Label>
                  </div>

                  {showAnswers[question.id] && (
                    <div className="rounded-md border bg-muted/50 p-3 mt-2">
                      <Badge variant="default" className="mb-2 text-xs">Suggested Answer</Badge>
                      <div className="text-xs whitespace-pre-wrap font-mono text-muted-foreground">
                        {question.answer}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
}
