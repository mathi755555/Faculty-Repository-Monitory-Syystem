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
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false
    }
  }
});

const App = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isHOD, setIsHOD] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [sessionError, setSessionError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let mounted = true;
    let authSubscription: { unsubscribe: () => void } | null = null;

    const initializeAuth = async () => {
      try {
        setLoading(true);
        setSessionError(null);

        // Get initial session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) throw sessionError;
        if (!mounted) return;

        const currentUser = session?.user ?? null;
        setUser(currentUser);

        if (currentUser) {
          const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("email")
            .eq("id", currentUser.id)
            .single();

          if (profileError) {
            if (profileError.code === "PGRST116") {
              // Profile doesn't exist, create it
              await supabase.from("profiles").insert({
                id: currentUser.id,
                email: currentUser.email,
                full_name: currentUser.user_metadata?.full_name || currentUser.email
              });
            } else {
              throw profileError;
            }
          }

          if (!mounted) return;
          setIsHOD(profile?.email === "kaileshwar2005@gmail.com");
        }

        // Set up auth state change subscription
        authSubscription = supabase.auth.onAuthStateChange(async (event, session) => {
          if (!mounted) return;

          const currentUser = session?.user ?? null;
          setUser(currentUser);

          if (currentUser) {
            try {
              const { data: profile, error: profileError } = await supabase
                .from("profiles")
                .select("email")
                .eq("id", currentUser.id)
                .single();

              if (profileError) throw profileError;
              if (!mounted) return;

              setIsHOD(profile?.email === "kaileshwar2005@gmail.com");
            } catch (error) {
              console.error("Profile fetch error:", error);
              setIsHOD(false);
            }
          } else {
            setIsHOD(false);
          }
        });

      } catch (error) {
        if (!mounted) return;
        console.error("Auth initialization error:", error);
        setSessionError(error instanceof Error ? error.message : "Failed to initialize authentication");
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
      authSubscription?.unsubscribe();
    };
  }, [retryCount]); // Add retryCount to dependencies to allow manual retry

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setIsHOD(false);
      setSessionError(null);
      queryClient.clear(); // Clear query cache on logout
    } catch (error) {
      console.error("Logout error:", error);
      setSessionError(error instanceof Error ? error.message : "Failed to sign out");
    }
  };

  const handleRetry = () => {
    setRetryCount(count => count + 1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Initializing application...</p>
        </div>
      </div>
    );
  }

  if (sessionError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error: {sessionError}</p>
          <Button
            onClick={handleRetry}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Retry
          </Button>
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