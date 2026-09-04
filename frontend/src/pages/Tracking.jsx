import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from "react-leaflet";
import { toast } from "sonner";
import axios from "axios";
import Navbar from "../components/navigation/Navbar";
import Footer from "../components/navigation/Footer";
import { getCityCoordinate } from "../data/cityCoordinates";
import { API_BASE_URL } from "../config/api";

function MapFitBounds({ bounds }) {
  const map = useMap();
  useEffect(() => {
    if (map && bounds && bounds.length >= 2) {
      map.fitBounds(bounds, {
        padding: [45, 45],
        maxZoom: 7,
      });
    }
  }, [map, bounds]);
  return null;
}

const STATUS_MAP = {
  REQUEST_CREATED: {
    label: "SHIPMENT CREATED",
    progress: 15,
    eta: "3-5 DAYS",
    isDelivered: false,
    badgeColor: "border-blue-500/30 bg-blue-500/10 text-blue-500 dark:text-blue-400",
  },
  WAREHOUSE_RECEIVED: {
    label: "AT WAREHOUSE",
    progress: 30,
    eta: "2-3 DAYS",
    isDelivered: false,
    badgeColor: "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400",
  },
  PACKAGE_PROCESSED: {
    label: "PROCESSING",
    progress: 45,
    eta: "2 DAYS",
    isDelivered: false,
    badgeColor: "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400",
  },
  DISTRIBUTOR_RECEIVED: {
    label: "AT DISTRIBUTION HUB",
    progress: 60,
    eta: "1-2 DAYS",
    isDelivered: false,
    badgeColor: "border-orange-500/30 bg-orange-500/10 text-orange-600 dark:text-orange-400",
  },
  ASSIGNED_FOR_DELIVERY: {
    label: "ASSIGNED FOR DELIVERY",
    progress: 75,
    eta: "TODAY",
    isDelivered: false,
    badgeColor: "border-purple-500/30 bg-purple-500/10 text-purple-600 dark:text-purple-400",
  },
  OUT_FOR_DELIVERY: {
    label: "OUT FOR DELIVERY",
    progress: 88,
    eta: "TODAY",
    isDelivered: false,
    badgeColor: "border-red-500/30 bg-red-500/10 text-red-500",
  },
  DELIVERED: {
    label: "DELIVERED",
    progress: 100,
    eta: "COMPLETED",
    isDelivered: true,
    badgeColor: "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  },
  IN_TRANSIT: {
    label: "IN TRANSIT",
    progress: 70,
    eta: "1-2 DAYS",
    isDelivered: false,
    badgeColor: "border-red-500/30 bg-red-500/10 text-red-500",
  },
};

const createCustomPin = (color, label, isCurrent = false) => {
  return L.divIcon({
    className: "custom-map-pin",
    html: `
      <div style="position: relative; display: flex; flex-direction: column; align-items: center; cursor: pointer;">
        ${isCurrent
        ? `<div style="position: absolute; top: -6px; width: 32px; height: 32px; background: ${color}; border-radius: 50%; opacity: 0.35; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>`
        : ""
      }
        <div style="width: 16px; height: 16px; background: ${color}; border: 2.5px solid #ffffff; border-radius: 50%; box-shadow: 0 0 14px ${color}; z-index: 2;"></div>
        <div style="margin-top: 5px; white-space: nowrap; font-size: 10px; font-weight: 700; color: #ffffff; background: rgba(13, 13, 13, 0.9); border: 1px solid rgba(255,255,255,0.18); padding: 2px 7px; border-radius: 4px; letter-spacing: 0.05em; text-transform: uppercase; box-shadow: 0 4px 10px rgba(0,0,0,0.5);">
          ${label}
        </div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 8],
  });
};

function Tracking() {
  const [searchParams] = useSearchParams();
  const [searchId, setSearchId] = useState(searchParams.get("id") || "");
  const [loading, setLoading] = useState(false);
  const [shipment, setShipment] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  const fetchTracking = useCallback(async (packageIdToTrack) => {
    const cleanId = (packageIdToTrack || "").trim().toUpperCase();
    if (!cleanId) {
      toast.error("Please enter a shipment ID to track");
      return;
    }

    setLoading(true);
    setHasSearched(true);
    setErrorMessage(null);

    try {
      // 1. Fetch package details from public API
      const packageRes = await axios.get(
        `${API_BASE_URL}/api/packages/public/track/${encodeURIComponent(cleanId)}`
      );

      if (packageRes.data && packageRes.data.success && packageRes.data.data) {
        const pkg = packageRes.data.data;
        setShipment(pkg);
        setErrorMessage(null);

        // 2. Fetch timeline history
        try {
          const historyRes = await axios.get(
            `${API_BASE_URL}/api/packages/public/track/${encodeURIComponent(cleanId)}/history`
          );

          if (historyRes.data && historyRes.data.success && Array.isArray(historyRes.data.data)) {
            const rawEvents = historyRes.data.data;
            const currentStatus = pkg.status;
            const currentProgress = STATUS_MAP[currentStatus]?.progress || 15;

            const originName = pkg.originCity || "Origin";
            const destName = pkg.destinationCity || "Destination";

            // Generate structured milestones mapped with real history
            const milestones = [
              {
                title: "Shipment Created",
                statusKey: "REQUEST_CREATED",
                threshold: 15,
                defaultLocation: `${originName} Hub`,
              },
              {
                title: "Warehouse Processing",
                statusKey: "WAREHOUSE_RECEIVED",
                threshold: 30,
                defaultLocation: `${originName} Warehouse`,
              },
              {
                title: "In Transit / Hub",
                statusKey: "DISTRIBUTOR_RECEIVED",
                threshold: 60,
                defaultLocation: `${originName} — ${destName} Route`,
              },
              {
                title: "Out for Delivery & Delivered",
                statusKey: "DELIVERED",
                threshold: 100,
                defaultLocation: `${destName} Hub`,
              },
            ];

            const builtTimeline = milestones.map((m) => {
              const matchingHistory = rawEvents.find(
                (h) => h.status === m.statusKey
              );
              const isCompleted = currentProgress >= m.threshold;

              let timeDisplay = isCompleted ? "Completed" : "Pending";
              let locationDisplay = m.defaultLocation;

              if (matchingHistory) {
                if (matchingHistory.createdAt) {
                  const d = new Date(matchingHistory.createdAt);
                  timeDisplay = d.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  });
                }
                if (matchingHistory.location) {
                  locationDisplay = matchingHistory.location;
                }
              } else if (isCompleted && pkg.updatedAt) {
                const d = new Date(pkg.updatedAt);
                timeDisplay = d.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                });
              }

              return {
                title: m.title,
                location: locationDisplay,
                time: timeDisplay,
                completed: isCompleted,
              };
            });

            setTimeline(builtTimeline);
          }
        } catch {
          // Fallback timeline structure built directly from package state
          const currentProgress = STATUS_MAP[pkg.status]?.progress || 15;
          const originName = pkg.originCity || "Origin";
          const destName = pkg.destinationCity || "Destination";

          setTimeline([
            {
              title: "Shipment Created",
              location: `${originName} Warehouse`,
              time: "Confirmed",
              completed: true,
            },
            {
              title: "Warehouse Intake",
              location: `${originName} Center`,
              time: currentProgress >= 30 ? "Completed" : "Pending",
              completed: currentProgress >= 30,
            },
            {
              title: "In Transit",
              location: `${originName} — ${destName}`,
              time: currentProgress >= 60 ? "In Transit" : "Pending",
              completed: currentProgress >= 60,
            },
            {
              title: "Out for Delivery",
              location: `${destName} Facility`,
              time: currentProgress >= 100 ? "Delivered" : "Pending",
              completed: currentProgress >= 100,
            },
          ]);
        }

        toast.success(`Shipment details loaded for ${pkg.packageId}`);
      } else {
        setShipment(null);
        setTimeline([]);
        const notFoundMsg = `No shipment found matching ID "${cleanId}".`;
        setErrorMessage(notFoundMsg);
        toast.error(notFoundMsg);
      }
    } catch (err) {
      setShipment(null);
      setTimeline([]);
      const msg =
        err.response?.data?.message ||
        `No shipment found matching ID "${cleanId}". Please verify the tracking number and try again.`;
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  // Check URL query param on mount
  useEffect(() => {
    const urlId = searchParams.get("id");
    if (urlId) {
      setSearchId(urlId);
      fetchTracking(urlId);
    }
  }, [searchParams, fetchTracking]);

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    fetchTracking(searchId);
  };

  const handleShareTracking = () => {
    if (!shipment?.packageId) return;
    const shareUrl = `${window.location.origin}/tracking?id=${encodeURIComponent(
      shipment.packageId
    )}`;
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(shareUrl);
      toast.success("Tracking link copied to clipboard!");
    } else {
      toast.error("Could not copy link. Please copy manually.");
    }
  };

  // Map Coordinates Calculation (derived from real shipment data when available)
  const originCity = shipment?.originCity || "Delhi";
  const destCity = shipment?.destinationCity || "Mumbai";
  const originCoord = getCityCoordinate(originCity);
  const destCoord = getCityCoordinate(destCity);

  const statusInfo = shipment
    ? STATUS_MAP[shipment.status] || STATUS_MAP.IN_TRANSIT
    : STATUS_MAP.REQUEST_CREATED;

  const progressRatio = Math.min(Math.max((statusInfo.progress || 15) / 100, 0), 1);

  const currentPackageCoord = [
    originCoord[0] + progressRatio * (destCoord[0] - originCoord[0]),
    originCoord[1] + progressRatio * (destCoord[1] - originCoord[1]),
  ];

  const originPin = createCustomPin("#10b981", `${originCity} (Origin)`);
  const currentPin = createCustomPin(
    "#ff2438",
    `Package (${statusInfo.progress}%)`,
    true
  );
  const destPin = createCustomPin("#f87171", `${destCity} (Dest)`);

  return (
    <main className="min-h-screen overflow-hidden bg-slate-50 text-slate-900 transition-colors duration-200 dark:bg-[#050505] dark:text-white">
      <Navbar />

      <section className="relative px-6 pb-16 pt-8 lg:px-12">
        {/* Background Grid */}
        <div
          className="
            pointer-events-none
            absolute
            inset-0
            opacity-[0.07]
            [background-image:linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)]
            [background-size:60px_60px]
          "
        />

        <div className="relative mx-auto max-w-7xl">
          {/* ================= HEADER ================= */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div
              className="
                mb-4
                inline-flex
                border
                border-red-500/20
                bg-red-500/[0.06]
                px-4
                py-2
                text-xs
                font-bold
                tracking-[0.3em]
                text-red-600
                dark:text-red-500
              "
            >
              LIVE TRACKING
            </div>

            <h1
              className="
                text-5xl
                font-black
                leading-[1.05]
                tracking-tight
                text-slate-900
                dark:text-white
                sm:text-6xl
                lg:text-7xl
              "
            >
              Know where it is.
              <span className="block text-red-500">Every mile.</span>
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300">
              Enter your shipment ID to get real-time visibility into your package
              location, live route map, and delivery status.
            </p>
          </motion.div>

          {/* ================= TRACKING SEARCH FORM ================= */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="
              mt-10
              rounded-2xl
              border
              border-slate-200
              bg-white
              p-6
              shadow-sm
              dark:border-white/10
              dark:bg-white/[0.02]
              dark:shadow-none
              sm:p-8
            "
          >
            <form onSubmit={handleSearchSubmit}>
              <div className="mb-4">
                <p className="text-xs font-bold tracking-[0.2em] text-slate-600 dark:text-slate-400">
                  ENTER SHIPMENT ID
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  type="text"
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                  placeholder="e.g. PKG-2026-000001 or LT-1002"
                  className="
                    h-14
                    flex-1
                    rounded-xl
                    border
                    border-slate-200
                    bg-slate-50
                    px-5
                    text-sm
                    font-medium
                    text-slate-900
                    outline-none
                    placeholder:text-slate-400
                    focus:border-red-500/70
                    focus:bg-white
                    dark:border-white/10
                    dark:bg-black/40
                    dark:text-white
                    dark:placeholder:text-slate-500
                    dark:focus:border-red-500/50
                  "
                />

                <button
                  type="submit"
                  disabled={loading}
                  className="
                    flex
                    h-14
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    bg-red-500
                    px-8
                    text-sm
                    font-bold
                    text-white
                    shadow-sm
                    transition
                    hover:bg-red-600
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                  "
                >
                  {loading ? (
                    <>
                      <svg
                        className="h-4 w-4 animate-spin text-white"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8H4z"
                        />
                      </svg>
                      Searching...
                    </>
                  ) : (
                    "Track Shipment"
                  )}
                </button>
              </div>
            </form>
          </motion.div>

          {/* ================= CONDITIONAL RESULT AREA ================= */}
          <AnimatePresence mode="wait">
            {/* 1. LOADING STATE */}
            {loading && (
              <motion.div
                key="loading-state"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="
                  mt-8
                  flex
                  flex-col
                  items-center
                  justify-center
                  rounded-2xl
                  border
                  border-slate-200
                  bg-white
                  p-12
                  text-center
                  shadow-sm
                  dark:border-white/10
                  dark:bg-white/[0.02]
                  dark:shadow-none
                "
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/10 text-red-500">
                  <svg
                    className="h-6 w-6 animate-spin text-red-500"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    />
                  </svg>
                </div>
                <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white">
                  Locating Shipment...
                </h3>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                  Fetching live GPS coordinates, status checkpoints, and route graph.
                </p>
              </motion.div>
            )}

            {/* 2. ERROR / NOT FOUND STATE */}
            {!loading && errorMessage && (
              <motion.div
                key="error-state"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="
                  mt-8
                  rounded-2xl
                  border
                  border-red-500/30
                  bg-red-500/[0.03]
                  p-8
                  text-center
                "
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/10 text-red-500">
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>

                <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">
                  Shipment Not Found
                </h3>

                <p className="mx-auto mt-2 max-w-md text-xs leading-5 text-slate-700 dark:text-slate-300">
                  {errorMessage}
                </p>

                <p className="mt-4 text-[11px] text-slate-600 dark:text-slate-400">
                  Need help? Contact our 24/7 team at{" "}
                  <a
                    href="mailto:support@logitrack.com"
                    className="font-bold text-red-600 underline hover:text-red-500 dark:text-red-500 dark:hover:text-red-400"
                  >
                    support@logitrack.com
                  </a>
                </p>
              </motion.div>
            )}

            {/* 3. INITIAL EMPTY STATE (No search yet) */}
            {!loading && !errorMessage && !shipment && (
              <motion.div
                key="empty-state"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="
                  mt-8
                  flex
                  flex-col
                  items-center
                  justify-center
                  rounded-2xl
                  border
                  border-dashed
                  border-slate-200
                  bg-white/50
                  p-12
                  text-center
                  dark:border-white/10
                  dark:bg-white/[0.01]
                "
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-200 bg-slate-100 text-slate-400 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-500">
                  <svg
                    className="h-7 w-7 text-red-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>

                <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white">
                  Ready to Track Your Shipment
                </h3>

                <p className="mt-2 max-w-md text-xs leading-5 text-slate-600 dark:text-slate-300">
                  Enter your tracking code above to reveal real-time location,
                  estimated delivery time, interactive route map, and status milestones.
                </p>
              </motion.div>
            )}

            {/* 4. SHIPMENT FOUND — RENDER DETAILS, MAP, AND TIMELINE */}
            {!loading && shipment && (
              <motion.div
                key="shipment-result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                {/* ================= SHIPMENT INFO CARDS ================= */}
                <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_1.4fr]">
                  {/* Shipment Details Card */}
                  <div
                    className="
                      rounded-2xl
                      border
                      border-slate-200
                      bg-white
                      p-7
                      shadow-sm
                      dark:border-white/10
                      dark:bg-white/[0.02]
                      dark:shadow-none
                    "
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-[10px] font-bold tracking-[0.25em] text-slate-600 dark:text-slate-400">
                          SHIPMENT ID
                        </p>

                        <h2 className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
                          {shipment.packageId}
                        </h2>
                      </div>

                      <div className="flex items-center gap-2.5">
                        <button
                          type="button"
                          onClick={handleShareTracking}
                          className="
                            flex
                            items-center
                            gap-1.5
                            rounded-lg
                            border
                            border-slate-200
                            bg-slate-100
                            px-3
                            py-1.5
                            text-[11px]
                            font-semibold
                            text-slate-700
                            transition
                            hover:border-slate-300
                            hover:bg-slate-200
                            dark:border-white/10
                            dark:bg-white/[0.04]
                            dark:text-slate-300
                            dark:hover:border-white/20
                            dark:hover:bg-white/10
                            dark:hover:text-white
                          "
                          title="Copy tracking link"
                        >
                          <svg
                            className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                            />
                          </svg>
                          Share
                        </button>

                        <div
                          className={`
                            rounded-md
                            border
                            px-3
                            py-1.5
                            text-[9px]
                            font-bold
                            tracking-[0.15em]
                            ${statusInfo.badgeColor}
                          `}
                        >
                          {statusInfo.label}
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 grid grid-cols-2 gap-6">
                      <Info
                        label="ORIGIN"
                        value={(shipment.originCity || "Origin Hub").toUpperCase()}
                      />
                      <Info
                        label="DESTINATION"
                        value={(shipment.destinationCity || "Destination Hub").toUpperCase()}
                      />
                      <Info
                        label="PACKAGE WEIGHT"
                        value={
                          shipment.weight
                            ? `${shipment.weight} KG`
                            : shipment.description || "Standard Package"
                        }
                      />
                      <Info label="ESTIMATED ETA" value={statusInfo.eta} />
                    </div>
                  </div>

                  {/* Delivery Progress Card */}
                  <div
                    className="
                      rounded-2xl
                      border
                      border-slate-200
                      bg-white
                      p-7
                      shadow-sm
                      dark:border-white/10
                      dark:bg-white/[0.02]
                      dark:shadow-none
                    "
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-bold tracking-[0.25em] text-slate-600 dark:text-slate-400">
                          DELIVERY PROGRESS
                        </p>

                        <p className="mt-2 text-xl font-bold text-slate-900 dark:text-white">
                          {statusInfo.progress}% Complete
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">ETA</p>
                        <p className="text-sm font-bold text-red-600 dark:text-red-500">
                          {statusInfo.eta}
                        </p>
                      </div>
                    </div>

                    <div className="mt-7 h-2.5 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${statusInfo.progress}%` }}
                        transition={{ duration: 1.2, delay: 0.2 }}
                        className="h-full rounded-full bg-red-500"
                      />
                    </div>

                    <div className="mt-3.5 flex justify-between text-[10px] font-bold tracking-wider text-slate-600 dark:text-slate-400">
                      <span>{(shipment.originCity || "ORIGIN").toUpperCase()}</span>
                      <span>{(shipment.destinationCity || "DESTINATION").toUpperCase()}</span>
                    </div>
                  </div>
                </div>

                {/* ================= LIVE ROUTE MAP ================= */}
                <div
                  className="
                    rounded-2xl
                    border
                    border-slate-200
                    bg-white
                    p-7
                    shadow-sm
                    dark:border-white/10
                    dark:bg-white/[0.02]
                    dark:shadow-none
                  "
                >
                  <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-[10px] font-bold tracking-[0.25em] text-slate-600 dark:text-slate-400">
                        LIVE ROUTE MAP
                      </p>

                      <h2 className="mt-1 text-xl font-bold text-slate-900 dark:text-white">
                        Real-Time Transit Tracking
                      </h2>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs">
                      <div className="flex items-center gap-1.5">
                        <span className="h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
                        <span className="font-semibold text-slate-700 dark:text-slate-300">
                          {originCity}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-[#ff2438]"></span>
                        <span className="font-semibold text-slate-900 dark:text-slate-200">
                          {statusInfo.label} ({statusInfo.progress}%)
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="h-2.5 w-2.5 rounded-full bg-red-400"></span>
                        <span className="font-semibold text-slate-700 dark:text-slate-300">
                          {destCity}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="relative z-0 h-[350px] w-full overflow-hidden rounded-xl border border-slate-200 dark:border-white/10 dark-map-tiles sm:h-[400px]">
                    <MapContainer
                      center={[
                        (originCoord[0] + destCoord[0]) / 2,
                        (originCoord[1] + destCoord[1]) / 2,
                      ]}
                      zoom={6}
                      scrollWheelZoom={false}
                      className="h-full w-full"
                      style={{ background: "#0d0d0d" }}
                    >
                      <MapFitBounds bounds={[originCoord, destCoord]} />
                      <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />

                      {/* Traversed Route */}
                      <Polyline
                        positions={[originCoord, currentPackageCoord]}
                        pathOptions={{
                          color: "#ff2438",
                          weight: 4,
                          opacity: 0.95,
                        }}
                      />

                      {/* Remaining Route */}
                      <Polyline
                        positions={[currentPackageCoord, destCoord]}
                        pathOptions={{
                          color: "#ff2438",
                          weight: 3,
                          opacity: 0.45,
                          dashArray: "6, 8",
                        }}
                      />

                      {/* Origin Marker */}
                      <Marker position={originCoord} icon={originPin}>
                        <Popup className="custom-dark-popup">
                          <div className="p-1 text-xs text-slate-900 dark:text-white">
                            <strong className="font-bold text-emerald-500">
                              Origin: {originCity}
                            </strong>
                            <p className="mt-0.5 text-slate-600 dark:text-slate-400">
                              {shipment.pickupAddress || "Dispatched"}
                            </p>
                          </div>
                        </Popup>
                      </Marker>

                      {/* Current Location Marker */}
                      <Marker position={currentPackageCoord} icon={currentPin}>
                        <Popup className="custom-dark-popup">
                          <div className="p-1 text-xs text-slate-900 dark:text-white">
                            <strong className="font-bold text-[#ff2438]">
                              Package ({statusInfo.progress}% Complete)
                            </strong>
                            <p className="mt-0.5 text-slate-600 dark:text-slate-400">
                              {statusInfo.label} — {originCity} to {destCity}
                            </p>
                          </div>
                        </Popup>
                      </Marker>

                      {/* Destination Marker */}
                      <Marker position={destCoord} icon={destPin}>
                        <Popup className="custom-dark-popup">
                          <div className="p-1 text-xs text-slate-900 dark:text-white">
                            <strong className="font-bold text-red-500">
                              Destination: {destCity}
                            </strong>
                            <p className="mt-0.5 text-slate-600 dark:text-slate-400">
                              ETA: {statusInfo.eta}
                            </p>
                          </div>
                        </Popup>
                      </Marker>
                    </MapContainer>
                  </div>
                </div>

                {/* ================= TIMELINE ================= */}
                <div
                  className="
                    rounded-2xl
                    border
                    border-slate-200
                    bg-white
                    p-7
                    shadow-sm
                    dark:border-white/10
                    dark:bg-white/[0.02]
                    dark:shadow-none
                  "
                >
                  <div className="mb-7">
                    <p className="text-[10px] font-bold tracking-[0.25em] text-slate-600 dark:text-slate-400">
                      SHIPMENT TIMELINE
                    </p>

                    <h2 className="mt-2 text-xl font-bold text-slate-900 dark:text-white">
                      Delivery Journey
                    </h2>
                  </div>

                  <div className="grid gap-6 md:grid-cols-4">
                    {timeline.map((step, index) => {
                      const activeIndex = timeline
                        .map((s) => s.completed)
                        .lastIndexOf(true);
                      return (
                        <TimelineStep
                          key={`${step.title}-${index}`}
                          step={step}
                          index={index}
                          isActive={index === activeIndex}
                          last={index === timeline.length - 1}
                        />
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <Footer />
    </main>
  );
}

/* ================= INFO ================= */
function Info({ label, value }) {
  return (
    <div>
      <p className="text-[9px] font-bold tracking-[0.2em] text-slate-600 dark:text-slate-400">
        {label}
      </p>

      <p className="mt-1.5 text-sm font-bold text-slate-900 dark:text-white">
        {value}
      </p>
    </div>
  );
}

/* ================= TIMELINE STEP ================= */
function TimelineStep({ step, last, isActive }) {
  return (
    <div className="relative">
      <div className="flex items-center">
        <div
          className={`
            flex
            h-9
            w-9
            shrink-0
            items-center
            justify-center
            rounded-full
            border
            ${step.completed
              ? "border-red-500/40 bg-red-500/10 text-red-600 dark:text-red-500"
              : "border-slate-300 bg-slate-100 text-slate-500 dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-400"
            }
          `}
        >
          {isActive ? (
            <svg
              className="h-4 w-4 text-[#ff2438]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
              <path d="M15 18H9" />
              <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.62l-3.48-4.35A1 1 0 0 0 17.52 8H14v10Z" />
              <circle cx="17" cy="18" r="2" />
              <circle cx="7" cy="18" r="2" />
            </svg>
          ) : (
            <div
              className={`
                h-2
                w-2
                rounded-full
                ${step.completed
                  ? "bg-red-500"
                  : "bg-slate-400 dark:bg-slate-600"
                }
              `}
            />
          )}
        </div>

        {!last && (
          <div
            className={`
              hidden
              h-px
              flex-1
              md:block
              ${step.completed
                ? "bg-red-500/30"
                : "bg-slate-200 dark:bg-white/10"
              }
            `}
          />
        )}
      </div>

      <div className="mt-4">
        <p className="text-sm font-bold text-slate-900 dark:text-white">
          {step.title}
        </p>

        <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
          {step.location}
        </p>

        <p
          className={`
            mt-2
            text-[9px]
            font-bold
            tracking-[0.15em]
            ${step.completed
              ? "text-red-600 dark:text-red-500"
              : "text-slate-500 dark:text-slate-400"
            }
          `}
        >
          {step.time}
        </p>
      </div>
    </div>
  );
}

export default Tracking;