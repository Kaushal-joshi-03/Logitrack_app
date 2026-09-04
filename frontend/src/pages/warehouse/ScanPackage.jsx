import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Navbar from "../../components/navigation/Navbar";

function ScanPackage() {
  const [packageId, setPackageId] = useState("");
  const [scannedPackage, setScannedPackage] = useState(null);

  const handleScan = () => {
    if (!packageId.trim()) return;

    // Dummy frontend data
    setScannedPackage({
      id: packageId.toUpperCase(),
      origin: "Delhi",
      destination: "Mumbai",
      currentLocation: "Delhi Warehouse",
      status: "IN WAREHOUSE",
      lastScanned: "27 Aug 2026, 09:42 AM",
    });
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white">

      {/* NAVBAR */}
      <Navbar showLogout={true} />

      <main
        className="
          min-h-[calc(100vh-76px)]
          bg-[#050505]
          px-6
          py-8
          lg:px-12
        "
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
          <Link
            to="/warehouse"
            className="
              mb-8
              inline-flex
              items-center
              gap-2
              text-sm
              font-medium
              text-slate-500
              transition
              hover:text-white
            "
          >
            <span className="text-xl">←</span>
            Back to Warehouse
          </Link>


          {/* HEADER */}
          <div className="mb-8">

            <p className="mb-2 text-xs font-bold tracking-[0.3em] text-red-500">
              WAREHOUSE CONTROL
            </p>

            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
              Scan Package
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Scan or enter a package ID to verify its current location
              and shipment status.
            </p>

          </div>


          {/* SCAN CARD */}
          <motion.section
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="
              border
              border-white/10
              bg-[#090909]
            "
          >

            {/* CARD HEADER */}
            <div className="border-b border-white/10 px-6 py-5">

              <p className="text-xs font-bold tracking-[0.2em] text-red-500">
                PACKAGE VERIFICATION
              </p>

              <h2 className="mt-1 text-lg font-semibold">
                Enter Package ID
              </h2>

            </div>


            {/* INPUT AREA */}
            <div className="px-6 py-7">

              <label className="text-xs font-semibold text-slate-300">
                Package ID
              </label>

              <div
                className="
                  mt-2
                  flex
                  h-[56px]
                  items-center
                  border
                  border-white/10
                  bg-black
                  px-4
                  transition
                  focus-within:border-red-500/50
                "
              >

                <span className="mr-3 text-red-500">
                  #
                </span>

                <input
                  type="text"
                  value={packageId}
                  onChange={(e) => setPackageId(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleScan();
                    }
                  }}
                  placeholder="Enter package ID e.g. PKG-10294"
                  className="
                    w-full
                    bg-transparent
                    text-sm
                    text-white
                    outline-none
                    placeholder:text-slate-600
                  "
                />

              </div>


              {/* SCAN BUTTON */}
              <button
                type="button"
                onClick={handleScan}
                className="
                  mt-4
                  flex
                  h-[54px]
                  w-full
                  items-center
                  justify-center
                  bg-red-500
                  text-sm
                  font-bold
                  text-white
                  transition
                  hover:bg-red-600
                  active:scale-[0.99]
                "
              >
                SCAN PACKAGE
                <span className="ml-3 text-lg">
                  →
                </span>
              </button>


              <p className="mt-3 text-[10px] text-slate-600">
                Enter a package ID and press Scan Package or hit Enter.
              </p>

            </div>

          </motion.section>


          {/* RESULT */}
          {scannedPackage && (

            <motion.section
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="
                mt-6
                border
                border-white/10
                bg-[#090909]
              "
            >

              {/* RESULT HEADER */}
              <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">

                <div>

                  <p className="text-xs font-bold tracking-[0.2em] text-emerald-400">
                    PACKAGE FOUND
                  </p>

                  <h2 className="mt-1 text-lg font-semibold">
                    Package Details
                  </h2>

                </div>

                <span
                  className="
                    inline-flex
                    items-center
                    gap-2
                    text-xs
                    font-semibold
                    text-emerald-400
                  "
                >
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  VERIFIED
                </span>

              </div>


              {/* PACKAGE ID */}
              <div className="border-b border-white/5 px-6 py-6">

                <p className="text-[10px] tracking-[0.2em] text-slate-600">
                  PACKAGE ID
                </p>

                <p className="mt-2 text-2xl font-bold">
                  {scannedPackage.id}
                </p>

              </div>


              {/* DETAILS GRID */}
              <div className="grid sm:grid-cols-2">

                <div className="border-b border-white/5 p-6 sm:border-r">
                  <p className="text-[10px] tracking-[0.2em] text-slate-600">
                    ORIGIN
                  </p>

                  <p className="mt-2 text-sm font-semibold">
                    {scannedPackage.origin}
                  </p>
                </div>


                <div className="border-b border-white/5 p-6">
                  <p className="text-[10px] tracking-[0.2em] text-slate-600">
                    DESTINATION
                  </p>

                  <p className="mt-2 text-sm font-semibold">
                    {scannedPackage.destination}
                  </p>
                </div>


                <div className="border-b border-white/5 p-6 sm:border-r">
                  <p className="text-[10px] tracking-[0.2em] text-slate-600">
                    CURRENT LOCATION
                  </p>

                  <p className="mt-2 text-sm font-semibold text-red-400">
                    {scannedPackage.currentLocation}
                  </p>
                </div>


                <div className="border-b border-white/5 p-6">
                  <p className="text-[10px] tracking-[0.2em] text-slate-600">
                    STATUS
                  </p>

                  <p className="mt-2 text-sm font-semibold text-yellow-400">
                    {scannedPackage.status}
                  </p>
                </div>

              </div>


              {/* LAST SCANNED */}
              <div className="px-6 py-5">

                <p className="text-[10px] tracking-[0.2em] text-slate-600">
                  LAST SCANNED
                </p>

                <p className="mt-2 text-xs text-slate-400">
                  {scannedPackage.lastScanned}
                </p>

              </div>

            </motion.section>

          )}


          {/* INFO */}
          <div className="mt-6 border border-white/5 bg-[#090909] p-5">

            <div className="flex items-center gap-2">

              <span
                className="
                  h-2
                  w-2
                  rounded-full
                  bg-emerald-400
                  shadow-[0_0_10px_rgba(52,211,153,0.7)]
                "
              />

              <span className="text-xs font-semibold text-emerald-400">
                SCANNER ONLINE
              </span>

            </div>

            <p className="mt-2 text-[10px] text-slate-600">
              Package scanning service is ready for use.
            </p>

          </div>

        </div>

      </main>

    </div>
  );
}

export default ScanPackage;