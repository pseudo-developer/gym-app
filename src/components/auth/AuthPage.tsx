
import { useState } from "react";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";

interface AuthPageProps {
  onAuthenticated: (username: string, isGuest?: boolean) => void;
}

const AuthPage = ({ onAuthenticated }: AuthPageProps) => {
  const [isLogin, setIsLogin] = useState(true);

  const handleLogin = (username: string) => {
    onAuthenticated(username, false);
  };

  const handleSignup = (username: string) => {
    onAuthenticated(username, false);
  };

  const handleContinueAsGuest = () => {
    onAuthenticated("Guest", true);
  };

  return (
    <div>
      {isLogin ? (
        <LoginForm
          onLogin={handleLogin}
          onContinueAsGuest={handleContinueAsGuest}
          onSwitchToSignup={() => setIsLogin(false)}
        />
      ) : (
        <SignupForm
          onSignup={handleSignup}
          onSwitchToLogin={() => setIsLogin(true)}
        />
      )}
    </div>
  );
};

export default AuthPage;
