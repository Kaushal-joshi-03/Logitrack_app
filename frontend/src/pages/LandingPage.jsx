import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/navigation/Navbar";
import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { API_BASE_URL } from "../config/api";
import { useAuth } from "../context/AuthContext";
import {
  LandingScrollProvider,
  useLandingScroll,
} from "../context/LandingScrollContext";
import ScrollProgressBar from "../components/landing/ScrollProgressBar";
import HeroBlobBackground from "../components/landing/HeroBlobBackground";
import HeroPinballBubbles from "../components/landing/HeroPinballBubbles";
import HeroTextCarousel from "../components/landing/HeroTextCarousel";
import {
  ServicesSection,
  SolutionsSection,
  NetworkSection,
  TrackingSection,
  SupportSection,
} from "../components/landing/LandingSections";
import ScrollTruckAnimation from "../components/landing/ScrollTruckAnimation";
import PartnerMarquee from "../components/landing/PartnerMarquee";
import Footer from "../components/navigation/Footer";
import useReducedMotion from "../hooks/useReducedMotion";
import "./LandingPage.css";

const SECTION_IDS = [
  "home-section",
  "services-section",
  "solutions-section",
  "network-section",
  "tracking-section",
  "support-section",
];
const NAV_OFFSET = 76;

const roles = [
  "Client",
  "Warehouse",
  "Distributor",
  "Delivery",
  "Admin",
];
function CityConnections() {
  return (
    <svg
      className="city-connections"
      viewBox="0 0 1000 650"
      preserveAspectRatio="none"
    >
      {/* DELHI → CUBE */}
      <path
        className="connection-line"
        d="M 120 115 C 260 150, 350 170, 505 250"
      />

      {/* AHMEDABAD → CUBE */}
      <path
        className="connection-line"
        d="M 120 470 C 280 420, 370 340, 505 250"
      />

      {/* MUMBAI → CUBE */}
      <path
        className="connection-line"
        d="M 880 220 C 760 230, 650 245, 505 250"
      />

      {/* moving dots */}
      <circle className="connection-dot">
        <animateMotion
          dur="3s"
          repeatCount="indefinite"
          path="M 120 115 C 260 150, 350 170, 505 250"
        />
      </circle>

      <circle className="connection-dot">
        <animateMotion
          dur="3.5s"
          repeatCount="indefinite"
          path="M 120 470 C 280 420, 370 340, 505 250"
        />
      </circle>

      <circle className="connection-dot">
        <animateMotion
          dur="3.2s"
          repeatCount="indefinite"
          path="M 880 220 C 760 230, 650 245, 505 250"
        />
      </circle>
    </svg>
  );
}
function ConnectionLine({ className = "", delay = 0 }) {
  return (
    <motion.div
      initial={{ scaleX: 0, opacity: 0 }}
      animate={{ scaleX: 1, opacity: 1 }}
      transition={{
        duration: 1,
        delay,
        ease: "easeOut",
      }}
      className={`
        pointer-events-none
        absolute
        z-10
        h-px
        origin-left
        bg-gradient-to-r
        from-[#ff2538]
        via-[#ff2538]/60
        to-transparent
        shadow-[0_0_8px_rgba(255,37,56,0.45)]
        ${className}
      `}
    >
      <motion.span
        animate={{
          left: ["0%", "100%"],
          opacity: [0, 1, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          delay,
          ease: "linear",
        }}
        className="
          absolute
          top-1/2
          h-1.5
          w-1.5
          -translate-y-1/2
          rounded-full
          bg-[#ff2538]
          shadow-[0_0_10px_rgba(255,37,56,0.9)]
        "
      />
    </motion.div>
  );
}


function RoleButton({ role, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        flex
        h-[64px] sm:h-[68px]
        min-w-0
        flex-1
        flex-col
        items-center
        justify-center
        rounded-md
        px-1 sm:px-2
        py-1.5
        transition-all
        duration-200
        ${active
          ? "bg-[#111111] text-white shadow-[0_8px_20px_rgba(0,0,0,0.18)]"
          : "bg-[#edf2f7] text-slate-700 hover:bg-[#e3e9ef] border border-slate-200/60"
        }
      `}
    >
      <span className="mb-0.5 sm:mb-1 text-[11px] sm:text-[13px]">
        ◇
      </span>

      <span className="whitespace-nowrap text-[10px] sm:text-[11px] md:text-[12px] font-medium leading-none">
        {role}
      </span>
    </button>
  );
}
function LoginCard() {
  const [activeTab, setActiveTab] = useState("login");
  const [selectedRole, setSelectedRole] = useState("Client");

  // Login fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  // Register fields
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regNameError, setRegNameError] = useState(false);
  const [regEmailError, setRegEmailError] = useState(false);
  const [regPasswordError, setRegPasswordError] = useState(false);

  // Forgot password fields
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotNewPassword, setForgotNewPassword] = useState("");
  const [showForgotPass, setShowForgotPass] = useState(false);

  // Feedback messages
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const [trackingId, setTrackingId] = useState("");
  const [trackResult, setTrackResult] = useState(null);
  const [trackLoading, setTrackLoading] = useState(false);
  const [trackError, setTrackError] = useState("");
  const navigate = useNavigate();
  const { login, register, forgotPassword } = useAuth();

  const roles = [
    "Client",
    "Warehouse",
    "Distributor",
    "Delivery",
    "Admin",
  ];

  const roleRoutes = {
    client: "/client",
    warehouse: "/warehouse",
    distributor: "/distributor",
    delivery: "/delivery",
    admin: "/admin",
  };

  const handleLoginSubmit = async (e) => {
    e?.preventDefault?.();
    setErrorMsg("");
    setSuccessMsg("");

    let hasError = false;
    if (!email.trim()) {
      setEmailError(true);
      hasError = true;
    }
    if (!password.trim()) {
      setPasswordError(true);
      hasError = true;
    }

    if (hasError) {
      return;
    }

    setLoading(true);
    const res = await login(email, password, selectedRole);
    setLoading(false);

    if (res.success) {
      const rawRole = (res.user?.role || selectedRole || "client").toLowerCase().trim();
      const normalizedRole = rawRole === "delivery_person" ? "delivery" : rawRole;
      const dest = roleRoutes[normalizedRole] || "/client";
      navigate(dest);
    } else {
      setEmailError(true);
      setPasswordError(true);
      setErrorMsg(res.message || "Invalid credentials. Please try again.");
    }
  };

  const handleRegisterSubmit = async (e) => {
    e?.preventDefault?.();
    setErrorMsg("");
    setSuccessMsg("");

    let hasError = false;
    if (!regName.trim()) {
      setRegNameError(true);
      hasError = true;
    }
    if (!regEmail.trim()) {
      setRegEmailError(true);
      hasError = true;
    }
    if (!regPassword.trim()) {
      setRegPasswordError(true);
      hasError = true;
    }

    if (hasError) {
      return;
    }

    setLoading(true);
    const res = await register(regName, regEmail, regPassword, selectedRole);
    setLoading(false);

    if (res.success) {
      setSuccessMsg(res.message || "Account registered successfully! Please log in.");
      setEmail(regEmail);
      setPassword(regPassword);
      setTimeout(() => {
        setActiveTab("login");
        setSuccessMsg("Account created! You can now log in.");
      }, 1200);
    } else {
      setErrorMsg(res.message || "Registration failed. Try a different email.");
    }
  };

  const handleForgotSubmit = async (e) => {
    e?.preventDefault?.();
    setErrorMsg("");
    setSuccessMsg("");

    if (!forgotEmail.trim() || !forgotNewPassword.trim()) {
      setErrorMsg("Please provide your email and a new password.");
      return;
    }

    setLoading(true);
    const res = await forgotPassword(forgotEmail, forgotNewPassword);
    setLoading(false);

    if (res.success) {
      setSuccessMsg("Password updated successfully! Please log in.");
      setEmail(forgotEmail);
      setPassword(forgotNewPassword);
      setTimeout(() => {
        setActiveTab("login");
      }, 1500);
    } else {
      setErrorMsg(res.message || "Password recovery failed.");
    }
  };

  const handleQuickTrack = async () => {
    const id = trackingId.trim();
    if (!id) {
      setTrackError("Please enter a Shipment ID.");
      setTrackResult(null);
      return;
    }
    setTrackLoading(true);
    setTrackError("");
    setTrackResult(null);
    try {
      const res = await fetch(`${API_BASE_URL}/api/packages/public/track/${encodeURIComponent(id)}`);
      const data = await res.json();
      if (res.ok && data.success) {
        setTrackResult(data.data);
      } else {
        setTrackError(data.message || "Shipment ID not found. Please check and try again.");
      }
    } catch {
      setTrackError("Unable to connect to the server. Please try again.");
    } finally {
      setTrackLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 35 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        duration: 0.7,
        ease: "easeOut",
      }}
      className="
        flex
        w-full
        flex-col
        overflow-hidden
        rounded-[16px]
        bg-[#f7f8fa]
        text-slate-900
        shadow-[0_25px_70px_rgba(0,0,0,0.45)]
      "
    >

      {/* =================================================
          TABS
      ================================================= */}

      <div className="grid h-[70px] shrink-0 grid-cols-2 border-b border-slate-200">

        <button
          type="button"
          onClick={() => {
            setActiveTab("login");
            setErrorMsg("");
            setSuccessMsg("");
          }}
          className={`
            relative
            text-[16px]
            font-medium
            transition
            ${activeTab === "login" || activeTab === "register" || activeTab === "forgot"
              ? "text-slate-900 font-bold"
              : "text-slate-400"
            }
          `}
        >
          {activeTab === "register" ? "REGISTER" : activeTab === "forgot" ? "RECOVER" : "LOGIN"}

          {(activeTab === "login" || activeTab === "register" || activeTab === "forgot") && (
            <motion.span
              layoutId="activeTab"
              className="
                absolute
                bottom-0
                left-8
                right-8
                h-[3px]
                bg-[#ff2438]
              "
            />
          )}
        </button>


        <button
          type="button"
          onClick={() => {
            setActiveTab("track");
            setErrorMsg("");
            setSuccessMsg("");
          }}
          className={`
            relative
            text-[16px]
            font-medium
            transition
            ${activeTab === "track"
              ? "text-slate-900 font-bold"
              : "text-[#91a4bc]"
            }
          `}
        >
          QUICK TRACK

          {activeTab === "track" && (
            <motion.span
              layoutId="activeTab"
              className="
                absolute
                bottom-0
                left-8
                right-8
                h-[3px]
                bg-[#ff2438]
              "
            />
          )}
        </button>

      </div>


      {/* =================================================
          LOGIN TAB
      ================================================= */}

      {activeTab === "login" && (

        <form onSubmit={handleLoginSubmit}>

          <div className="px-4 sm:px-8 py-5 sm:py-6">

            <h2 className="text-[14px] sm:text-[15px] font-black tracking-tight">
              SELECT YOUR FUNCTIONAL ROLE
            </h2>


            {/* ROLE BUTTONS */}

            <div className="mt-4 flex w-full gap-1.5 sm:gap-2">

              {roles.map((role) => (
                <RoleButton
                  key={role}
                  role={role}
                  active={selectedRole === role}
                  onClick={() => setSelectedRole(role)}
                />
              ))}

            </div>


            {/* SELECTED ROLE */}

            <div className="mt-4 flex items-center justify-between text-[12px] text-slate-400">
              <div>
                Logging in as:
                <span className="ml-1 font-bold text-slate-900">
                  {selectedRole.toUpperCase()}
                </span>
              </div>
            </div>

            {errorMsg && (
              <div className="mt-3 rounded bg-red-500/10 p-2 text-xs font-semibold text-red-600 border border-red-500/20">
                {errorMsg}
              </div>
            )}

            {successMsg && (
              <div className="mt-3 rounded bg-emerald-500/10 p-2 text-xs font-semibold text-emerald-600 border border-emerald-500/20">
                {successMsg}
              </div>
            )}


            {/* EMAIL */}

            <div className="mt-4">

              <label className="text-[12px] font-semibold">
                Email
              </label>

              <div
                className={`
                  mt-2
                  flex
                  h-[52px]
                  items-center
                  rounded-md
                  border
                  bg-white
                  px-4
                  transition-all
                  duration-200
                  ${emailError
                    ? "border-red-500 ring-1 ring-red-500/50 animate-pulse"
                    : "border-slate-300"
                  }
                `}
              >

                <span className="mr-3 text-slate-400">
                  ✉
                </span>

                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailError) setEmailError(false);
                  }}
                  placeholder="name@company.com"
                  className="
                    w-full
                    bg-transparent
                    text-sm
                    outline-none
                    placeholder:text-slate-400
                  "
                />

              </div>

            </div>


            {/* PASSWORD */}

            <div className="mt-4">

              <div className="flex items-center justify-between">

                <label className="text-[12px] font-semibold">
                  Password
                </label>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="cursor-pointer text-[11px] font-medium text-slate-500 hover:text-slate-900 transition-colors inline-flex items-center gap-1.5"
                  >
                    <span className={`inline-block h-1.5 w-1.5 rounded-full ${showPassword ? "bg-[#ff2438]" : "bg-slate-400"}`} />
                    {showPassword ? "Hide Password" : "Show Password"}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab("forgot");
                      setErrorMsg("");
                      setSuccessMsg("");
                    }}
                    className="cursor-pointer text-[12px] font-semibold text-[#ff2438] hover:underline"
                  >
                    Forgot?
                  </button>
                </div>

              </div>

              <div
                className={`
                  mt-2
                  flex
                  h-[52px]
                  items-center
                  rounded-md
                  border
                  bg-white
                  px-4
                  transition-all
                  duration-200
                  ${passwordError
                    ? "border-red-500 ring-1 ring-red-500/50 animate-pulse"
                    : "border-slate-300"
                  }
                `}
              >

                <span className="mr-3 text-slate-400">
                  ♙
                </span>

                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (passwordError) setPasswordError(false);
                  }}
                  placeholder="••••••••••"
                  className="
                    w-full
                    bg-transparent
                    text-sm
                    outline-none
                  "
                />

              </div>

            </div>


            {/* LOGIN BUTTON */}

            <button
              type="submit"
              disabled={loading}
              className="
                mt-5
                flex
                h-[54px]
                w-full
                items-center
                justify-center
                bg-[#111111]
                text-[14px]
                font-medium
                text-white
                transition-all
                duration-200
                hover:bg-[#ff2438]
                disabled:opacity-60
              "
            >
              {loading ? "AUTHENTICATING..." : "LOGIN"}

              <span className="ml-3">
                →
              </span>

            </button>

          </div>


          {/* LOGIN FOOTER */}

          <div
            className="
              shrink-0
              border-t
              border-slate-200
              bg-[#edf3f8]
              px-6
              py-4
              text-center
            "
          >

            <div className="text-[10px] text-slate-400">

              <span className="mr-2 text-emerald-500">
                ◇
              </span>

              Role-Protected Access Control

            </div>

            <div className="mt-2 text-[10px] text-slate-500">

              Don't have an account?

              <button
                type="button"
                onClick={() => {
                  setActiveTab("register");
                  setErrorMsg("");
                  setSuccessMsg("");
                }}
                className="ml-1 cursor-pointer font-bold text-[#ff2438] hover:underline"
              >
                Create your account
              </button>

            </div>

          </div>

        </form>

      )}


      {/* =================================================
          REGISTER TAB
      ================================================= */}

      {activeTab === "register" && (

        <form onSubmit={handleRegisterSubmit}>

          <div className="px-4 sm:px-8 py-5 sm:py-6">

            <h2 className="text-[14px] sm:text-[15px] font-black tracking-tight">
              CREATE YOUR ACCOUNT
            </h2>

            {/* ROLE BUTTONS */}
            <div className="mt-4 flex w-full gap-1.5 sm:gap-2">
              {roles.map((role) => (
                <RoleButton
                  key={role}
                  role={role}
                  active={selectedRole === role}
                  onClick={() => setSelectedRole(role)}
                />
              ))}
            </div>

            <div className="mt-3 text-[12px] text-slate-400">
              Registering role: <span className="font-bold text-slate-900">{selectedRole.toUpperCase()}</span>
            </div>

            {errorMsg && (
              <div className="mt-3 rounded bg-red-500/10 p-2 text-xs font-semibold text-red-600 border border-red-500/20">
                {errorMsg}
              </div>
            )}

            {successMsg && (
              <div className="mt-3 rounded bg-emerald-500/10 p-2 text-xs font-semibold text-emerald-600 border border-emerald-500/20">
                {successMsg}
              </div>
            )}

            {/* NAME */}
            <div className="mt-3">
              <label className="text-[12px] font-semibold">Full Name</label>
              <div
                className={`mt-1.5 flex h-[48px] items-center rounded-md border bg-white px-4 transition-all duration-200 ${regNameError ? "border-red-500 ring-1 ring-red-500/50 animate-pulse" : "border-slate-300"
                  }`}
              >
                <span className="mr-3 text-slate-400">👤</span>
                <input
                  type="text"
                  value={regName}
                  onChange={(e) => {
                    setRegName(e.target.value);
                    if (regNameError) setRegNameError(false);
                  }}
                  placeholder="e.g. Kaushal Sharma"
                  className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* EMAIL */}
            <div className="mt-3">
              <label className="text-[12px] font-semibold">Email</label>
              <div
                className={`mt-1.5 flex h-[48px] items-center rounded-md border bg-white px-4 transition-all duration-200 ${regEmailError ? "border-red-500 ring-1 ring-red-500/50 animate-pulse" : "border-slate-300"
                  }`}
              >
                <span className="mr-3 text-slate-400">✉</span>
                <input
                  type="email"
                  value={regEmail}
                  onChange={(e) => {
                    setRegEmail(e.target.value);
                    if (regEmailError) setRegEmailError(false);
                  }}
                  placeholder="name@company.com"
                  className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div className="mt-3">
              <div className="flex items-center justify-between">
                <label className="text-[12px] font-semibold">Password</label>
                <button
                  type="button"
                  onClick={() => setShowRegPassword(!showRegPassword)}
                  className="cursor-pointer text-[11px] font-medium text-slate-500 hover:text-slate-900 transition-colors inline-flex items-center gap-1"
                >
                  <span className={`inline-block h-1.5 w-1.5 rounded-full ${showRegPassword ? "bg-[#ff2438]" : "bg-slate-400"}`} />
                  {showRegPassword ? "Hide Password" : "Show Password"}
                </button>
              </div>
              <div
                className={`mt-1.5 flex h-[48px] items-center rounded-md border bg-white px-4 transition-all duration-200 ${regPasswordError ? "border-red-500 ring-1 ring-red-500/50 animate-pulse" : "border-slate-300"
                  }`}
              >
                <span className="mr-3 text-slate-400">♙</span>
                <input
                  type={showRegPassword ? "text" : "password"}
                  value={regPassword}
                  onChange={(e) => {
                    setRegPassword(e.target.value);
                    if (regPasswordError) setRegPasswordError(false);
                  }}
                  placeholder="Create a strong password"
                  className="w-full bg-transparent text-sm outline-none"
                />
              </div>
            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={loading}
              className="
                mt-5
                flex
                h-[52px]
                w-full
                items-center
                justify-center
                bg-[#111111]
                text-[14px]
                font-medium
                text-white
                transition-all
                duration-200
                hover:bg-[#ff2438]
                disabled:opacity-60
              "
            >
              {loading ? "CREATING ACCOUNT..." : "CREATE ACCOUNT"}
              <span className="ml-3">→</span>
            </button>

          </div>

          <div className="shrink-0 border-t border-slate-200 bg-[#edf3f8] px-6 py-4 text-center">
            <div className="text-[10px] text-slate-500">
              Already registered?
              <button
                type="button"
                onClick={() => {
                  setActiveTab("login");
                  setErrorMsg("");
                  setSuccessMsg("");
                }}
                className="ml-1 cursor-pointer font-bold text-[#ff2438] hover:underline"
              >
                LogIn
              </button>
            </div>
          </div>

        </form>

      )}

      {/* =================================================
          FORGOT PASSWORD TAB
      ================================================= */}

      {activeTab === "forgot" && (

        <form onSubmit={handleForgotSubmit}>

          <div className="px-4 sm:px-8 py-5 sm:py-6">

            <h2 className="text-[14px] sm:text-[15px] font-black tracking-tight">
              RECOVER YOUR PASSWORD
            </h2>

            <p className="mt-1 text-[12px] text-slate-500">
              Enter your registered email and choose a new password.
            </p>

            {errorMsg && (
              <div className="mt-3 rounded bg-red-500/10 p-2 text-xs font-semibold text-red-600 border border-red-500/20">
                {errorMsg}
              </div>
            )}

            {successMsg && (
              <div className="mt-3 rounded bg-emerald-500/10 p-2 text-xs font-semibold text-emerald-600 border border-emerald-500/20">
                {successMsg}
              </div>
            )}

            {/* EMAIL */}
            <div className="mt-4">
              <label className="text-[12px] font-semibold">Registered Email</label>
              <div className="mt-2 flex h-[52px] items-center rounded-md border border-slate-300 bg-white px-4">
                <span className="mr-3 text-slate-400">✉</span>
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* NEW PASSWORD */}
            <div className="mt-4">
              <div className="flex items-center justify-between">
                <label className="text-[12px] font-semibold">New Password</label>
                <button
                  type="button"
                  onClick={() => setShowForgotPass(!showForgotPass)}
                  className="cursor-pointer text-[11px] font-medium text-slate-500 hover:text-slate-900 transition-colors inline-flex items-center gap-1"
                >
                  <span className={`inline-block h-1.5 w-1.5 rounded-full ${showForgotPass ? "bg-[#ff2438]" : "bg-slate-400"}`} />
                  {showForgotPass ? "Hide Password" : "Show Password"}
                </button>
              </div>
              <div className="mt-2 flex h-[52px] items-center rounded-md border border-slate-300 bg-white px-4">
                <span className="mr-3 text-slate-400">♙</span>
                <input
                  type={showForgotPass ? "text" : "password"}
                  value={forgotNewPassword}
                  onChange={(e) => setForgotNewPassword(e.target.value)}
                  placeholder="••••••••••"
                  className="w-full bg-transparent text-sm outline-none"
                />
              </div>
            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={loading}
              className="
                mt-5
                flex
                h-[54px]
                w-full
                items-center
                justify-center
                bg-[#111111]
                text-[14px]
                font-medium
                text-white
                transition-all
                duration-200
                hover:bg-[#ff2438]
                disabled:opacity-60
              "
            >
              {loading ? "UPDATING PASSWORD..." : "UPDATE PASSWORD"}
              <span className="ml-3">→</span>
            </button>

          </div>

          <div className="shrink-0 border-t border-slate-200 bg-[#edf3f8] px-6 py-4 text-center">
            <div className="text-[10px] text-slate-500">
              Remember your password?
              <button
                type="button"
                onClick={() => {
                  setActiveTab("login");
                  setErrorMsg("");
                  setSuccessMsg("");
                }}
                className="ml-1 cursor-pointer font-bold text-[#ff2438] hover:underline"
              >
                Back to Login
              </button>
            </div>
          </div>

        </form>

      )}


      {/* =================================================
          QUICK TRACK TAB
      ================================================= */}

      {activeTab === "track" && (

        <div className="flex min-h-[390px] flex-col">

          <div className="px-4 sm:px-8 py-5 sm:py-7">

            <h2 className="text-[14px] sm:text-[15px] font-black">
              TRACK YOUR SHIPMENT
            </h2>

            <p className="mt-2 text-[12px] leading-5 text-slate-400">
              Enter your shipment ID to view the latest
              delivery status and location.
            </p>


            {/* TRACKING INPUT */}

            <div className="mt-7">

              <label className="text-[12px] font-semibold">
                Shipment ID
              </label>

              <div
                className="
                  mt-2
                  flex
                  h-[54px]
                  items-center
                  rounded-md
                  border
                  border-slate-300
                  bg-white
                  px-4
                "
              >

                <span className="mr-3 text-slate-400">
                  #
                </span>

                <input
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleQuickTrack()}
                  placeholder="e.g. PKG-2026-000005"
                  className="
                    w-full
                    bg-transparent
                    text-sm
                    outline-none
                    placeholder:text-slate-400
                  "
                />

              </div>

            </div>


            {/* TRACK BUTTON */}

            <button
              type="button"
              onClick={handleQuickTrack}
              disabled={trackLoading}
              className="
                mt-5
                flex
                h-[54px]
                w-full
                items-center
                justify-center
                bg-[#111111]
                text-[14px]
                font-medium
                text-white
                transition
                hover:bg-[#ff2438]
                disabled:opacity-60
                disabled:cursor-not-allowed
              "
            >
              {trackLoading ? (
                <>
                  <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  SEARCHING...
                </>
              ) : (
                <>
                  TRACK SHIPMENT
                  <span className="ml-3">→</span>
                </>
              )}
            </button>


            {/* RESULT / ERROR / EXAMPLE */}

            {trackError && (
              <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4">
                <div className="flex items-start gap-2">
                  <svg className="mt-0.5 h-4 w-4 shrink-0 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <p className="text-[12px] leading-5 text-red-600">{trackError}</p>
                </div>
              </div>
            )}

            {trackResult && (() => {
              const pkg = trackResult;
              const statusColorMap = {
                delivered: { bg: "bg-green-50", text: "text-green-600", label: "DELIVERED" },
                in_transit: { bg: "bg-red-50", text: "text-red-500", label: "IN TRANSIT" },
                "in transit": { bg: "bg-red-50", text: "text-red-500", label: "IN TRANSIT" },
                out_for_delivery: { bg: "bg-orange-50", text: "text-orange-500", label: "OUT FOR DELIVERY" },
                "out for delivery": { bg: "bg-orange-50", text: "text-orange-500", label: "OUT FOR DELIVERY" },
                pending: { bg: "bg-slate-100", text: "text-slate-500", label: "PENDING" },
                cancelled: { bg: "bg-gray-100", text: "text-gray-500", label: "CANCELLED" },
              };
              const rawStatus = (pkg.status || "").toLowerCase().replace(/-/g, "_");
              const badge = statusColorMap[rawStatus] || { bg: "bg-slate-100", text: "text-slate-600", label: (pkg.status || "UNKNOWN").toUpperCase() };
              const edd = pkg.expectedDelivery || pkg.estimatedDelivery || pkg.edd;
              const lastLocation = pkg.currentLocation || pkg.lastLocation || pkg.destinationCity || "—";
              return (
                <div className="mt-6 rounded-lg border border-slate-200 bg-white p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-800">{pkg.packageId || pkg.id}</span>
                    <span className={`rounded-full px-3 py-1 text-[10px] font-semibold ${badge.bg} ${badge.text}`}>
                      {badge.label}
                    </span>
                  </div>
                  {(pkg.originCity || pkg.destinationCity) && (
                    <div className="flex items-center gap-2 text-[11px] text-slate-500">
                      <span className="font-medium text-slate-700">{pkg.originCity || "—"}</span>
                      <span>→</span>
                      <span className="font-medium text-slate-700">{pkg.destinationCity || "—"}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                    <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    <span>Last seen: <span className="font-medium text-slate-700">{lastLocation}</span></span>
                  </div>
                  {edd && (
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                      <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                      <span>Expected by: <span className="font-medium text-slate-700">{new Date(edd).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span></span>
                    </div>
                  )}
                </div>
              );
            })()}

            {!trackResult && !trackError && (
              <div className="mt-6 rounded-lg border border-slate-200 bg-white p-4">
                <div className="text-[10px] uppercase tracking-wider text-slate-400">
                  Example Shipment
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-sm font-bold">
                    PKG-2026-000005
                  </span>
                  <span className="
                    rounded-full
                    bg-red-50
                    px-3
                    py-1
                    text-[10px]
                    font-semibold
                    text-red-500
                  ">
                    IN TRANSIT
                  </span>
                </div>
              </div>
            )}

          </div>


          <div
            className="
              mt-auto
              border-t
              border-slate-200
              bg-[#edf3f8]
              px-6
              py-5
              text-center
            "
          >

            <div className="text-[10px] text-slate-400">
              REAL-TIME SHIPMENT VISIBILITY
            </div>

            <div className="mt-1 text-[10px] text-slate-500">
              Track your package from warehouse to doorstep.
            </div>

          </div>

        </div>

      )}

    </motion.div>
  );
}

function LocationCard({ city, type, className }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`
        absolute
        z-30
        rounded-xl
        border
        border-slate-200
        dark:border-white/10
        bg-white/95
        dark:bg-black/70
        px-5
        py-3
        backdrop-blur-md
        shadow-md
        ${className}
      `}
    >

      <div className="flex items-center gap-2">

        <span
          className="
            h-2.5
            w-2.5
            rounded-full
            bg-[#ff2438]
            shadow-[0_0_12px_rgba(255,36,56,0.8)]
          "
        />

        <span className="text-sm font-bold text-slate-900 dark:text-white">
          {city}
        </span>

      </div>

      <div className="mt-1 text-[9px] font-medium tracking-wide text-slate-500 dark:text-slate-400">
        {type}
      </div>

    </motion.div>
  );
}


const HOME_FEATURES = [
  {
    title: "Fast Delivery",
    desc: "Guaranteed on-time routing",
    badge: "99.4% SLA",
    badgeColor: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    iconAnim: "animate-lightning-charge inline-block",
    icon: (
      <svg
        className="h-4 w-4 text-red-600 dark:text-red-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M13 10V3L4 14h7v7l9-11h-7z"
        />
      </svg>
    ),
  },
  {
    title: "Real-Time Tracking",
    desc: "Live GPS & milestone sync",
    liveRadar: true,
    icon: (
      <svg
        className="h-4 w-4 text-red-600 dark:text-red-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    ),
  },
  {
    title: "Secure Handling",
    desc: "Tamper-evident chain of custody",
    badge: "100% Insured",
    badgeColor: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
    iconAnim: "animate-shield-glow inline-block",
    icon: (
      <svg
        className="h-4 w-4 text-red-600 dark:text-red-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
        />
      </svg>
    ),
  },
];

function HomeFeatureStrip() {
  return (
    <div
      className="
        animate-dock-float
        relative
        w-full
        overflow-hidden
        rounded-2xl
        border
        border-white/90
        bg-white/75
        px-4 sm:px-6
        py-3.5
        shadow-xl
        shadow-orange-500/5
        backdrop-blur-xl
        dark:border-white/10
        dark:bg-black/60
        dark:shadow-none
      "
      style={{ willChange: "transform" }}
    >
      {/* ── Running Border Beam / Shimmer Glow Sweep ── */}
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl"
        aria-hidden="true"
      >
        <div className="animate-dock-shimmer absolute inset-y-0 -left-[100%] w-[100%] bg-gradient-to-r from-transparent via-orange-500/15 to-transparent" />
      </div>

      <div className="relative z-10 grid grid-cols-1 divide-y sm:divide-y-0 sm:divide-x divide-slate-200/60 dark:divide-white/10 sm:grid-cols-3 gap-3 sm:gap-0">
        {HOME_FEATURES.map((item, idx) => (
          <div
            key={item.title}
            className={`group flex items-center gap-3 px-3.5 py-1.5 cursor-default rounded-xl transition-all duration-300 hover:scale-105 hover:bg-white/90 dark:hover:bg-white/[0.08] hover:shadow-sm ${idx === 0 ? "sm:pl-1 sm:pr-4" : idx === 2 ? "sm:pr-1 sm:pl-4" : "sm:px-4"
              }`}
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-500/10 text-red-600 dark:text-red-500 transition-transform duration-200 group-hover:scale-110 group-hover:-translate-y-0.5">
              <span className={item.iconAnim || "inline-block"}>{item.icon}</span>
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-bold tracking-tight text-slate-900 dark:text-white">
                  {item.title}
                </h4>

                {item.liveRadar && (
                  <span
                    className="relative flex h-2.5 w-2.5 items-center justify-center"
                    title="Active Satellite Ping"
                  >
                    <span
                      className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60"
                      style={{ animationDuration: "2s" }}
                    />
                    <span
                      className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-40"
                      style={{ animationDuration: "2s", animationDelay: "1s" }}
                    />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.9)]" />
                  </span>
                )}

                {item.badge && (
                  <span
                    className={`inline-flex items-center rounded-md border px-1.5 py-0.5 text-[9.5px] font-bold tracking-wide ${item.badgeColor}`}
                  >
                    {item.badge}
                  </span>
                )}
              </div>

              <p className="mt-0.5 truncate text-[11px] font-medium text-slate-600 dark:text-slate-400">
                {item.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function LandingPageContent() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const reducedMotion = useReducedMotion();
  // ref for the Services→Support wrapper (used by scroll truck)
  const sectionsWrapperRef = useRef(null);
  useEffect(() => {
    if (location.pathname === "/login" || searchParams.get("login") === "true") {
      setShowLoginModal(true);
    }
  }, [location.pathname, searchParams]);

  const landingScroll = useLandingScroll();

  const handleShipWithLogitrack = () => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      navigate("/client");
    }
  };

  const handleExploreNetwork = () => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    navigate("/network");
  };

  return (
    <div className="relative w-full bg-slate-50 dark:bg-[#050505] text-slate-900 dark:text-white">

      {/* Subtle scroll progress indicator */}
      <ScrollProgressBar progress={landingScroll?.scrollProgress || 0} />

      <div className="landing-scroll-root">

        {/* ==================================================
          NAVBAR (sticky — see Navbar.jsx)
      ================================================== */}

        <Navbar onLoginClick={() => setShowLoginModal(true)} />


        {/* ==================================================
          HOME SECTION — with animated mesh gradient aurora background
      ================================================== */}

        <section id="home-section" className="relative overflow-hidden">

          {/* Canvas pinball bubble physics (z-0, behind grid z-0 and content z-10) */}
          <HeroPinballBubbles />

          <div className="flex h-[calc(100dvh-76px)] w-full flex-col overflow-hidden">

            {/* ==================================================
          MAIN
      ================================================== */}

            <main
              className="
          relative
          min-h-0
          flex-1
          overflow-hidden
        "
            >

              {/* GRID BACKGROUND — slow animated pan, tuned for both themes */}

              <div className="hero-bg-grid pointer-events-none absolute inset-0" />

              {/* HERO CONTENT CONTAINER */}

              <div
                className="
            relative
            z-20
            mx-auto
            flex
            h-full
            min-h-0
            w-full
            max-w-5xl
            flex-col
            justify-center
            items-center
            gap-6
            py-4
            px-4
            sm:px-6
          "
              >
                {/* Organic radial glow behind hero card to diffuse background bubbles */}
                <div
                  className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] bg-white/70 dark:bg-black/50 rounded-full blur-[100px] -z-10"
                  aria-hidden="true"
                />

                {/* FROSTED GLASS CONTAINER — protects text contrast from moving bubbles */}
                <div
                  className="
                    relative
                    z-10
                    w-full
                    max-w-5xl
                    flex
                    flex-col
                    items-center
                    gap-y-6
                    p-6
                    sm:p-10
                    rounded-3xl
                    border
                    border-white/60
                    dark:border-white/10
                    bg-white/45
                    dark:bg-black/45
                    shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)]
                    backdrop-blur-md
                  "
                  style={{
                    backdropFilter: "blur(12px) saturate(180%)",
                    WebkitBackdropFilter: "blur(12px) saturate(180%)",
                  }}
                >
                  {/* =================================================
                      MAIN HERO HEADING
                  ================================================= */}
                  <div className="text-center w-full max-w-4xl mx-auto">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.12]">
                      Intelligent Shipping &amp;{" "}
                      <span className="bg-gradient-to-r from-[#ea580c] via-[#ff2438] to-[#f97316] bg-clip-text text-transparent">
                        Supply Chain
                      </span>
                    </h1>
                  </div>

                  {/* =================================================
                      ROTATING TEXT + CAROUSEL NAVIGATION (Arrows + Dots)
                  ================================================= */}
                  <HeroTextCarousel />

                  {/* =================================================
                      CTA BUTTONS
                  ================================================= */}
                  <div className="flex items-center justify-center gap-4 flex-wrap">
                    <button
                      type="button"
                      onClick={handleShipWithLogitrack}
                      className="
                        whitespace-nowrap
                        rounded-xl
                        bg-[#ff2438]
                        px-7
                        py-3.5
                        text-sm
                        font-bold
                        text-white
                        shadow-[0_8px_25px_rgba(255,36,56,0.25)]
                        transition-all
                        duration-200
                        hover:-translate-y-1
                        hover:bg-red-600
                      "
                    >
                      Ship With Logitrack
                      <span className="ml-2">
                        →
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={handleExploreNetwork}
                      className="
                        whitespace-nowrap
                        rounded-xl
                        border
                        border-slate-300
                        bg-white
                        px-7
                        py-3.5
                        text-sm
                        font-bold
                        text-slate-900
                        shadow-sm
                        transition-all
                        duration-200
                        hover:-translate-y-1
                        hover:border-red-500/40
                        hover:shadow-md
                        dark:border-white/10
                        dark:bg-black/40
                        dark:text-white
                      "
                    >
                      <span className="text-slate-900 dark:text-white">
                        Explore Network
                      </span>
                      <span className="ml-2 text-[#ff2438]">
                        →
                      </span>
                    </button>
                  </div>
                </div>

                {/* FEATURE STRIP */}
                <div className="w-full max-w-5xl">
                  <HomeFeatureStrip />
                </div>

              </div>

            </main>

          </div>

        </section>
        {/* ==================================================
          END HOME SECTION
      ================================================== */}


        {/* ==================================================
          PARTNER & CARRIER AUTO-SCROLLING MARQUEE
      ================================================== */}
        <PartnerMarquee />

        {/* ==================================================
          SERVICES / SOLUTIONS / NETWORK / TRACKING / SUPPORT
          — scroll-driven truck drives left→right through all 5 sections
        ================================================== */}

        <div ref={sectionsWrapperRef} className="relative">
          {/* Scroll-scrubbed truck animation — runs across all 5 sections */}
          <ScrollTruckAnimation
            wrapperRef={sectionsWrapperRef}
            reducedMotion={reducedMotion}
          />
          <ServicesSection id="services-section" />
          <SolutionsSection id="solutions-section" />
          <NetworkSection id="network-section" />
          <TrackingSection id="tracking-section" />
          <SupportSection id="support-section" />
        </div>

        {/* ==================================================
          COMPREHENSIVE MULTI-COLUMN ENTERPRISE FOOTER
      ================================================== */}
        <Footer />

        {/* ==================================================
          LOGIN / QUICK TRACK MODAL
      ================================================== */}
        <AnimatePresence>
          {showLoginModal && (
            <div className="fixed inset-0 z-[500] flex items-center justify-center p-3 sm:p-4">
              {/* Dark Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/75 backdrop-blur-md"
                onClick={() => setShowLoginModal(false)}
              />

              {/* Modal Container */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 25 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{
                  type: "spring",
                  stiffness: 380,
                  damping: 28,
                }}
                className="relative z-10 w-full max-w-[500px]"
              >
                {/* Close Button */}
                <button
                  type="button"
                  onClick={() => setShowLoginModal(false)}
                  aria-label="Close"
                  className="
                    absolute
                    -top-3.5
                    -right-3.5
                    z-30
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-full
                    bg-slate-900
                    text-white
                    border
                    border-white/20
                    shadow-xl
                    hover:bg-[#ff2438]
                    hover:border-[#ff2438]
                    transition-all
                    duration-200
                  "
                >
                  ✕
                </button>

                <LoginCard />
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>

    </div>
  );
}

/**
 * Public export — wraps the landing page in LandingScrollProvider so the
 * Navbar (rendered inside LandingPageContent) can scroll-spy and smoothly
 * scroll to each section. Every other route never mounts this provider,
 * so Navbar's normal path-based behavior there is completely unchanged.
 */
function LandingPage() {
  return (
    <LandingScrollProvider sectionIds={SECTION_IDS} navOffset={NAV_OFFSET}>
      <LandingPageContent />
    </LandingScrollProvider>
  );
}

function ServiceCard({ number, title, description, icon }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.6 }}
      whileHover={{ y: -8 }}
      className="
        group
        relative
        min-h-[270px]
        overflow-hidden
        rounded-2xl
        border
        border-white/10
        bg-white/[0.025]
        p-7
        transition-all
        duration-300
        hover:border-red-500/40
        hover:bg-white/[0.045]
      "
    >

      {/* Red glow */}
      <div
        className="
          absolute
          -right-16
          -top-16
          h-40
          w-40
          rounded-full
          bg-red-500/10
          blur-3xl
          transition-all
          duration-500
          group-hover:bg-red-500/20
        "
      />

      {/* Number */}
      <div className="relative flex items-center justify-between">
        <span className="text-xs font-bold tracking-[0.2em] text-slate-600">
          {number}
        </span>

        <span
          className="
            flex
            h-11
            w-11
            items-center
            justify-center
            rounded-xl
            border
            border-white/10
            bg-white/[0.04]
            text-lg
            text-red-500
            transition-all
            duration-300
            group-hover:border-red-500/40
            group-hover:bg-red-500/10
          "
        >
          {icon}
        </span>
      </div>


      {/* Content */}
      <div className="relative mt-12">

        <h3 className="text-xl font-semibold text-white">
          {title}
        </h3>

        <p className="mt-4 max-w-sm text-sm leading-6 text-slate-500">
          {description}
        </p>

      </div>


      {/* Bottom line */}
      <div
        className="
          absolute
          bottom-0
          left-0
          h-[2px]
          w-0
          bg-red-500
          transition-all
          duration-500
          group-hover:w-full
        "
      />

    </motion.div>
  );
}

export default LandingPage;