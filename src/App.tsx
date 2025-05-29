import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

import Index from "./pages/Index";
import Auth from "./components/Auth";
import FacultyDashboard from "./components/FacultyDashboard";
import HODDashboard from "./components/HODDashboard";
import { Button } from "@/components/ui/button";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30000,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
    },
  },
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

    const fetchProfile = async (user: User) => {
      try {
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("email")
          .eq("id", user.id)
          .single();

        if (error && error.code === "PGRST116") {
          // Profile doesn't exist, create one
          await supabase.from("profiles").insert({
            id: user.id,
            email: user.email,
            full_name: user.user_metadata?.full_name || user.email,
          });
          setIsHOD(user.email === "kaileshwar2005@gmail.com");
        } else if (error) {
          console.error("Error fetching profile:", error);
        } else if (profile && mounted) {
          setIsHOD(profile.email === "kaileshwar2005@gmail.com");
        }
      } catch (err) {
        console.error("Unhandled error fetching profile:", err);
      }
    };

    const initializeAuth = async () => {
      try {
        setLoading(true);
        setSessionError(null);

        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) throw sessionError;
        if (!mounted) return;

        const currentUser = session?.user ?? null;
        setUser(currentUser);

        if (currentUser) {
          await fetchProfile(currentUser);
        } else {
          setIsHOD(false);
        }

        authSubscription = supabase.auth.onAuthStateChange(async (_event, session) => {
          if (!mounted) return;

          const user = session?.user ?? null;
          setUser(user);

          if (user) {
            await fetchProfile(user);
          } else {
            setIsHOD(false);
          }
        });

      } catch (error) {
        console.error("Auth initialization error:", error);
        setSessionError(error instanceof Error ? error.message : "Failed to initialize authentication");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
      authSubscription?.unsubscribe();
    };
  }, [retryCount]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setIsHOD(false);
      setSessionError(null);
      queryClient.clear();
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
                    <Navigate to="/hod" replace />
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
                    <Navigate to="/hod" replace />
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
                    <Navigate to="/hod" replace />
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
