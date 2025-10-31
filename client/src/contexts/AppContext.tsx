import { createContext, useContext, useState, ReactNode } from "react";

interface PersonalDetails {
  name: string;
  email: string;
  skills: string[];
  projects: string;
  experience: string;
  resumeUrl?: string;
  profilePicture?: string;
}

interface InterviewSetup {
  companyName: string;
  expectedPackage: string;
  techStacks: string[];
  duration: string;
}

interface InterviewAnswer {
  questionId: string;
  answer: string;
  type: "technical" | "hr" | "coding";
}

interface InterviewSession {
  id: string;
  date: string;
  companyName: string;
  techStacks: string[];
  duration: string;
  accuracy: number;
  timeTaken: string;
  communicationScore: number;
  codingScore: number;
  answers: InterviewAnswer[];
}

interface AppContextType {
  personalDetails: PersonalDetails;
  updatePersonalDetails: (details: Partial<PersonalDetails>) => void;
  currentInterviewSetup: InterviewSetup | null;
  setCurrentInterviewSetup: (setup: InterviewSetup) => void;
  interviewSessions: InterviewSession[];
  saveInterviewSession: (session: InterviewSession) => void;
  currentAnswers: InterviewAnswer[];
  saveAnswer: (answer: InterviewAnswer) => void;
  clearCurrentInterview: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [personalDetails, setPersonalDetails] = useState<PersonalDetails>({
    name: "",
    email: "",
    skills: [],
    projects: "",
    experience: "",
  });

  const [currentInterviewSetup, setCurrentInterviewSetup] = useState<InterviewSetup | null>(null);
  const [interviewSessions, setInterviewSessions] = useState<InterviewSession[]>([]);
  const [currentAnswers, setCurrentAnswers] = useState<InterviewAnswer[]>([]);

  const updatePersonalDetails = (details: Partial<PersonalDetails>) => {
    setPersonalDetails(prev => ({ ...prev, ...details }));
  };

  const saveInterviewSession = (session: InterviewSession) => {
    setInterviewSessions(prev => [session, ...prev]);
  };

  const saveAnswer = (answer: InterviewAnswer) => {
    setCurrentAnswers(prev => {
      const existing = prev.findIndex(a => a.questionId === answer.questionId);
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = answer;
        return updated;
      }
      return [...prev, answer];
    });
  };

  const clearCurrentInterview = () => {
    setCurrentAnswers([]);
    setCurrentInterviewSetup(null);
  };

  return (
    <AppContext.Provider
      value={{
        personalDetails,
        updatePersonalDetails,
        currentInterviewSetup,
        setCurrentInterviewSetup,
        interviewSessions,
        saveInterviewSession,
        currentAnswers,
        saveAnswer,
        clearCurrentInterview,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
}
