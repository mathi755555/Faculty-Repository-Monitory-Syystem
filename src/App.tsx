
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import Index from "./pages/Index";
import Auth from "./components/Auth";
import FacultyDashboard from "./components/FacultyDashboard";
import HODDashboard from "./components/HODDashboard";

const queryClient = new QueryClient();

const App = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route 
              path="/" 
              element={
                user ? <Navigate to="/dashboard" replace /> : <Index />
              } 
            />
            <Route 
              path="/auth" 
              element={
                user ? <Navigate to="/dashboard" replace /> : <Auth onAuthChange={setUser} />
              } 
            />
            <Route 
              path="/dashboard" 
              element={
                user ? <FacultyDashboard onLogout={handleLogout} /> : <Navigate to="/auth" replace />
              } 
            />
            <Route 
              path="/hod" 
              element={
                user ? <HODDashboard onLogout={handleLogout} /> : <Navigate to="/auth" replace />
              } 
            />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
