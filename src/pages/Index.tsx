
import { useState } from "react";
import AuthPage from "@/components/auth/AuthPage";
import Header from "@/components/Header";
import Dashboard from "@/components/Dashboard";

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [isGuest, setIsGuest] = useState(false);
  const [trackFromDate, setTrackFromDate] = useState("2025-05-01");

  const handleAuthenticated = (user: string, guest = false) => {
    setUsername(user);
    setIsGuest(guest);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUsername("");
    setIsGuest(false);
  };

  if (!isAuthenticated) {
    return <AuthPage onAuthenticated={handleAuthenticated} />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Header
        username={username}
        isGuest={isGuest}
        trackFromDate={trackFromDate}
        onTrackFromDateChange={setTrackFromDate}
        onLogout={handleLogout}
      />
      
      <Dashboard trackFromDate={trackFromDate} />
    </div>
  );
};

export default Index;
