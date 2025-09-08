import React from "react";
import { Button } from "../ui/Button";


const GoogleAuthButton = () => {

    const handleGoogleAuth = async () => {
        window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
    };

  return (
    <Button
      onClick={handleGoogleAuth}
      variant="ghost"
      className="w-full max-w-md mt-2 border-1 border-neutral"
    >
      <img src="/google.webp" alt="Google" className="mr-2 h-4 w-4 inline" />
      Login with Google
    </Button>
  );
};

export default GoogleAuthButton;
