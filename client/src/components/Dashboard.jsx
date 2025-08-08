import React from "react";
import EmailForm from "./EmailForm";
import toast from "react-hot-toast";
import { appservice } from "../servise/servise";

export default function Dashboard({ user }) {
  const logout = async () => {
    try {
      await appservice.logout();
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("googleAccessToken");

      toast.success("Logout successful.", {
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

      window.location.href = "/";
    } catch (err) {
      console.error("Logout error:", err);
      toast.error("Logout failed.", {
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
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="navbar bg-base-100 rounded-box shadow-lg">
          <div className="navbar-start">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                              <img className="w-7 h-6 mt-1" src="./favicon.png" alt="icon" />

              </div>
              <div>
                <h1 className="text-xl font-bold">MailMint</h1>
                <p className="text-sm text-base-content/70">
                  Welcome, {user.name}
                </p>
              </div>
            </div>
          </div>

          <div className="navbar-end">
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar"
              >
                <div className="w-10 rounded-full bg-primary text-primary-content flex items-center justify-center">
                  <img src={user.picture} alt="Profile" />
                </div>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-max"
              >
                <li>
                  <a className="justify-between">{user.email}</a>
                </li>
                
                <li>
                  <button onClick={() => logout()}>Logout</button>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <EmailForm />
      </div>
    </div>
  );
}
