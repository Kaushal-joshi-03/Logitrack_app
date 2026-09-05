import { createContext, useContext, useState, useEffect } from "react";
import { API_BASE_URL } from "../config/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("logitrack_user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem("logitrack_token") || null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem("logitrack_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("logitrack_user");
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem("logitrack_token", token);
    } else {
      localStorage.removeItem("logitrack_token");
    }
  }, [token]);

  const normalizeRole = (r) => {
    if (!r) return "client";
    const lower = String(r).toLowerCase().trim();
    if (lower === "delivery_person") return "delivery";
    return lower;
  };

  const getRegisteredUsersMap = () => {
    try {
      const saved = localStorage.getItem("logitrack_registered_users");
      const defaultUsers = {
        "admin@logitrack.com": { name: "Lakshya", role: "admin" },
        "amit@logitrack.com": { name: "Amit Verma", role: "admin" },
        "neha@logitrack.com": { name: "Neha Gupta", role: "admin" },
        "kaushal@company.com": { name: "Kaushal", role: "client" },
        "lakshyachoudhary2804@gmail.com": { name: "Lakshya", role: "admin" },
      };
      return saved ? { ...defaultUsers, ...JSON.parse(saved) } : defaultUsers;
    } catch {
      return {};
    }
  };

  const login = async (email, password, role) => {
    const cleanEmail = email.toLowerCase().trim();
    const registeredUsers = getRegisteredUsersMap();
    const existingRegistered = registeredUsers[cleanEmail];
    const selectedNormalizedRole = normalizeRole(role);

    // Client-side role pre-check if user is in local registered map
    if (existingRegistered && existingRegistered.role && normalizeRole(existingRegistered.role) !== selectedNormalizedRole) {
      const formattedRole = String(role).charAt(0).toUpperCase() + String(role).slice(1);
      return {
        success: false,
        message: `These credentials are not registered under the ${formattedRole} role. Please select the correct role or check your credentials.`,
      };
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: cleanEmail, password, role: selectedNormalizedRole }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        const returnedUser = data.user || data.data?.user || {};
        const returnedToken = data.token || data.data?.token;
        const userName = returnedUser.name || existingRegistered?.name || "User";
        const userRole = normalizeRole(returnedUser.role || selectedNormalizedRole || existingRegistered?.role);

        // Verify that returned user role matches selected role
        if (selectedNormalizedRole && userRole !== selectedNormalizedRole) {
          const formattedRole = String(role).charAt(0).toUpperCase() + String(role).slice(1);
          return {
            success: false,
            message: `These credentials are not registered under the ${formattedRole} role. Please select the correct role or check your credentials.`,
          };
        }

        const userData = {
          id: returnedUser.id || returnedUser._id || "user-" + Date.now(),
          name: userName,
          email: returnedUser.email || cleanEmail,
          role: userRole,
        };
        setUser(userData);
        setToken(returnedToken);
        return { success: true, token: returnedToken, user: userData };
      } else {
        return {
          success: false,
          message: data.message || "Invalid email or password",
        };
      }
    } catch {
      return {
        success: false,
        message: "Unable to connect to the server. Please check your network or try again.",
      };
    }
  };

  const register = async (name, email, password, role) => {
    const cleanEmail = email.toLowerCase().trim();
    const cleanName = name.trim();
    const normalizedRole = normalizeRole(role);

    try {
      // Save locally in registry
      const registeredUsers = getRegisteredUsersMap();
      registeredUsers[cleanEmail] = { name: cleanName, role: normalizedRole };
      localStorage.setItem("logitrack_registered_users", JSON.stringify(registeredUsers));

      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: cleanName, email: cleanEmail, password, role: normalizedRole }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        return { success: true, message: data.message || "Registration successful!" };
      } else {
        return { success: false, message: data.message || "Registration failed" };
      }
    } catch {
      return { success: false, message: "Unable to connect to the registration server. Please check your connection." };
    }
  };

  const forgotPassword = async (email, newPassword) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, newPassword }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        return { success: true, message: data.message || "Password reset instructions sent!" };
      } else {
        return { success: false, message: data.message || "Password reset request failed" };
      }
    } catch {
      return { success: false, message: "Unable to reach the server. Please try again." };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("logitrack_user");
    localStorage.removeItem("logitrack_token");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        login,
        register,
        forgotPassword,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
