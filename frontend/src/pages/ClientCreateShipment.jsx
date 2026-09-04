import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";
import axios from "axios";
import { API_BASE_URL } from "../config/api";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/navigation/Navbar";
import SearchableSelect from "../components/ui/SearchableSelect";
import { indianCities } from "../data/indianCities";

function ClientCreateShipment() {
  const { token } = useAuth();
  const [created, setCreated] = useState(false);
  const [shipmentId, setShipmentId] = useState("");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    senderName: "",
    senderPhone: "",
    originCity: "Delhi",
    pickupAddress: "",
    receiverName: "",
    receiverPhone: "",
    destinationCity: "Mumbai",
    deliveryAddress: "",
    packageType: "Parcel",
    weight: "",
    priority: "Standard",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleCopyTrackingId = async () => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(shipmentId);
      } else {
        const input = document.createElement("input");
        input.value = shipmentId;
        document.body.appendChild(input);
        input.select();
        document.execCommand("copy");
        document.body.removeChild(input);
      }
      toast.success("Tracking ID copied to clipboard!");
    } catch {
      toast.error("Failed to copy tracking ID");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        senderName: form.senderName,
        senderPhone: form.senderPhone,
        pickupAddress: form.pickupAddress,
        receiverName: form.receiverName,
        receiverPhone: form.receiverPhone,
        deliveryAddress: form.deliveryAddress,
        originCity: form.originCity,
        destinationCity: form.destinationCity,
        priority: form.priority,
        packageType: form.packageType,
        description: form.packageType || "Standard Parcel",
        weight: Number(form.weight),
        dimensions: { length: 10, width: 10, height: 10 },
      };

      const headers = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      const response = await axios.post(`${API_BASE_URL}/api/packages`, payload, { headers });

      if (response.data && response.data.success) {
        const packageData = response.data.data || response.data.package || {};
        const realId = packageData.packageId || `PKG-${Math.floor(10000 + Math.random() * 90000)}`;
        setShipmentId(realId);
        setCreated(true);
        toast.success("Shipment created successfully!");
      } else {
        toast.error(response.data?.message || "Failed to create shipment.");
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Unable to connect to server. Please try again.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  if (created) {
    return (
      <div className="min-h-screen bg-[#050505] text-white">

        {/* HEADER */}
        <Navbar />

        {/* MAIN */}
        <main
          className="min-h-[calc(100vh-76px)] px-6 py-12 lg:px-10"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)
            `,
            backgroundSize: "38px 38px",
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="mx-auto max-w-xl rounded-2xl border border-white/10 bg-[#080808] p-8 text-center"
          >
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-3xl text-emerald-500">
              ✓
            </div>

            <h2 className="mt-5 text-2xl font-bold">
              Shipment Created Successfully
            </h2>

            <p className="mt-2 text-sm text-slate-400">
              Your shipment has been registered and assigned a tracking ID.
            </p>

            <div className="mt-6 flex items-center justify-between rounded-lg border border-white/10 bg-[#050505] p-4 text-left">
              <div>
                <div className="text-xs text-slate-500">TRACKING ID</div>
                <div className="text-xl font-bold text-red-500">{shipmentId}</div>
              </div>

              <button
                type="button"
                onClick={handleCopyTrackingId}
                title="Copy Tracking ID"
                aria-label="Copy Tracking ID"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-400 transition hover:border-red-500/40 hover:bg-red-500/10 hover:text-white"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              </button>
            </div>

            <div className="mt-8 flex gap-3">
              <Link
                to="/client"
                className="flex-1 rounded bg-[#ff2438] py-3 text-sm font-semibold text-white transition hover:bg-red-600"
              >
                Go to Dashboard
              </Link>

              <button
                type="button"
                onClick={() => setCreated(false)}
                className="flex-1 rounded border border-white/10 py-3 text-sm font-semibold text-slate-400 transition hover:border-red-500/40 hover:text-white"
              >
                CREATE ANOTHER
              </button>
            </div>
          </motion.div>
        </main>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-[#050505] text-white">

      {/* ================= HEADER ================= */}
      <Navbar />


      {/* ================= MAIN ================= */}

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

        <div className="mx-auto max-w-[1100px]">

          {/* BACK */}

          <Link
            to="/client"
            className="mb-6 inline-flex items-center gap-2 text-sm text-slate-500 transition hover:text-white"
          >
            <span className="text-xl">←</span>
            Back to Client Dashboard
          </Link>


          {/* TITLE */}

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
          >

            <p className="text-xs font-bold tracking-[0.3em] text-red-500">
              SHIPMENT MANAGEMENT
            </p>

            <h1 className="mt-2 text-3xl font-bold md:text-4xl">
              Create Shipment
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Enter shipment details to arrange a new delivery.
            </p>

          </motion.div>


          {/* FORM */}

          <form onSubmit={handleSubmit} className="mt-8">

            <div className="grid gap-6 lg:grid-cols-2">


              {/* ================= SENDER ================= */}

              <section className="border border-white/10 bg-[#090909]">

                <div className="border-b border-white/10 px-6 py-5">

                  <p className="text-xs font-bold tracking-[0.2em] text-red-500">
                    STEP 01
                  </p>

                  <h2 className="mt-1 text-lg font-semibold">
                    Sender Details
                  </h2>

                </div>

                <div className="space-y-5 p-6">

                  <Input
                    label="Sender Name"
                    name="senderName"
                    value={form.senderName}
                    onChange={handleChange}
                    placeholder="Enter sender name"
                    required
                  />

                  <Input
                    label="Phone Number"
                    name="senderPhone"
                    value={form.senderPhone}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                    required
                  />

                  <SearchableSelect
                    label="Origin City"
                    name="originCity"
                    value={form.originCity}
                    onChange={handleChange}
                    options={indianCities}
                    placeholder="Search or select origin city..."
                    required
                  />

                  <TextArea
                    label="Pickup Address"
                    name="pickupAddress"
                    value={form.pickupAddress}
                    onChange={handleChange}
                    placeholder="Enter complete pickup address"
                    required
                  />

                </div>

              </section>


              {/* ================= RECEIVER ================= */}

              <section className="border border-white/10 bg-[#090909]">

                <div className="border-b border-white/10 px-6 py-5">

                  <p className="text-xs font-bold tracking-[0.2em] text-red-500">
                    STEP 02
                  </p>

                  <h2 className="mt-1 text-lg font-semibold">
                    Receiver Details
                  </h2>

                </div>

                <div className="space-y-5 p-6">

                  <Input
                    label="Receiver Name"
                    name="receiverName"
                    value={form.receiverName}
                    onChange={handleChange}
                    placeholder="Enter receiver name"
                    required
                  />

                  <Input
                    label="Phone Number"
                    name="receiverPhone"
                    value={form.receiverPhone}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                    required
                  />

                  <SearchableSelect
                    label="Destination City"
                    name="destinationCity"
                    value={form.destinationCity}
                    onChange={handleChange}
                    options={indianCities}
                    placeholder="Search or select destination city..."
                    required
                  />

                  <TextArea
                    label="Delivery Address"
                    name="deliveryAddress"
                    value={form.deliveryAddress}
                    onChange={handleChange}
                    placeholder="Enter complete delivery address"
                    required
                  />

                </div>

              </section>


              {/* ================= PACKAGE ================= */}

              <section className="border border-white/10 bg-[#090909] lg:col-span-2">

                <div className="border-b border-white/10 px-6 py-5">

                  <p className="text-xs font-bold tracking-[0.2em] text-red-500">
                    STEP 03
                  </p>

                  <h2 className="mt-1 text-lg font-semibold">
                    Package Information
                  </h2>

                </div>

                <div className="grid gap-5 p-6 md:grid-cols-3">

                  <Select
                    label="Package Type"
                    name="packageType"
                    value={form.packageType}
                    onChange={handleChange}
                    options={[
                      "Parcel",
                      "Document",
                      "Electronics",
                      "Fragile",
                      "Other",
                    ]}
                  />

                  <Input
                    label="Weight (KG)"
                    name="weight"
                    type="number"
                    value={form.weight}
                    onChange={handleChange}
                    placeholder="e.g. 2.5"
                    required
                  />

                  <Select
                    label="Priority"
                    name="priority"
                    value={form.priority}
                    onChange={handleChange}
                    options={[
                      "Standard",
                      "Express",
                      "Urgent",
                    ]}
                  />

                </div>

              </section>

            </div>


            {/* ================= SUMMARY ================= */}

            <section className="mt-6 border border-white/10 bg-[#090909]">

              <div className="border-b border-white/10 px-6 py-5">

                <p className="text-xs font-bold tracking-[0.2em] text-red-500">
                  FINAL STEP
                </p>

                <h2 className="mt-1 text-lg font-semibold">
                  Shipment Summary
                </h2>

              </div>

              <div className="grid gap-4 p-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">

                <Summary
                  title="ORIGIN"
                  value={form.originCity}
                />

                <Summary
                  title="DESTINATION"
                  value={form.destinationCity}
                />

                <Summary
                  title="PACKAGE"
                  value={form.packageType}
                />

                <Summary
                  title="WEIGHT"
                  value={form.weight ? `${form.weight} KG` : "Not specified"}
                />

                <Summary
                  title="PRIORITY"
                  value={form.priority}
                />

              </div>

            </section>


            {/* SUBMIT */}

            <div className="mt-6 flex justify-end">

              <button
                type="submit"
                disabled={loading}
                style={{
                  backgroundColor: "#FF4B4B",
                  color: "#FFFFFF",
                }}
                className="
                  flex
                  h-14
                  w-full
                  items-center
                  justify-center
                  !bg-[#FF4B4B]
                  px-10
                  text-base
                  font-bold
                  !text-white
                  hover:!bg-[#FF4B4B]
                  hover:!text-white
                  focus:!bg-[#FF4B4B]
                  focus:!text-white
                  active:!bg-[#FF4B4B]
                  active:!text-white
                  disabled:opacity-60
                  disabled:cursor-not-allowed
                  sm:w-auto
                "
              >
                {loading ? (
                  <span className="flex items-center gap-2 !text-white" style={{ color: "#FFFFFF" }}>
                    <svg className="h-4 w-4 animate-spin !text-white" style={{ color: "#FFFFFF" }} viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Creating Shipment...
                  </span>
                ) : (
                  <span className="flex items-center !text-white" style={{ color: "#FFFFFF" }}>
                    <span style={{ color: "#FFFFFF" }} className="font-bold !text-white">
                      Create Shipment
                    </span>
                    <span style={{ color: "#FFFFFF" }} className="ml-3 text-lg font-bold leading-none !text-white">
                      →
                    </span>
                  </span>
                )}
              </button>

            </div>

          </form>

        </div>

      </main>

    </div>
  );
}


/* ================= INPUT ================= */

function Input({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
}) {
  return (
    <div>

      <label className="text-[11px] font-semibold text-slate-300">
        {label}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="
          mt-2
          h-12
          w-full
          border
          border-white/10
          bg-black/30
          px-4
          text-sm
          text-white
          outline-none
          placeholder:text-slate-700
          focus:border-red-500/50
        "
      />

    </div>
  );
}


/* ================= TEXTAREA ================= */

function TextArea({
  label,
  name,
  value,
  onChange,
  placeholder,
  required = false,
}) {
  return (
    <div>

      <label className="text-[11px] font-semibold text-slate-300">
        {label}
      </label>

      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        rows={3}
        className="
          mt-2
          w-full
          resize-none
          border
          border-white/10
          bg-black/30
          px-4
          py-3
          text-sm
          text-white
          outline-none
          placeholder:text-slate-700
          focus:border-red-500/50
        "
      />

    </div>
  );
}


/* ================= SELECT ================= */

function Select({
  label,
  name,
  value,
  onChange,
  options,
}) {
  return (
    <div>

      <label className="text-[11px] font-semibold text-slate-300">
        {label}
      </label>

      <select
        name={name}
        value={value}
        onChange={onChange}
        className="
          mt-2
          h-12
          w-full
          border
          border-white/10
          bg-[#0d0d0d]
          px-4
          text-sm
          text-white
          outline-none
          focus:border-red-500/50
        "
      >

        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}

      </select>

    </div>
  );
}


/* ================= SUMMARY ================= */

function Summary({ title, value }) {
  return (
    <div className="border border-white/10 bg-black/20 p-4">

      <p className="text-[9px] tracking-[0.2em] text-slate-600">
        {title}
      </p>

      <p className="mt-2 text-sm font-semibold">
        {value}
      </p>

    </div>
  );
}

export default ClientCreateShipment;