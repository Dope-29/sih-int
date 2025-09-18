import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import CreateTeam from "./pages/CreateTeam";
import TeamFormation from "./pages/TeamFormation";
import JoinTeam from "./pages/JoinTeam";
import FindTeams from "./pages/FindTeams";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./contexts/AuthContext";
import TeamDetails from "./pages/TeamDetails";
import { Toaster } from "@/components/ui/toaster";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Navigate to="/team-details" replace />} />
              <Route path="/register" element={<Register />} />
              <Route path="/create-team" element={<CreateTeam />} />
              <Route path="/team-formation" element={<TeamFormation />} />
              <Route path="/join-team" element={<JoinTeam />} />
              <Route path="/find-teams" element={<FindTeams />} />
              <Route path="/team-details" element={<TeamDetails />} />
            </Route>
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="/*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
