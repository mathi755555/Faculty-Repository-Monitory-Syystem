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

const queryClient = new QueryClient();

console.log("App module loaded");

const App = () => {
  console.log("App rendered");

  const [user, setUser] = useState<User | null>(null);
  const [isHOD, setIsHOD] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("useEffect started");

    let mounted = true;

    const fetchProfile = async (user: User) => {
      console.log("Fetching profile for user:", user.id);
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("email")
        .eq("id", user.id)
        .single();

      if (!error && profile && mounted) {
        console.log("Profile fetched:", profile);
        setIsHOD(profile.email === "kaileshwar2005@gmail.com");
      } else if (error) {
        console.error("Error fetching profile:", error);
      }
    };

    const getSessionAndProfile = async () => {
      console.log("Getting session");
      const { data } = await supabase.auth.getSession();
      const user = data.session?.user ?? null;

      if (!mounted) return;

      console.log("Session user:", user);
      setUser(user);

      if (user) {
        await fetchProfile(user);
      } else {
        setIsHOD(false);
      }

      setLoading(false);
      console.log("Loading set to false after session fetch");
    };

    getSessionAndProfile();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!mounted) return;

      const user = session?.user ?? null;
      console.log("Auth state changed. User:", user);
      setUser(user);

      if (user) {
        await fetchProfile(user);
      } else {
        setIsHOD(false);
      }

      // Do NOT set loading here to avoid flicker
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
      console.log("Cleanup: unsubscribed");
    };
  }, []);

  const handleLogout = async () => {
    console.log("Logging out");
    await supabase.auth.signOut();
    setUser(null);
    setIsHOD(false);
  };

  if (loading) {
    console.log("Rendering loading screen");
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  console.log("Rendering main app, user:", user, "isHOD:", isHOD);

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
