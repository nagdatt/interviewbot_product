import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AppProvider } from "@/contexts/AppContext";

import Login from "@/pages/Login";
import Home from "@/pages/Home";
import InterviewSetup from "@/pages/InterviewSetup";
import InterviewRoom from "@/pages/InterviewRoom";
import Analysis from "@/pages/Analysis";
import History from "@/pages/History";
import PersonalDetails from "@/pages/PersonalDetails";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/" component={Home} />
      <Route path="/interview-setup" component={InterviewSetup} />
      <Route path="/interview-room" component={InterviewRoom} />
      <Route path="/analysis" component={Analysis} />
      <Route path="/history" component={History} />
      <Route path="/personal-details" component={PersonalDetails} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AppProvider>
          <TooltipProvider>
            <Router />
            <Toaster />
          </TooltipProvider>
        </AppProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
