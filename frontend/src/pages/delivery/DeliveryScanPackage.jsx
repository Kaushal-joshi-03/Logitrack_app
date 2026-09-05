import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import Navbar from "../../components/navigation/Navbar";

function DeliveryScanPackage() {
  const [packageId, setPackageId] = useState("");
  const [scannedResult, setScannedResult] = useState(null);
  const [isScanning, setIsScanning] = useState(false);

  const handleScan = (idToUse) => {
    const target = (idToUse || packageId).trim().toUpperCase();
    if (!target) {
      toast.error("Please enter or scan a package barcode.");
      return;
    }

    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setScannedResult({
        id: target,
        recipient: "Rahul Sharma",
        phone: "+91 98201 44102",
        destination: "Flat 402, Sea Breeze Apts, Bandra West, Mumbai",
        routeStop: "Stop 3 of 8",
        status: "OUT FOR DELIVERY",
        itemType: "Express Courier Parcel (2.4 kg)",
      });
      toast.success(`Package ${target} recognized!`);
    }, 600);
  };

  const handleConfirmDelivery = () => {
    if (!scannedResult) return;
    toast.success(`Package ${scannedResult.id} marked as DELIVERED!`);
    setScannedResult({ ...scannedResult, status: "DELIVERED" });

    // Update localStorage
    const saved = localStorage.getItem("logitrack_agent_deliveries");
    if (saved) {
      try {
        const deliveries = JSON.parse(saved);
        const updated = deliveries.map((d) =>
          d.id.toUpperCase() === scannedResult.id.toUpperCase()
            ? { ...d, status: "DELIVERED", time: "Just now" }
            : d
        );
        localStorage.setItem("logitrack_agent_deliveries", JSON.stringify(updated));
      } catch (err) {
        // ignore
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Navbar showLogout={true} />

      <main
        className="min-h-[calc(100vh-76px)] px-6 py-8 lg:px-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)
          `,
          backgroundSize: "38px 38px",
        }}
      >
        <div className="mx-auto max-w-[1000px]">
          {/* BACK */}
          <div className="flex items-center justify-between">
            <Link
              to="/delivery"
              className="inline-flex items-center gap-2 text-sm text-slate-500 transition hover:text-white"
            >
              <span className="text-xl">←</span>
              Back to Delivery Dashboard
            </Link>

            <Link
              to="/delivery/deliveries"
              className="border border-white/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-slate-300 hover:border-red-500/40 hover:text-white transition"
            >
              View Deliveries
            </Link>
          </div>

          {/* HEADER */}
          <div className="mt-6">
            <p className="text-xs font-bold tracking-[0.3em] text-red-500">
              OPTICAL BARCODE VERIFICATION
            </p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight md:text-4xl">
              Scan Delivery Parcel
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              Scan recipient barcode or enter shipment ID to confirm physical handover at delivery address.
            </p>
          </div>

          {/* SCANNER CONTAINER */}
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {/* VIEWFINDER SIMULATOR */}
            <div className="border border-white/10 bg-[#090909] p-6 flex flex-col items-center justify-center relative min-h-[300px]">
              <div className="relative h-48 w-48 border-2 border-dashed border-red-500/50 flex items-center justify-center p-4">
                {/* Corner markers */}
                <span className="absolute -top-1 -left-1 h-3 w-3 border-t-2 border-l-2 border-red-500" />
                <span className="absolute -top-1 -right-1 h-3 w-3 border-t-2 border-r-2 border-red-500" />
                <span className="absolute -bottom-1 -left-1 h-3 w-3 border-b-2 border-l-2 border-red-500" />
                <span className="absolute -bottom-1 -right-1 h-3 w-3 border-b-2 border-r-2 border-red-500" />

                {/* Laser scan line animation */}
                <motion.div
                  animate={{ y: [-70, 70, -70] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="absolute w-44 h-0.5 bg-red-500 shadow-[0_0_12px_rgba(239,29,47,1)]"
                />

                <div className="text-center">
                  <span className="text-2xl">📷</span>
                  <p className="mt-2 text-[10px] text-slate-500 uppercase tracking-widest font-mono">
                    Align Barcode in Lens
                  </p>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                {["PKG-10294", "PKG-10287", "PKG-10281"].map((demoId) => (
                  <button
                    key={demoId}
                    type="button"
                    onClick={() => {
                      setPackageId(demoId);
                      handleScan(demoId);
                    }}
                    className="border border-white/10 px-2 py-1 text-[11px] font-mono text-slate-400 hover:text-white hover:border-red-500/40"
                  >
                    Quick: {demoId}
                  </button>
                ))}
              </div>
            </div>

            {/* MANUAL ENTRY & RESULTS */}
            <div className="border border-white/10 bg-[#090909] p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-white border-b border-white/10 pb-3">
                  Manual Barcode Entry
                </h3>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleScan();
                  }}
                  className="mt-4 space-y-4"
                >
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                      Package / Tracking ID
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. PKG-10294"
                      value={packageId}
                      onChange={(e) => setPackageId(e.target.value)}
                      className="w-full border border-white/10 bg-black/40 px-3.5 py-2.5 text-sm text-white placeholder-slate-600 focus:border-red-500 focus:outline-none font-mono"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isScanning}
                    className="w-full bg-red-600 py-2.5 text-xs font-semibold uppercase tracking-wider text-white hover:bg-red-500 transition shadow-lg shadow-red-600/20"
                  >
                    {isScanning ? "Scanning Optical Beacon..." : "Look Up Package"}
                  </button>
                </form>
              </div>

              {/* SCANNED CARD RESULT */}
              {scannedResult && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 border border-white/10 bg-white/[0.02] p-4 text-xs space-y-2"
                >
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <span className="font-mono font-bold text-white text-sm">
                      {scannedResult.id}
                    </span>
                    <span
                      className={`px-2 py-0.5 font-bold text-[10px] rounded ${
                        scannedResult.status === "DELIVERED"
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "bg-red-500/10 text-red-400"
                      }`}
                    >
                      {scannedResult.status}
                    </span>
                  </div>

                  <p className="text-slate-300">
                    <strong className="text-white">{scannedResult.recipient}</strong> • {scannedResult.phone}
                  </p>
                  <p className="text-slate-400 text-[11px]">{scannedResult.destination}</p>

                  <div className="pt-2 flex justify-end">
                    {scannedResult.status !== "DELIVERED" ? (
                      <button
                        type="button"
                        onClick={handleConfirmDelivery}
                        className="w-full bg-emerald-600 py-2 text-xs font-semibold uppercase tracking-wider text-white hover:bg-emerald-500 shadow-md"
                      >
                        Confirm Handover & Deliver ✓
                      </button>
                    ) : (
                      <span className="text-emerald-400 font-bold text-xs">
                        ✓ Delivery Verified & Recorded
                      </span>
                    )}
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default DeliveryScanPackage;
