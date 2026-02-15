import type { CredentialResponse } from "@react-oauth/google";
import { GoogleLogin } from "@react-oauth/google";
import React from "react";

interface GoogleSignInProps {
  onSuccess: (user: Record<string, unknown>) => void;
  onError?: (error: string) => void;
}

const GoogleSignIn: React.FC<GoogleSignInProps> = ({ onSuccess, onError }) => {
  const handleSuccess = async (credentialResponse: CredentialResponse) => {
    try {
      if (!credentialResponse.credential) {
        throw new Error("No credential received");
      }

      // Send the token to your backend
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/v0/api/google`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: credentialResponse.credential,
          }),
        },
      );

      if (response.status !== 200) {
        throw new Error("Failed to sign in with Google");
      }
      const { token, user } = await response.json();

      // Store token in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // Call success callback
      onSuccess(user);
    } catch (error) {
      console.error("Google sign-in error:", error);
      onError?.("Failed to sign in with Google");
    }
  };

  const handleError = () => {
    console.error("Google sign-in failed");
    onError?.("Google sign-in failed");
  };

  return (
    <div className="google-signin-container">
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={handleError}
        useOneTap
        theme="outline"
        size="large"
        text="continue_with"
      />
    </div>
  );
};

export default GoogleSignIn;
