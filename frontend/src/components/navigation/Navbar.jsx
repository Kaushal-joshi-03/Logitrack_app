import { motion } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { useLandingScroll } from "../../context/LandingScrollContext";

function Navbar({ onLoginClick }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();

  // Present only inside LandingPage — every other route gets `null` here,
  // so all existing navbar behavior (below) is completely unaffected.
  const landingScroll = useLandingScroll();

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const navLinks = [
    { name: "HOME", path: "/", sectionId: "home-section" },
    { name: "Services", path: "/services", sectionId: "services-section" },
    { name: "Solutions", path: "/solutions", sectionId: "solutions-section" },
    { name: "Network", path: "/network", sectionId: "network-section" },
    { name: "Tracking", path: "/tracking", sectionId: "tracking-section" },
    { name: "Support", path: "/support", sectionId: "support-section" },
  ];

  // On the Landing Page, clicking a nav item smoothly scrolls to that
  // section instead of navigating away. Everywhere else (including direct
  // visits to /services, /solutions, etc.) the Link behaves exactly as
  // before and loads the existing route.
  const handleNavClick = (e, item) => {
    if (location.pathname === "/" && landingScroll) {
      e.preventDefault();
      landingScroll.scrollToSection(item.sectionId);
    }
    setMobileOpen(false);
  };

  return (
    <header
      className={`
        sticky top-0 z-[100] w-full border-b border-white/10 bg-[#080808]
        transition-all duration-300
        ${scrolled ? "navbar-scrolled" : ""}
      `}
    >

      <div
        className={`
          flex w-full items-center justify-between px-6 transition-all duration-300 lg:px-10
          ${scrolled ? "h-[64px]" : "h-[76px]"}
        `}
      >

        {/* ================= LOGO ================= */}
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-3">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-3"
            >
              {/* Logo box */}
              <img
                src="/logo.png"
                alt="LOGITRACK"
                className="h-10 w-10 rounded object-contain bg-white"
              />

              {/* Brand */}
              <div className="leading-none">
                <div className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
                  LOGI<span className="text-red-500">TRACK</span>
                </div>

                <div className="
                  mt-1
                  text-[7px]
                  font-bold
                  tracking-[0.35em]
                  text-slate-500
                ">
                  ENTERPRISE
                </div>
              </div>
            </motion.div>
          </Link>
        </div>

        {/* ================= TOP-CENTER NAVIGATION ================= */}
        <nav className="hidden items-center gap-8 lg:flex">
          {navLinks.map((item) => {
            const isActive =
              location.pathname === "/" && landingScroll
                ? landingScroll.activeSection === item.sectionId
                : location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={(e) => handleNavClick(e, item)}
                className={`
                  relative py-2 text-xs font-semibold uppercase tracking-wider transition-colors duration-200
                  ${isActive ? "text-red-500 font-bold" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"}
                `}
              >
                {item.name}
                {isActive && (
                  <motion.span
                    layoutId="navbar-active-indicator"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    className="absolute bottom-0 left-0 h-[2px] w-full rounded-full bg-red-500 shadow-[0_0_8px_rgba(255,36,56,0.7)]"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* ================= RIGHT SIDE ================= */}
        <div className="flex items-center gap-4">
          {/* Permanent Theme Toggle Button */}
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-md
              border
              border-slate-300
              dark:border-white/10
              bg-white
              dark:bg-white/[0.03]
              text-base
              transition-colors
              duration-200
              hover:border-slate-400
              dark:hover:border-white/20
              hover:bg-slate-100
              dark:hover:bg-white/[0.08]
            "
          >
            {isDark ? "🌙" : "☀️"}
          </motion.button>

          {/* If not authenticated: Show Log In button */}
          {!isAuthenticated && (
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              type="button"
              onClick={() => {
                if (onLoginClick) {
                  onLoginClick();
                } else {
                  navigate("/login");
                }
              }}
              className="
                rounded-lg
                bg-slate-900
                dark:bg-white/10
                border
                border-slate-800
                dark:border-white/15
                px-3.5
                py-1.5
                text-xs
                font-bold
                text-white
                shadow-sm
                transition-all
                duration-200
                hover:bg-[#ff2438]
                hover:border-[#ff2438]
                dark:hover:bg-[#ff2438]
                dark:hover:border-[#ff2438]
              "
            >
              Log In
            </motion.button>
          )}

          {/* If authenticated and not on public Home page: Show user info and red/orange Logout button */}
          {isAuthenticated && location.pathname !== "/" && (
            <>
              <div className="hidden text-right sm:block">
                <p className="text-[10px] text-slate-500">LOGGED IN AS</p>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  {user?.name?.toUpperCase() || (user?.role ? user.role.toUpperCase() : "USER")}
                </p>
              </div>

              <button
                onClick={handleLogout}
                className="
                  rounded
                  bg-[#ff2438]
                  px-4
                  py-2
                  text-sm
                  font-semibold
                  text-white
                  shadow-[0_2px_10px_rgba(255,36,56,0.25)]
                  transition-all
                  duration-200
                  hover:bg-red-600
                  hover:shadow-[0_4px_15px_rgba(255,36,56,0.35)]
                "
              >
                Logout
              </button>
            </>
          )}

          {/* Mobile menu toggle (nav links are hidden below lg:) */}
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileOpen}
            className="
              flex h-9 w-9 items-center justify-center rounded-md border
              border-slate-300 dark:border-white/10 bg-white dark:bg-white/[0.03]
              text-slate-900 dark:text-white lg:hidden
            "
          >
            <span className="text-base">{mobileOpen ? "✕" : "☰"}</span>
          </button>
        </div>

      </div>

      {/* ================= MOBILE NAV PANEL ================= */}
      {mobileOpen && (
        <nav className="flex flex-col gap-1 border-t border-white/10 bg-[#080808] px-6 py-4 lg:hidden">
          {navLinks.map((item) => {
            const isActive =
              location.pathname === "/" && landingScroll
                ? landingScroll.activeSection === item.sectionId
                : location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={(e) => handleNavClick(e, item)}
                className={`
                  rounded-md px-3 py-2.5 text-xs font-semibold uppercase tracking-wider transition-colors
                  ${isActive ? "bg-red-500/10 text-red-500" : "text-slate-400 hover:bg-white/5 hover:text-white"}
                `}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>
      )}

    </header>
  );
}

export default Navbar;