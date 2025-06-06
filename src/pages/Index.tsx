
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import AuthPage from "@/components/auth/AuthPage";
import Header from "@/components/Header";
import Dashboard from "@/components/Dashboard";

const Index = () => {
  const { user, loading, signOut } = useAuth();
  const [isGuest, setIsGuest] = useState(false);
  const [trackFromDate, setTrackFromDate] = useState("2025-05-01");

  const handleContinueAsGuest = () => {
    setIsGuest(true);
  };

  const handleLogout = async () => {
    if (isGuest) {
      setIsGuest(false);
    } else {
      await signOut();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 dark:border-gray-100"></div>
          <p className="mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user && !isGuest) {
    return <AuthPage onContinueAsGuest={handleContinueAsGuest} />;
  }

  const username = isGuest ? "Guest" : user?.email?.split('@')[0] || "User";

  return (
    <div className="container mx-auto px-4 py-8">
      <Header
        username={username}
        isGuest={isGuest}
        trackFromDate={trackFromDate}
        onTrackFromDateChange={setTrackFromDate}
        onLogout={handleLogout}
      />
      
      <Dashboard 
        trackFromDate={trackFromDate} 
        userId={isGuest ? undefined : user?.id}
        isGuest={isGuest}
      />
    </div>
  );
};

export default Index;
