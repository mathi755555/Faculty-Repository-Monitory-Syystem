import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import Index from "./pages/Index";
import Auth from "./components/Auth";
import FacultyDashboard from "./components/FacultyDashboard";
import HODDashboard from "./components/HODDashboard";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30000,
      refetchOnWindowFocus: false
    }
  }
});

const App = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isHOD, setIsHOD] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [sessionError, setSessionError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const getSessionAndProfile = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          throw sessionError;
        }

        if (!mounted) return;

        const user = session?.user ?? null;
        setUser(user);

        if (user) {
          const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("email")
            .eq("id", user.id)
            .single();

          if (profileError) {
            throw profileError;
          }

          if (!mounted) return;

          if (profile) {
            setIsHOD(profile.email === "kaileshwar2005@gmail.com");
          }
        }
      } catch (error) {
        if (!mounted) return;
        console.error("Session/Profile error:", error);
        setSessionError(error instanceof Error ? error.message : "Failed to load user session");
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    getSessionAndProfile();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!mounted) return;

      try {
        const user = session?.user ?? null;
        setUser(user);

        if (user) {
          const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("email")
            .eq("id", user.id)
            .single();

          if (profileError) {
            throw profileError;
          }

          if (!mounted) return;

          if (profile) {
            setIsHOD(profile.email === "kaileshwar2005@gmail.com");
          }
        } else {
          setIsHOD(false);
        }
      } catch (error) {
        if (!mounted) return;
        console.error("Auth state change error:", error);
        setSessionError(error instanceof Error ? error.message : "Failed to update user session");
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setIsHOD(false);
      setSessionError(null);
    } catch (error) {
      console.error("Logout error:", error);
      setSessionError(error instanceof Error ? error.message : "Failed to sign out");
    }
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

  if (sessionError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error: {sessionError}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Retry
          </button>
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
                user ? (
                  isHOD ? (
                    <Navigate to="/hod\" replace />
                  ) : (
                    <Navigate to="/dashboard" replace />
                  )
                ) : (
                  <Index />
                )
              }
            />
            <Route
              path="/auth"
              element={
                user ? (
                  isHOD ? (
                    <Navigate to="/hod\" replace />
                  ) : (
                    <Navigate to="/dashboard" replace />
                  )
                ) : (
                  <Auth onAuthChange={setUser} />
                )
              }
            />
            <Route
              path="/dashboard"
              element={
                user ? (
                  isHOD ? (
                    <Navigate to="/hod\" replace />
                  ) : (
                    <FacultyDashboard onLogout={handleLogout} />
                  )
                ) : (
                  <Navigate to="/auth" replace />
                )
              }
            />
            <Route
              path="/hod"
              element={
                user ? (
                  isHOD ? (
                    <HODDashboard onLogout={handleLogout} />
                  ) : (
                    <Navigate to="/dashboard" replace />
                  )
                ) : (
                  <Navigate to="/auth" replace />
                )
              }
            />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;