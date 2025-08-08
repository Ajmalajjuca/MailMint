import React from "react";
import { useGoogleLogin } from "@react-oauth/google";
import toast from "react-hot-toast";
import { appservice } from "../servise/servise";

export default function Login() {
  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {

      const accessToken = tokenResponse.access_token;
      localStorage.setItem("googleAccessToken", accessToken);
      try {
        // Send token to backend for verification + login/register
    
        const response = await appservice.loginWithGoogle(accessToken);
        const {user, token} = response.data;

        // localStorage.setItem("token", res.data.token)
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("token", token);
        window.location.href = "/";
      } catch (err) {
        console.error("Login error:", err);
        toast.error("Login failed. Please try again.", {
          style: {
            border: "1px solid #713200",
            padding: "16px",
            color: "#713200",
          },
          iconTheme: {
            primary: "#713200",
            secondary: "#FFFAEE",
          },
        });
      }
    },
    onError: (error) => {
      toast.error("Login failed. Please try again.", {
        style: {
          border: "1px solid #713200",
          padding: "16px",
          color: "#713200",
        },
        iconTheme: {
          primary: "#713200",
          secondary: "#FFFAEE",
        },
      });
      console.error("Login error:", error);
    },
    flow: "implicit", // or 'auth-code' if you're exchanging code on the backend
    scope: "profile email https://www.googleapis.com/auth/gmail.send", // Added Gmail scope
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50">
      <div className="card w-96 bg-base-100 shadow-2xl">
        <div className="card-body items-center text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <img className="w-12 h-10 mt-1" src="./favicon.png" alt="icon" />
            </div>
            <h2 className="text-2xl font-bold">MailMint</h2>
            <p className="text-base-content/70">
              Generate professional emails with AI assistance
            </p>
          </div>

          <button
            onClick={() => login()}
            className="btn btn-primary btn-wide gap-2"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  );
}
